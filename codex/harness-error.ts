import { TaggedError } from "better-result";

/** Reports an operational failure without exposing credentials or hook payloads. */
export class HarnessError extends TaggedError("HarnessError")<{ message: string }> {}
