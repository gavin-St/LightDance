
function getX(cursorX) {
    return (cursorX / windowWidth - 0.5) * planeWidth;
}

function getY(cursorY) {
    return (-cursorY / windowHeight + 0.5) * planeHeight;
}