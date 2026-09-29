const mongoose = require("mongoose");

const liveQuizSchema = new mongoose.Schema(
  {
    roomCode: {
      type: String,
      required: true,
      unique: true,
    },
    subject: {
      type: String,
      required: true,
    },
    numberOfQuestions: {
      type: Number,
      required: true,
    },
    questions: [
      {
        question: String,
        options: [String],
        correctAnswer: Number,
        explanation: String,
        _id: false,
      },
    ],
    host: {
      type: mongoose.Schema.Types.Mixed,
      ref: "users",
    },
    players: [
      {
        userId: { type: mongoose.Schema.Types.Mixed, ref: "users" },
        name: String,
        score: { type: Number, default: 0 },
        answers: [
          {
            questionIndex: Number,
            selectedOption: Number,
            isCorrect: Boolean,
            _id: false,
          },
        ],
        _id: false,
      },
    ],
    status: {
      type: String,
      enum: ["waiting", "playing", "finished"],
      default: "waiting",
    },
    currentQuestion: {
      type: Number,
      default: 0,
    },
    winner: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

const liveQuizModel = mongoose.model("LiveQuiz", liveQuizSchema);
module.exports = liveQuizModel;
