import React from "react";

export type hexStatus = {
    id: string;
    accessible: boolean;
    category: string;
    answered: "pass" | "fail" | "unanswered";
    nextTo: Array<string>;
    questionText: string;
    answerText: string;
    incorrectAnswers?: Array<string>;
    difficulty: string;
 };

export default function Hex(props: {hexState: hexStatus, handleClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void}) {

    return (
        <div className={`hex ${props.hexState.id} ${props.hexState.answered} ${props.hexState.accessible && "accessible"}`} onMouseDown={props.handleClick}>
            <h2 className="hex-category-text">{props.hexState.category}</h2>
        </div>
    )
}