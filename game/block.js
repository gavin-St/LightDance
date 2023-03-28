let blockGeometry, blockMaterial;

// bounds of targetability of blocks
const centerZTargetable = 0;
const targetableRadius = 1; // > 0

// size of (square) blocks
const blockSize = 2;

// the Z coordinates where blocks can begin and end being targetable
const beginTargetable = centerZTargetable - targetableRadius;
const endTargetable = centerZTargetable + targetableRadius;

// the radius from (0,0) at which to generate blocks in
const blockGenerationRadius = 5;
// the z coordinate to generate blocks at
const blockGenerationZCoord = -10;

// imaginary plane at which cursor sits on to target blocks
planeHeight = blockGenerationRadius * 2.4;
planeWidth = blockGenerationRadius * 2.4;

// the number of units cursor should be within to break block
const targetRadius = 3;

const makeBlockButton = document.querySelector("#move_block");

class Block {
    constructor(mesh, direction, targetable) {
        this.mesh = mesh;
        this.direction = direction;
        this.targetable = targetable;
    }
}

function init() {
    blockGeometry = new THREE.BoxGeometry(blockSize, blockSize, blockSize);
    blockMaterial = new THREE.MeshStandardMaterial({color: 0xff0000});
}

function generatePoint(r) {
    let  randomValue = Math.random() * 2 * Math.PI;
    // x, y, angle
    let tuple = [r * Math.cos(randomValue), r * Math.sin(randomValue), randomValue];
    //console.log(randomValue);
    //console.log(r * Math.cos(randomValue));
    //console.log(r * Math.sin(randomValue));
    return tuple;
}

function makeCube(x = 0, y = 0, rotation = 0) {
    activeCubes.push();
    activeCubes.push(new Block(new THREE.Mesh(blockGeometry, blockMaterial), 0, false));
    //cubesTargetable.push(false);
    numCubes++;

    activeCubes.at(-1).mesh.geometry.computeBoundingBox();
    activeCubes.at(-1).mesh.rotation.z = rotation;
    activeCubes.at(-1).mesh.position.x = x;
    activeCubes.at(-1).mesh.position.y = y;
    activeCubes.at(-1).mesh.position.z = blockGenerationZCoord;
    scene.add(activeCubes.at(-1).mesh);
}

function moveAllCubes() {
    //console.log(activeCubes);
    for (let i = 0; i < numCubes; i++) {
        activeCubes[i].mesh.position.z += 0.1;
    }
}

function addNewBlock() {
    tuple = generatePoint(blockGenerationRadius);
    makeCube(tuple[0], tuple[1], tuple[2]);
}

function destroyBlock(index, removeSquare = false) {
    scene.remove(activeCubes[index].mesh);
    activeCubes.splice(index, 1);
    //cubesTargetable.splice(index, 1);
    numCubes--;
    if (removeSquare) {
        removeTargetSquare(0);
    }
}

function destroyPastBlocks() {
    for (let i = 0; i < numCubes; i++) {
        if (activeCubes[i].mesh.position.z > 10) {
            destroyBlock(i);
        }
    }
}

// center: [centerX, centerY]
function drawTargetSquare(center, width, height) {
    let square = new THREE.Shape();
    square.moveTo(center[0], center[1]);
    square.currentPoint = new THREE.Vector2(center[0] - width/2, center[1] - height/2);
    square.lineTo(center[0] - width/2, center[1] + height/2);
    square.lineTo(center[0] + width/2, center[1] + height/2);
    square.lineTo(center[0] + width/2, center[1] - height/2);
    square.lineTo(center[0] - width/2, center[1] - height/2);
    let squareGeometry = new THREE.ShapeGeometry(square);
    let squareMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    let squareMesh = new THREE.Mesh(squareGeometry, squareMaterial);
    targets.push(squareMesh);
    scene.add(targets.at(-1));
}

function removeTargetSquare(index) {
    scene.remove(targets[index]);
    targets.splice(index, 1);
}

function checkPlaneIntersections() {
    for (let i = 0; i < numCubes; i++) {
        //activeCubes[i].geometry.computeBoundingBox();
        //console.log(activeCubes[i].geometry.boundingBox);
        curXPos = activeCubes[i].mesh.position.x;
        curYPos = activeCubes[i].mesh.position.y;
        curZPos = activeCubes[i].mesh.position.z;
        // it is targetable
        if (curZPos >= beginTargetable && curZPos <= endTargetable) {
            console.log("intersecting");
            if (!activeCubes[i].targetable) {
                activeCubes[i].mesh.material = new THREE.MeshStandardMaterial({color: 0x00ff00});
                drawTargetSquare([curXPos, curYPos], blockSize, blockSize);
            }
            //cubesTargetable[i] = true;
            activeCubes[i].targetable = true;
            // console.log("cursorX: " + cursorX + " window width: " + windowWidth + " plane width: " + planeWidth);
            // console.log("cursorY: " + cursorY + " window height: " + windowHeight + " plane height: " + planeHeight);
            // console.log("BLOCK POSITION: x: " + curXPos + " y: " + curYPos);
            // console.log("X Pos on Plane: " + (cursorX / windowWidth - 0.5) * planeWidth);
            // console.log("Y Pos on Plane: " + (-cursorY / windowHeight + 0.5) * planeHeight);
            if (Math.abs(curXPos - (getX(cursorX))) <= 3 && 
                Math.abs(curYPos - (getY(cursorY))) <= 3) {
                console.log("DESTROYED BLOCK");
                destroyBlock(i, true);
            }
        } else {
            console.log("not intersecting");
            activeCubes[i].mesh.material = new THREE.MeshStandardMaterial({color: 0xff0000});
            //cubesTargetable[i] = false;
            activeCubes[i].targetable = false;
            removeTargetSquare(0);
        }
    }
}

function frameDebug() {
    console.log("X Pos on Plane: " + getX(cursorX));
    console.log("Y Pos on Plane: " + getY(cursorY));
}

function animate() {
    requestAnimationFrame(animate);
    moveAllCubes();
    destroyPastBlocks();
    checkPlaneIntersections();
    renderer.render(scene, camera);
}

init();
//addLight(7);
makeBlockButton.addEventListener('click', addNewBlock);
animate();




