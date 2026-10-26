/** @fileoverview Reads HCB JSON and follows public pages or authenticated cursors without emitting partial totals. */
import { Result } from "better-result";
import { z } from "zod";

import { HcbError } from "./hcb-error";
import {
  cursorItemSchema,
  cursorPageSchema,
  jsonSchema,
  listSchema,
  optionsSchema,
  pageSizeSchema,
  pathSchema,
} from "./schemas";

function prepareUrl(path: string, options: z.output<typeof optionsSchema>) {
  return Result.gen(function* () {
    const valid = pathSchema.safeParse(path);
    if (!valid.success)
      return Result.err(
        new HcbError({ message: "Use a relative HCB API path, such as /user/organizations." }),
      );
    const prefix = "/api/" + options.api;
    const url = yield* Result.try({
      try: () => new URL("https://hcb.hackclub.com" + prefix + path),
      catch: () => new HcbError({ message: "Invalid HCB path." }),
    });
    if (!url.pathname.startsWith(prefix + "/"))
      return Result.err(new HcbError({ message: "Path must stay within the selected HCB API." }));
    if (options.all) {
      if (url.searchParams.has("page") || url.searchParams.has("after"))
        return Result.err(
          new HcbError({
            message: "--all starts at the first page. Remove page and after parameters.",
          }),
        );
      const sizeKey = options.api === "v3" ? "per_page" : "limit";
      const size = pageSizeSchema.safeParse(url.searchParams.get(sizeKey) ?? 100);
      if (!size.success)
        return Result.err(new HcbError({ message: "Page size must be an integer from 1 to 100." }));
      url.searchParams.set(sizeKey, String(size.data));
      if (options.api === "v3") url.searchParams.set("page", "1");
    }
    return Result.ok(url);
  });
}

function pageData(data: z.output<typeof jsonSchema>, url: URL, api: "v3" | "v4") {
  if (api === "v4") {
    const page = cursorPageSchema.safeParse(data);
    if (page.success) {
      if (!page.data.has_more) return Result.ok({ items: page.data.data, next: undefined });
      const cursor = cursorItemSchema.safeParse(page.data.data.at(-1));
      if (!cursor.success)
        return Result.err(
          new HcbError({ message: "HCB reported more records without a valid next cursor." }),
        );
      url.searchParams.set("after", cursor.data.id);
      return Result.ok({ items: page.data.data, next: url });
    }
  }
  const list = listSchema.safeParse(data);
  if (!list.success)
    return Result.err(new HcbError({ message: "--all requires an HCB list response." }));
  if (api === "v4" || list.data.length < Number(url.searchParams.get("per_page"))) {
    return Result.ok({ items: list.data, next: undefined });
  }
  url.searchParams.set("page", String(Number(url.searchParams.get("page")) + 1));
  return Result.ok({ items: list.data, next: url });
}

/** Returns one response or an entire list, failing before output if pagination cannot finish. */
export function getHcb(
  path: string,
  options: z.output<typeof optionsSchema>,
  request: (url: URL, init: RequestInit) => Promise<Response> = fetch,
): Promise<Result<z.output<typeof jsonSchema>, HcbError>> {
  return Result.gen(async function* () {
    if (options.api === "v4" && !options.token)
      return Result.err(
        new HcbError({ message: "Set HCB_TOKEN to an authorized HCB OAuth access token for v4." }),
      );
    let url = yield* prepareUrl(path, options);
    const headers = new Headers({ Accept: "application/json" });
    if (options.api === "v4") headers.set("Authorization", "Bearer " + options.token);
    const records: z.output<typeof jsonSchema>[] = [];
    const seen = new Set<string>();
    for (let pages = 0; pages < 1000; pages += 1) {
      const response = yield* Result.await(
        Result.tryPromise({
          try: () =>
            request(url, {
              method: "GET",
              headers,
              redirect: "error",
              signal: AbortSignal.timeout(30_000),
            }),
          catch: () => new HcbError({ message: "HCB request failed, timed out, or redirected." }),
        }),
      );
      if (!response.ok)
        return Result.err(
          new HcbError({
            message:
              "HCB returned HTTP " +
              response.status +
              ". Check access, token validity, and the API path.",
          }),
        );
      const body = yield* Result.await(
        Result.tryPromise({
          try: () => response.json(),
          catch: () => new HcbError({ message: "HCB returned invalid JSON." }),
        }),
      );
      const data = jsonSchema.safeParse(body);
      if (!data.success)
        return Result.err(new HcbError({ message: "HCB returned invalid JSON data." }));
      if (!options.all) return Result.ok(data.data);
      const page = yield* pageData(data.data, url, options.api);
      const signature = JSON.stringify(page.items);
      if (seen.has(signature))
        return Result.err(
          new HcbError({ message: "HCB repeated a page. No partial result was emitted." }),
        );
      seen.add(signature);
      records.push(...page.items);
      if (!page.next) return Result.ok(records);
      url = page.next;
    }
    return Result.err(
      new HcbError({
        message: "HCB pagination exceeded 1000 pages. No partial result was emitted.",
      }),
    );
  });
}
