import { z } from "zod";

export const userEmailSchema = z
	.string()
	.email({ message: "Invalid email address" })
	.min(1, { message: "Email is required" });

export const userPasswordSchema = z
	.string()
	.min(6, { message: "Password must be at least 6 characters long" })
	.max(20, { message: "Password must be at most 20 characters long" })
	.regex(/^(?=.*[a-zA-Z])(?=.*[0-9]).*$/, {
		message: "Password must contain at least one letter and one number",
	});

