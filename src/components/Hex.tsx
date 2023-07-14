import React from "react";
import { position } from "./Grid";

export type hexStatus = {
    id: string;
    position: position;
    accessible: boolean;
    category: string;
    answered: "pass" | "fail" | "unanswered";
    questionText: string;
    correctAnswer: string;
    incorrectAnswers?: Array<string>;
    difficulty: string;
 };

export default function Hex(props: {hexState: hexStatus, handleClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void}) {

    return (
        <div className={`hex ${props.hexState.id} ${props.hexState.answered} ${props.hexState.accessible && "accessible"}`} onMouseDown={props.handleClick}>
            <h2 className="hex-category-text">{props.hexState.answered === "fail"? `Correct asnwer: ${props.hexState.correctAnswer}` : props.hexState.category}</h2>
        </div>
    )
}