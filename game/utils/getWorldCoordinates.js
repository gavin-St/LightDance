
export function getX(cursorX, planeWidth) {
    let windowWidth = window.innerWidth;
    //console.log("x width: ", windowWidth, planeWidth);
    return (cursorX / windowWidth - 0.5) * planeWidth;
}

export function getY(cursorY, planeHeight) {
    let windowHeight = window.innerHeight;
   // console.log("y height: ", windowHeight, planeWidth);
    return (-cursorY / windowHeight + 0.5) * planeHeight;
}

