#!/usr/bin/env bun
import { parseArgs } from "node:util";

import { Result } from "better-result";

import { getHcb } from "./client";
import { HcbError } from "./errors";
import { optionsSchema } from "./schemas";

const usage =
  "Usage: hcb get /path[?filters] [--api v3|v4] [--all]\n" +
  "Read-only JSON. v3 is public; v4 uses HCB_TOKEN. --all collects every page into one JSON array.\n" +
  "Examples: hcb get /organizations/purdue-hackers\n" +
  "          hcb get /user/organizations --api v4\n" +
  "          hcb get /organizations/purdue-hackers/transactions --api v4 --all";

function run() {
  return Result.gen(async function* () {
    const args = yield* Result.try({
      try: () =>
        parseArgs({
          args: Bun.argv.slice(2),
          allowPositionals: true,
          strict: true,
          options: {
            api: { type: "string", default: "v3" },
            all: { type: "boolean", default: false },
            help: { type: "boolean", short: "h" },
          },
        }),
      catch: () => new HcbError({ message: usage }),
    });
    if (args.values.help) {
      console.log(usage);
      return Result.ok(undefined);
    }
    const [command, path] = args.positionals;
    if (command !== "get" || !path || args.positionals.length !== 2)
      return Result.err(new HcbError({ message: usage }));
    const options = optionsSchema.safeParse({
      api: args.values.api,
      all: args.values.all,
      token: process.env.HCB_TOKEN || undefined,
    });
    if (!options.success) return Result.err(new HcbError({ message: usage }));
    const data = yield* Result.await(getHcb(path, options.data));
    console.log(JSON.stringify(data, null, 2));
    return Result.ok(undefined);
  });
}

const result = await run();
if (result.isErr()) {
  console.error(result.error.message);
  process.exitCode = 1;
}
