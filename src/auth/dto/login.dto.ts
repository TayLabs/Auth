import z from 'zod';

const loginBodySchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string('Password must be a valid string'),
});

type LoginBody = z.infer<typeof loginBodySchema>;

export { loginBodySchema as default, type LoginBody };
