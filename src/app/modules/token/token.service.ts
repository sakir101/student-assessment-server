
import httpStatus from "http-status"
import ApiError from "../../../errors/ApiError"
import prisma from "../../../shared/prisma"

const verifyEmail = async (userId: string, token: string): Promise<void> => {
    const userResult = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })

    if (!userResult) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
    }

    const tokenData = await prisma.token.findFirst({
        where: {
            token: token,
        },
    });

    if (!tokenData) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Token not found')
    }

    const updateUser = {
        verifiedUser: true
    }

    await prisma.user.update({
        where: {
            id: userId
        },
        data: updateUser
    })

    await prisma.token.delete({
        where: {
            id: tokenData.id
        }
    })
}

export const TokenService = {
    verifyEmail
}