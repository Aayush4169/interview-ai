const mongoose = require("mongoose");

const quizQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Question is required"],
    },
    options: {
      type: [String],
      required: [true, "Options are required"],
    },
    correctAnswer: {
      type: Number,
      required: [true, "Correct answer index is required"],
    },
    explanation: {
      type: String,
      required: [true, "Explanation is required"],
    },
  },
  { _id: false },
);

const quizSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
    },
    numberOfQuestions: {
      type: Number,
      required: [true, "Number of questions is required"],
    },
    questions: [quizQuestionSchema],
    score: {
      type: Number,
      default: null,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const quizModel = mongoose.model("Quiz", quizSchema);
module.exports = quizModel;
