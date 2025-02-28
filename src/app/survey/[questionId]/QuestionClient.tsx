"use client";

import { useSelector, useDispatch } from "react-redux";
import { saveAnswer } from "@/redux/features/userAnswers/userAnswersSlice";
import { selectAnswerByQuestionId } from "@/redux/features/userAnswers/userAnswerSelector";
import { useRouter, useParams } from "next/navigation";
import { RootState } from "@/redux/store";
import questions from "@/data/questions.json";

interface Question {
  text: string;
  options?: Record<string, string>;
  default?: string;
}

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

    const nextQuestionId = (question.options?.[option as keyof typeof question.options] as string | undefined) ?? ("default" in question ? question.default : undefined);
    if (!nextQuestionId) {
      router.push("/survey/results");
      return;
    }

    router.push(`/survey/${nextQuestionId}`);
  };

  return (
    <div>
      <h1>{question.text}</h1>
      <div style={{ display: "flex", gap: "10px" }}>
        {Object.keys(question.options || {}).map((option) => (
          <button
            key={option}
            onClick={() => handleAnswer(option)}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: "pointer",
              backgroundColor: selectedAnswer === option ? "blue" : "gray",
              color: "white",
              border: "none",
            }}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
