import express from 'express';
import { AdminRoutes } from '../modules/admin/admin.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { CareerRoutes } from '../modules/careerPredict/careerPredict.route';
import { courseRoutes } from '../modules/course/course.route';
import { FacultyRoutes } from '../modules/faculty/faculty.route';
import { InterestRoutes } from '../modules/interest/interest.route';
import { JobRoutes } from '../modules/job/job.route';
import { MasterFieldRoutes } from '../modules/masterField/masterField.route';
import { StudentRoutes } from '../modules/student/student.route';
import { SubFieldRoutes } from '../modules/subField/subField.route';
import { SuperAdminRoutes } from '../modules/superAdmin/superAdmin.route';
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
  {
    path: "/masterField",
    route: MasterFieldRoutes
  },
  {
    path: "/subField",
    route: SubFieldRoutes
  },
  {
    path: "/course",
    route: courseRoutes
  },
  {
    path: "/job",
    route: JobRoutes
  },
  {
    path: "/superAdmin",
    route: SuperAdminRoutes
  },
  {
    path: "/admin",
    route: AdminRoutes
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
