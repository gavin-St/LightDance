let blockGeometry, blockMaterial;

const makeBlockButton = document.querySelector("#move_block");

class Block {
    targetSquare;
    constructor(mesh, x, y, z, rotation, direction, width, height, depth, rotatePoint) {
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
        scene.add(this.targetSquare);
    }
    #directionIndicator() {
        // Create a yellow material
        const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });

        // Create a circle geometry
        const geometry = new THREE.CircleGeometry(0.25, 32); // Radius of 0.5 and 32 segments

        // Create a mesh (circle) with the material and geometry
        const indicator = new THREE.Mesh(geometry, material);

        // Set the circle's position based on the center coordinates
        let centerX = this.xCoord;
        let centerY = this.yCoord;
        if(this.direction == 0) {
            centerY += 1;
        } else if(this.direction == 1) {
            centerX += 1;
        } else if(this.direction == 2) {
            centerY -= 1;
        } else {
            centerX -= 1;
        }
        const [newX, newY] = this.rotatePoint(centerX, centerY, this.xCoord, this.yCoord, this.mesh.rotation.z);
        indicator.position.set(newX, newY, -9);

        scene.add(indicator);
        this.indicator = indicator;
    }
    showTargetSquare(show = true) {
        this.targetSquare.visible = show;
    }
    incrementIndicator(distance) {
        this.indicator.position.z += distance;
    }
}

