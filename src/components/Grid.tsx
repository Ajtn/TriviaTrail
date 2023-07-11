import React, {MutableRefObject, useState} from "react";
import Hex, {hexStatus} from "./Hex";
import { difficulty, question } from "./triviaTypes.types";
import DetailedHex from "./DetailedHex";

/*
    Grid needs to know:
        -Start point/endpoint 
        -what connections between hexes
        -hex state (answered, failed, inacessible, unanswered)
        -hex content (45)
*/
export default function Grid(props: {windowWidth: MutableRefObject<number>, questionData: Array<question>}) {
    const [hexGrid, setHexGrid] = useState(createGrid()),
    [activeQ, setactiveQ] = useState({visible: false, qData: {id: "", questionText:"", answerText: "", difficulty: "easy" as difficulty, category: ""} as question});

    function createGrid():Array<hexStatus> {
        return props.questionData.map(q => ({qId: q.id, accessible: false, category:q.category, answered: "unanswered" as "unanswered", nextTo: []}));
    }

    function updateactiveQ (event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        // setactiveQ(oldactiveQ => ({...oldactiveQ, visible: !oldactiveQ.visible}))
        // console.log(event.currentTarget.classList[1]);
        // const newActive = props.find(q => q.id === event.currentTarget.classList[1]);
        const clickedQ = props.questionData.find(q => q.id === event.currentTarget.classList[1]);
        if (clickedQ) {
            setactiveQ({visible:true, qData: clickedQ});
        }
    }

    //todo: add logic to change hex accessibility
    //finds current question and modifies it's answered value in state
    function answerClicked(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        console.log(event.currentTarget);
        const clickedA = event.currentTarget.outerText,
        clickedId = event.currentTarget.parentElement?.classList[1];
        console.log(activeQ.qData.answerText);
        setHexGrid(oldGrid => oldGrid.map(hex => {
            if (hex.qId === clickedId) {
                if (clickedA === activeQ.qData.answerText) {
                    console.log("huh");
                    return {...hex, answered: "pass"};
                } else {
                    console.log(clickedA);
                    console.log(activeQ.qData);
                    return {...hex, answered: "fail"};
                }
            } else {
                return hex;
            }
        }));
        setactiveQ(oldQ => ({...oldQ, visible: false}));
    }
    
    let gridScale = "small";

    if (props.windowWidth.current > 900 && props.windowWidth.current < 1300) {
        gridScale = "medium";
    } else if (props.windowWidth.current > 1300) {
        gridScale = "large";
    }

    return (
    <div className="hex-grid">
        <div className={`grid-container ${gridScale}`}>
            {hexGrid.map(hex => <Hex key={hex.qId} hexState={hex} handleClick={updateactiveQ}/>)}
            <DetailedHex activeQ={activeQ} handleClick={answerClicked} />
        </div>        
    </div>)
}