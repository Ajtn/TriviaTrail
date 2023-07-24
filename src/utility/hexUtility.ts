import { position, hexScale } from "../components/CanvasGrid";

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

export function calcHexScale(windowSize: {width: number, height: number}, rowLength: number) {
    const offset = windowSize.width / 300;
    let lengthW = ((windowSize.width + offset) / rowLength - offset) / 1.49;
    lengthW = lengthW - lengthW / (rowLength * 2);
    //todo:
    //  -change from rowLength to total/rowLength
    let lengthH = ((windowSize.height - offset * (rowLength - 1)) / rowLength) / Math.sqrt(3);
    lengthH = lengthH - lengthH / (rowLength * 2);
    let length = 0,
    canvasOffset = {x: 0, y: 0};
    if (lengthH < lengthW) {
        length = lengthH;
        canvasOffset.x = ((windowSize.width - (((lengthH * 1.49 + offset) * rowLength)) - offset * 2.5) / 2)
    } else {
        length = lengthW;
        canvasOffset.y = ((windowSize.height - (((lengthW * Math.sqrt(3) + offset) * rowLength))) / 2)
    }
    const font = length / 5;
    return ({hexSideLength: length, innerHexLength: length - Math.round(length/10) ,hexOffset: offset, fontSize: font, canvasOffset: canvasOffset});
}


export function getTextOffset(text: string, fontSize: number) {
    return text.length * fontSize * 0.45 / 2;
}

export function formatString(inputText: string) {
    return inputText.replaceAll("_", " ");
}