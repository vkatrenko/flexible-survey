"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import questions from "@/data/questions.json";

export default function ResultsClient() {
  const userAnswers = useSelector((state: RootState) => state.userAnswers.answers);

  if (!userAnswers || Object.keys(userAnswers).length === 0) {
    return <p>Відповіді не знайдено. Можливо, ви ще не проходили опитування.</p>;
  }

  console.log("ResultsClient: userAnswers is === ", userAnswers);

  return (
    <div>
      <h1>Результати опитування</h1>
      <ul>
        {Object.entries(userAnswers).map(([questionId, answer]) => {
          // Перевіряємо, чи є таке питання в questions.json
          const questionText = questions[questionId as keyof typeof questions]?.text;

          return (
            <li key={questionId}>
              <strong>{questionText || `Запитання ${questionId} не знайдено`}:</strong> {answer}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
