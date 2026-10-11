import jwt from "jsonwebtoken";

export const signToken = (id: string, email: string, role: string) => {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error("JWT_SECRET_KEY is not defined");
  }

  return jwt.sign(
    { id, email, role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d"}
  );
};
