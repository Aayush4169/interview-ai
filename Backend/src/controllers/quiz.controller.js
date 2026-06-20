const { generateQuizQuestions } = require("../services/ai.service");
const quizModel = require("../models/quiz.model");

// Generate and save quiz
async function generateQuizController(req, res) {
  const { subject, numberOfQuestions } = req.body;

  const quizData = await generateQuizQuestions({ subject, numberOfQuestions });

  const quiz = await quizModel.create({
    user: req.user.id,
    subject,
    numberOfQuestions,
    questions: quizData.questions,
  });

  res.status(201).json({
    message: "Quiz generated successfully.",
    quiz,
  });
}

// Get quiz by id
async function getQuizByIdController(req, res) {
  const { quizId } = req.params;

  const quiz = await quizModel.findOne({
    _id: quizId,
    user: req.user.id,
  });

  if (!quiz) {
    return res.status(404).json({ message: "Quiz not found." });
  }

  res.status(200).json({ message: "Quiz fetched successfully.", quiz });
}

// Get all quizzes of logged in user
async function getAllQuizzesController(req, res) {
  const quizzes = await quizModel
    .find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .select("-questions"); // don't send questions in list

  res.status(200).json({ message: "Quizzes fetched successfully.", quizzes });
}

// Submit quiz score
async function submitQuizController(req, res) {
  const { quizId } = req.params;
  const { score } = req.body;

  const quiz = await quizModel.findOneAndUpdate(
    { _id: quizId, user: req.user.id },
    { score, isCompleted: true },
    { new: true },
  );

  if (!quiz) {
    return res.status(404).json({ message: "Quiz not found." });
  }

  res.status(200).json({ message: "Quiz submitted successfully.", quiz });
}

module.exports = {
  generateQuizController,
  getQuizByIdController,
  getAllQuizzesController,
  submitQuizController,
};
