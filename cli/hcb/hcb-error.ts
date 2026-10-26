import { TaggedError } from "better-result";

/** Reports HCB request failures without exposing credentials or account data. */
export class HcbError extends TaggedError("HcbError")<{ message: string }> {}
