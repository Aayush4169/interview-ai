import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export const generateQuiz = async ({ subject, numberOfQuestions }) => {
  const response = await api.post("/api/quiz/generate", {
    subject,
    numberOfQuestions,
  });
  return response.data;
};

export const getQuizById = async (quizId) => {
  const response = await api.get(`/api/quiz/${quizId}`);
  return response.data;
};

export const getAllQuizzes = async () => {
  const response = await api.get("/api/quiz/all");
  return response.data;
};

export const submitQuiz = async ({ quizId, score }) => {
  const response = await api.patch(`/api/quiz/${quizId}/submit`, { score });
  return response.data;
};
