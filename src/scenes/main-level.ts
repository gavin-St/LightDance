import * as THREE from 'three'

export default class mainLevel extends THREE.Scene{
    
    private readonly keyDown = new Set<string>()
    private curSelect = 0;
    private coords = [{x:-26.5,y:8.1},{x:-51,y: -1.95},{x:-37.5,y:-12}];
    private selector: any;
    private selected = false;

    async initialize(){
        const scene = new THREE.Scene();

        const ambient = new THREE.HemisphereLight(0xffffbb, 0x080820);
        scene.add(ambient);
  
        const light = new THREE.DirectionalLight(0xFFFFFF, 1);
        light.position.set( 1, 10, 6);
        scene.add(light);



        document.addEventListener('keydown', this.handleKeyDown)
		document.addEventListener('keyup', this.handleKeyUp)
    }

    private handleKeyDown = (event: KeyboardEvent) => {
		this.keyDown.add(event.key.toLowerCase())
	}

	private handleKeyUp = (event: KeyboardEvent) => {
        this.keyDown.delete(event.key.toLowerCase())
        if (event.key === 'ArrowDown' || event.key === 's'){
			this.curSelect = (this.curSelect + 1) % 3;
            console.log("down")
		}
        if (event.key === 'ArrowUp' || event.key === 'w'){
			this.curSelect = (this.curSelect + 2) % 3;
            console.log("up")
		}
        if (event.key === 'Enter'){
			this.selected = true;
		}
	}


    update(){
        if(this.selected) return 1
        return -1
    }
}