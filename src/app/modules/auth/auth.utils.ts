import bcrypt from 'bcrypt';

export const isPasswordMatched = async (givenPassword: string, savedPassword: string) => {
    return await bcrypt.compare(givenPassword, savedPassword);
}