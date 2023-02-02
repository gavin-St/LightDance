
let display = document.getElementById(`cursor_coordinates`);
let tracker;

function init() {
    let trackerGeometry = new THREE.CircleGeometry(0.5);
    let trackerMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    tracker = new THREE.Mesh(trackerGeometry, trackerMaterial)
    scene.add(tracker);
}

function mouseCoordinates(event) {
    cursorX = event.clientX;
    cursorY = event.clientY;
    display.innerHTML= `Coordinate X: ${cursorX} Pixels, Coordinate Y: ${cursorY} Pixels`;
}

function track() {
    requestAnimationFrame(track);
    tracker.position.x = getX(cursorX);
    tracker.position.y = getY(cursorY);
}

init()
document.onmousemove = mouseCoordinates;
track();

