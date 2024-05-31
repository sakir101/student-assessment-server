/*
  Warnings:

  - Added the required column `activity` to the `admins` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SkillStatus" AS ENUM ('Expert', 'Proficient', 'Competent', 'Novice', 'NotSet');

-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'NotSet';

-- AlterTable
ALTER TABLE "admins" ADD COLUMN     "activity" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "task_feedback" ALTER COLUMN "comment" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'NotSet';

-- CreateTable
CREATE TABLE "super_admins" (
    "id" TEXT NOT NULL,
    "superAdminId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "middleName" TEXT NOT NULL,
    "profileImage" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "super_admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_skills" (
    "interestId" TEXT NOT NULL,
    "status" "SkillStatus" NOT NULL,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "student_skills_pkey" PRIMARY KEY ("interestId","studentId")
);

-- CreateTable
CREATE TABLE "student_relatedWorks" (
    "interestId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "student_relatedWorks_pkey" PRIMARY KEY ("interestId","studentId")
);

-- CreateTable
CREATE TABLE "faculty_relatedWorks" (
    "interestId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "facultyId" TEXT NOT NULL,

    CONSTRAINT "faculty_relatedWorks_pkey" PRIMARY KEY ("interestId","facultyId")
);

-- AddForeignKey
ALTER TABLE "super_admins" ADD CONSTRAINT "super_admins_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_skills" ADD CONSTRAINT "student_skills_interestId_fkey" FOREIGN KEY ("interestId") REFERENCES "interests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_skills" ADD CONSTRAINT "student_skills_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_relatedWorks" ADD CONSTRAINT "student_relatedWorks_interestId_fkey" FOREIGN KEY ("interestId") REFERENCES "interests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_relatedWorks" ADD CONSTRAINT "student_relatedWorks_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faculty_relatedWorks" ADD CONSTRAINT "faculty_relatedWorks_interestId_fkey" FOREIGN KEY ("interestId") REFERENCES "interests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faculty_relatedWorks" ADD CONSTRAINT "faculty_relatedWorks_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "faculties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
