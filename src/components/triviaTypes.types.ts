export type question = {
   id: string;
   questionText: string;
   answerText: string;
   incorrectAnswers?: Array<string>;
   difficulty: "easy" |"medium" | "hard";
   category: string;
}