import { BreakableBlockGenerator } from "./block.js";

const makeBlockButton = document.querySelector("#move_block");

generator = new BreakableBlockGenerator(
    mainScene, // sceneObject
    -10, // blockGenerationZCoord
    10, // despawnLimit
    {beginX: -4, endX: 4, beginY: -4, endY: 4}, // blockGenerationBorders
    [2, 2, 2], // blockDimensions
    0, // inRangeCenterZCoord
    1, // inRangeRadius
    0.05 // errorMargin
);

// randomly generates a block on a circle with radius blockGenerationRadius
function randomlyGenerateBlock() {
    let tuple = generator.generatePoint(2);
    generator.generateBlock(tuple[0], tuple[1], tuple[2], tuple[3]);
}

// imaginary plane at which cursor sits on to target blocks, *2.4 since it will be double the radius + a bit more
planeHeight = (generator.blockGenerationBorders.endY - generator.blockGenerationBorders.beginY) * 2;
planeWidth = (generator.blockGenerationBorders.endX - generator.blockGenerationBorders.beginX) * 2;

function animate() {
    requestAnimationFrame(animate);
    generator.moveAllCubes(0.05);
    generator.destroyPastBlocks();
    generator.checkInRange();
    generator.checkBreakability();
    renderer.render(mainScene.scene, camera);
}

makeBlockButton.addEventListener('click', randomlyGenerateBlock);
animate();
