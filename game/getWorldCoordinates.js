
function getX(cursorX) {
    windowWidth = window.innerWidth;
    //console.log("x width: ", windowWidth, planeWidth);
    return (cursorX / windowWidth - 0.5) * planeWidth;
}

function getY(cursorY) {
    windowHeight = window.innerHeight;
   // console.log("y height: ", windowHeight, planeWidth);
    return (-cursorY / windowHeight + 0.5) * planeHeight;
}