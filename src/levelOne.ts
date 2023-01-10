import * as THREE from 'three'
import mainLevel from './scenes/main-level'

const width = window.innerWidth
const height = window.innerHeight

const renderer = new THREE.WebGLRenderer({
	canvas: document.getElementById('app') as HTMLCanvasElement
})
renderer.setSize(width, height)
//const mainCamera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100)
//field of view, aspect ratio, near plane, far plane
const camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
        camera.position.set(0, 0, 150);


let scene = new mainLevel()
scene.initialize()

function tick()
{
	const returnedValue = scene.update();
	if(returnedValue == 1){
		window.location.href= "../../index.html";
	}
	else{
		renderer.render(scene, camera)
		requestAnimationFrame(tick)
	}
}

tick()