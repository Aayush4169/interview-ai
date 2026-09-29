import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../auth/hooks/useAuth";
import socket from "../services/liveQuiz.socket";
import "../style/quiz.scss";

export default function LiveQuizLobby() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState(null); // "create" or "join"
  const [subject, setSubject] = useState("JavaScript");
  const [numberOfQuestions, setNumberOfQuestions] = useState(10);
  const [roomCode, setRoomCode] = useState("");
  const [userName, setUserName] = useState(user?.username || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.username && !userName) {
      setUserName(user.username);
    }
  }, [user]);

  const subjects = ["JavaScript", "React", "Node.js", "MongoDB", "DSA", "System Design"];
  const questionCounts = [5, 10, 15];

  const handleCreate = () => {
    const finalUserName = userName.trim() || user?.username || "Player";
    setLoading(true);
    setError("");

    if (!socket.connected) {
      socket.connect();
    }

    socket.off("room_created");
    socket.off("error");

    socket.on("room_created", ({ roomCode, quiz }) => {
      setLoading(false);
      navigate(`/quiz/live/${roomCode}`, {
        state: {
          userName: finalUserName,
          isHost: true,
          initialPlayers: quiz?.players || [{ name: finalUserName }],
        },
      });
    });

    socket.on("error", ({ message }) => {
      setLoading(false);
      setError(message);
    });

    socket.emit("create_room", {
      subject,
      numberOfQuestions,
      userName: finalUserName,
      userId: user?._id || finalUserName,
    });
  };

  const handleJoin = () => {
    const finalUserName = userName.trim() || user?.username || "Player";
    if (!roomCode.trim()) return setError("Enter room code");
    setLoading(true);
    setError("");

    if (!socket.connected) {
      socket.connect();
    }

    socket.off("player_joined");
    socket.off("error");

    const targetRoom = roomCode.trim().toUpperCase();

    socket.on("player_joined", ({ players }) => {
      setLoading(false);
      navigate(`/quiz/live/${targetRoom}`, {
        state: {
          userName: finalUserName,
          isHost: false,
          initialPlayers: players,
        },
      });
    });

    socket.on("error", ({ message }) => {
      setLoading(false);
      setError(message);
    });

    socket.emit("join_room", {
      roomCode: targetRoom,
      userName: finalUserName,
      userId: user?._id || finalUserName,
    });
  };

  return (
    <div className="quiz-section">
      <header className="quiz-header">
        <h1>⚡ Live <span className="highlight">Quiz</span></h1>
        <p>Challenge a friend in real-time!</p>
      </header>

      {!mode && (
        <div className="live-mode-select">
          <div className="subject-grid">
            <div className="subject-card" onClick={() => setMode("create")}>
              <div className="icon">🏠</div>
              <div className="name">Create Room</div>
            </div>
            <div className="subject-card" onClick={() => setMode("join")}>
              <div className="icon">🚪</div>
              <div className="name">Join Room</div>
            </div>
          </div>
        </div>
      )}

      {mode && (
        <div className="quiz-block">
          <input
            className="quiz-input"
            placeholder="Enter your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />

          {mode === "create" && (
            <>
              <h2>Select Subject</h2>
              <div className="subject-grid">
                {subjects.map((s) => (
                  <div
                    key={s}
                    className={`subject-card ${subject === s ? "subject-card--active" : ""}`}
                    onClick={() => setSubject(s)}
                  >
                    <div className="name">{s}</div>
                  </div>
                ))}
              </div>

              <h2 style={{ marginTop: "1rem" }}>Number of Questions</h2>
              <div className="count-grid">
                {questionCounts.map((c) => (
                  <div
                    key={c}
                    className={`count-card ${numberOfQuestions === c ? "count-card--active" : ""}`}
                    onClick={() => setNumberOfQuestions(c)}
                  >
                    {c} Questions
                  </div>
                ))}
              </div>
            </>
          )}

          {mode === "join" && (
            <input
              className="quiz-input"
              placeholder="Enter Room Code (e.g. ABC123)"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              style={{ marginTop: "1rem" }}
            />
          )}

          {error && <p className="quiz-error">{error}</p>}

          <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
            <button className="start-btn" onClick={mode === "create" ? handleCreate : handleJoin} disabled={loading}>
              {loading ? "Please wait..." : mode === "create" ? "🚀 Create Room" : "🚪 Join Room"}
            </button>
            <button className="load-btn" onClick={() => setMode(null)}>← Back</button>
          </div>
        </div>
      )}
    </div>
  );
}