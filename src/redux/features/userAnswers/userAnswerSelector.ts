import { RootState } from '../../store';

export const selectUserAnswers = (state: RootState): Record<string, string> =>
  state.userAnswers.answers;

export const selectAnswerByQuestionId =
  (questionId: string) =>
  (state: RootState): string | null =>
    state.userAnswers.answers[questionId] || null;
