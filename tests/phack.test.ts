import { expect, test } from "bun:test";

import { Result } from "better-result";

import { createLink, getLink } from "../cli/phack/client";
import { PhackError } from "../cli/phack/phack-error";

const destination = "https://purduehackers.com/events?ref=phack";
const failed = () => Result.err(new PhackError({ message: "Request failed." }));

test("creation uses an atomic create and preserves the exact destination", async () => {
  const result = await createLink(destination, "hack-night", async (path, body) => {
    expect(path).toBe("/items");
    expect(body).toBe(
      JSON.stringify({
        items: [{ operation: "create", key: "hack-night", value: { d: destination, v: 0 } }],
      }),
    );
    return Result.ok("{}");
  });
  expect(result.isOk() && result.value.status).toBe("created");
});

test("invalid inputs never reach Vercel", async () => {
  let calls = 0;
  const request = async () => {
    calls += 1;
    return Result.ok("{}");
  };
  for (const slug of ["api", "API", "a", "-bad", "bad/slug", "x".repeat(65)]) {
    expect((await createLink(destination, slug, request)).isErr()).toBe(true);
    expect((await getLink(slug, request)).isErr()).toBe(true);
  }
  for (const url of ["javascript:alert(1)", "file:///tmp/x", "not a url"])
    expect((await createLink(url, "valid", request)).isErr()).toBe(true);
  expect(calls).toBe(0);
});

test("an uncertain write reconciles the same slug and does not write twice", async () => {
  const paths: string[] = [];
  const result = await createLink(destination, "same-link", async (path) => {
    paths.push(path);
    return path === "/items"
      ? failed()
      : Result.ok(JSON.stringify({ value: { d: destination, v: 9 } }));
  });
  expect(result.isOk() && result.value.status).toBe("existing");
  expect(paths).toEqual(["/items", "/item/same-link"]);
});

test("a conflicting destination is never overwritten", async () => {
  const result = await createLink(destination, "taken-link", async (path) =>
    path === "/items" ? failed() : Result.ok('{"value":{"d":"https://example.com"}}'),
  );
  expect(result.isErr() && result.error.message).toContain("Nothing was overwritten");
});

test("an unresolved generated slug is retained in recovery instructions", async () => {
  const paths: string[] = [];
  const result = await createLink(destination, undefined, async (path) => {
    paths.push(path);
    return failed();
  });
  const slug = paths[1]?.slice("/item/".length);
  expect(slug).toMatch(/^[a-f0-9]{8}$/u);
  expect(result.isErr() && result.error.message).toContain("--slug " + slug);
  expect(paths.length).toBe(2);
});

test("reads reject missing and malformed records", async () => {
  for (const raw of ["", "not-json", "{}", '{"value":{"d":"javascript:alert(1)"}}'])
    expect((await getLink("valid", async () => Result.ok(raw))).isErr()).toBe(true);
  const result = await getLink("valid", async () =>
    Result.ok(JSON.stringify({ value: { d: destination } })),
  );
  expect(result.isOk() && result.value.destination).toBe(destination);
});
