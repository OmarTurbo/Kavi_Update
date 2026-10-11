import { Request, Response } from "express";
import { catchAsync } from "../utils";
import { signUpService, loginService } from "../services/auth.service";

export const signUp = catchAsync(async (req: Request, res: Response) => {
  const user = await signUpService(req.body);
  
  
  res.status(201).json({
    status: "success",
    user,
  });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const { user, token } = await loginService(username, password);

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "none",
    secure: true,     
    maxAge: 24 * 60 * 60 * 1000,
  });
  
  res.status(200).json({
    status: "success",
    token,
    user,
  });
});

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    path: "/",
  });

  res.status(200).json({ message: "Logged out successfully" });
};

export const me = (req: any, res: Response) => {
  res.status(200).json({
    user: req.user, 
  });
};

export const helloWorld = (req: Request, res: Response) => {
  res.status(200).json({
    stauts: "success",
    message: "hello kavi on vps"
  });
};

