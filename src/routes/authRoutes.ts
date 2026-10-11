import express from "express";
import { 
  signUp,
  login,
  logout,
  me,
  helloWorld,
} from './../controllers/auth.controller';
import { protect, restrictTo } from "../middlewares";
import { Role } from "../enums";

const router = express.Router();

// protected and restricted for admins only 
router.post("/signup", protect, restrictTo(Role.ADMIN_ROLE), signUp);

// public for every one
router.post("/login", login);

router.post("/logout", logout); 

router.get("/me", protect, me);

router.get("/hello", helloWorld);


export default router;