'use client';

import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';

import questions from '@/data/questions.json';
import { selectAnswerByQuestionId } from '@/redux/features/userAnswers/userAnswerSelector';
import { saveAnswer } from '@/redux/features/userAnswers/userAnswersSlice';

interface Question {
  text: string;
  options?: Record<string, string>;
  type: 'question' | 'screen';
  defaultAnswer?: string | Record<string, string>;
  dependentPlaceholders?: Record<string, string>;
}

export default function QuestionClient() {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();
  const questionId = params?.questionId as string;
  const question = questions[questionId as keyof typeof questions] as Question;
  const selectedAnswer = useSelector(selectAnswerByQuestionId(questionId));

  if (!question) return <p>Питання не знайдено</p>;

  const handleAnswer = (option: string) => {
    dispatch(saveAnswer({ questionId, answer: option }));

    let nextQuestionId: string | undefined;

    if (question.type === 'screen') {
      nextQuestionId = question.defaultAnswer
        ? typeof question.defaultAnswer === 'string'
          ? question.defaultAnswer
          : question.defaultAnswer[option]
        : undefined;
    } else {
      nextQuestionId = question.options?.[option] || (question.defaultAnswer as string);
    }

    console.log('Selected option:', option);
    console.log('Next question ID:', nextQuestionId);

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
        {question.type === 'screen' || Object.keys(question.options || {}).length === 0 ? (
          <button
            onClick={() => handleAnswer('')}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: 'gray',
              color: 'white',
              border: 'none',
            }}
          >
            Next
          </button>
        ) : (
          Object.keys(question.options || {}).map(option => (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: selectedAnswer === option ? 'purple' : 'gray',
                color: 'white',
                border: 'none',
              }}
            >
              {option}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
