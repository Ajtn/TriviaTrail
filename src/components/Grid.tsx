import React, { useState } from "react";
import Hex, { hexStatus } from "./Hex";
import { question } from "./triviaTypes.types";
import DetailedHex from "./DetailedHex";

/*
    Grid needs to know:
        -Start point/endpoint 
        -what connections between hexes
        -hex state (answered, failed, inacessible, unanswered)
        -hex content (45)
*/
export default function Grid(props: {windowWidth: number, questionData: Array<question>}) {
    const [hexGrid, setHexGrid] = useState(createGrid()),
    [activeQ, setactiveQ] = useState({visible: false, qData: {id: "", questionText:"", answerText: "", difficulty: "easy", category: ""} as question});

    function createGrid():Array<hexStatus> {
        return props.questionData.map(q => ({...q, accessible: true, answered: "unanswered" as "unanswered", nextTo: []}));
    }

    function updateactiveQ (event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const clickedQ = hexGrid.find(q => q.id === event.currentTarget.classList[1]);
        if (clickedQ) {
            if (clickedQ.accessible)
                setactiveQ({visible:true, qData: clickedQ});
        }
    }

    //todo: add logic to change hex accessibility
    //finds current question and modifies it's answered value in state
    function answerClicked(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const clickedA = event.currentTarget.outerText,
        clickedId = event.currentTarget.parentElement?.classList[1];
        setHexGrid(oldGrid => oldGrid.map(hex => {
            if (hex.id === clickedId) {
                if (clickedA === activeQ.qData.answerText) {
                    return {...hex, answered: "pass", accessible: false};
                } else {
                    return {...hex, answered: "fail", accessible: false};
                }
            } else {
                return hex;
            }
        }));
        setactiveQ(oldQ => ({...oldQ, visible: false}));
    }

    let gridScale = "small";

    console.log(props.windowWidth);
    if (props.windowWidth > 900 && props.windowWidth < 1300) {
        gridScale = "medium";
    } else if (props.windowWidth > 1300) {
        gridScale = "large";
    }

    return (
    <div className={`hex-grid ${gridScale}`}>
        <div className={`grid-container ${gridScale}`}>
            {hexGrid.map(hex => <Hex key={hex.id} hexState={hex} handleClick={updateactiveQ}/>)}
            <DetailedHex activeQ={activeQ} handleClick={answerClicked} />
        </div>        
    </div>)
}