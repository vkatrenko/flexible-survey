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

// Визначення типу для userAnswers
interface UserAnswers {
  [key: string]: string; // Ключі - ідентифікатори питань, значення - відповіді
}

// Функція для форматування тексту
const capitalizeFirstLetter = (text: string) => {
  if (!text) return text; // Якщо текст порожній, повертаємо його
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase(); // Перша буква велика, решта маленькі
};

// Функція для підстановки значень у текст
const resolvePlaceholders = (
  text: string,
  placeholders: Record<string, string>,
  answers: UserAnswers,
) => {
  return text.replace(/\{(\w+)\}/g, (_, key) => {
    const placeholderExpression = placeholders[key];
    if (!placeholderExpression) return `{${key}}`;

    // Перевіряємо, чи є умовний вираз
    if (placeholderExpression.includes(' ? ')) {
      const [questionKey, trueText] = placeholderExpression.split(' ? ');
      const questionId = questionKey.replace(/[{}]/g, '');
      const answer = answers[questionId];
      return answer === 'Yes' ? trueText : '';
    } else {
      // Просте підставлення
      const questionId = placeholderExpression.replace(/[{}]/g, '');
      return answers[questionId] || `{${key}}`;
    }
  });
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

    // Форматуємо текст, щоб перша буква була великою
    resolvedText = capitalizeFirstLetter(resolvedText);
  } catch {
    resolvedText = question.text; // Повертаємо текст без змін у разі помилки
  }

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
