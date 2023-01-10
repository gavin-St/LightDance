import * as THREE from 'three'

export default class HomeScene extends THREE.Scene{
    
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

        const triShape = new THREE.Shape();
        triShape.moveTo(4.2,6.6);
        triShape.lineTo(10,10)
        triShape.lineTo(4.2,13.4)
        triShape.lineTo(4.2,6.6)

        const extrudeSettings = {
            depth: 8,
            bevelEnabled: false,
            bevelSegments: 2,
            steps: 0,
            bevelSize: 1,
            bevelThickness: 1
        }

        const geometry2 = new THREE.ExtrudeGeometry( triShape, extrudeSettings );
        const material2 = new THREE.MeshBasicMaterial( { color: 0xFFFFFF } );
        this.selector = new THREE.Mesh( geometry2, material2 ) ;
        this.selector.position.x = this.coords[this.curSelect].x;
        this.selector.position.y = this.coords[this.curSelect].y;
        this.add( this.selector );

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
        this.selector.position.x = this.coords[this.curSelect].x;
        this.selector.position.y = this.coords[this.curSelect].y;
        if(this.selected) return this.curSelect
        return -1
    }
}