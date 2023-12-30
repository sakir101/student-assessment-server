import { Interest } from "@prisma/client"
import prisma from "../../../shared/prisma"

const createInterest = async (interestData: Interest): Promise<Interest> => {
    const result = await prisma.interest.create({
        data: interestData
    })
    return result
}

export const InterestService = {
    createInterest
}