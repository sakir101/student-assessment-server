import axios from 'axios';
import prisma from '../../../shared/prisma';

const careerPrediction = async (id: string) => {
    try {
        const assignInterestData = await prisma.interestStudent.findMany({
            where: {
                studentId: id
            },
            include: {
                interest: true
            }
        })
        const interest: string[] = [];

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

        const skill: string[] = [];

        const key = 'key'; // Define the key name

        // Concatenate all interest values using Array.join() method
        const concatenatedInterests = interest.join(', ');

        // Create an object with the specified key and concatenated interests
        const obj = {
            [key]: concatenatedInterests
        };

        console.log(obj);

        const combinedArray = [...new Set([...skill, ...interest])];

        // console.log(combinedArray);

        const interestData = obj[key];
        console.log(interestData);
        const apiUrl = "http://127.0.0.1:5001/careerPredict";


        const response = await axios.post(apiUrl, { interest: interestData });

        const prediction = response.data;



        return prediction

    } catch (error) {
        console.log("failed");
        return error
    }
}

export const CareerPredictService = {
    careerPrediction
}