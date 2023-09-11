import { getX, getY } from "../utils/getWorldCoordinates.js";

export class Block {
    targetSquare;
    constructor(sceneObject, mesh, x, y, z, rotation, direction, width, height, depth, rotatePoint) {
        //console.log(sceneObject);
        this.sceneObject = sceneObject;
        this.mesh = mesh;

        this.mesh.geometry.computeBoundingBox();
        this.mesh.position.x = x;
        this.mesh.position.y = y;
        this.mesh.position.z = z;
        this.mesh.rotation.z = rotation;
        this.rotatePoint = rotatePoint;

        this.direction = direction;
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.inRange = false;
        this.breakable = false;
        this.#setTargetSquare();
        this.#directionIndicator();
    }
    get xCoord() {
        return this.mesh.position.x;
    }
    get yCoord() {
        return this.mesh.position.y;
    }
    get zCoord() {
        return this.mesh.position.z;
    }
    // draws a target square for the hitbox of a block
    #setTargetSquare() {
        let square = new THREE.Shape();
        square.moveTo(this.xCoord, this.yCoord);
        square.currentPoint = new THREE.Vector2(this.xCoord - this.width/2, this.yCoord - this.height/2);
        square.lineTo(this.xCoord - this.width/2, this.yCoord + this.height/2);
        square.lineTo(this.xCoord + this.width/2, this.yCoord + this.height/2);
        square.lineTo(this.xCoord + this.width/2, this.yCoord - this.height/2);
        square.lineTo(this.xCoord - this.width/2, this.yCoord - this.height/2);
        let squareGeometry = new THREE.ShapeGeometry(square);
        let squareMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        let squareMesh = new THREE.Mesh(squareGeometry, squareMaterial);
        squareMesh.visible = false;
        this.targetSquare = squareMesh;
        //console.log(this.sceneObject);
        // this.sceneObject.scene.add(this.targetSquare);
    }
    #directionIndicator() {
        let centerX = this.xCoord;
        let centerY = this.yCoord;

        const topLeft = this.rotatePoint(centerX - this.width / 2 + this.width / 10, centerY + this.height / 2, centerX, centerY, this.mesh.rotation.z);
        const topRight = this.rotatePoint(centerX + this.width / 2 - this.width / 10, centerY + this.height / 2, centerX, centerY, this.mesh.rotation.z);

        const triangleGeometry = new THREE.Geometry();
        var v1 = new THREE.Vector3(topLeft[0], topLeft[1], this.mesh.position.z + 1.01);
        var v2 = new THREE.Vector3(topRight[0], topRight[1], this.mesh.position.z + 1.01);
        var v3 = new THREE.Vector3(centerX, centerY, this.mesh.position.z + 1.01);
        triangleGeometry.vertices.push( v1 );
        triangleGeometry.vertices.push( v2 );
        triangleGeometry.vertices.push( v3 );

        triangleGeometry.faces.push(new THREE.Face3(0, 1, 2));
        triangleGeometry.computeFaceNormals();

        const triangleMaterial = new THREE.MeshBasicMaterial({
        color: 0x6edbc5,
        side: THREE.DoubleSide
        });

        const triangle = new THREE.Mesh(triangleGeometry, triangleMaterial);


        this.sceneObject.scene.add(triangle);
        this.indicator = triangle;
    }
    showTargetSquare(show = true) {
        this.targetSquare.visible = show;
    }
    incrementIndicator(distance) {
        this.indicator.position.z += distance;
    }
}

export class BlockGenerator {
    numCubes; // number of cubes in the scene
    blockArray; // array of Block(), tracking all active blocks in the scene
    blockGenerationBorders; // obj of [beginX, endX, beginY, endY], the borders such that any block generated outside of these will be forced inside
    #blockGeometry;
    #blockMaterial;
    #blockDimensions; // array, [width, height, depth]
    #blockGenerationZCoord; // radius at which to generate blocks (only used for random generation)
    _despawnLimit; // the z coord at which blocks will despawn (to save memory)
    sceneObject;
    movementPerSecond;
    constructor(sceneObject, blockGenerationBorders, blockDimensions, blockGenerationZCoord, despawnLimit, movementPerSecond) {
        this.sceneObject = sceneObject;
        this.numCubes = 0;
        this.blockArray = [];
        this.blockGenerationBorders = blockGenerationBorders;
        this.#blockDimensions = blockDimensions
        this.#blockGenerationZCoord = blockGenerationZCoord;
        this._despawnLimit = despawnLimit;
        this.movementPerSecond = movementPerSecond;
        this.#initializeBlockData();
    }

