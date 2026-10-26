import { z } from "zod";

// oxlint-disable-next-line rayhanadev/no-promise-catch -- Zod recovery omits invalid optional metadata without rejecting the lifecycle event.
const identifier = z
  .string()
  .regex(/^[\w.:-]{1,180}$/u)
  .optional()
  .catch(undefined);

const reportedErrorSchema = z.union([
  z.object({ isError: z.literal(true) }),
  z.object({ ok: z.literal(false) }),
  z.object({ exit_code: z.number().refine((code) => code !== 0) }),
]);

export const hookEventSchema = z.object({
  hook_event_name: z.enum([
    "SessionStart",
    "SubagentStart",
    "PreToolUse",
    "PostToolUse",
    "SubagentStop",
    "Stop",
    "Interrupt",
    "SessionEnd",
  ]),
  session_id: identifier,
  turn_id: identifier,
  tool_name: identifier,
  tool_use_id: identifier,
  agent_id: identifier,
  agent_type: identifier,
  source: identifier,
  // Inspect error flags without retaining or traversing response content.
  tool_response: z.preprocess(
    (response) => reportedErrorSchema.safeParse(response).success,
    z.boolean(),
  ),
});

export type HookEvent = z.infer<typeof hookEventSchema>;
