
let timeDisplay = document.getElementById(`clock`);

// sort block spawn input by reverse in terms of time
blockSpawnInput.sort((a, b) => {
    if (a.time === b.time) {
        return 0;
    } else {
        return (a.time < b.time) ? 1 : -1;
    }
})

console.log(blockSpawnInput);

clock = new THREE.Clock(true);
clock.start();

curBlock = null;
// get the element with the least time
if (blockSpawnInput.length > 0) {
    curBlock = blockSpawnInput.at(-1);
}

console.log(`here`);

function frame() {
    requestAnimationFrame(frame);
    curTime = clock.getElapsedTime();
    timeDisplay.innerHTML = `Seconds Passed: ${curTime}`;
    while (curBlock && curTime >= curBlock.time) {
        makeCube(curBlock.x, curBlock.y, curBlock.rotation);
        blockSpawnInput.pop();
        if (blockSpawnInput.length === 0) {
            console.log("EMPTY");
            curBlock = null;
            break;
        }
        curBlock = blockSpawnInput.at(-1);
    }
}

frame();