class BlockGenerator {
    numCubes; // number of cubes in the scene
    blockArray; // array of Block(), tracking all active blocks in the scene
    blockGenerationBorders; // obj of [beginX, endX, beginY, endY], the borders such that any block generated outside of these will be forced inside
    #blockGeometry;
    #blockMaterial;
    #blockDimensions; // array, [width, height, depth]
    #blockGenerationZCoord; // radius at which to generate blocks (only used for random generation)
    #despawnLimit; // the z coord at which blocks will despawn (to save memory)
    constructor(blockGenerationBorders, blockDimensions, blockGenerationZCoord, despawnLimit) {
        this.numCubes = 0;
        this.blockArray = [];
        this.blockGenerationBorders = blockGenerationBorders;
        this.#blockDimensions = blockDimensions
        this.#blockGenerationZCoord = blockGenerationZCoord;
        this.#despawnLimit = despawnLimit;
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
    generateBlock(x = 0, y = 0, rotation = 0, direction = 0) {
        console.log(`direction: ${direction}`);
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
        this.blockArray.push(new Block(new THREE.Mesh(this.#blockGeometry, this.#blockMaterial), x, y, this.#blockGenerationZCoord, rotation, direction, this.#blockDimensions[0], this.#blockDimensions[0], this.#blockDimensions[0], this._rotatePoint));
        this.numCubes++;
        scene.add(this.blockArray.at(-1).mesh);
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
        scene.remove(this.blockArray[index].targetSquare);
        scene.remove(this.blockArray[index].indicator);
        scene.remove(this.blockArray[index].mesh);
        this.blockArray.splice(index, 1);
        this.numCubes--;
    }
    // destroy all passed blocks
    destroyPastBlocks() {
        for (let i = 0; i < this.numCubes; i++) {
            if (this.blockArray[i].zCoord > this.#despawnLimit) {
                this.destroyBlock(i);
            }
        }
    }
}

class BreakableBlockGenerator extends BlockGenerator {
    #inRangeCenterZCoord; // center Z coordinate of the in-range region for blocks
    #inRangeRadius; // the radius of the in-range region centered at inRangeCenterZCoord
    #beginInRange; // start of in-range region (z-coord)
    #endInRange; // end of in-range region (z-coord)
    constructor(blockGenerationZCoord, despawnLimit, blockGenerationBorders, blockDimensions, inRangeCenterZCoord, inRangeRadius) {
        super(blockGenerationBorders, blockDimensions, blockGenerationZCoord, despawnLimit);
        this.#inRangeCenterZCoord = inRangeCenterZCoord;
        this.#inRangeRadius = inRangeRadius;
        this.#beginInRange = inRangeCenterZCoord - inRangeRadius;
        this.#endInRange = inRangeCenterZCoord + inRangeRadius;
    }

    // check for when blocks become breakable (cursor in correct position to break block)
    checkBreakability() {
        for (let i = 0; i < this.numCubes; i++) {
            let curXPos = this.blockArray[i].xCoord;
            let curYPos = this.blockArray[i].yCoord;
            //check if cursor is in proper relative position to the block
            const rotated = this._rotatePoint(getX(cursorX), getY(cursorY), curXPos, curYPos, -this.blockArray[i].mesh.rotation.z);
            const x = rotated[0];
            const y = rotated[1];
            const direction = this.blockArray[i].direction;
            const height = this.blockArray[i].height;
            const width = this.blockArray[i].width;
            // console.log(`direction: ${direction}`);

            if ((direction == 0 && y > curYPos + height / 2 - 0.05) //need cursor to be above
             || (direction == 1 && x > curXPos + width / 2 - 0.05) //need cursor to be to the right
             || (direction == 2 && y < curYPos - height / 2 + 0.05) //need cursor to be under
             || (direction == 3 && x < curXPos - width / 2 + 0.05) //need cursor to be to the left
             || (this.blockArray[i].breakable && this.blockArray[i].inRange && Math.abs(curXPos - getX(cursorX)) <= width / 2 + 0.05 && Math.abs(curYPos - getY(cursorY)) <= height / 2 + 0.05) //previously breakable and in box
            ) {
                if(!this.blockArray[i].breakable) {
                    console.log("just became breakable");
                    // console.log(`x ${x}`);
                    // console.log(`y ${y}`);
                    // console.log(`curXPos ${curXPos}`);
                    // console.log(`curYPos ${curYPos}`);
                    // console.log(`width ${width}`);
                    // console.log(`height ${height}`);
                }
                this.blockArray[i].breakable = true;
            } else {
                if(this.blockArray[i].breakable) {
                    console.log("not breakable anymore");
                    // console.log(`direction: ${direction}`);
                    // console.log(`x ${x}`);
                    // console.log(`y ${y}`);
                    // console.log(`curXPos ${curXPos}`);
                    // console.log(`curYPos ${curYPos}`);
                    // console.log(`width ${width}`);
                    // console.log(`height ${height}`);
                    // console.log(`x diff ${Math.abs(curXPos - getX(cursorX))}`);
                    // console.log(`y diff ${Math.abs(curYPos - getY(cursorY))}`);
                }
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
                console.log("in range");
                if (!this.blockArray[i].inRange) {
                    // make the block green
                    this.blockArray[i].mesh.material = new THREE.MeshStandardMaterial({color: 0x00ff00});
                    this.blockArray[i].showTargetSquare(true);
                }
                this.blockArray[i].inRange = true;
                const rotated = this._rotatePoint(getX(cursorX), getY(cursorY), curXPos, curYPos, -this.blockArray[i].mesh.rotation.z);
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
                    this.destroyBlock(i);
                }
            } else {
                this.blockArray[i].mesh.material = new THREE.MeshStandardMaterial({color: 0xff0000});
                this.blockArray[i].inRange = false;
                this.blockArray[i].showTargetSquare(false);
            }
        }
    }
}

let generator = new BreakableBlockGenerator(
    blockGenerationZCoord = -10, 
    despawnLimit = 10, 
    blockGenerationBorders = {beginX: -5, endX: 5, beginY: -5, endY: 5}, 
    blockDimensions = [2, 2, 2], 
    inRangeCenterZCoord = 0, 
    inRangeRadius = 1
);

// randomly generates a block on a circle with radius blockGenerationRadius
function randomlyGenerateBlock() {
    let tuple = generator.generatePoint(2);
    generator.generateBlock(tuple[0], tuple[1], tuple[2], tuple[3]);
}

// imaginary plane at which cursor sits on to target blocks, *2.4 since it will be double the radius + a bit more
planeHeight = (generator.blockGenerationBorders.endY - generator.blockGenerationBorders.beginY) / 2 * 2.4;
planeWidth = (generator.blockGenerationBorders.endX - generator.blockGenerationBorders.beginX) / 2 * 2.4;

function animate() {
    requestAnimationFrame(animate);
    generator.moveAllCubes(0.02);
    generator.destroyPastBlocks();
    generator.checkInRange();
    generator.checkBreakability();
    renderer.render(scene, camera);
}

makeBlockButton.addEventListener('click', randomlyGenerateBlock);
animate();




