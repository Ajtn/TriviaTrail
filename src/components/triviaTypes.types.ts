export type difficulty = "easy" |"medium" | "hard";

export type question = {
   id: string;
   questionText: string;
   answerText: string;
   incorrectAnswers?: Array<string>;
   difficulty: difficulty;
   category: string;
}