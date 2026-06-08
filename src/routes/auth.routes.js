const { Router } = require("express");
const authController = require("../controllers/auth.controllers");

const authRouter = Router();
/**
 * @route post/api/auth/register
 *@description Register a new user
 * @access public
 */
authRouter.post("/register", authController.registerUserController);
/**
 * @route Post/api/auth/login
 * @description login user with emaill and password
 * @access public
 */
authRouter.post("api/login", authController.loginUserController);
module.exports = authRouter;
