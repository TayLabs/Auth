import { type ResponseBody } from '@/types/ResponseBody';
import z from 'zod';

const toggleTwoFactorParamsSchema = z.object({
  switch: z
    .string()
    .regex(/^(on|off)$/, "Invalid parameter, must be either 'on' or off")
    .transform((str) => str as 'on' | 'off'),
});

type ToggleTwoFactorParams = z.infer<typeof toggleTwoFactorParamsSchema>;
type ToggleTwoFactorResBody = ResponseBody;

export {
  toggleTwoFactorParamsSchema as default,
  type ToggleTwoFactorParams,
  type ToggleTwoFactorResBody,
};
