import { Role } from "../enums"
import AppError from "./AppError"

export function CheckRole(role: string) {
  if(role !== Role.ADMIN_ROLE) 
   throw new AppError("You do not have permission to make this action", 403)
}