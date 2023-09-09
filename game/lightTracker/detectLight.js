const pi = 3.1415926535897932384626;
const intensityThreshold = 200; 
const sizeThreshold = 5000; 

function circularity(area, perimeter) {
    return (4 * pi * area) / (perimeter * perimeter);
}

const getBrightestPoint = (img) => {

    //grayscale and blur image
    let grayscaled = new cv.Mat();
    cv.cvtColor(img, grayscaled, cv.COLOR_BGR2GRAY);
    let blurred = new cv.Mat();
    cv.medianBlur(grayscaled, blurred, 21);

    const min_max_info = cv.minMaxLoc(blurred);
    const brightest_value = min_max_info.maxVal;
    console.log(brightest_value)    

    if (brightest_value < intensityThreshold) {
        console.log("Light intensity below threshold");
        return null;  // or however you want to handle this
    }

    // any pixel >= 200 is set to white (255) and any < 200 are set to black
    let brightest_only = new cv.Mat();
    cv.threshold(blurred, brightest_only, brightest_value-3, 255, cv.THRESH_BINARY);

    //remove small areas/noise
    let kernel = new cv.Mat();
    cv.erode(brightest_only, brightest_only, kernel, new cv.Point(-1, -1), 2);
    cv.dilate(brightest_only, brightest_only, kernel, new cv.Point(-1, -1), 4);
    kernel.delete();

    //find contours
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(brightest_only, contours, hierarchy, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE);

    //initialize to smallest possible
    let max_circ = 0;
    let most_circ_contour = new cv.Mat();

    //find contour with max circularity
    let validContourFound = false;
    for(let i = 0; i < contours.size(); i++) {
        const contour = contours.get(i);
        const area = cv.contourArea(contour);
        console.log("area",area)
        // Check area size
        // if (area > sizeThreshold) {
        //     console.log("AREA TOO BIG")
        //     continue;
        // }

        const perim = cv.arcLength(contour, true);
        const circ = circularity(area, perim);
        if(circ > max_circ || i == 0) {
            most_circ_contour = contour;
            max_circ = circ;
            validContourFound = true;
        }
    }
    // Check if no valid contour was found
    if (!validContourFound) {
        return null;
    }


    //centroid of the most circular moment
    const img_moment = cv.moments(most_circ_contour);

    let centerX = 0;
    let centerY = 0;

    if(img_moment["m00"] != 0) {
        centerX = Math.floor(img_moment["m10"]/img_moment["m00"]);
        centerY = Math.floor(img_moment["m01"]/img_moment["m00"]);
    } else {
        console.log("ERROR");
        return null;
    }

    const brightest_point_info = {"center_x": centerX, "center_y": centerY};
    
    grayscaled.delete();
    blurred.delete();
    brightest_only.delete();
    hierarchy.delete();
    contours.delete();
    most_circ_contour.delete();

    return brightest_point_info;
}

function printBrightestPoint(img) {
    const brightest_point = getBrightestPoint(img);
    const centerX = brightest_point['center_x'];
    const centerY = brightest_point['center_y'];

    cv.circle(img, (centerX, centerY), 7, (125, 125, 125), -1);
}


export default getBrightestPoint;