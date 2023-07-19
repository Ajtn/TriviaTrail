import { hexStatus } from "../components/Hex";

export const testHexes: Array<hexStatus> = [
    {
        id: "asdjahsd",
        position: {xPos: 0, yPos: 0},
        accessible: true,
        category: "Test question",
        answered: "unanswered",
        questionText: "Test question text?",
        correctAnswer: "test answer",
        incorrectAnswers: ["Not test answer", "wrong"],
        difficulty: "easy"
    },
    {
        id: "asdasd",
        position: {xPos: 1, yPos: 0},
        accessible: true,
        category: "Test question",
        answered: "unanswered",
        questionText: "Test question text?",
        correctAnswer: "test answer",
        incorrectAnswers: ["Not test answer", "wrong"],
        difficulty: "easy"
    },
    {
        id: "asd",
        position: {xPos: 0, yPos: 1},
        accessible: true,
        category: "Test question",
        answered: "unanswered",
        questionText: "Test question text?",
        correctAnswer: "test answer",
        incorrectAnswers: ["Not test answer", "wrong"],
        difficulty: "easy"
    },
    {
        id: "gfdg",
        position: {xPos: 1, yPos: 1},
        accessible: true,
        category: "Test question",
        answered: "unanswered",
        questionText: "Test question text?",
        correctAnswer: "test answer",
        incorrectAnswers: ["Not test answer", "wrong"],
        difficulty: "easy"
    }
];