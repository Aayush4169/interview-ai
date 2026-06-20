import { createContext, useState, useContext } from "react";
import { generateQuiz, getQuizById, getAllQuizzes, submitQuiz } from "./services/quiz.api";

export const QuizContext = createContext(null);

export function QuizProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [quizzes, setQuizzes] = useState([]);

  const createQuiz = async ({ subject, numberOfQuestions }) => {
    setLoading(true);
    const data = await generateQuiz({ subject, numberOfQuestions });
    setLoading(false);
    return data.quiz;
  };

  const fetchQuizById = async (quizId) => {
    setLoading(true);
    const data = await getQuizById(quizId);
    setLoading(false);
    return data.quiz;
  };

  const fetchAllQuizzes = async () => {
    setLoading(true);
    const data = await getAllQuizzes();
    setQuizzes(data.quizzes);
    setLoading(false);
  };

  const submitQuizScore = async ({ quizId, score }) => {
    const data = await submitQuiz({ quizId, score });
    return data.quiz;
  };

  return (
    <QuizContext.Provider value={{ loading, quizzes, createQuiz, fetchQuizById, fetchAllQuizzes, submitQuizScore }}>
      {children}
    </QuizContext.Provider>
  );
}