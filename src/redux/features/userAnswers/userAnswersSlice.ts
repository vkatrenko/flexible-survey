import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserAnswersState {
  answers: Record<string, string>; // { questionId: answerValue }
}

const initialState: UserAnswersState = {
  answers: {},
};

const userAnswersSlice = createSlice({
  name: 'userAnswers',
  initialState,
  reducers: {
    saveAnswer: (state, action: PayloadAction<{ questionId: string; answer: string }>) => {
      const { questionId, answer } = action.payload;
      state.answers[questionId] = answer;
    },
    resetAnswers: state => {
      state.answers = {};
    },
  },
});

export const { saveAnswer, resetAnswers } = userAnswersSlice.actions;
export default userAnswersSlice.reducer;
