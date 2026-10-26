import { expect, test } from "bun:test";

import { getHcb } from "../cli/hcb/client";

test("public reads preserve JSON and never send a private token", async () => {
  const calls: { url: string; init: RequestInit }[] = [];
  const result = await getHcb(
    "/organizations/purdue-hackers?expand=balance",
    { api: "v3", all: false, token: "fixture-private" },
    async (url, init) => {
      calls.push({ url: url.href, init });
      return Response.json({ balance_cents: -1234, pending: null });
    },
  );
  expect(result.isOk() && result.value).toEqual({ balance_cents: -1234, pending: null });
  expect(calls[0]?.url).toBe(
    "https://hcb.hackclub.com/api/v3/organizations/purdue-hackers?expand=balance",
  );
  expect(new Headers(calls[0]?.init.headers).has("Authorization")).toBe(false);
  expect(calls[0]?.init.method).toBe("GET");
  expect(calls[0]?.init.redirect).toBe("error");
  expect(calls[0]?.init.signal).toBeInstanceOf(AbortSignal);
});

test("private reads require and forward the caller's token", async () => {
  let calls = 0;
  const request = async (_url: URL, init: RequestInit) => {
    calls += 1;
    expect(new Headers(init.headers).get("Authorization")).toBe("Bearer fixture-private");
    return Response.json([{ id: "org_fixture" }]);
  };
  const missing = await getHcb("/user/organizations", { api: "v4", all: false }, request);
  expect(missing.isErr()).toBe(true);
  expect(calls).toBe(0);
  const result = await getHcb(
    "/user/organizations",
    { api: "v4", all: true, token: "fixture-private" },
    request,
  );
  expect(result.isOk() && result.value).toEqual([{ id: "org_fixture" }]);
  expect(calls).toBe(1);
});

test("public pagination keeps filters and collects every page", async () => {
  const pages: string[] = [];
  const result = await getHcb(
    "/organizations/fixture/transactions?per_page=2&expand=card_charge",
    { api: "v3", all: true },
    async (url) => {
      expect(url.searchParams.get("per_page")).toBe("2");
      expect(url.searchParams.get("expand")).toBe("card_charge");
      pages.push(url.searchParams.get("page") ?? "missing");
      return Response.json(pages.length === 1 ? [{ id: "a" }, { id: "b" }] : [{ id: "c" }]);
    },
  );
  expect(pages).toEqual(["1", "2"]);
  expect(result.isOk() && result.value).toEqual([{ id: "a" }, { id: "b" }, { id: "c" }]);
});

test("private pagination follows has_more and public ID cursors", async () => {
  const cursors: (string | null)[] = [];
  const result = await getHcb(
    "/organizations/fixture/transactions?filters[missing_receipts]=true",
    { api: "v4", all: true, token: "fixture-private" },
    async (url) => {
      cursors.push(url.searchParams.get("after"));
      expect(url.searchParams.get("limit")).toBe("100");
      expect(url.searchParams.get("filters[missing_receipts]")).toBe("true");
      return Response.json(
        cursors.length === 1
          ? { has_more: true, total_count: 2, data: [{ id: "txn_a", amount_cents: -123 }] }
          : { has_more: false, total_count: 2, data: [{ id: "txn_b", amount_cents: 456 }] },
      );
    },
  );
  expect(cursors).toEqual([null, "txn_a"]);
  expect(result.isOk() && result.value).toEqual([
    { id: "txn_a", amount_cents: -123 },
    { id: "txn_b", amount_cents: 456 },
  ]);
});

test.each([401, 403, 404, 429, 500])(
  "HTTP %s fails without treating unavailable data as zero",
  async (status) => {
    const result = await getHcb(
      "/organizations/fixture",
      { api: "v4", all: false, token: "fixture-private" },
      async () => Response.json({ private: "fixture-sensitive" }, { status }),
    );
    expect(result.isErr() && result.error.message).toContain("HTTP " + status);
    expect(JSON.stringify(result)).not.toContain("fixture-private");
    expect(JSON.stringify(result)).not.toContain("fixture-sensitive");
  },
);

test("pagination errors discard partial results", async () => {
  let pages = 0;
  const result = await getHcb(
    "/organizations/fixture/transactions?per_page=1",
    { api: "v3", all: true },
    async () => {
      pages += 1;
      return pages === 1
        ? Response.json([{ id: "txn_a" }])
        : new Response("unavailable", { status: 503 });
    },
  );
  expect(result.isErr()).toBe(true);
  expect(JSON.stringify(result)).not.toContain("txn_a");
});

test("repeated pages, missing cursors and unsupported envelopes fail", async () => {
  for (const data of [
    { has_more: true, data: [{ id: "txn_same" }] },
    { has_more: true, data: [] },
    { has_more: true, data: [{ memo: "no ID" }] },
    { balance_cents: 123 },
  ]) {
    let calls = 0;
    const result = await getHcb(
      "/organizations/fixture/transactions",
      { api: "v4", all: true, token: "fixture-private" },
      async () => {
        calls += 1;
        return Response.json(data);
      },
    );
    expect(result.isErr()).toBe(true);
    expect(calls).toBeLessThanOrEqual(2);
  }
  const invalid = await getHcb(
    "/organizations/fixture",
    { api: "v3", all: false },
    async () => new Response("not json"),
  );
  expect(invalid.isErr() && invalid.error.message).toBe("HCB returned invalid JSON.");
});

test("paths cannot escape HCB, and --all cannot start halfway through a list", async () => {
  let calls = 0;
  for (const path of [
    "https://example.com",
    "//example.com",
    "/../../../outside",
    "/%2e%2e/other",
    "/user#fragment",
    "/user\\organizations",
    "/organizations?page=2",
    "/organizations?after=txn_a",
    "/organizations?per_page=0",
    "/organizations?per_page=101",
  ]) {
    const result = await getHcb(
      path,
      { api: "v3", all: true, token: "fixture-private" },
      async () => {
        calls += 1;
        return Response.json([]);
      },
    );
    expect(result.isErr()).toBe(true);
  }
  expect(calls).toBe(0);
});

test("CLI exposes help and reports invalid inputs without stdout data", async () => {
  for (const args of [
    ["--help"],
    ["post", "/organizations"],
    ["get", "/user/organizations", "--api", "v4"],
    ["get", "/organizations", "--token", "fixture-secret"],
  ]) {
    const child = Bun.spawn(
      [process.execPath, "--no-env-file", import.meta.dir + "/../cli/hcb/index.ts", ...args],
      { env: {}, stdout: "pipe", stderr: "pipe" },
    );
    const [code, stdout, stderr] = await Promise.all([
      child.exited,
      new Response(child.stdout).text(),
      new Response(child.stderr).text(),
    ]);
    if (args[0] === "--help") {
      expect(code).toBe(0);
      expect(stdout).toContain("Usage: hcb get");
      expect(stderr).toBe("");
    } else {
      expect(code).toBe(1);
      expect(stdout).toBe("");
      expect(stderr).not.toBe("");
      expect(stderr).not.toContain("fixture-secret");
    }
  }
});
