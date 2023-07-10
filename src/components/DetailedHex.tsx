import { question } from "./triviaTypes.types";


export default function DetailedHex(props: {visible: boolean, activeQuestion: question}) {
    let answers: Array<string>= [];
    if (props.activeQuestion.incorrectAnswers) {
        props.activeQuestion.incorrectAnswers.forEach(fAnswer => answers.push(fAnswer));
        answers.push(props.activeQuestion.answerText);
        answers.sort(() => 0.5 - Math.random());
    } else {
        answers.splice(0, 0 ,"True", "False");
    }
    
    return (
        <>
            {props.visible && <div className="hex big-hex">
                <h2 className="hex-question-text">{props.activeQuestion.questionText}</h2>
                <div className="answers">
                    {answers.map(answer => <div key={answer} className="answer">{answer}</div>)}
                </div>
        </div>}
        </>
    )
}