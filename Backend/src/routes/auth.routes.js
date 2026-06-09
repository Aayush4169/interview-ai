const { Router } = require("express");
const authController = require("../controllers/auth.controllers");
const authMiddleware = require("../middlewares/auth.middleware");
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
authRouter.post("/login", authController.loginUserController);

/**
 * @route GET/api/auth/logout
 * @description clear token from user cookie and add the token in blacklist
 *@access public
 */
authRouter.get("/logout", authController.logoutUserController);

/**
 * @route GET /api/auth/get-me
 * @description get the current logged in user details
 *@acess private
 */
authRouter.get(
  "/get-me",
  authMiddleware.authUser,
  authController.getMeController,
);

module.exports = authRouter;
