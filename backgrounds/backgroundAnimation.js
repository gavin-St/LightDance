import { BlockGenerator } from "../game/components/block.js";

const generationFrequency = 2000;

// constructor(sceneObject, blockGenerationBorders, blockDimensions, blockGenerationZCoord, despawnLimit) {

let backgroundGenerator = new BlockGenerator(
    backgroundScene, // sceneObject
    {beginX: -4, endX: 4, beginY: -4, endY: 4}, // blockGenerationBorders
    [2, 2, 2], // blockDimensions
    -10, // blockGenerationZCoord
    10, // despawnLimit
)

// randomly generates a block on a circle with radius blockGenerationRadius
function randomlyGenerateBlock() {
    let radius = Math.random() * 2 + 2; // random radius
    let tuple = backgroundGenerator.generatePoint(radius);
    console.log(tuple);
    backgroundGenerator.generateBlock(tuple[0], tuple[1], tuple[2], tuple[3]);
}

function animate() {
    requestAnimationFrame(animate);
    backgroundGenerator.moveAllCubes(0.05);
    backgroundGenerator.destroyPastBlocks();
    renderer.render(backgroundScene.scene, camera);
}

animate();
setInterval(randomlyGenerateBlock, generationFrequency);
