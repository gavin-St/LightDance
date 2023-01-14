
let scene, camera, renderer, geometry, material;

let numCubes = 0;
let activeCubes = [];

const makeBlockButton = document.querySelector("#move_block");


function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    camera.position.z = 5;

    geometry = new THREE.BoxGeometry(2, 2, 2);
    material = new THREE.MeshBasicMaterial({color: 0xff0000});
}

function generatePoint(r) {
    let  randomValue = Math.random() * 2 * Math.PI;
    // x, y, angle
    let tuple = [r * Math.cos(randomValue), r * Math.sin(randomValue), randomValue];
    console.log(randomValue);
    console.log(r * Math.cos(randomValue));
    console.log(r * Math.sin(randomValue));
    return tuple;
}

function makeCube(x = 0, y = 0, z = 0, rotation = 0) {
    activeCubes.push(new THREE.Mesh(geometry, material));
    numCubes++;
    scene.add(activeCubes.at(-1));
    activeCubes.at(-1).rotation.z = rotation;
    activeCubes.at(-1).position.x = x;
    activeCubes.at(-1).position.y = y;
    activeCubes.at(-1).position.z = z;
}

function moveAllCubes() {
    console.log(activeCubes);
    for (let i = 0; i < numCubes; i++) {
        activeCubes[i].position.z += 0.1
    }
}

function addNewBlock() {
    tuple = generatePoint(5);
    makeCube(tuple[0], tuple[1], -10, tuple[2]);
}

function destroyPastBlocks() {
    for (let i = 0; i < numCubes; i++) {
        if (activeCubes[i].position.z > 10) {
            scene.remove(activeCubes[i]);
            activeCubes.splice(i, 1);
            numCubes--;
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    moveAllCubes();
    destroyPastBlocks();
    renderer.render(scene, camera);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

init();

window.addEventListener('resize', onWindowResize, false);
makeBlockButton.addEventListener('click', addNewBlock);


animate();




