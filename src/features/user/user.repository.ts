import { User } from "../../prisma/generated";
import prisma from "../../prisma/client";
import { hashPassword } from "../../utils/hash";

export const findUserByEmail = (email: User["email"]) =>{
	return prisma.user.findUnique({
		where: {
			email,
		},
	});
}

export const createUserByEmailAndPassword = async(user: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'refreshTokens'>) => {
	const hashedPassword = await hashPassword(user.password);
	return await prisma.user.create({
		data: {
			email: user.email,
			password: hashedPassword,
		},
	});
}

export const findUserById = async (id: User["id"]) =>{
	return await prisma.user.findUnique({
		where: {
			id,
		},
  	});
}

