'use client';

import Link from 'next/link';
import { useSelector } from 'react-redux';

import questions from '@/data/questions.json';
import { RootState } from '@/redux/store';

export default function ResultsClient() {
  const userAnswers = useSelector((state: RootState) => state.userAnswers.answers);

  if (!userAnswers || Object.keys(userAnswers).length === 0) {
    return <p>No answers found. You may not have completed the survey yet.</p>;
  }

  return (
    <div style={{ backgroundColor: '#FFF0F0', minHeight: '100vh' }}>
      <h1 style={{ color: 'black', paddingLeft: '16.67%', fontSize: '2.5rem' }}>Survey Results</h1>
      <ul>
        {Object.entries(userAnswers).map(([questionId, answer]) => {
          const questionText = questions[questionId as keyof typeof questions]?.text;

          return (
            <li key={questionId} style={{ color: 'black', paddingLeft: '16.67%' }}>
              <strong
                style={{ color: 'black' }}
              >{`Q: ${questionText || `Question ${questionId} not found:`}`}</strong>
              <div style={{ color: 'purple' }}>{`A: ${answer}`}</div>
            </li>
          );
        })}
      </ul>
      <p style={{ paddingLeft: '16.67%' }}>
        <Link href="/survey/q1" style={{ color: 'blue', textDecoration: 'underline' }}>
          Start a new survey
        </Link>
      </p>
    </div>
  );
}
