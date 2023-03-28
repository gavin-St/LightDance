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
    constructor(mesh, direction, targetable, breakable) {
        this.mesh = mesh;
        this.direction = direction;
        this.targetable = targetable;
        this.breakable = breakable;
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

function rotatePoint(x, y, centerX, centerY, angle) {
    //rotate (x,y) around (centerX, centerY) by angle radians

    const c = Math.cos(angle);
    const s = Math.sin(angle);

    //subtract center to make this equivalent to rotating around origin
    x -= centerX;
    y -= centerY;

    let newX = x * c - y * s;
    let newY = x * s + y * c;

    //add back center
    newX += centerX;
    newY += centerY;

    return [newX, newY];
}

function makeCube(x = 0, y = 0, rotation = 0) {
    activeCubes.push();
    activeCubes.push(new Block(new THREE.Mesh(blockGeometry, blockMaterial), Math.floor(Math.random() * 3), false, false));
    console.log(`direction: ${activeCubes.at(-1).direction}`);
    console.log(`rotation: ${rotation}`);
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
        activeCubes[i].mesh.position.z += 0.05;
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
            const rotated = rotatePoint(getX(cursorX), getY(cursorY), curXPos, curYPos, -activeCubes[i].mesh.rotation.z);
            const x = rotated[0];
            const y = rotated[1];
            const direction = activeCubes[i].direction;
            //check if it passed through the entire block
            if(activeCubes[i].breakable) {
                if(activeCubes[i].direction == 0 && y < curYPos - blockSize / 2) {
                    destroyBlock(i, true);
                } else if(activeCubes[i].direction == 1 && x < curXPos - blockSize / 2) {
                    destroyBlock(i, true);
                } else if(activeCubes[i].direction == 2 && y > curYPos + blockSize / 2) {
                    destroyBlock(i, true);
                } else if(activeCubes[i].direction == 3 && x > curXPos + blockSize / 2) {
                    destroyBlock(i, true);
                }
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

function checkBreakability() {
    for(let i = 0; i < numCubes; i++) {
        curXPos = activeCubes[i].mesh.position.x;
        curYPos = activeCubes[i].mesh.position.y;
        //check if cursor is in proper relative position to the block
        const rotated = rotatePoint(getX(cursorX), getY(cursorY), curXPos, curYPos, -activeCubes[i].mesh.rotation.z);
        const x = rotated[0];
        const y = rotated[1];
        //console.log(getX(cursorX), getY(cursorY), curXPos, curYPos, x, y);
        const direction = activeCubes[i].direction;

        if(direction == 0 && y > curYPos + blockSize / 2) { //need cursor to be above
            activeCubes[i].breakable = true;
        } else if(direction == 1 && x > curXPos + blockSize / 2) { //need cursor to be to the right
            activeCubes[i].breakable = true;
        } else if(direction == 2 && y < curYPos - blockSize / 2) { //need cursor to be under
            activeCubes[i].breakable = true;
        }  else if(direction == 3 && x < curXPos - blockSize / 2) { //need cursor to be to the left
            activeCubes[i].breakable = true;
        } else if(activeCubes[i].breakable && Math.abs(curXPos - getX(cursorX)) <= 1 && Math.abs(curYPos - getY(cursorY)) <= 1) { //previously breakable and in box
            activeCubes[i].breakable = true;
        } else {
            activeCubes[i].breakable = false;
        }
        // if(activeCubes[i].breakable) {
        //     console.log(activeCubes[i].breakable);
        // }
    }
}

function frameDebug() {
    //console.log("X Pos on Plane: " + getX(cursorX));
    //console.log("Y Pos on Plane: " + getY(cursorY));
}

function animate() {
    requestAnimationFrame(animate);
    moveAllCubes();
    destroyPastBlocks();
    checkPlaneIntersections();
    checkBreakability();
    renderer.render(scene, camera);
}

init();
//addLight(7);
makeBlockButton.addEventListener('click', addNewBlock);
animate();




