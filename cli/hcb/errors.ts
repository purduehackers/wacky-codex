import { TaggedError } from "better-result";

/** Reports HCB request failures without exposing credentials or account data. */
export class HcbError extends TaggedError("HcbError")<{ message: string }> {} // oxlint-disable-line rayhanadev/errors-file-organization -- TaggedError factory superclasses are not recognized by this rule.
