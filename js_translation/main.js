// let img_input = document.getElementById('input_image');
// let file_input = document.getElementById('file_input');

// file_input.addEventListener('change', (e) => {
//     img_input.src = URL.createObjectURL(e.target.files[0])
// }, false)

// img_input.onload = function() {
//     let mat = cv.imread(img_input);
//     cv.cvtColor(mat, mat, cv.COLOR_RGB2GRAY);
//     cv.imshow('output', mat);
//     mat.delete();
// }

import {open_camera} from "./open_camera.js";

let src;
let dst
let gray
let cap
let faces
let classifier
let utils
let faceCascadeFile

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
    console.log(cv.COLOR_RGBA2GRAY);
    
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
            faces = new cv.RectVector();
            classifier = new cv.CascadeClassifier();
            utils = new Utils('errorMessage');
            faceCascadeFile = 'haarcascade_frontalface_default.xml'; // path to xml
            utils.createFileFromUrl(faceCascadeFile, faceCascadeFile, () => {
                classifier.load(faceCascadeFile); // in the callback, load the cascade from file 
            });
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
            console.log(src)
            console.log(video.readyState);  // Should be >= 2 (HAVE_CURRENT_DATA) or ideally 4 (HAVE_ENOUGH_DATA)
            console.log(video.videoWidth, video.videoHeight);  // Should be > 0
            console.log(src.size());

            cap.read(src);
            src.copyTo(dst);
            cv.cvtColor(dst, gray, cv.COLOR_RGBA2GRAY, 0);
            try {
                classifier.detectMultiScale(gray, faces, 1.1, 3, 0);
                console.log(faces.size());
            } catch(err) {
                console.log(err);
            }
            for (let i = 0; i < faces.size(); ++i) {
                let face = faces.get(i);
                let point1 = new cv.Point(face.x, face.y);
                let point2 = new cv.Point(face.x + face.width, face.y + face.height);
                cv.rectangle(dst, point1, point2, [255, 0, 0, 255]);
            }
            cv.imshow("canvas_output", dst);
            // schedule next one.
            let delay = 1000/FPS - (Date.now() - begin);
            setTimeout(processVideo, delay);
        }
    }
    // Remove the event listener after it's been executed.
    document.removeEventListener('opencvReady', opencvReadyHandler);
    // schedule first one.
}

document.addEventListener('opencvReady', opencvReadyHandler);