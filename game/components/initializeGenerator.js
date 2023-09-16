import { BreakableBlockGenerator } from "./block.js";

const makeBlockButton = document.querySelector("#move_block");

// constructor(sceneObject, blockGenerationBorders, blockDimensions, blockGenerationZCoord, despawnLimit, movementPerSecond, inRangeCenterZCoord, inRangeRadius, errorMargin)

generator = new BreakableBlockGenerator(
    mainScene, // sceneObject
    {beginX: -4, endX: 4, beginY: -4, endY: 4}, // blockGenerationBorders
    [1.5, 1.5, 1.5], // blockDimensions
    -10, // blockGenerationZCoord
    10, // despawnLimit
    5, // movementPerSecond (in world coords)
    0, // inRangeCenterZCoord
    1, // inRangeRadius
    0.05 // errorMargin
);

document.dispatchEvent(new Event("generatorInitialized"));

console.log("INITIALIZED")
console.log(generator);

// randomly generates a block on a circle with radius blockGenerationRadius
function randomlyGenerateBlock() {
    let tuple = generator.generatePoint(2);
    generator.generateBlock(tuple[0], tuple[1], tuple[2], tuple[3]);
}

// imaginary plane at which cursor sits on to target blocks, *2.4 since it will be double the radius + a bit more
planeHeight = (generator.blockGenerationBorders.endY - generator.blockGenerationBorders.beginY) * 2;
planeWidth = (generator.blockGenerationBorders.endX - generator.blockGenerationBorders.beginX) * 2;

function animate() {
    const lifeElement = document.getElementById('lives_count');
    const curLives = parseInt(lifeElement.textContent.split(' ')[1]);

    if (curLives > 0) {
        requestAnimationFrame(animate);
        // generator.moveAllCubes(0.05);
        generator.destroyPastBlocksAndTrack();
        generator.checkInRange();
        generator.checkBreakability();
        renderer.render(mainScene.scene, camera);
    }
}

// standard move speed is 5 in-game units per second (we move once per 1/100 seconds or 10ms)
setInterval(() => {generator.moveAllCubes(generator.movementPerSecond / 20)}, 50);

makeBlockButton.addEventListener('click', randomlyGenerateBlock);
animate();
