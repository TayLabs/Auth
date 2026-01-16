import { Profile } from '@/interfaces/profile.interface';
import { type ResponseBody } from '@/types/ResponseBody';
import z from 'zod';

const updateBodySchema = z.object({
  firstName: z.string().min(1).max(128).optional(),
  lastName: z.string().min(1).max(128).optional(),
  displayName: z.string().min(1).max(256).optional(),
  username: z.string().min(3).max(256).optional(),
  bio: z.string().optional(),
});

type UpdateProfileReqBody = z.infer<typeof updateBodySchema>;
type UpdateProfileResBody = ResponseBody<{
  profile: Profile;
}>;

export {
  updateBodySchema as default,
  type UpdateProfileReqBody,
  type UpdateProfileResBody,
};
