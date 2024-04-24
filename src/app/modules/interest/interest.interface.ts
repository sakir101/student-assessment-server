import { SkillStatus } from '@prisma/client';

export type IInterestFilterRequest = {
    searchTerm?: string | undefined;
}

export type SkillStudentCreateManyInput = {
    interestId: string;
    studentId: string;
    status: SkillStatus;
};