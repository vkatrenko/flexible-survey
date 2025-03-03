'use client';

import { useSelector } from 'react-redux';

import questions from '@/data/questions.json';
import { RootState } from '@/redux/store';

export default function ResultsClient() {
  const userAnswers = useSelector((state: RootState) => state.userAnswers.answers);

  console.log('ResultsClient: Component rendered');
  console.log('ResultsClient: Redux state:', userAnswers);

  if (!userAnswers || Object.keys(userAnswers).length === 0) {
    console.log('ResultsClient: No answers found');
    return <p>Відповіді не знайдено. Можливо, ви ще не проходили опитування.</p>;
  }

  console.log('ResultsClient: userAnswers is === ', userAnswers);

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
