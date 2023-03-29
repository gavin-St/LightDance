const cv = require('./opencv.js');
const pi = 3.1415926535897932384626

function circularity(area, perimeter) {
    return (4 * pi * area) / (perimeter * perimeter);
}

function get_brightest_point(img) {

    //grayscale and blur image

    const grayscaled = cv.cvtColor(img, cv.COLOR_BGR2GRAY);
    const blurred = cv.medianBlur(grayscaled, 21);

    const min_max_info = cv.minMaxLoc(blurred);
    const brightest_value = min_max_info[1];

    console.log(brightest_value);

    // any pixel >= 200 is set to white (255) and any < 200 are set to black

    let brightest_only = cv.threshold(blurred, brightest_value-3, 255, cv.THRESH_BINARY)[1];

    //remove small areas/noise

    brightest_only = cv.erode(brightest_only, null, iterations=2);
    brightest_only = cv.dilate(brightest_only, null, iterations=4);

    //find contours

    const contours = cv.findContours(brightest_only, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE);
    const hierarchy = cv.findContours(brightest_only, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE);

    const num_contours = contours.length;

    //initialize to smallest possible

    let max_circ = 0;
    let most_circ_contour = null;

    //find contour with max circularity

    for(let i = 0; i < contours.length; i++) {
        const contour = contours[i];
        const area = cv.contourArea(contour);
        const perim = cv.arcLength(contour, true);
        const circ = circularity(area, perim);
        if(circ > max_circ || i == 0) {
            most_circ_contour = contour;
            max_circ = circ;
        }
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
    }

    const brightest_point_info = new Map();
    brightest_point_info.set("center_x", centerX);
    brightest_point_info.set("center_y", centerY);

    return brightest_point_info;
}

function print_brightest_point(img) {
    const brightest_point = get_brightest_point(img);
    const centerX = brightest_point['center_x'];
    const centerY = brightest_point['center_y'];

    cv.circle(img, (centerX, centerY), 7, (125, 125, 125), -1);
}


export default get_brightest_point;