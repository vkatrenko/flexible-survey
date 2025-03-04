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
  defaultAnswer?: string;
  dependentPlaceholders?: Record<string, string>;
}

// Визначення типу для userAnswers
interface UserAnswers {
  [key: string]: string;
}

// Форматує першу літеру рядка у верхній регістр
const capitalizeFirstLetter = (text: string) => {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Підставляє значення в текст з плейсхолдерів
const resolvePlaceholders = (
  text: string,
  placeholders: Record<string, string>,
  answers: UserAnswers,
) => {
  return text.replace(/\{(\w+)\}/g, (_, key) => {
    const placeholderExpression = placeholders[key];
    if (!placeholderExpression) return `{${key}}`;

    if (placeholderExpression.includes(' ? ')) {
      const [questionKey, trueText] = placeholderExpression.split(' ? ');
      const questionId = questionKey.replace(/[{}]/g, '');
      const answer = answers[questionId];
      return answer === 'Yes' ? trueText : '';
    } else {
      const questionId = placeholderExpression.replace(/[{}]/g, '');
      return answers[questionId] || `{${key}}`;
    }
  });
};

// Обробляє умовний вираз у defaultAnswer
const resolveDefaultAnswer = (
  defaultAnswer: string,
  userAnswers: UserAnswers,
): string | undefined => {
  const match = defaultAnswer.match(/^\{(\w+)\} \? (\w+) : (\w+)$/);
  if (match) {
    const [, questionId, trueValue, falseValue] = match;
    return userAnswers[questionId] === 'Yes' ? trueValue : falseValue;
  }
  return defaultAnswer;
};

export default function QuestionClient() {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();
  const questionId = params?.questionId as string;
  const question = questions[questionId as keyof typeof questions] as Question;
  const userAnswers = useSelector(
    (state: { userAnswers: { answers: UserAnswers } }) => state.userAnswers.answers,
  );
  const selectedAnswer = useSelector(selectAnswerByQuestionId(questionId));

  if (!question) return <p>Питання не знайдено</p>;

  let resolvedText: string;
  try {
    resolvedText = question.dependentPlaceholders
      ? resolvePlaceholders(question.text, question.dependentPlaceholders, userAnswers)
      : question.text;

    resolvedText = capitalizeFirstLetter(resolvedText);
  } catch {
    resolvedText = question.text;
  }

  const handleAnswer = (option: string) => {
    dispatch(saveAnswer({ questionId, answer: option }));

    let nextQuestionId: string | undefined;

    if (question.type === 'screen' && question.defaultAnswer) {
      nextQuestionId = resolveDefaultAnswer(question.defaultAnswer, userAnswers);
    } else {
      nextQuestionId = question.options?.[option] || (question.defaultAnswer as string);
    }

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

      <h1>{resolvedText}</h1>
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
