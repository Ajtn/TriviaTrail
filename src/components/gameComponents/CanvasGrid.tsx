import React, { useState, useEffect, useRef } from "react";
import "../../utility/hexUtility"; 
import QuestionModal from "./QuestionModal";
import '../../style/canvasStyle.css';
import {calcHexScale, getHexCoords, getGridX, pointInsideHex, getTextOffset, checkAdjacent, formatString, isHexWinState} from "../../utility/hexUtility";
import { ruleSet } from "../../App";

//object structure expected from API
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

type hexStatus = {
    id: string;
    position: position;
    accessible: boolean;
    category: string;
    answered: "pass" | "fail" | "unanswered";
    questionText: string;
    correctAnswer: string;
    incorrectAnswers?: Array<string>;
    difficulty: string;
    isGoal: boolean;
 };

export type activeQ = {
    visible: boolean;
    qData: hexStatus;
}

type urlParams = {
    [index: string]: string;
}

type apiConfig = {
    baseUrl: string;
    method: string;
    urlParams: urlParams;
}

export type position = {
    xPos: number;
    yPos: number;
}

export type hexScale = {
    hexSideLength: number;
    //space between each hex
    hexOffset: number;
    fontSize: number;
    //offset added to all hexes to keep grid somewhat centered in canvas with variable screen sizes
    canvasOffset: {x: number, y: number};
}

type winState = "won" | "lose" | "ongoing"

