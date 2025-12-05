import { controller } from '@/middleware/controller.middleware';

export const update = controller<any, any>((req, res, _next) => {
  res.status(200).json({
    profile: {},
  });
});
