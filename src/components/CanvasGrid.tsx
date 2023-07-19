import React, { useState, useEffect, useRef } from "react";
import { hexStatus } from "./Hex";
import DetailedHex from "./DetailedHex";
import '../style/canvasStyle.css';
import { testHexes } from "../assets/demoQs";

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


type apiConfig = {
    baseUrl: string;
    method: string;
    urlParams: Array<string>;
}

export type position = {
    xPos: number;
    yPos: number;
}

type winState = "won" | "lose" | "ongoing"


export default function CanvasGrid(props: {rowLength: number, startingHexes: Array<position>, endHexes:Array<position> ,api: apiConfig}) {

    const [windowSize, setWindowWidth] = useState({width: window.innerWidth, height: window.innerHeight});
    const [hexScale, setHexScale] = useState(calcHexScale);
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
    useEffect(initResizeListener, [windowSize]);
    useEffect(updateHexScale, [windowSize]);
    useEffect(drawGrid, [hexGrid, hexScale]);

    const canvRef = useRef<HTMLCanvasElement>(null);

    function drawGrid() {
        const canvas = canvRef.current;
        const context = canvas?.getContext('2d');

        if (context) {
            context.clearRect(0, 0, windowSize.width, windowSize.height);
            // testHexes.forEach(hex => drawHex(context, hex));
            hexGrid.forEach(hex => drawHex(context, hex));
        }
    }

    function initResizeListener() {
        window.addEventListener('resize', handleResize);
        return () => {
        window.removeEventListener('resize', handleResize);
        };
    }

    function calcHexScale() {
        const offset = windowSize.width / 300;
        let lengthW = ((windowSize.width + offset) / props.rowLength - offset) / 1.49;
        lengthW = lengthW - lengthW / (props.rowLength * 2);
        //todo:
        //  -change from rowLength to total/rowLength
        let lengthH = ((windowSize.height - offset * (props.rowLength - 1)) / props.rowLength) / Math.sqrt(3);
        lengthH = lengthH - lengthH / (props.rowLength * 2)
        let length = 0,
        canvasOffset = {x: 0, y: 0};
        if (lengthH < lengthW) {
            length = lengthH;
            canvasOffset.x = ((windowSize.width - (((lengthH * 1.49 + offset) * props.rowLength)) - offset * 2.5) / 2)
        } else {
            length = lengthW;
            canvasOffset.y = ((windowSize.height - (((lengthW * Math.sqrt(3) + offset) * props.rowLength))) / 2)
        }
        const font = length / 5;
        return ({hexSideLength: length,hexOffset: offset, fontSize: font, canvasOffset: canvasOffset});
    }

    function handleResize() {
        setWindowWidth({width: window.innerWidth, height: window.innerHeight});
    }

    function updateHexScale() {
        setHexScale(calcHexScale);
    }

    function getTrivia() {
        //const url = apiParameters.length > 0 ? props.api.baseUrl + "?" + apiParameters.map(param => param + "&") : props.api.baseUrl;
        const url = props.api.urlParams.length > 0 ? props.api.baseUrl + "?" + props.api.urlParams.map(param => param + "&") : props.api.baseUrl;
        fetch(url, {
            method: props.api.method,
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

    function drawHex(canvasContext: CanvasRenderingContext2D, hex: hexStatus) {
        const {x:x, y:y} = getHexCoords(hex.position);

        canvasContext.beginPath();
        canvasContext.moveTo(x + hexScale.hexSideLength * Math.cos(0), y + hexScale.hexSideLength * Math.sin(0));

        for (let side = 0; side < 6; side++) {
            canvasContext.lineTo(x + hexScale.hexSideLength * Math.cos(side * 2 * Math.PI / 6), y + hexScale.hexSideLength * Math.sin(side * 2 * Math.PI / 6));
        }
        canvasContext.fillStyle = getHexColour(hex.accessible, hex.answered);
        canvasContext.fill();

        canvasContext.font = `${hexScale.fontSize}px Georgia`;
        canvasContext.fillStyle = "black";
        const textOffset = getTextOffset(hex.category);
        canvasContext.fillText(hex.category, x - textOffset, y);
    }

    function getHexColour(accessible: boolean, answered: "pass" | "fail" | "unanswered") {
        if (answered === "unanswered") {
            if (! accessible) {
                return "#ade4ef";
            } else {
                return "#1d9cc4";
            }
        } else if (answered === "pass") {
            return "#66e377";
        } else {
            return "#e53a49";
        }
    }

    function getHexCoords(hexPos: position) {
        const {xPos: xPos, yPos: yPos} = hexPos;
        const xGap = (hexScale.hexSideLength * 1.49 + hexScale.hexOffset);
        const yGap = (Math.sqrt(3)) * hexScale.hexSideLength + hexScale.hexOffset;
        if (hexPos.xPos % 2 === 0) {
            return {x: xPos * xGap + hexScale.hexSideLength + hexScale.canvasOffset.x, y: yPos * yGap + hexScale.hexSideLength + hexScale.canvasOffset.y}
        } else {
            return {x: xPos * xGap + hexScale.hexSideLength + hexScale.canvasOffset.x, y: (yPos + 0.5) * yGap + hexScale.hexSideLength + hexScale.canvasOffset.y}
        }
    }

    function getTextOffset(text: string) {
        return text.length * hexScale.fontSize * 0.45 / 2;
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
            if (props.startingHexes.some(startPos => tempHex.position.xPos === startPos.xPos && tempHex.position.yPos === startPos.yPos)) {
                tempHex.accessible = true;
            }
            return tempHex;
        });
    }

    function updateactiveQ (event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const clickedQ = hexGrid.find(q => q.id === event.currentTarget.classList[1]);
        if (clickedQ) {
            if (clickedQ.accessible) {
                setactiveQ({visible:true, qData: clickedQ});
            }
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

    return (
        <canvas className="hex-canvas" width={windowSize.width} height={windowSize.height - 4} ref={canvRef}></canvas>
    )
}