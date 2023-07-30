import { position, hexScale } from "../components/gameComponents/CanvasGrid";

//practically equivalent to position, added to clarify expected logic
export type coordinate = {
    x: number;
    y: number;
}

//Used tan law to find the angle between two points
function getAngleBetweenPoints(pos1: coordinate, pos2: coordinate) {
    return Math.atan2(pos1.x - pos2.x, pos1.y - pos2.y);
}

//Use pythag theorem to find distance between points
function getDistanceBetweenPoints(pos1: coordinate, pos2: coordinate) {
    return (Math.sqrt((pos1.x - pos2.x) **2  + (pos1.y - pos2.y) ** 2))
}

//checks two sets of coordinates and returns true if they would be inside a hexagon drawn at the other point (not grid pos)
export function pointInsideHex(hexPos: coordinate, hexSideL: number, pos: coordinate) {
    const actualLength = getDistanceBetweenPoints(hexPos, pos);
    let angle = Math.abs(getAngleBetweenPoints(hexPos, pos));
    while (angle > Math.PI / 6) {
        angle = angle - Math.PI / 6;
    }
    const maxLength = (Math.sqrt(hexSideL ** 2 - (hexSideL / 2) ** 2) / Math.cos(angle));
    return maxLength >= actualLength? true : false;
}

//Finds the x and y co ordinates for a hexes origin given it's position in the grid and the scale of the grid
export function getHexCoords(hexGridPos: position, hexScale: hexScale) {
    const {xPos: xPos, yPos: yPos} = hexGridPos;
    const xGap = (hexScale.hexSideLength * 1.49 + hexScale.hexOffset);
    const yGap = (Math.sqrt(3)) * hexScale.hexSideLength + hexScale.hexOffset;
    if (xPos % 2 === 0) {
        return {x: xPos * xGap + hexScale.hexSideLength + hexScale.canvasOffset.x, y: yPos * yGap + hexScale.hexSideLength + hexScale.canvasOffset.y - 10}
    } else {
        return {x: xPos * xGap + hexScale.hexSideLength + hexScale.canvasOffset.x, y: (yPos + 0.5) * yGap + hexScale.hexSideLength + hexScale.canvasOffset.y - 10}
    }
}

//takes x coordinate on screen and returns equivalent xPos on grid
export function getGridX(x: number, hexScale: hexScale) {
    const xGap = (hexScale.hexSideLength * 1.49 + hexScale.hexOffset);
    return Math.ceil((x - hexScale.hexSideLength - hexScale.canvasOffset.x) / xGap);
}

//checks if two hexes are adjacent to each other given their grid positions
export function checkAdjacent(hex1: position, hex2: position) {
    if (hex1.xPos === hex2.xPos) {
        if (hex1.yPos === hex2.yPos + 1 || hex1.yPos === hex2.yPos - 1) {
            return true;
        }
    } else if (hex2.xPos % 2 === 0) {
        if (hex1.xPos === hex2.xPos - 1 || hex1.xPos === hex2.xPos + 1) {
            if (hex1.yPos === hex2.yPos -1 || hex1.yPos === hex2.yPos) {
                return true;
            }
        }
    } else {
        if (hex1.xPos === hex2.xPos - 1 || hex1.xPos === hex2.xPos + 1) {
            if (hex1.yPos === hex2.yPos || hex1.yPos === hex2.yPos + 1) {
                return true;
            }
        }
    }
    return false;
}

//checks if a grid position is one of the goal positions, -1 is used to denote any position in that row/column
export function isHexWinState(hexPos: position, goalPositions: Array<position>) {
    if (goalPositions.some(goal => (hexPos.xPos === goal.xPos || goal.xPos === -1) && (goal.yPos === -1 || hexPos.yPos === goal.yPos))) {
        return true;
    } else {
        return false;
    }
}

//calculates hex dimensions based on window scale and grid size
export function calcHexScale(windowSize: {width: number, height: number}, rowLength: number, columnLength: number) {
    const offset = windowSize.width / 300;
    let lengthW = ((windowSize.width * 0.95 + offset) / rowLength - offset) / 1.49;
    lengthW = lengthW - lengthW / (rowLength * 2);
    let lengthH = ((windowSize.height - offset * (rowLength - 1)) / columnLength) / Math.sqrt(3);
    lengthH = lengthH - lengthH / (columnLength * 2);
    let length = 0,
    canvasOffset = {x: 0, y: 0};
    if (lengthH < lengthW) {
        length = lengthH;
        canvasOffset.x = ((windowSize.width - (((length * 1.49 + offset) * rowLength)) - offset) / 2 + (windowSize.width * 0.05) );
        canvasOffset.y = ((windowSize.height - (((length * Math.sqrt(3) + offset) * columnLength)) - offset * 2) / 8);
    } else {
        length = lengthW;
        //navbar swaps from vertical to horizontal at 600 width different scaling ideal
        if (windowSize.width <= 600 || window.matchMedia(("(orientation: portrait)"))) {
            canvasOffset.y = ((windowSize.height - (((length * Math.sqrt(3) + offset) * columnLength))) * 0.75);
            canvasOffset.x = canvasOffset.x = ((windowSize.width - (((length * 1.49 + offset) * rowLength)) - offset * 2.5) / 2 + (windowSize.width * 0.02));
        } else {
            canvasOffset.y = ((windowSize.height - (((length * Math.sqrt(3) + offset) * columnLength))) / 8);
            canvasOffset.x = ((windowSize.width - (((length * 1.49 + offset) * rowLength)) - offset * 2.5) / 2 + (windowSize.width * 0.04));
        }
    }
    const font = length / 5;
    return ({hexSideLength: length ,hexOffset: offset, fontSize: font, canvasOffset: canvasOffset});
}


export function getTextOffset(text: string, fontSize: number) {
    return text.length * fontSize * 0.45 / 2;
}

export function formatString(inputText: string) {
    return inputText.replaceAll("_", " ");
}