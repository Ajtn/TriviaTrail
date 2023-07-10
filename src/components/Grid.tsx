import React, {useState} from "react";
import Hex from "./Hex";
import { question } from "./triviaTypes.types";
import DetailedHex from "./DetailedHex";

type hexStatus = {
    qId: string;
    accessible: boolean;
    category: "string";
    answered: "pass" | "fail" | "unanswered";
    nextTo: Array<string>;
};

/*
    Grid needs to know:
        -Start point/endpoint 
        -what connections between hexes
        -hex state (answered, failed, inacessible, unanswered)
        -hex content (45)
*/
export default function Grid(props: {questionData: Array<question>}) {
    const [hexGrid, setHexGrid] = useState(createGrid()),
    [activeQ, setactiveQ] = useState({visible: false, qData: {id: "", questionText:"", answerText: "", difficulty: "easy" as "easy", category: ""}});

    function createGrid():Array<hexStatus> {
        return props.questionData.map(q => ({qId: q.id, accessible: false, category:q.category, answered: "unanswered", nextTo: []}));
    }

    function updateactiveQ (event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        // setactiveQ(oldactiveQ => ({...oldactiveQ, visible: !oldactiveQ.visible}))
        // console.log(event.currentTarget.classList[1]);
        // const newActive = props.find(q => q.id === event.currentTarget.classList[1]);
        setactiveQ({qData: props.questionData.find(q => q.id === event.currentTarget.classList[1]), visible: true});
    }

    console.log(hexGrid);
    return (
    <div className="hex-grid">
        <div className="grid-container">
            {hexGrid.map(hex => <Hex key={hex.qId} qId={hex.qId} category={hex.category} handleClick={updateactiveQ}/>)}
            <DetailedHex visible={activeQ.visible} activeQuestion={activeQ.qData} />
        </div>        
    </div>)
}