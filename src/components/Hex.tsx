import React from "react";

export default function Hex(props: {qId: string, category: string, handleClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void}) {

    return (
        <div className={`hex ${props.qId}`} onMouseDown={props.handleClick}>
            <h2 className="hex-category-text">{props.category}</h2>
        </div>
    )
}