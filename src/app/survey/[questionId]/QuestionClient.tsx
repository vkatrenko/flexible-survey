'use client';

import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';

import questions from '@/data/questions.json';
import { selectAnswerByQuestionId } from '@/redux/features/userAnswers/userAnswerSelector';
import { saveAnswer } from '@/redux/features/userAnswers/userAnswersSlice';

export default function QuestionClient() {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();
  const questionId = params?.questionId as string;
  const question = questions[questionId as keyof typeof questions];
  const selectedAnswer = useSelector(selectAnswerByQuestionId(questionId));

  if (!question) return <p>Питання не знайдено</p>;

  const handleAnswer = (option: string) => {
    dispatch(saveAnswer({ questionId, answer: option }));

    const nextQuestionId =
      (question.options?.[option as keyof typeof question.options] as string | undefined) ??
      ('default' in question ? question.default : undefined);
    if (!nextQuestionId) {
      router.push('/survey/results');
      return;
    }

    router.push(`/survey/${nextQuestionId}`);
  };

  return (
    <div>
      <button
        onClick={() => router.back()}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          borderRadius: '8px',
          cursor: 'pointer',
          backgroundColor: 'lightgray',
          color: 'black',
          border: 'none',
        }}
      >
        {'<'}
      </button>

      <h1>{question.text}</h1>
      <div style={{ display: 'flex', gap: '10px' }}>
        {Object.keys(question.options || {}).map(option => (
          <button
            key={option}
            onClick={() => handleAnswer(option)}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: selectedAnswer === option ? 'blue' : 'gray',
              color: 'white',
              border: 'none',
            }}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