export default function CanvasGrid(props: {gameRules: ruleSet, api: apiConfig, darkMode: boolean, canClick: boolean, reset: number}) {

    const [windowSize, setWindowSize] = useState({width: Math.round(window.innerWidth), height: window.innerHeight});
    const [hexScale, setHexScale] = useState(calcHexScale(windowSize, props.gameRules.rowLength, props.gameRules.colLength));
    //Questiondata direct from API
    const [questions, setQuestions] = useState<question[]>([]),
    //winState to check if the game is still going
    [winState, setWinstate] = useState<winState>("ongoing"),
    //Array to track state of all hexes and their question data
    [hexGrid, setHexGrid] = useState<hexStatus[]>([]),
    [mouseOnHex, setMouseOnHex] = useState<hexStatus | undefined>(),
    //Currently selected question and whether it's visible in pop up modal
    [activeQ, setactiveQ] = useState<activeQ>({visible: false, qData: {id: "", position: {xPos: -1, yPos: -1}, accessible: false, category: "", answered: "unanswered", questionText: "", correctAnswer: "", difficulty: "", isGoal: false}});

    useEffect(initTrivia, [props.reset]);
    useEffect(initHexGrid, [questions]);
    useEffect(checkFailState, [hexGrid]);
    useEffect(initResizeListener, [windowSize]);
    useEffect(updateHexScale, [windowSize, questions]);
    useEffect(drawGrid, [hexGrid, hexScale, mouseOnHex, props.darkMode]);
    useEffect(initMouseMoveListener, [hexScale, hexGrid, activeQ]);
    useEffect(initMouseClickListener, [hexScale, hexGrid, activeQ, props.canClick]);

    const canvRef = useRef<HTMLCanvasElement>(null);

    //lightmode colour scheme for hexes on canvas
    const defaultHexStyle = {
        pass: {colour: "#338f3f", fontColour: "#faebd7"},
        fail: {colour: "#ba2a37", fontColour: "#faebd7"},
        acessible: {colour: "#5e9cca", fontColour: "black"},
        inaccessible: {colour: "#ade4ef", fontColour: "black"},
        goal: {colour: "#f3c45f", fontColour: "black"}
    },
    //darkmode colour scheme for hexes on canvas
    darkHexStyle = {
        pass: {colour: "#043006", fontColour: "antiqueWhite"},
        fail: {colour: "#520d1a", fontColour: "antiqueWhite"},
        acessible: {colour: "#111b4b", fontColour: "antiqueWhite"},
        inaccessible: {colour: "#263045", fontColour: "#89879b"},
        goal: {colour: "#6a7109", fontColour: "antiqueWhite"}
    };

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
        if (! activeQ.visible && props.canClick) {
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
        setWindowSize({width: Math.round(window.innerWidth), height: window.innerHeight});
    }


    function updateHexScale() {
        setHexScale(calcHexScale(windowSize, props.gameRules.rowLength, props.gameRules.colLength));
    }

    function initTrivia() {
        const paramKeys = Object.keys(props.api.urlParams);
        let url = props.api.baseUrl;
        if (paramKeys.length > 0) {
            url = url + "?";
            paramKeys.forEach(key => {
                if (props.api.urlParams[key] !== "") {
                    url = `${url}${key}=${props.api.urlParams[key]}&`
                }
            });
            url = url.slice(0, -1);
            console.log(url);
            console.log(props.api.urlParams);
        }

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
        setactiveQ({visible: false, qData: {id: "", position: {xPos: -1, yPos: -1}, accessible: false, category: "", answered: "unanswered", questionText: "", correctAnswer: "", difficulty: "", isGoal: false}});
    }

    function resetApp() {
        initTrivia();
        setactiveQ(oldQ => ({...oldQ, visible: false}));
        setWinstate("ongoing");
    }

    function keepPlaying() {
        setactiveQ(oldActive => ({...oldActive, visible: false}));
        setWinstate("ongoing");
    }

    function drawGrid() {
        const canvas = canvRef.current;
        const context = canvas?.getContext('2d');

        if (context) {
            context.clearRect(0, 0, windowSize.width, windowSize.height);
            hexGrid.forEach(hex => drawHex(context, hex));
            if (mouseOnHex) {
                drawHex(context, mouseOnHex, {colour: "#e4f118", fontColour: "black"});
            }
        }
    }

    function drawHex(canvasContext: CanvasRenderingContext2D, hex: hexStatus, overrideStyle?: {colour: string, fontColour: string}) {
        const {x:x, y:y} = getHexCoords(hex.position, hexScale);
        let tempStyle;
        if (overrideStyle) {
            tempStyle = overrideStyle;
        } else {
            tempStyle = getHexStyle(hex.accessible, hex.isGoal, hex.answered);
        }

        canvasContext.beginPath();
        canvasContext.moveTo(x + hexScale.hexSideLength * Math.cos(0), y + hexScale.hexSideLength * Math.sin(0));

        for (let side = 0; side < 6; side++) {
            canvasContext.lineTo(x + hexScale.hexSideLength * Math.cos(side * 2 * Math.PI / 6), y + hexScale.hexSideLength * Math.sin(side * 2 * Math.PI / 6));
        }
        canvasContext.fillStyle = tempStyle.colour;
        canvasContext.fill();


        canvasContext.font = `${hexScale.fontSize}px Georgia`;
        canvasContext.fillStyle = tempStyle.fontColour;
        const textOffset = getTextOffset(hex.category, hexScale.fontSize);
        canvasContext.fillText(hex.category, x - textOffset, y);
    }

    function getHexStyle(accessible: boolean, isGoal: boolean,answered: "pass" | "fail" | "unanswered") {
        if (answered === "pass") {
            return !props.darkMode? defaultHexStyle.pass : darkHexStyle.pass;
        } else if (answered === "fail") {
            return !props.darkMode? defaultHexStyle.fail : darkHexStyle.fail;
        } else if (isGoal){
            return !props.darkMode? defaultHexStyle.goal : darkHexStyle.goal;
        } else if (accessible) {
            return !props.darkMode? defaultHexStyle.acessible : darkHexStyle.acessible;
        } else {
            return !props.darkMode? defaultHexStyle.inaccessible : darkHexStyle.inaccessible;
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
            const tempHex: hexStatus = {...q, questionText: q.question.text, category: formatString(q.category), position: {xPos: xPos, yPos: yPos}, accessible: false, answered: "unanswered" as "unanswered", isGoal: false}
            if (xPos + 1 < props.gameRules.rowLength) {
                xPos++;
            } else {
                xPos = 0;
                yPos++;
            }
            if (props.gameRules.startHexes.some(startPos => tempHex.position.xPos === startPos.xPos && tempHex.position.yPos === startPos.yPos)) {
                tempHex.accessible = true;
            }
            if (isHexWinState(tempHex.position, props.gameRules.endHexes)) {
                tempHex.isGoal = true;
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
                    if (activeQ.qData.isGoal) {
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
            <QuestionModal activeQ={activeQ} handleClick={answerClicked} winState={winState} handleReset={resetApp} handleClose={keepPlaying} />
            <canvas className="hex-canvas" width={windowSize.width} height={windowSize.height - 4} ref={canvRef}></canvas>
        </div>
    )
}