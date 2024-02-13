import { InterestFaculty } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import prisma from "../../../shared/prisma";

const assignInterestFaculty = async (
    id: string,
    payload: string[]
): Promise<InterestFaculty[]> => {

    const facultyInfo = await prisma.faculty.findFirst({
        where: {
            userId: id
        }
    })

    if (!facultyInfo) {
        throw new ApiError(httpStatus.NOT_FOUND, "Faculty does not exist")
    }

    const { id: fId } = facultyInfo
    const existingInterests = await prisma.interestFaculty.findMany({
        where: {
            facultyId: fId,
            interestId: {
                in: payload,
            },
        },
    });

    const existingInterestIds = existingInterests.map((interest) => interest.interestId);

    const newInterestsToCreate = payload.filter((interestId) => !existingInterestIds.includes(interestId));

    await prisma.interestFaculty.createMany({
        data: newInterestsToCreate.map((interestId) => ({
            interestId,
            facultyId: fId,
        })),
    });
    const assignInterestData = await prisma.interestFaculty.findMany({
        where: {
            facultyId: fId
        },
        include: {
            interest: true
        }
    })
    return assignInterestData
}

export const FacultyService = {
    assignInterestFaculty
}
