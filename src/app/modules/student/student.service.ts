import { InterestStudent } from "@prisma/client";
import prisma from "../../../shared/prisma";

const assignInterest = async (
    id: string,
    payload: string[]
): Promise<InterestStudent[]> => {
    const existingInterests = await prisma.interestStudent.findMany({
        where: {
            studentId: id,
            interestId: {
                in: payload,
            },
        },
    });

    const existingInterestIds = existingInterests.map((interest) => interest.interestId);

    const newInterestsToCreate = payload.filter((interestId) => !existingInterestIds.includes(interestId));

    await prisma.interestStudent.createMany({
        data: newInterestsToCreate.map((interestId) => ({
            interestId,
            studentId: id,
        })),
    });
    const assignInterestData = await prisma.interestStudent.findMany({
        where: {
            studentId: id
        },
        include: {
            interest: true
        }
    })
    return assignInterestData
}

export const StudentService = {
    assignInterest
}
