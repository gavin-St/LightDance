
let timeDisplay = document.getElementById(`clock`);
let clock = new THREE.Clock(true);

// [time (sec), x, y, rotation]
let map = sessionStorage.getItem("Active Map") ? JSON.parse(sessionStorage.getItem(sessionStorage.getItem("Active Map"))) : [];
console.log(map);
const degToRad = Math.PI / 180;

// time it takes for block to go from spawn to center of targetable
console.log(generator);
console.log(generator.inRangeCenterZCoord);
console.log(generator.blockGenerationZCoord);
console.log(generator.movementPerSecond);
const blockGenerationDelay = (generator.inRangeCenterZCoord - generator.blockGenerationZCoord) / generator.movementPerSecond;
console.log(blockGenerationDelay);
// ^^
// can delete this once read
// issue: time in the map causes blocks to be GENERATED at that time, not in range at that time.
// solution: let blocks stay the same, but delay the song by blockGenerationDelay. 
// thus, time in the JSON file (and thus the intended moment to break block) is accurate to the actual song's rhythm.

function sortMap() {
    // sort block spawn input by reverse in terms of time
    map.sort((a, b) => {
        if (a.time === b.time) {
            return 0;
        } else {
            return (a.time < b.time) ? 1 : -1;
        }
    })
}

function loadMap() {
    console.log(map);
    sortMap();
    curBlock = null;
    // get the element with the least time
    if (map.length > 0) {
        curBlock = map.at(-1);
    }
    document.dispatchEvent(new Event("mapReady"));
    clock.start();
}


function frame() {
    requestAnimationFrame(frame);
    curTime = clock.getElapsedTime();
    timeDisplay.innerHTML = `Seconds Passed: ${curTime}`;
    const lifeElement = document.getElementById('lives_count');
    const curLives = parseInt(lifeElement.textContent.split(' ')[1]);
    console.log(curLives);
    while (curBlock && curTime >= curBlock.time && curLives > 0) {
        generator.generateBlock(curBlock.x, curBlock.y, curBlock.rotation * Math.PI / 180);
        map.pop();
        if (map.length === 0) {
            console.log("EMPTY");
            curBlock = null;
            break;
        }
        curBlock = map.at(-1);
    }
}

loadMap();

frame();
