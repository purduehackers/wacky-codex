import { TaggedError } from "better-result";

/** Reports short-link failures without exposing authentication details. */
export class PhackError extends TaggedError("PhackError")<{ message: string }> {}
