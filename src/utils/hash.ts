import crypto from "crypto";
import bcrypt from "bcryptjs";
import env from "./validations/env";

const SALT_ROUNDS = 12;
const HASH_ALGORITHM = "sha256";
const HASH_ENCODING = "hex";

export const hashToken = (token: string): string => {
	const hash = crypto.createHmac(HASH_ALGORITHM, env.JWT_REFRESH_SECRET);
	hash.update(token);
	return hash.digest(HASH_ENCODING);
}

export const hashPassword = async (password: string): Promise<string> => {
	const salt = await bcrypt.genSalt(SALT_ROUNDS);
	return await bcrypt.hash(password, salt);
};