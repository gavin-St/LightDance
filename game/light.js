let backgroundLight, light, centerLight;

function addLight(r) {
    backgroundLight = new THREE.AmbientLight(0xffffff); // soft white light
    scene.add(backgroundLight);
    light = new THREE.PointLight(0xffffff, 1, 50, 2);
    for (let i = 10; i >= -10; i--) {
        light.position.set(0, r, i);
        scene.add(light);
        light.position.set(r, 0, i);
        scene.add(light);
        light.position.set(0, -r, i);
        scene.add(light);
        light.position.set(-r, 0, i);
        scene.add(light);
        light.position.set(0, 0, i);
        scene.add(light);
    }
    centerLight = new THREE.DirectionalLight(0xffffff, 4);
    centerLight.position.set(0, 0, 1);
    scene.add(centerLight);
}

addLight(7);
