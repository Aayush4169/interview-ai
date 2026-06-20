import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuiz } from "../hooks/useQuiz";
import "../style/quiz.scss";

export default function QuizPlay() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { fetchQuizById, submitQuizScore, loading } = useQuiz();

  const [quiz, setQuiz] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    fetchQuizById(quizId).then(setQuiz);
  }, [quizId]);

  if (loading || !quiz) return <main className="loading-screen"><h1>Loading quiz...</h1></main>;

  if (quiz.isCompleted) {
    navigate(`/quiz/${quizId}/result`);
    return null;
  }

  const currentQuestion = quiz.questions[currentIndex];
  const isLast = currentIndex === quiz.questions.length - 1;

  const handleSelect = (index) => {
    if (showAnswer) return;
    setSelectedOption(index);
    setShowAnswer(true);
    const isCorrect = index === currentQuestion.correctAnswer;
    if (isCorrect) setScore((s) => s + 1);
    setAnswers((prev) => [...prev, { selected: index, correct: currentQuestion.correctAnswer, isCorrect }]);
  };

  const handleNext = async () => {
    if (isLast) {
      const finalScore = answers.filter(a => a.isCorrect).length + (selectedOption === currentQuestion.correctAnswer ? 1 : 0);
      await submitQuizScore({ quizId, score: finalScore });
      navigate(`/quiz/${quizId}/result`);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setShowAnswer(false);
    }
  };

  return (
    <div className="quiz-play">
      <div className="quiz-progress">
        <span>{currentIndex + 1} / {quiz.questions.length}</span>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${((currentIndex + 1) / quiz.questions.length) * 100}%` }} />
        </div>
        <span>Score: {score}</span>
      </div>

      <div className="question-card">
        <h2>{currentQuestion.question}</h2>
        <ul className="options-list">
          {currentQuestion.options.map((opt, i) => (
            <li
              key={i}
              className={`option
                ${selectedOption === i ? "option--selected" : ""}
                ${showAnswer && i === currentQuestion.correctAnswer ? "option--correct" : ""}
                ${showAnswer && selectedOption === i && i !== currentQuestion.correctAnswer ? "option--wrong" : ""}
              `}
              onClick={() => handleSelect(i)}
            >
              {opt}
            </li>
          ))}
        </ul>

        {showAnswer && (
          <div className="explanation">
            <strong>Explanation:</strong> {currentQuestion.explanation}
          </div>
        )}

        {showAnswer && (
          <button className="next-btn" onClick={handleNext}>
            {isLast ? "Finish Quiz" : "Next Question →"}
          </button>
        )}
      </div>
    </div>
  );
}