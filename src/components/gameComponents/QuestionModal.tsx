import { activeQ } from "./CanvasGrid";

type modalProps = {
    activeQ: activeQ;
    handleClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    winState: string;
    handleReset: () => void;
    handleClose: () => void;
};

export default function QuestionModal(props: modalProps) {
    const {qData: qData, visible: visible} = props.activeQ;
    let answers: Array<string>= [];

    if (qData.incorrectAnswers) {
        qData.incorrectAnswers.forEach(fAnswer => answers.push(fAnswer));
        answers.push(qData.correctAnswer);
        answers.sort(() => 0.5 - Math.random());
    } else {
        answers.splice(0, 0 ,"True", "False");
    }
    

    if (props.winState !== "ongoing") {
        return (<div className="hex big-hex">
            <h2 className="game-over-h2">{props.winState === "won" ? "You win!" : "Woops, nowhere to go..."}</h2>
            <div className="restart-menu">
                <p>New game?</p>
                <div onClick={props.handleReset} className="response restart yes">Yes</div>
                <div onClick={props.handleClose} className="response restart no">No</div>
            </div>
        </div>)
    } else if (visible) {
        let innerJsx = (<></>);
        if (qData.answered === "unanswered") {
            innerJsx = (<div className={`answers ${qData.id}`}>
                {answers.map(answer => <div key={answer} onMouseDown={props.handleClick} className={`response answer ${answer}`}>{answer}</div>)}
            </div>)
        } else {
            const solution = qData.answered === "pass" ? "Correct answer!" : <>The correct answer was: <p className="answer-splash">{qData.correctAnswer}</p></>
            innerJsx = <div className={`answer-splash ${qData.answered}`}>{solution}</div>;
        }
        return (<div className="hex big-hex">
            <h2 className="hex-question-text">{qData.questionText}</h2>
            {innerJsx}
        </div>)
    } else {
        return <></>
    }
}