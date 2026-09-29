import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router";
import { useAuth } from "../../auth/hooks/useAuth";
import socket from "../services/liveQuiz.socket";
import "../style/quiz.scss";

export default function LiveQuizRoom() {
  const { roomCode } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const userName = state?.userName || user?.username || "Player";
  const isHost = state?.isHost || false;

  const [players, setPlayers] = useState(state?.initialPlayers || [{ name: userName }]);
  const [status, setStatus] = useState("waiting"); // waiting, playing, finished
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [explanation, setExplanation] = useState("");
  const [scores, setScores] = useState([]);
  const [winner, setWinner] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
      socket.emit("join_room", {
        roomCode: roomCode?.toUpperCase(),
        userName,
        userId: user?._id || userName,
      });
    }

    // listen to socket events
    socket.on("player_joined", ({ players }) => {
      setPlayers(players);
    });

    socket.on("new_question", ({ questionIndex, question, options, total, timer }) => {
      setCurrentQuestion({ question, options });
      setQuestionIndex(questionIndex);
      setTotalQuestions(total);
      setTimeLeft(timer);
      setSelectedOption(null);
      setShowResult(false);
      setCorrectAnswer(null);
      setExplanation("");
      setStatus("playing");
    });

    socket.on("score_update", ({ players }) => {
      setScores(players);
    });

    socket.on("question_result", ({ correctAnswer, explanation }) => {
      setCorrectAnswer(correctAnswer);
      setExplanation(explanation);
      setShowResult(true);
    });

    socket.on("game_over", ({ players, winner }) => {
      setScores(players);
      setWinner(winner);
      setStatus("finished");
    });

    socket.on("player_left", ({ message }) => {
      setError(message);
    });

    socket.on("error", ({ message }) => {
      setError(message);
    });

    return () => {
      socket.off("player_joined");
      socket.off("new_question");
      socket.off("score_update");
      socket.off("question_result");
      socket.off("game_over");
      socket.off("player_left");
      socket.off("error");
    };
  }, [roomCode, userName, user]);

  // timer countdown
  useEffect(() => {
    if (status !== "playing" || showResult) return;
    if (timeLeft <= 0) return;

    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, status, showResult]);

  const handleAnswer = (index) => {
    if (selectedOption !== null || showResult) return;
    setSelectedOption(index);

    socket.emit("submit_answer", {
      roomCode,
      questionIndex,
      selectedOption: index,
      userId: user?._id || userName,
    });
  };

  const handleStart = () => {
    socket.emit("start_game", { roomCode });
  };

  // WAITING ROOM
  if (status === "waiting") {
    return (
      <div className="quiz-section">
        <div className="live-room">
          <h1>⚡ Room: <span className="highlight">{roomCode}</span></h1>
          <p>Share this code with your friend!</p>

          <div className="players-list">
            <h2>Players ({players.length}/2)</h2>
            {players.map((p, i) => (
              <div key={i} className="player-item">
                👤 {p.name} {i === 0 ? "(Host)" : ""}
              </div>
            ))}
            {players.length < 2 && (
              <div className="player-item player-item--waiting">
                ⏳ Waiting for player 2...
              </div>
            )}
          </div>

          {error && <p className="quiz-error">{error}</p>}

          {isHost && players.length === 2 && (
            <button className="start-btn" onClick={handleStart}>
              🚀 Start Game
            </button>
          )}
          {!isHost && <p style={{ color: "#94a3b8" }}>Waiting for host to start...</p>}
        </div>
      </div>
    );
  }

  // GAME OVER
  if (status === "finished") {
    const sorted = [...scores].sort((a, b) => b.score - a.score);
    return (
      <div className="quiz-result">
        <h1>Game Over! 🎉</h1>
        <div className="result-card">
          <h2>🏆 Winner: <span className="highlight">{winner}</span></h2>
          <div className="live-scores">
            {sorted.map((p, i) => (
              <div key={i} className="live-score-item">
                <span>{i === 0 ? "🥇" : "🥈"} {p.name}</span>
                <span>{p.score} / {totalQuestions}</span>
              </div>
            ))}
          </div>
          <button className="start-btn" style={{ marginTop: "1.5rem" }}
            onClick={() => navigate("/quiz")}>
            Back to Quiz
          </button>
        </div>
      </div>
    );
  }

  // PLAYING
  return (
    <div className="quiz-play">
      {/* Header */}
      <div className="quiz-progress">
        <span>{questionIndex + 1} / {totalQuestions}</span>
        <div className="progress-bar">
          <div className="progress-fill"
            style={{ width: `${((questionIndex + 1) / totalQuestions) * 100}%` }} />
        </div>
        <span className={`timer ${timeLeft <= 5 ? "timer--danger" : ""}`}>
          ⏱ {timeLeft}s
        </span>
      </div>

      {/* Live Scores */}
      <div className="live-scoreboard">
        {scores.map((p, i) => (
          <div key={i} className="live-score-pill">
            👤 {p.name}: {p.score}
          </div>
        ))}
      </div>

      {/* Question */}
      {currentQuestion && (
        <div className="question-card">
          <h2>{currentQuestion.question}</h2>
          <ul className="options-list">
            {currentQuestion.options.map((opt, i) => (
              <li
                key={i}
                className={`option
                  ${selectedOption === i ? "option--selected" : ""}
                  ${showResult && i === correctAnswer ? "option--correct" : ""}
                  ${showResult && selectedOption === i && i !== correctAnswer ? "option--wrong" : ""}
                `}
                onClick={() => handleAnswer(i)}
              >
                {opt}
              </li>
            ))}
          </ul>

          {showResult && (
            <div className="explanation">
              <strong>Explanation:</strong> {explanation}
            </div>
          )}

          {!selectedOption && !showResult && (
            <p style={{ color: "#94a3b8", marginTop: "1rem" }}>
              ⏳ Waiting for your answer...
            </p>
          )}
        </div>
      )}

      {error && <p className="quiz-error">{error}</p>}
    </div>
  );
}