/* eslint-disable no-undef */
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  default_student_pass: process.env.DEFAULT_STUDENT_PASS,
  default_faculty_pass: process.env.DEFAULT_FACULTY_PASS,
  default_admin_pass: process.env.DEFAULT_ADMIN_PASS,
  bycrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  email: process.env.EMAIL,
  email_password: process.env.EMAIL_PASSWORD,
  charset: process.env.charset,
  jwt: {
    student_secret: process.env.JWT_SECRET_STUDENT,
    faculty_secret: process.env.JWT_SECRET_FACULTY,
    admin_secret: process.env.JWT_SECRET_ADMIN,
    super_admin_secret: process.env.JWT_SECRET_SUPER_ADMIN,
    student_refresh_secret: process.env.JWT_REFRESH_SECRET_STUDENT,
    faculty_refresh_secret: process.env.JWT_REFRESH_SECRET_FACULTY,
    admin_refresh_secret: process.env.JWT_REFRESH_SECRET_ADMIN,
    super_admin_refresh_secret: process.env.JWT_REFRESH_SECRET_SUPER_ADMIN,
    expires_in: process.env.JWT_EXPIRES_IN,
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  },
};
