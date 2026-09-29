const liveQuizModel = require("../models/liveQuiz.model");
const { generateQuizQuestions } = require("../services/ai.service");

const QUESTION_TIMER = 15; // seconds per question
const roomTimers = {}; // store timers

function liveQuizSocket(io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // CREATE ROOM
    socket.on(
      "create_room",
      async ({ subject, numberOfQuestions, userName, userId }) => {
        try {
          // generate room code
          const roomCode = Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase();

          // generate questions from Gemini
          const quizData = await generateQuizQuestions({
            subject,
            numberOfQuestions,
          });

          // save in MongoDB
          const liveQuiz = await liveQuizModel.create({
            roomCode,
            subject,
            numberOfQuestions,
            questions: quizData.questions,
            host: userId,
            players: [{ userId, name: userName, score: 0, answers: [] }],
            status: "waiting",
          });

          socket.join(roomCode);
          socket.data.roomCode = roomCode;
          socket.data.userId = userId;
          socket.data.userName = userName;

          socket.emit("room_created", { roomCode, quiz: liveQuiz });
        } catch (err) {
          console.error("Error creating room:", err);
          socket.emit("error", { message: err.message || "Failed to create room" });
        }
      },
    );

    // JOIN ROOM
    socket.on("join_room", async ({ roomCode, userName, userId }) => {
      try {
        const liveQuiz = await liveQuizModel.findOne({ roomCode });

        if (!liveQuiz) {
          return socket.emit("error", { message: "Room not found" });
        }
        if (liveQuiz.status !== "waiting") {
          return socket.emit("error", { message: "Game already started" });
        }
        if (liveQuiz.players.length >= 2) {
          return socket.emit("error", { message: "Room is full" });
        }

        // check if player is already in room
        const existingPlayer = liveQuiz.players.find(p => p.name === userName || (userId && p.userId === userId));
        if (!existingPlayer) {
          liveQuiz.players.push({
            userId: userId || userName,
            name: userName,
            score: 0,
            answers: [],
          });
          await liveQuiz.save();
        }

        socket.join(roomCode);
        socket.data.roomCode = roomCode;
        socket.data.userId = userId || userName;
        socket.data.userName = userName;

        // tell everyone in room that player joined
        io.to(roomCode).emit("player_joined", {
          players: liveQuiz.players,
          message: `${userName} joined the room!`,
        });
      } catch (err) {
        console.error("Error joining room:", err);
        socket.emit("error", { message: err.message || "Failed to join room" });
      }
    });

    // START GAME (only host can start)
    socket.on("start_game", async ({ roomCode }) => {
      try {
        const liveQuiz = await liveQuizModel.findOne({ roomCode });

        if (!liveQuiz)
          return socket.emit("error", { message: "Room not found" });
        if (liveQuiz.players.length < 2)
          return socket.emit("error", { message: "Need 2 players to start" });

        liveQuiz.status = "playing";
        liveQuiz.currentQuestion = 0;
        await liveQuiz.save();

        // send first question
        sendQuestion(io, roomCode, liveQuiz, 0);
      } catch (err) {
        console.error("Error starting game:", err);
        socket.emit("error", { message: err.message || "Failed to start game" });
      }
    });

    // SUBMIT ANSWER
    socket.on(
      "submit_answer",
      async ({ roomCode, questionIndex, selectedOption, userId }) => {
        try {
          const liveQuiz = await liveQuizModel.findOne({ roomCode });
          if (!liveQuiz) return;

          const question = liveQuiz.questions[questionIndex];
          const isCorrect = selectedOption === question.correctAnswer;

          // update player score and answer
          const player = liveQuiz.players.find(
            (p) => p.userId && (p.userId.toString() === userId?.toString()) || p.name === userId,
          );
          if (player) {
            if (isCorrect) player.score += 1;
            player.answers.push({ questionIndex, selectedOption, isCorrect });
          }

          await liveQuiz.save();

          // broadcast updated scores to room
          io.to(roomCode).emit("score_update", {
            players: liveQuiz.players,
            answeredBy: userId,
            isCorrect,
          });
        } catch (err) {
          console.error("Error submitting answer:", err);
          socket.emit("error", { message: "Failed to submit answer" });
        }
      },
    );

    // DISCONNECT
    socket.on("disconnect", () => {
      const { roomCode, userName } = socket.data;
      if (roomCode) {
        io.to(roomCode).emit("player_left", {
          message: `${userName} left the game`,
        });
        if (roomTimers[roomCode]) {
          clearTimeout(roomTimers[roomCode]);
        }
      }
      console.log("User disconnected:", socket.id);
    });
  });
}

// Helper: send question with timer
function sendQuestion(io, roomCode, liveQuiz, questionIndex) {
  const question = liveQuiz.questions[questionIndex];

  // send question without correct answer
  io.to(roomCode).emit("new_question", {
    questionIndex,
    question: question.question,
    options: question.options,
    total: liveQuiz.questions.length,
    timer: QUESTION_TIMER,
  });

  // auto move after timer
  roomTimers[roomCode] = setTimeout(async () => {
    // send correct answer + explanation
    io.to(roomCode).emit("question_result", {
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      questionIndex,
    });

    // wait 3 seconds then next question or finish
    setTimeout(async () => {
      const nextIndex = questionIndex + 1;
      const updatedQuiz = await liveQuizModel.findOne({ roomCode });

      if (nextIndex >= liveQuiz.questions.length) {
        // game finished
        updatedQuiz.status = "finished";

        // find winner
        const sorted = [...updatedQuiz.players].sort(
          (a, b) => b.score - a.score,
        );
        updatedQuiz.winner = sorted[0].name;
        await updatedQuiz.save();

        io.to(roomCode).emit("game_over", {
          players: updatedQuiz.players,
          winner: updatedQuiz.winner,
        });
      } else {
        updatedQuiz.currentQuestion = nextIndex;
        await updatedQuiz.save();
        sendQuestion(io, roomCode, updatedQuiz, nextIndex);
      }
    }, 3000);
  }, QUESTION_TIMER * 1000);
}

module.exports = liveQuizSocket;
