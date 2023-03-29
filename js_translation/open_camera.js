const get_brightest_point = require('./detect_light.js');
const cv = require('./opencv.js');

class Coord {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

//remove first n elements from arr
function remove_front(arr, n) {
    const arr_len = arr.length;
    if(arr_len < n) {
        return [];
    }
    while(n > 0) {
        arr.shift();
        n--;
    }
    return arr;
}

const color = [0, 255, 0];
const thickness = 9;
// the number of recent frames to keep the movement line on for
const frames_tracked = 10;
let cur_len = 0;

//create video capturing
const vid = cv.VideoCapture(0);
//array of Coords across multiple frames
const coords = [];

if(!vid.isOpened()) {
    console.log("Cannot open camera");
    throw '';
}

// press q to exit the video

while(cv.waitKey(1) & 0xFF != 'q'.charCodeAt(0)) {
    //Get current frame
    let ret = vid.read();
    let frame = vid.read();

    if(!ret) {
        console.log("Stopped receiving stream. Exiting ...");
        break;
    }

    // call image processing function

    const brightest_point = get_brightest_point(frame);
    const x = brightest_point['center_x'];
    const y = brightest_point['center_y'];
    const c = new Coord(x, y);

    coords.push(c);
    cur_len++;

    const frames_exceeded = cur_len - frames_tracked;

    if(cur_len > frames_tracked) {
        remove_front(coords, frames_exceeded);
        cur_len -= frames_exceeded;
    }

    console.log(c);

    for(let i = 1; i < cur_len; i++) {
        const prev_x = coords[i].x;
        const prev_y = coords[i].y;
        const cur_x = coords[i - 1].x;
        const cur_y = coords[i - 1].y;
        prev_point = [prev_x, prev_y];
        cur_point = [cur_x, cur_y];
        cv.line(frame, prev_point, cur_point, color, thickness);
    }

    //Display the resulting frame
    cv.imshow('frame', frame);
}

//release the video
vid.release();
cv.destroyAllWindows();
