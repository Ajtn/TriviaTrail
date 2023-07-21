import React, { useState, useEffect, useRef } from "react";
import "../utility/hexUtility"; 
import { hexStatus } from "./Hex";
import DetailedHex from "./DetailedHex";
import '../style/canvasStyle.css';
import { calcHexScale, checkAdjacent, formatString, getGridX, getHexCoords, getTextOffset, pointInsideHex } from "../utility/hexUtility";

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

export type hexScale = {
    hexSideLength: number;
    hexOffset: number;
    fontSize: number;
    canvasOffset: {x: number, y: number};
}

type winState = "won" | "lose" | "ongoing"


export default function CanvasGrid(props: {rowLength: number, startingHexes: Array<position>, endHexes:Array<position> ,api: apiConfig}) {

    const [windowSize, setWindowWidth] = useState({width: window.innerWidth, height: window.innerHeight});
    const [hexScale, setHexScale] = useState(calcHexScale(windowSize, props.rowLength));
    //Questiondata direct from API
    const [questions, setQuestions] = useState<question[]>([]),
    //User defined parameters to modify API call to specific question types (not implemented)
    //[apiParameters, setApiParameters] = useState(props.api.urlParams),
    //winState to check if the game is still going
    [winState, setWinstate] = useState<winState>("ongoing"),
    //Array to track state of all hexes and their question data
    [hexGrid, setHexGrid] = useState<hexStatus[]>([]),
    [mouseOnHex, setMouseOnHex] = useState<hexStatus | undefined>(),
    //Currently selected question and whether it's visible in pop up big hex
    [activeQ, setactiveQ] = useState<activeQ>({visible: false, qData: {id: "", position: {xPos: -1, yPos: -1}, accessible: false, category: "", answered: "unanswered", questionText: "", correctAnswer: "", difficulty: ""}});

    useEffect(getTrivia, []);
    useEffect(initHexGrid, [questions]);
    useEffect(checkFailState, [hexGrid]);
    useEffect(initResizeListener, [windowSize]);
    useEffect(updateHexScale, [windowSize]);
    useEffect(drawGrid, [hexGrid, hexScale, mouseOnHex]);
    useEffect(initMouseMoveListener, [hexScale, hexGrid, activeQ]);
    useEffect(initMouseClickListener, [hexScale, hexGrid, activeQ]);

    const canvRef = useRef<HTMLCanvasElement>(null);

    function drawGrid() {
        const canvas = canvRef.current;
        const context = canvas?.getContext('2d');

        if (context) {
            context.clearRect(0, 0, windowSize.width, windowSize.height);
            hexGrid.forEach(hex => drawHex(context, hex));
            if (mouseOnHex) {
                drawHex(context, mouseOnHex, "#e4f118");
            }
        }
    }

    function initMouseMoveListener() {
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
        }
    }

    //todo: find bug that interrupts hexGrid state update
    function handleMouseMove(event: MouseEvent) {

        if (false) {
            const hoverPos = {x: event.clientX, y: event.clientY};
            const xGrid = getGridX(hoverPos.x, hexScale);
            const xAlignedHexes: Array<hexStatus> = [];
    
            hexGrid.forEach(hex => {
                if (hex.accessible && (xGrid === hex.position.xPos || xGrid === hex.position.xPos + 1)) {
                    xAlignedHexes.push(hex);
                }
            });
    
            const hoverHex = xAlignedHexes.find(hex => {
                const hexCoord = getHexCoords(hex.position, hexScale);
                return pointInsideHex(hexCoord, hexScale.hexSideLength, hoverPos)
            });
            setMouseOnHex(hoverHex);
        } 
    }
    
    function initMouseClickListener() {
        window.addEventListener('mousedown', handleMouseClick);
        return () => {
            window.removeEventListener('mousedown', handleMouseClick)
        }
    }

    function handleMouseClick(event: MouseEvent) {
        if (! activeQ.visible) {
            const clickPos = {x: event.clientX, y: event.clientY};
            const xGrid = getGridX(clickPos.x, hexScale);
            const xAlignedHexes: Array<hexStatus> = [];

            hexGrid.forEach(hex => {
                if (xGrid === hex.position.xPos || xGrid === hex.position.xPos + 1) {
                    xAlignedHexes.push(hex);
                }
            });

            const clickedHex = xAlignedHexes.find(hex => {
                const hexCoord = getHexCoords(hex.position, hexScale);
                return pointInsideHex(hexCoord, hexScale.hexSideLength, clickPos)
            });
            if (clickedHex?.accessible) {
                setactiveQ({visible: true, qData: clickedHex});
            }
        }
    }
    
    function initResizeListener() {
        window.addEventListener('resize', handleResize);
        return () => {
        window.removeEventListener('resize', handleResize);
        };
    }

    function handleResize() {
        setWindowWidth({width: window.innerWidth, height: window.innerHeight});
    }

    function updateHexScale() {
        setHexScale(calcHexScale(windowSize, props.rowLength));
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

    function drawHex(canvasContext: CanvasRenderingContext2D, hex: hexStatus, overrideColour?: string) {
        const {x:x, y:y} = getHexCoords(hex.position, hexScale);

        canvasContext.beginPath();
        canvasContext.moveTo(x + hexScale.hexSideLength * Math.cos(0), y + hexScale.hexSideLength * Math.sin(0));

        for (let side = 0; side < 6; side++) {
            canvasContext.lineTo(x + hexScale.hexSideLength * Math.cos(side * 2 * Math.PI / 6), y + hexScale.hexSideLength * Math.sin(side * 2 * Math.PI / 6));
        }
        canvasContext.fillStyle = overrideColour? overrideColour : getHexColour(hex.accessible, hex.answered);
        canvasContext.fill();

        canvasContext.font = `${hexScale.fontSize}px Georgia`;
        canvasContext.fillStyle = "black";
        const textOffset = getTextOffset(hex.category, hexScale.fontSize);
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

    //calculates hexes adjacent to active hex to modify accessibility
    function getNeighbors(hexPos: {xPos: number, yPos: number}) {
        const neighbors: Array<string> = [];
        hexGrid.forEach(hex => {
            if (checkAdjacent(hexPos, hex.position)) {
                neighbors.push(hex.id);
            }
        });
        return neighbors;
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

    //finds current question and modifies it's answered value in state
    function answerClicked(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const clickedA = event.currentTarget.outerText,
        clickedId = event.currentTarget.parentElement?.classList[1];
        setHexGrid(oldGrid => oldGrid.map(hex => {
            if (hex.id === clickedId) {
                if (clickedA === activeQ.qData.correctAnswer) {
                    if (props.endHexes.some(endPos => (endPos.xPos === activeQ.qData.position.xPos && endPos.yPos === activeQ.qData.position.yPos))) {
                        setWinstate("won");
                    }
                    setactiveQ(oldActive => ({...oldActive, qData: {...oldActive.qData, answered: "pass"}}));
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
        <div className="canvas-grid grid-container">
            <DetailedHex activeQ={activeQ} handleClick={answerClicked} winState={winState} handleReset={resetApp} handleClose={keepPlaying} />
            <canvas className="hex-canvas" width={windowSize.width} height={windowSize.height - 4} ref={canvRef}></canvas>
        </div>
    )
}