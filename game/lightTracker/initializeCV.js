function initializeCV() {
    if (typeof cv === "undefined") {
        setTimeout(initializeCV, 50);
        return;
    }
}