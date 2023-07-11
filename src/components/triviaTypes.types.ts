
export type question = {
   id: string;
   questionText: string;
   answerText: string;
   incorrectAnswers?: Array<string>;
   difficulty: string;
   category: string;
}
