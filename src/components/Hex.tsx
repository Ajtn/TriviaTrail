import React from "react";

export type hexStatus = {
    qId: string;
    accessible: boolean;
    category: string;
    answered: "pass" | "fail" | "unanswered";
    nextTo: Array<string>;
 };

export default function Hex(props: {hexState: hexStatus, handleClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void}) {

    return (
        <div className={`hex ${props.hexState.qId} ${props.hexState.answered} ${props.hexState.accessible && "accessible"}`} onMouseDown={props.handleClick}>
            <h2 className="hex-category-text">{props.hexState.category}</h2>
        </div>
    )
}