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
        const interest: string[] = [];

        if (!assignInterestData) {
            return new ApiError(httpStatus.NOT_FOUND, "Student does not select any interest")
        }

        if (assignInterestData) {
            const interestIds: string[] = [];

            // Map through the data array and extract interestId from each object
            assignInterestData.forEach(item => {
                interestIds.push(item.interestId);
            });

            const interestData = await prisma.interest.findMany({
                where: {
                    id: {
                        in: interestIds,
                    },
                },
            });

            interestData.forEach(item => {
                interest.push(item.title)
            })
        }

        // const skill: string[] = [];

        const key = 'key'; // Define the key name

        // Concatenate all interest values using Array.join() method
        const concatenatedInterests = interest.join(', ');

        // Create an object with the specified key and concatenated interests
        const obj = {
            [key]: concatenatedInterests
        };

        // console.log(obj);

        // const combinedArray = [...new Set([...skill, ...interest])];

        // console.log(combinedArray);

        const interestData = obj[key];
        const apiUrl = "http://127.0.0.1:5001/careerPredict";


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