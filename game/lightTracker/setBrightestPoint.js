import getBrightestPoint from "./detectLight.js";


const FPS = 24;
let src, dst, gray, cap;

let color;
const thickness = 9;
// the number of recent frames to keep the movement line on for
const framesTracked = 10;
let curLen = 0;
const coords = [];

class Coord {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

//remove first n elements from arr
function remove_front(arr, n) {
    if (arr.length < n) {
        return [];
    }
    while (n > 0) {
        arr.shift();
        n--;
    }
    return arr;
}

let keepRunning = true;
document.addEventListener('keydown', function(event) {
    if (event.key === 'q' || event.keyCode === 81) { // 81 is the keycode for "q"
        keepRunning = false;
    }
});

function opencvReadyHandler() {
    console.log('OpenCV is now ready!');
    let video = document.getElementById("cam_input"); // video is the id of video tag
    console.log(video);
    video.width = window.innerWidth;
    video.height = window.innerHeight;
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(function(stream) {
        video.srcObject = stream;
        video.play();
    })
    .catch(function(err) {
        console.log("An error occurred! " + err);
    });
    console.log(cv);
    
    color = new cv.Scalar(0, 255, 0, 255);

    function onVideoPlaying() {
        // Now initialize src
        let videoWidth = video.videoWidth;
        let videoHeight = video.videoHeight;

        if (videoWidth > 0 && videoHeight > 0) {
            console.log(videoWidth, videoHeight)
            src = new cv.Mat(videoHeight, videoWidth, cv.CV_8UC4);
            dst = new cv.Mat(video.height, video.width, cv.CV_8UC1);
            gray = new cv.Mat();
            cap = new cv.VideoCapture(cam_input);
        } else {
            console.error('Video dimensions are not available yet');
        }

        // Remove the event listener after it's been executed.
        video.removeEventListener('playing', onVideoPlaying);

        // schedule first frame processing.
        setTimeout(processVideo, 10);
    }

    video.addEventListener('playing', onVideoPlaying);

    function processVideo() {
        if (src) {
            let begin = Date.now();
            // console.log(src)
            // console.log(video.readyState);  // Should be >= 2 (HAVE_CURRENT_DATA) or ideally 4 (HAVE_ENOUGH_DATA)
            // console.log(video.videoWidth, video.videoHeight);  // Should be > 0
            // console.log(src.size());

            let frame = new cv.Mat(video.height, video.width, cv.CV_8UC4);

            cap.read(frame);

            if (!frame) {
                console.log("Stopped receiving stream. Exiting ...");
                return;
            }

            // call image processing function

            const brightestPoint = getBrightestPoint(frame);
            let xPoint = video.width - brightestPoint['center_x']; // reflect across center of video
            let yPoint = brightestPoint['center_y'];

            if (xPoint > video.width) {
                xPoint = video.width;
            } else if (xPoint < 0) {
                xPoint = 0;
            }
            if (yPoint > video.height) {
                yPoint = video.height;
            } else if (yPoint < 0) {
                yPoint = 0;
            }

            const coord = new Coord(xPoint, yPoint);
            cursorX = coord.x;
            cursorY = coord.y;
            console.log(`${xPoint}, ${yPoint}`);

            coords.push(coord);
            curLen++;

            const framesExceeded = curLen - framesTracked;

            if (curLen > framesTracked) {
                remove_front(coords, framesExceeded);
                curLen -= framesExceeded;
            }

            for (let i = 1; i < curLen; i++) {
                const prevX = coords[i].x;
                const prevY = coords[i].y;
                const curX = coords[i - 1].x;
                const curY = coords[i - 1].y;
            
                // Convert the coordinates to cv.Point
                let prevPoint = new cv.Point(prevX, prevY);
                let curPoint = new cv.Point(curX, curY);
            
                cv.line(frame, prevPoint, curPoint, color, thickness);
            }

            //Display the resulting frame
            cv.imshow('canvas_output', frame);
            frame.delete();
            // check next frame
            if (keepRunning) {
                let delay = 1000/FPS - (Date.now() - begin);
                setTimeout(processVideo, delay);
            }
        }
    }
    // Remove the event listener after it's been executed.
    document.removeEventListener('opencvReady', opencvReadyHandler);
    // schedule first one.
}

document.addEventListener('opencvReady', opencvReadyHandler);