import axios from 'axios';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';

const careerPrediction = async (id: string) => {
    try {
        const studentInfo = await prisma.student.findFirst({
            where: {
                userId: id
            }
        })

        if (!studentInfo) {
            throw new ApiError(httpStatus.NOT_FOUND, "Student does not exist")
        }

        const { id: sId } = studentInfo
        const assignInterestData = await prisma.interestStudent.findMany({
            where: {
                studentId: sId
            },
            include: {
                interest: true
            }
        })

        const assignSkillData = await prisma.skillStudent.findMany({
            where: {
                studentId: sId
            },
            include: {
                interest: true
            }
        })

        const assignRelatedWorksData = await prisma.relatedWorksStudent.findMany({
            where: {
                studentId: sId
            },
            include: {
                interest: true
            }
        })

        const interest: string[] = [];


        if (assignInterestData.length === 0) {
            throw new ApiError(httpStatus.NOT_FOUND, "Student did not select any interest");
        }

        if (assignSkillData.length === 0) {
            throw new ApiError(httpStatus.NOT_FOUND, "Student did not select any skill");
        }

        if (assignRelatedWorksData.length === 0) {
            throw new ApiError(httpStatus.NOT_FOUND, "Student did not create any related work");
        }


        if (assignInterestData && assignSkillData && assignRelatedWorksData) {
            const interestIds: string[] = [];
            const skillIds: string[] = [];
            const relatedWorksIds: string[] = [];

            assignInterestData.forEach(item => {
                interestIds.push(item.interestId);
            });

            assignSkillData.forEach(item => {
                skillIds.push(item.interestId);
            });

            assignRelatedWorksData.forEach(item => {
                relatedWorksIds.push(item.interestId);
            });

            const allIds = [...interestIds, ...skillIds, ...relatedWorksIds];

            const combinedIds = Array.from(new Set(allIds));

            const interestData = await prisma.interest.findMany({
                where: {
                    id: {
                        in: combinedIds,
                    },
                },
            });

            interestData.forEach(item => {
                interest.push(item.title)
            })
        }

        const key = 'key';
        const concatenatedInterests = interest.join(', ');

        const obj = {
            [key]: concatenatedInterests
        };

        const interestData = obj[key];
        console.log(interestData)

        const apiUrl = "https://3996-59-153-103-212.ngrok-free.app";

        const response = await axios.post(apiUrl, { interest: interestData });

        const prediction = response.data;

        return prediction

    } catch (error) {
        throw new ApiError(httpStatus.NOT_FOUND, "Failed to analysis data")
    }
}

export const CareerPredictService = {
    careerPrediction
}