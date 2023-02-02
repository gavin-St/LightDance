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
    activeCubes.push(new THREE.Mesh(blockGeometry, blockMaterial));
    cubesTargetable.push(false);
    numCubes++;

    activeCubes.at(-1).geometry.computeBoundingBox();
    activeCubes.at(-1).rotation.z = rotation;
    activeCubes.at(-1).position.x = x;
    activeCubes.at(-1).position.y = y;
    activeCubes.at(-1).position.z = blockGenerationZCoord;
    scene.add(activeCubes.at(-1));
}

function moveAllCubes() {
    //console.log(activeCubes);
    for (let i = 0; i < numCubes; i++) {
        activeCubes[i].position.z += 0.1;
    }
}

function addNewBlock() {
    tuple = generatePoint(blockGenerationRadius);
    makeCube(tuple[0], tuple[1], tuple[2]);
}

function destroyBlock(index, removeSquare = false) {
    scene.remove(activeCubes[index]);
    activeCubes.splice(index, 1);
    cubesTargetable.splice(index, 1);
    numCubes--;
    if (removeSquare) {
        removeTargetSquare(0);
    }
}

function destroyPastBlocks() {
    for (let i = 0; i < numCubes; i++) {
        if (activeCubes[i].position.z > 10) {
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
        curXPos = activeCubes[i].position.x;
        curYPos = activeCubes[i].position.y;
        curZPos = activeCubes[i].position.z;
        // it is targetable
        if (curZPos >= beginTargetable && curZPos <= endTargetable) {
            console.log("intersecting");
            if (!cubesTargetable[i]) {
                activeCubes[i].material = new THREE.MeshStandardMaterial({color: 0x00ff00});
                drawTargetSquare([curXPos, curYPos], blockSize, blockSize);
            }
            cubesTargetable[i] = true;
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
            activeCubes[i].material = new THREE.MeshStandardMaterial({color: 0xff0000});
            cubesTargetable[i] = false;
            removeTargetSquare(0);
        }
    }
}

function frameDebug() {
    console.log("X Pos on Plane: " + getX(cursorX));
    console.log("Y Pos on Plane: " + getY(cursorY));
}

function animate() {
    //frameDebug();
    // console.log(cubesTargetable);
    // console.log(activeCubes);
    requestAnimationFrame(animate);
    moveAllCubes();
    destroyPastBlocks();
    checkPlaneIntersections();
    renderer.render(scene, camera);
}

// function addPlane() {
//     // planeGeometry = new THREE.PlaneGeometry(2000, 2000, 1, 1);
//     // planeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
//     // plane = new THREE.Mesh(planeGeometry, planeMaterial)
//     // scene.add(plane);
//     plane = new THREE.Plane(new THREE.Vector3(0, 0, 0), 0);
//     const helper = new THREE.PlaneHelper( plane, 1, 0xffffff );
//     scene.add( helper );
// }

init();
//addLight(7);
makeBlockButton.addEventListener('click', addNewBlock);
animate();




