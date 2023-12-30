import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { InterestRoutes } from '../modules/interest/interest.route';
import { TokenRoutes } from '../modules/token/token.route';
import { UserRoutes } from '../modules/user/user.route';


const router = express.Router();

const moduleRoutes = [
  // ... routes
  {
    path: "/user",
    route: UserRoutes
  },
  {
    path: "/users",
    route: TokenRoutes
  },
  {
    path: "/auth",
    route: AuthRoutes
  },
  {
    path: "/interest",
    route: InterestRoutes
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
