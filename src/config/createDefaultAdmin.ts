import User from "../models/user.model";

export const createDefaultAdmin = async() => {
  const adminExist = await User.findOne({ role: "admin" });
  if(adminExist) return ;
  await User.create({
    username: process.env.ADMIN_USERNAME,
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    type: process.env.ADMIN_TYPE,
    role: process.env.ROLE
  });
  console.log ("admin created successfuly");
}
