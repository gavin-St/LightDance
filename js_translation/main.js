import  openCamera  from "./open_camera.js";
import  get_brightest_point  from "./detect_light.js";

let src, dst, gray, cap, faces;
let classifier;
let utils;
let faceCascadeFile;

let color;
const thickness = 9;
// the number of recent frames to keep the movement line on for
const frames_tracked = 10;
let cur_len = 0;
const coords = [];

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

let keepRunning = true;
document.addEventListener('keydown', function(event) {
    if (event.key === 'q' || event.keyCode === 81) { // 81 is the keycode for "q"
        keepRunning = false;
    }
});

function opencvReadyHandler() {
    console.log('OpenCV is now ready!');
    let video = document.getElementById("cam_input"); // video is the id of video tag
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

        if(videoWidth > 0 && videoHeight > 0) {
            console.log(videoWidth, videoHeight)
            src = new cv.Mat(videoHeight, videoWidth, cv.CV_8UC4);
            dst = new cv.Mat(video.height, video.width, cv.CV_8UC1);
            gray = new cv.Mat();
            cap = new cv.VideoCapture(cam_input);
            // faces = new cv.RectVector();
            // classifier = new cv.CascadeClassifier();
            // utils = new Utils('errorMessage');
            // faceCascadeFile = 'haarcascade_frontalface_default.xml'; // path to xml
            // utils.createFileFromUrl(faceCascadeFile, faceCascadeFile, () => {
            //     classifier.load(faceCascadeFile); // in the callback, load the cascade from file 
            // });
        } else {
            console.error('Video dimensions are not available yet');
        }

        // Remove the event listener after it's been executed.
        video.removeEventListener('playing', onVideoPlaying);

        // schedule first frame processing.
        setTimeout(processVideo, 10);
    }

    video.addEventListener('playing', onVideoPlaying);

    const FPS = 24;
    function processVideo() {
        if (src) {
            let begin = Date.now();
            // console.log(src)
            // console.log(video.readyState);  // Should be >= 2 (HAVE_CURRENT_DATA) or ideally 4 (HAVE_ENOUGH_DATA)
            // console.log(video.videoWidth, video.videoHeight);  // Should be > 0
            // console.log(src.size());

            let frame = new cv.Mat(video.height, video.width, cv.CV_8UC4);

            cap.read(frame);

            if(!frame) {
                console.log("Stopped receiving stream. Exiting ...");
                return;
            }

            // call image processing function

            const brightest_point = get_brightest_point(frame);
            console.log(brightest_point);
            const x = brightest_point['center_x'];
            const y = brightest_point['center_y'];
            console.log(x);
            const c = new Coord(x, y);
            console.log(c);

            coords.push(c);
            cur_len++;

            const frames_exceeded = cur_len - frames_tracked;

            if(cur_len > frames_tracked) {
                remove_front(coords, frames_exceeded);
                cur_len -= frames_exceeded;
            }

            for(let i = 1; i < cur_len; i++) {
                const prev_x = coords[i].x;
                const prev_y = coords[i].y;
                const cur_x = coords[i - 1].x;
                const cur_y = coords[i - 1].y;
            
                // Convert the coordinates to cv.Point
                let prev_point = new cv.Point(prev_x, prev_y);
                let cur_point = new cv.Point(cur_x, cur_y);
            
                cv.line(frame, prev_point, cur_point, color, thickness);
            }

            //Display the resulting frame
            cv.imshow('canvas_output', frame);
            frame.delete();
            // cap.read(src);
            // src.copyTo(dst);
            // cv.cvtColor(dst, gray, cv.COLOR_RGBA2GRAY, 0);
            // for (let i = 0; i < faces.size(); ++i) {
            //     let face = faces.get(i);
            //     let point1 = new cv.Point(face.x, face.y);
            //     let point2 = new cv.Point(face.x + face.width, face.y + face.height);
            //     cv.rectangle(dst, point1, point2, [255, 0, 0, 255]);
            // }
            // cv.imshow("canvas_output", dst);
            // schedule next one.
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