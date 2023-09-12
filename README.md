# Light Dance

Light Dance is a recreation of the VR rhythm game [Beat Saber](https://beatsaber.com/) using OpenCV and Three.js. In Beat Saber, VR controllers are used to slice through blocks that are synchronized to the beat of music. Also, there are arrow indicators that tell you which direction to slice each block. In Light Dance, we replaced the VR controllers with OpenCV motion sensors, creating a version of Beat Saber that does not require the use of VR. Instead, all that is needed is any flashlight, such as your mobile phone's flashlight, and a webcam on your computer. We use computer vision to detect where the light is on the flashlight, and you can use your flashlight to slice through blocks!

## Video Demo

## Map Upload

Light Dance has the functionality of adding custom maps. On the home screen, you will see the option to add a map. All you need to do is provide a name for the map and a valid map file, then click submit when you are ready.

### Map File Format

The map file should be an array of block objects. Each object has the property time, x, y, and rotation.

- **Time:** The time in seconds that the block should appear on the screen.
- **x:** The x position on the screen that the block should appear. The center of the screen is x = 0, and going left to right increases the x value. x is bounded by [-5, 5].
- **y:** The y position on the screen that the block should appear. The center of the screen is y = 0, and going bottom to top increases the y value. y is bounded by [-5, 5].
- **Rotation:** The rotation of the block in degrees. The value provided will rotate the block counterclockwise.

### Example of a Valid File

```
[
    {
        "time": 5.32,
        "x": -2, 
        "y": 0,
        "rotation": 270
    },
    {
        "time": 6.242,
        "x": 2, 
        "y": 0,
        "rotation": 90
    },
    {
        "time": 7.098,
        "x": 0, 
        "y": -3,
        "rotation": 0
    }
]
```

## Built With

- [OpenCV](https://opencv.org/)
- [Three.js](https://threejs.org/)
- JavaScript
- HTML
- CSS

## Installation

1. Clone the repo
   ```sh
   git clone https://github.com/UncreativeName1/LightDance
   ```
2. Navigate to the repo on your local machine and double click the index.html file
