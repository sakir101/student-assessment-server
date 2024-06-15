import { Admin } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import prisma from "../../../shared/prisma";

const getAdminByUserId = async (id: string): Promise<Admin | null> => {
    const AdminInfo = await prisma.admin.findFirst({
        where: {
            userId: id
        },
        include: {
            user: true
        }
    })

    if (!AdminInfo) {
        throw new ApiError(httpStatus.NOT_FOUND, "Admin does not exist")
    }


    return AdminInfo;
}

const getAdminByAdminId = async (id: string): Promise<Admin | null> => {
    const AdminInfo = await prisma.admin.findFirst({
        where: {
            id
        },
        include: {
            user: true
        }
    })

    if (!AdminInfo) {
        throw new ApiError(httpStatus.NOT_FOUND, "Admin does not exist")
    }


    return AdminInfo;
}

export const AdminService = {

    getAdminByUserId,
    getAdminByAdminId
}