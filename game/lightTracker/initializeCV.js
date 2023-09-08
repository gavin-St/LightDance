function initializeCV() {
    if (typeof cv === "undefined") {
        setTimeout(initializeCV, 50);
        return;
    }
    cv.onRuntimeInitialized = function() {
        const event = new Event('opencvReady');
        document.dispatchEvent(event);

    }
}