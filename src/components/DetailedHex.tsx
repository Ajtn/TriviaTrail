import { hexStatus } from "./Hex";

type DetailedHexProps = {
    activeQ: {visible: boolean, qData: hexStatus};
    handleClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

export default function DetailedHex(props: DetailedHexProps) {
    let answers: Array<string>= [];
    if (props.activeQ.qData.incorrectAnswers) {
        props.activeQ.qData.incorrectAnswers.forEach(fAnswer => answers.push(fAnswer));
        answers.push(props.activeQ.qData.correctAnswer);
        answers.sort(() => 0.5 - Math.random());
    } else {
        answers.splice(0, 0 ,"True", "False");
    }
    
    return (
        <>
            {props.activeQ.visible && <div className="hex big-hex">
                <h2 className="hex-question-text">{props.activeQ.qData.questionText}</h2>
                <div className={`answers ${props.activeQ.qData.id}`}>
                    {answers.map(answer => <div key={answer} onMouseDown={props.handleClick} className={`answer ${answer}`}>{answer}</div>)}
                </div>
        </div>}
        </>
    )
}