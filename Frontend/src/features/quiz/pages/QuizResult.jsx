import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuiz } from "../hooks/useQuiz";
import "../style/quiz.scss";

export default function QuizResult() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { fetchQuizById } = useQuiz();
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    fetchQuizById(quizId).then(setQuiz);
  }, [quizId]);

  if (!quiz) return <main className="loading-screen"><h1>Loading result...</h1></main>;

  const percentage = Math.round((quiz.score / quiz.numberOfQuestions) * 100);

  return (
    <div className="quiz-result">
      <h1>Quiz Completed! 🎉</h1>
      <div className="result-card">
        <h2>{quiz.subject}</h2>
        <div className="score-circle">
          <span>{quiz.score}/{quiz.numberOfQuestions}</span>
          <p>{percentage}%</p>
        </div>
        <p className={`result-msg ${percentage >= 70 ? "result-msg--pass" : "result-msg--fail"}`}>
          {percentage >= 70 ? "Great job! 🚀" : "Keep practicing! 💪"}
        </p>
        <div className="result-actions">
          <button onClick={() => navigate("/quiz")} className="start-btn">
            Try Another Quiz
          </button>
        </div>
      </div>
    </div>
  );
}