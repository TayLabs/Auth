import z from 'zod';

const loginBodySchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

type LoginBody = z.infer<typeof loginBodySchema>;

export { loginBodySchema as default, type LoginBody };
