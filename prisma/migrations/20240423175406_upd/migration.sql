/*
  Warnings:

  - Added the required column `contactNum` to the `faculties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `institution` to the `faculties` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Correct', 'Wrong', 'PartiallyCorrect', 'PartiallyWrong');

-- AlterTable
ALTER TABLE "faculties" ADD COLUMN     "contactNum" TEXT NOT NULL,
ADD COLUMN     "institution" TEXT NOT NULL,
ALTER COLUMN "middleName" DROP NOT NULL;

-- AlterTable
ALTER TABLE "students" ALTER COLUMN "middleName" DROP NOT NULL;

-- CreateTable
CREATE TABLE "faculty_interests" (
    "interestId" TEXT NOT NULL,
    "facultyId" TEXT NOT NULL,

    CONSTRAINT "faculty_interests_pkey" PRIMARY KEY ("interestId","facultyId")
);

-- CreateTable
CREATE TABLE "faculty_enrollment" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "facultyId" TEXT NOT NULL,

    CONSTRAINT "faculty_enrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "solution" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "facultyId" TEXT NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_hint" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,

    CONSTRAINT "task_hint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_task" (
    "taskId" TEXT NOT NULL,
    "solution" TEXT,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "student_task_pkey" PRIMARY KEY ("taskId","studentId")
);

-- CreateTable
CREATE TABLE "faculty_task" (
    "taskId" TEXT NOT NULL,
    "facultyId" TEXT NOT NULL,

    CONSTRAINT "faculty_task_pkey" PRIMARY KEY ("taskId","facultyId")
);

-- CreateTable
CREATE TABLE "task_feedback" (
    "taskId" TEXT NOT NULL,
    "facultyId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "status" "Status" NOT NULL,

    CONSTRAINT "task_feedback_pkey" PRIMARY KEY ("taskId","facultyId","studentId")
);

-- AddForeignKey
ALTER TABLE "faculty_interests" ADD CONSTRAINT "faculty_interests_interestId_fkey" FOREIGN KEY ("interestId") REFERENCES "interests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faculty_interests" ADD CONSTRAINT "faculty_interests_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "faculties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faculty_enrollment" ADD CONSTRAINT "faculty_enrollment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faculty_enrollment" ADD CONSTRAINT "faculty_enrollment_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "faculties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "faculties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_hint" ADD CONSTRAINT "task_hint_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_task" ADD CONSTRAINT "student_task_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_task" ADD CONSTRAINT "student_task_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faculty_task" ADD CONSTRAINT "faculty_task_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faculty_task" ADD CONSTRAINT "faculty_task_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "faculties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_feedback" ADD CONSTRAINT "task_feedback_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_feedback" ADD CONSTRAINT "task_feedback_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "faculties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_feedback" ADD CONSTRAINT "task_feedback_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