    #initializeBlockData(width = 2, height = 2, depth = 2, blockColor = 0xff0000) {
        this.#blockGeometry = new THREE.BoxGeometry(width, height, depth);
        this.#blockMaterial = new THREE.MeshStandardMaterial({color: blockColor});
    }

    // generates a random point on a circle of radius r
    generatePoint(r) {
        let randomValue = Math.random() * 2 * Math.PI;
        let x = r * Math.cos(randomValue);
        let y = r * Math.sin(randomValue);
        let rotation = Math.random() * 2 * Math.PI;
        let direction = Math.floor(Math.random() * 4);
        // x, y, angle, direction
        return [x, y, rotation, direction];
    }
    // ???
    _rotatePoint(x, y, centerX, centerY, angle) {
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


    // generates a block
    // rotation is in radians
    generateBlock(x = 0, y = 0, rotation = 0, direction = 0) {
        direction = 0;
        // rotation = 0;
        this.blockArray.push();
        if (x < this.blockGenerationBorders.beginX) {
            x = this.blockGenerationBorders.beginX;
        } else if (x > this.blockGenerationBorders.endX) {
            x = this.blockGenerationBorders.endX;
        }
        if (y < this.blockGenerationBorders.beginY) {
            y = this.blockGenerationBorders.beginY;
        } else if (y > this.blockGenerationBorders.endY) {
            y = this.blockGenerationBorders.endY;
        }
        // console.log("IN GEN BLOCK");
        // console.log(this.sceneObject);
        this.blockArray.push(new Block(this.sceneObject, new THREE.Mesh(this.#blockGeometry, this.#blockMaterial), x, y, this.#blockGenerationZCoord, rotation, direction, this.#blockDimensions[0], this.#blockDimensions[0], this.#blockDimensions[0], this._rotatePoint));
        this.numCubes++;
        this.sceneObject.scene.add(this.blockArray.at(-1).mesh);
    }
    // // randomly generates a block on a circle with radius blockGenerationRadius
    // randomlyGenerateBlock() {
    //     console.log(this);
    //     console.log(this.blockGenerationBorders);
    //     let tuple = this._generatePoint((this.blockGenerationBorders[0] + this.blockGenerationBorders[1]) / 2);
    //     this.generateBlock(tuple[0], tuple[1], tuple[2], tuple[3]);
    // }
    // moves all cubes forward distance units in the scene
    moveAllCubes(distance = 0.05) {
        //console.log(this.blockArray);
        for (let i = 0; i < this.numCubes; i++) {
            this.blockArray[i].mesh.position.z += distance;
            this.blockArray[i].incrementIndicator(distance);
        }
    }
    // destroys the block at index
    destroyBlock(index) {
        this.sceneObject.scene.remove(this.blockArray[index].targetSquare);
        this.sceneObject.scene.remove(this.blockArray[index].indicator);
        this.sceneObject.scene.remove(this.blockArray[index].mesh);
        this.blockArray.splice(index, 1);
        this.numCubes--;
    }
    // destroy all passed blocks
    destroyPastBlocks() {
        for (let i = 0; i < this.numCubes; i++) {
            if (this.blockArray[i].zCoord > this._despawnLimit) {
                this.destroyBlock(i);
            }
        }
    }
}

export class BreakableBlockGenerator extends BlockGenerator {
    inRangeCenterZCoord; // center Z coordinate of the in-range region for blocks
    #inRangeRadius; // the radius of the in-range region centered at inRangeCenterZCoord
    #beginInRange; // start of in-range region (z-coord)
    #endInRange; // end of in-range region (z-coord)
    #errorMargin; 
    constructor(sceneObject, blockGenerationBorders, blockDimensions, blockGenerationZCoord, despawnLimit, movementPerSecond, inRangeCenterZCoord, inRangeRadius, errorMargin) {
        super(sceneObject, blockGenerationBorders, blockDimensions, blockGenerationZCoord, despawnLimit, movementPerSecond);
        this.inRangeCenterZCoord = inRangeCenterZCoord;
        this.#inRangeRadius = inRangeRadius;
        this.#beginInRange = inRangeCenterZCoord - inRangeRadius;
        this.#endInRange = inRangeCenterZCoord + inRangeRadius;
        this.#errorMargin = errorMargin;
    }
    destroyBlockAndTrack(index) {
        this.destroyBlock(index)
        totalDestroyed++;
        if(totalDestroyed === mapLength) {
            const gameDoneEvent = new Event('victory');
            document.dispatchEvent(gameDoneEvent);
        }
    }
     // destroy all passed blocks
    destroyPastBlocksAndTrack() {
        for (let i = 0; i < this.numCubes; i++) {
            if (this.blockArray[i].zCoord > this._despawnLimit) {
                this.destroyBlockAndTrack(i);
            }
        }
    }
    // check for when blocks become breakable (cursor in correct position to break block)
    checkBreakability() {
        for (let i = 0; i < this.numCubes; i++) {
            let curXPos = this.blockArray[i].xCoord;
            let curYPos = this.blockArray[i].yCoord;
            //check if cursor is in proper relative position to the block
            const rotated = this._rotatePoint(getX(cursorX, planeWidth), getY(cursorY, planeHeight), curXPos, curYPos, -this.blockArray[i].mesh.rotation.z);
            const x = rotated[0];
            const y = rotated[1];
            const direction = this.blockArray[i].direction;
            const height = this.blockArray[i].height;
            const width = this.blockArray[i].width;
            // console.log(`direction: ${direction}`);

            if ((direction == 0 && y > curYPos + height / 2 - this.#errorMargin) //need cursor to be above
             || (direction == 1 && x > curXPos + width / 2 - this.#errorMargin) //need cursor to be to the right
             || (direction == 2 && y < curYPos - height / 2 + this.#errorMargin) //need cursor to be under
             || (direction == 3 && x < curXPos - width / 2 + this.#errorMargin) //need cursor to be to the left
             || (this.blockArray[i].breakable && this.blockArray[i].inRange && Math.abs(curXPos - getX(cursorX, planeWidth)) <= width / 2 + this.#errorMargin && Math.abs(curYPos - getY(cursorY, planeHeight)) <= height / 2 + this.#errorMargin) //previously breakable and in box
            ) {
                // if(!this.blockArray[i].breakable) {
                //     console.log("just became breakable");
                // }
                this.blockArray[i].breakable = true;
            } else {
                // if(this.blockArray[i].breakable) {
                //     console.log("not breakable anymore");
                // }
                this.blockArray[i].breakable = false;
            }
        }
    }

    // check for when blocks come into range (z-coord region), and if its also breakable + cursor has passed through the block enough, destroy the block
    checkInRange() {
        for (let i = 0; i < this.numCubes; i++) {
            let curXPos = this.blockArray[i].xCoord;
            let curYPos = this.blockArray[i].yCoord;
            let curZPos = this.blockArray[i].zCoord;
            // it is in range
            if (curZPos >= this.#beginInRange && curZPos <= this.#endInRange) {
                // console.log("in range");
                if (!this.blockArray[i].inRange) {
                    // make the block green
                    this.blockArray[i].mesh.material = new THREE.MeshStandardMaterial({color: 0x00ff00});
                    // this.blockArray[i].indicator.material = new THREE.MeshStandardMaterial({
                    //     color: 0x00ff00,
                    //     side: THREE.DoubleSide
                    //     });
                    this.blockArray[i].showTargetSquare(true);
                }
                this.blockArray[i].inRange = true;
                const rotated = this._rotatePoint(getX(cursorX, planeWidth), getY(cursorY, planeHeight), curXPos, curYPos, -this.blockArray[i].mesh.rotation.z);
                const x = rotated[0];
                const y = rotated[1];
                const direction = this.blockArray[i].direction;
                // console.log(`angle: ${-this.blockArray[i].mesh.rotation.z}`);
                // console.log(`cur x pos: ${curXPos}`);
                // console.log(`cur y pos: ${curYPos}`);
                // console.log(`x: ${x}`);
                // console.log(`y: ${y}`);
                //check if it passed through the entire block
                if (this.blockArray[i].breakable && ((direction == 0 && y < curYPos)
                                                  || (direction == 1 && x < curXPos)
                                                  || (direction == 2 && y > curYPos)
                                                  || (direction == 3 && x > curXPos))) {
                    this.destroyBlockAndTrack(i);
                }
            } else {
               // console.log(this.blockArray[i].mesh.material.color.g);
                if(this.blockArray[i].mesh.material.color.g) {
                    const lifeElement = document.getElementById('lives_count');
                    const curLives = parseInt(lifeElement.textContent.split(' ')[1]);
                    lifeElement.textContent = `Lives: ${curLives - 1}`;
                    if(curLives === 1) {
                        setInterval(() => {
                            this.blockArray[i].length = 0;
                            const gameDoneEvent = new Event('gameDone');
                            document.dispatchEvent(gameDoneEvent);
                            while (this.sceneObject.scene.children.length > 0) {
                                this.sceneObject.scene.remove(this.sceneObject.scene.children[0]);
                            }
                        }, 1000);
                    }
                }
                this.blockArray[i].mesh.material = new THREE.MeshStandardMaterial({color: 0xff0000});
                this.blockArray[i].inRange = false;
                this.blockArray[i].showTargetSquare(false);
            }
        }
    }
}



