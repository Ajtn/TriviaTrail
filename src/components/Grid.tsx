import React, { useState, useEffect, useRef } from "react";
import Hex, { hexStatus } from "./Hex";
import DetailedHex from "./DetailedHex";

/*
    Grid needs to know:
        -Start point/endpoint 
*/

type question = {
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

interface headers {
    [key: string]: string;
}

type apiConfig = {
    baseUrl: string;
    method: string;
    headers: headers;
    urlParams: Array<string>;
}

export type position = {
    xPos: number;
    yPos: number;
}

/*
    todo:
        -Toolbar for modifying apiParameters
            -difficulty
            -grid size
            -category (check if free api works here)
*/

export default function Grid(props: {windowWidth: number ,rowLength: number, hexOffset: number, startingHex: position, endHexes:Array<position> ,api: apiConfig}) {
    const [questions, setQuestions] = useState<question[]>([]),
    [apiParameters, setApiParameters] = useState(props.api.urlParams),
    [hexGrid, setHexGrid] = useState<hexStatus[]>([]),
    [activeQ, setactiveQ] = useState<{visible: boolean, qData: hexStatus}>({visible: false, qData: {id: "", position: {xPos: -1, yPos: -1}, accessible: false, category: "", answered: "unanswered", questionText: "", correctAnswer: "", difficulty: ""}});

    const gridRef = useRef(null);

    useEffect(getTrivia, []);

    function getTrivia() {
        const url = apiParameters.length > 0 ? props.api.baseUrl + "?" + apiParameters.map(param => param + "&") : props.api.baseUrl;
        fetch(url, {
            method: props.api.method,
            headers: props.api.headers
        })
        .then(res => res.json())
        .then(data => {
            setQuestions(data);
        });
    }

    useEffect(initHexGrid, [questions]);

    function setGridScale() {
        let gridWidth = 550,
        hexSize = 80;
        if (props.windowWidth > 1900) {
            gridWidth = 1000;
            hexSize = 160;
        } else if (props.windowWidth > 1400) {
            gridWidth = 800;
            hexSize = 130;
            console.log("size");
        } else if (props.windowWidth > 900) {
            gridWidth = 700;
            hexSize = 110;
        }
        // gridRef.current.style.setProperty('width', `${gridWidth}px`);
        // gridRef.current.style.setProperty('--s', `${hexSize}px`);
        // console.log(gridRef);
    }

    setGridScale();

    function initHexGrid() {
        setHexGrid(createGrid());
    }

    console.log(props.windowWidth);

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

    function formatString(inputText: string) {
        return inputText.replaceAll("_", " ");
    }

    function createGrid():Array<hexStatus> {
        let xPos = 0,
        yPos = 0;
        return questions.map(q => {
            const tempHex: hexStatus = {...q, questionText: q.question.text, category: formatString(q.category), position: {xPos: xPos, yPos: yPos}, accessible: false, answered: "unanswered" as "unanswered"}
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
                if (clickedA === activeQ.qData.correctAnswer) {
                    if (props.endHexes.some(endPos => (endPos.xPos === activeQ.qData.position.xPos && endPos.yPos === activeQ.qData.position.yPos))) {
                        console.log("You win!");
                    }
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

    return (
    <div className={`hex-grid ${gridScale}`} ref={gridRef}>
        <div className={`grid-container ${gridScale}`}>
            {hexGrid.map(hex => <Hex key={hex.id} hexState={hex} handleClick={updateactiveQ}/>)}
            <DetailedHex activeQ={activeQ} handleClick={answerClicked} />
        </div>        
    </div>)
}