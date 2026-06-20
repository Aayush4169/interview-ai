import { useState } from "react";
import { useNavigate } from "react-router";
import { useQuiz } from "../hooks/useQuiz";
import "../style/quiz.scss";

const subjects = [
  { name: "JavaScript", icon: "⚡" },
  { name: "React", icon: "⚛️" },
  { name: "Node.js", icon: "🟢" },
  { name: "MongoDB", icon: "🍃" },
  { name: "DSA", icon: "🧠" },
  { name: "System Design", icon: "🏗️" },
];

const questionCounts = [5, 10, 15, 20];

export default function QuizSection() {
  const navigate = useNavigate();
  const { createQuiz, loading } = useQuiz();
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [numberOfQuestions, setNumberOfQuestions] = useState(10);

  const handleStartQuiz = async () => {
    if (!selectedSubject) return alert("Please select a subject!");
    const quiz = await createQuiz({ subject: selectedSubject, numberOfQuestions });
    navigate(`/quiz/${quiz._id}`);
  };

  if (loading) {
    return (
      <main className="loading-screen">
        <h1>Generating your quiz...</h1>
      </main>
    );
  }

  return (
    <div className="quiz-section">
      <header className="quiz-header">
        <h1>🧠 Quiz <span className="highlight">Section</span></h1>
        <p>Select a subject and number of questions to start your quiz.</p>
      </header>

      {/* Subject Selection */}
      <div className="quiz-block">
        <h2>Select Subject</h2>
        <div className="subject-grid">
          {subjects.map((s) => (
            <div
              key={s.name}
              className={`subject-card ${selectedSubject === s.name ? "subject-card--active" : ""}`}
              onClick={() => setSelectedSubject(s.name)}
            >
              <div className="icon">{s.icon}</div>
              <div className="name">{s.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Number of Questions */}
      <div className="quiz-block">
        <h2>Number of Questions</h2>
        <div className="count-grid">
          {questionCounts.map((count) => (
            <div
              key={count}
              className={`count-card ${numberOfQuestions === count ? "count-card--active" : ""}`}
              onClick={() => setNumberOfQuestions(count)}
            >
              {count} Questions
            </div>
          ))}
        </div>
      </div>

      {/* Start Button */}
      <button
        className="start-btn"
        onClick={handleStartQuiz}
        disabled={!selectedSubject}
      >
        🚀 Start Quiz
      </button>

      {/* Previous Quizzes */}
      <PreviousQuizzes />
    </div>
  );
}

function PreviousQuizzes() {
  const navigate = useNavigate();
  const { quizzes, fetchAllQuizzes } = useQuiz();
  const [loaded, setLoaded] = useState(false);

  const handleLoad = async () => {
    await fetchAllQuizzes();
    setLoaded(true);
  };

  return (
    <div className="quiz-block">
      <div className="prev-header">
        <h2>My Previous Quizzes</h2>
        {!loaded && (
          <button className="load-btn" onClick={handleLoad}>Load History</button>
        )}
      </div>
      {loaded && quizzes.length === 0 && <p>No previous quizzes found.</p>}
      {quizzes.length > 0 && (
        <ul className="quiz-list">
          {quizzes.map((q) => (
            <li key={q._id} className="quiz-item" onClick={() => navigate(`/quiz/${q._id}`)}>
              <h3>{q.subject}</h3>
              <p>{q.numberOfQuestions} Questions • {new Date(q.createdAt).toLocaleDateString()}</p>
              {q.isCompleted
                ? <p className="score score--done">Score: {q.score}/{q.numberOfQuestions}</p>
                : <p className="score score--pending">Not completed</p>
              }
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}