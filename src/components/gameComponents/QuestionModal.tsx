import { hexStatus } from "./CanvasGrid";


type modalProps = {
    activeQ: hexStatus;
    handleClick: (isCorrect: boolean) => void;
    winState: string;
    handleReset: () => void;
    handleClose: () => void;
};

export default function QuestionModal(props: modalProps) {
    const {activeQ: hex} = props;
    let answers: Array<string>= [];

    if (hex.incorrectAnswers) {
        hex.incorrectAnswers.forEach(fAnswer => answers.push(fAnswer));
        answers.push(hex.correctAnswer);
        answers.sort(() => 0.5 - Math.random());
    } else {
        answers.splice(0, 0 ,"True", "False");
    }
    
    function responseClicked(response: string) {
        if (response === hex.correctAnswer) {
            props.handleClick(true);
        } else {
            props.handleClick(false);
        }
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
    } else {
        let innerJsx = (<></>);
        if (hex.answered === "unanswered") {
            innerJsx = (<div className={`answers ${hex.id}`}>
                {answers.map(answer => <div key={answer} onMouseDown={() => {responseClicked(answer)}} className={`response answer ${answer}`}>{answer}</div>)}
            </div>)
        } else {
            const solution = hex.answered === "pass" ? "Correct answer!" : <>The correct answer was: <p className="answer-splash">{hex.correctAnswer}</p></>
            innerJsx = <div className={`answer-splash ${hex.answered}`}>{solution}</div>;
        }
        return (<div className="hex big-hex">
            <h2 className="hex-question-text">{hex.questionText}</h2>
            {innerJsx}
        </div>)
    }
}