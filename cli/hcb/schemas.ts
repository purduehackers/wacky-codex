import { z } from "zod";

// oxlint-disable-next-line rayhanadev/wrap-throwing-api -- Zod constructs a synchronous JSON schema without reading a response body.
export const jsonSchema = z.json();
export const optionsSchema = z.strictObject({
  api: z.enum(["v3", "v4"]).default("v3"),
  all: z.boolean().default(false),
  token: z.string().trim().min(1).optional(),
});
export const pathSchema = z
  .string()
  .startsWith("/")
  .refine(
    (path) => !path.startsWith("//") && !path.includes("\\") && !path.includes("#"),
    "Use a relative HCB API path.",
  );
export const pageSizeSchema = z.coerce.number().int().min(1).max(100);
export const listSchema = z.array(jsonSchema);
export const cursorPageSchema = z.looseObject({ data: listSchema, has_more: z.boolean() });
export const cursorItemSchema = z.looseObject({ id: z.string().min(1) });
