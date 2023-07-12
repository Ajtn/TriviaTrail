import React, { useState, useEffect } from "react";
import Hex, { hexStatus } from "./Hex";
import DetailedHex from "./DetailedHex";

/*
    Grid needs to know:
        -Start point/endpoint 
*/

export type question = {
    category: string;
    id: string;
    tags: Array<string>;
    difficulty: string;
    regions: Array<string>;
    isNiche: boolean;
    question: {text: string};
    correctAnswer: string;
    incorrectAnswers?: Array<string>;
    type: string;
 }

export default function Grid(props: {windowWidth: number ,rowLength: number, startingHex: {xPos: number, yPos: number}, api: {url: string}}) {
    const [questions, setQuestions] = useState<question[]>([{category: "", id: "", tags: [], difficulty: "", regions: [], isNiche: false, question: {text: ""}, correctAnswer: "", type: ""}]),
    [hexGrid, setHexGrid] = useState<hexStatus[]>([]),
    [activeQ, setactiveQ] = useState<{visible: boolean, qData: hexStatus}>({visible: false, qData: {id: "", position: {xPos: -1, yPos: -1}, accessible: false, category: "", answered: "unanswered", questionText: "", answerText: "", difficulty: ""}});

    useEffect(getTrivia, []);

    function getTrivia() {
        fetch(props.api.url)
        .then(res => res.json())
        .then(data => {
            setQuestions(data);
        });
    }

    useEffect(initHexGrid, [questions]);

    function initHexGrid() {
        setHexGrid(createGrid());
    }

    function getNeighbors(hexPos: {xPos: number, yPos: number}) {
        const neighbors: Array<string> = [];
        hexGrid.forEach(hex => {
            if (hex.position.yPos === hexPos.yPos) {
                if (hex.position.xPos === hexPos.xPos + 1 || hex.position.xPos === hexPos.xPos - 1) {
                    neighbors.push(hex.id);
                }
            } else if (hexPos.yPos % 2 === 0) {
                if (hex.position.yPos === hexPos.yPos - 1 || hex.position.yPos === hexPos.yPos + 1) {
                    if (hex.position.xPos === hexPos.xPos -1 || hex.position.xPos === hexPos.xPos) {
                        neighbors.push(hex.id);
                    }
                }
            } else {
                if (hex.position.yPos === hexPos.yPos - 1 || hex.position.yPos === hexPos.yPos + 1) {
                    if (hex.position.xPos === hexPos.xPos || hex.position.xPos === hexPos.xPos + 1) {
                        neighbors.push(hex.id);
                    }
                }
            } 
        });
        return neighbors;
    }

    function createGrid():Array<hexStatus> {
        let xPos = 0,
        yPos = 0;
        return questions.map(q => {
            const tempHex:hexStatus = {
                id: q.id,
                position: {xPos: xPos, yPos: yPos},
                accessible: false,
                category: q.category,
                answered: "unanswered" as "unanswered",
                questionText: q.question.text,
                answerText: q.correctAnswer,
                incorrectAnswers: q.incorrectAnswers ? q.incorrectAnswers : undefined,
                difficulty: q.difficulty
            }
            //const tempHex = {...q, position: {xPos: xPos, yPos: yPos}, accessible: false, answered: "unanswered" as "unanswered", nextTo: []};
            if (xPos + 1 < props.rowLength) {
                xPos++;
            } else {
                xPos = 0;
                yPos++;
            }
            if (tempHex.position.xPos === props.startingHex.xPos && tempHex.position.yPos === props.startingHex.yPos) {
                tempHex.accessible = true;
            }

            return tempHex;
        });
    }

    function updateactiveQ (event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const clickedQ = hexGrid.find(q => q.id === event.currentTarget.classList[1]);
        if (clickedQ) {
            if (clickedQ.accessible)
                setactiveQ({visible:true, qData: clickedQ});
        }
    }

    //finds current question and modifies it's answered value in state
    function answerClicked(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const clickedA = event.currentTarget.outerText,
        clickedId = event.currentTarget.parentElement?.classList[1];

        setHexGrid(oldGrid => oldGrid.map(hex => {
            if (hex.id === clickedId) {
                if (clickedA === activeQ.qData.answerText) {
                    updateNeighbors(hex.position);
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

    function updateNeighbors(hexPos: {xPos: number, yPos: number}) {
        const neighbors = getNeighbors(hexPos);
        setHexGrid(oldGrid => {
            return oldGrid.map(hex => {
                if (neighbors.includes(hex.id) && hex.answered === "unanswered") {
                    return {...hex, accessible: true};
                } else {
                    return hex;
                }
            })
        });
    }

    let gridScale = "small";

    if (props.windowWidth > 900 && props.windowWidth < 1300) {
        gridScale = "medium";
    } else if (props.windowWidth > 1300) {
        gridScale = "large";
    }

    console.log(hexGrid);
    return (
    <div className={`hex-grid ${gridScale}`}>
        <div className={`grid-container ${gridScale}`}>
            {hexGrid.map(hex => <Hex key={hex.id} hexState={hex} handleClick={updateactiveQ}/>)}
            <DetailedHex activeQ={activeQ} handleClick={answerClicked} />
        </div>        
    </div>)
}