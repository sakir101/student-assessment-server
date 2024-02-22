import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { CareerRoutes } from '../modules/careerPredict/careerPredict.route';
import { FacultyRoutes } from '../modules/faculty/faculty.route';
import { InterestRoutes } from '../modules/interest/interest.route';
import { StudentRoutes } from '../modules/student/student.route';
import { TaskRoutes } from '../modules/task/task.route';
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
  {
    path: "/students",
    route: StudentRoutes
  },
  {
    path: "/career-predict",
    route: CareerRoutes
  },
  {
    path: "/faculties",
    route: FacultyRoutes
  },
  {
    path: "/tasks",
    route: TaskRoutes
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
