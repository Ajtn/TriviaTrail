import React, { useState, useEffect } from "react";
import Hex, { hexStatus } from "./Hex";
import DetailedHex from "./DetailedHex";

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

export type activeQ = {
    visible: boolean;
    qData: hexStatus;
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

type winState = "won" | "lose" | "ongoing"

/*
    todo:
        -Toolbar for modifying apiParameters
            -difficulty
            -grid size
            -category (check if free api works here)
*/

export default function Grid(props: {windowWidth: number ,rowLength: number, hexOffset: number, startingHex: position, endHexes:Array<position> ,api: apiConfig}) {
    //Questiondata direct from API
    const [questions, setQuestions] = useState<question[]>([]),
    //User defined parameters to modify API call to specific question types (not implemented)
    //[apiParameters, setApiParameters] = useState(props.api.urlParams),
    //winState to check if the game is still going
    [winState, setWinstate] = useState<winState>("ongoing"),
    //Array to track state of all hexes and their question data
    [hexGrid, setHexGrid] = useState<hexStatus[]>([]),
    //Currently selected question and whether it's visible in pop up big hex
    [activeQ, setactiveQ] = useState<activeQ>({visible: false, qData: {id: "", position: {xPos: -1, yPos: -1}, accessible: false, category: "", answered: "unanswered", questionText: "", correctAnswer: "", difficulty: ""}});

    useEffect(getTrivia, []);
    useEffect(initHexGrid, [questions]);
    useEffect(checkFailState, [hexGrid]);

    function getTrivia() {
        //const url = apiParameters.length > 0 ? props.api.baseUrl + "?" + apiParameters.map(param => param + "&") : props.api.baseUrl;
        const url = props.api.urlParams.length > 0 ? props.api.baseUrl + "?" + props.api.urlParams.map(param => param + "&") : props.api.baseUrl;
        fetch(url, {
            method: props.api.method,
            headers: props.api.headers
        })
        .then(res => res.json())
        .then(data => {
            setQuestions(data);
        });
    }

    function checkFailState() {
        if (hexGrid.length > 1 && ! hexGrid.some((hex => hex.accessible))) {
            setWinstate("lose");
        }
    }

    function initHexGrid() {
        setHexGrid(createGrid());
        setactiveQ({visible: false, qData: {id: "", position: {xPos: -1, yPos: -1}, accessible: false, category: "", answered: "unanswered", questionText: "", correctAnswer: "", difficulty: ""}});
    }

    function resetApp() {
        getTrivia();
        setWinstate("ongoing");
    }

    function keepPlaying() {
        setactiveQ(oldActive => ({...oldActive, visible: false}));
        setWinstate("ongoing");
    }

    //calculates hexes adjacent to active hex to modify accessibility
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

    //populates hexgrid with hexState data, associating each hex with a question
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
                        setWinstate("won");
                    } else {
                        setactiveQ(oldActive => ({...oldActive, qData: {...oldActive.qData, answered: "pass"}}));
                    }
                    updateNeighbors(hex.position);
                    return {...hex, answered: "pass", accessible: false};
                } else {
                    setactiveQ(oldActive => ({...oldActive, qData: {...oldActive.qData, answered: "fail"}}))
                    return {...hex, answered: "fail", accessible: false};
                }
            } else {
                return hex;
            }
        }));
        setTimeout(() => {setactiveQ(oldQ => ({...oldQ, visible: false}))}, 1000);
    }

    //modifies acessibility of hexes adjacent to position of parameter
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

    let gridScale = "large";

    //Determines classname to be appended to modify which CSS will be applied
    // if (props.windowWidth > 900 && props.windowWidth < 1300) {
    //     gridScale = "medium";
    // } else if (props.windowWidth > 1300) {
    //     gridScale = "large";
    // }

    return (
    <div className={`hex-grid ${gridScale}`}>
        <div className={`grid-container ${gridScale}`}>
            {hexGrid.map(hex => <Hex key={hex.id} hexState={hex} handleClick={updateactiveQ}/>)}
            <DetailedHex activeQ={activeQ} handleClick={answerClicked} winState={winState} handleReset={resetApp} handleClose={keepPlaying}/>
        </div>        
    </div>)
}