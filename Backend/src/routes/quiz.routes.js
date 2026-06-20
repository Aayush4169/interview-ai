const express = require("express");
const router = express.Router();
const {
  generateQuizController,
  getQuizByIdController,
  getAllQuizzesController,
  submitQuizController,
} = require("../controllers/quiz.controller");
const { authUser } = require("../middlewares/auth.middleware");

router.post("/generate", authUser, generateQuizController);
router.get("/all", authUser, getAllQuizzesController);
router.get("/:quizId", authUser, getQuizByIdController);
router.patch("/:quizId/submit", authUser, submitQuizController);

module.exports = router;
