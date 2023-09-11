let mapIndex = 0;


function validJSON(json) {
    try {
        JSON.parse(json); // Array of Objects.
    } catch {
        return false;
    }
    return true;
}

const maps = {
    'testing_copy.json': [
        {
            "time": 5,
            "x": 4,
            "y": 0,
            "rotation": 30
        },
        {
            "time": 8,
            "x": 0,
            "y": 4,
            "rotation": 60
        },
        {
            "time": 10,
            "x": 2.5,
            "y": 2.5,
            "rotation": 120
        },
        {
            "time": 12,
            "y": 4,
            "x": 4,
            "rotation": 0
        },
        {
            "time": 12,
            "x": -4,
            "y": 4,
            "rotation": 0
        },
        {
            "time": 14,
            "x": 4,
            "y": 1,
            "rotation": 30
        },
        {
            "time": 15,
            "x": -4,
            "y": 1,
            "rotation": 60
        },
        {
            "time": 16,
            "x": -4,
            "y": -1,
            "rotation": 30
        },
        {
            "time": 17,
            "x": 4,
            "y": -1,
            "rotation": 60
        },
        {
            "time": 20,
            "x": 3,
            "y": 2,
            "rotation": 45
        },
        {
            "time": 20.2,
            "x": 4,
            "y": 0.5,
            "rotation": 38
        },
        {
            "time": 20.4,
            "x": 4,
            "y": -1,
            "rotation": 30
        },
        {
            "time": 20.6,
            "x": 2.5,
            "y": -2.5,
            "rotation": 15
        },
        {
            "time": 20.8,
            "x": 1,
            "y": -4,
            "rotation": 0
        },
        {
            "time": 22,
            "x": -4,
            "y": 0,
            "rotation": 0
        },
        {
            "time": 22.2,
            "x": -4,
            "y": -1,
            "rotation": 30
        },
        {
            "time": 22.4,
            "x": -3,
            "y": -2,
            "rotation": 45
        },
        {
            "time": 22.6,
            "x": -2,
            "y": -3,
            "rotation": 60
        },
        {
            "time": 22.8,
            "x": -1,
            "y": -4,
            "rotation": 75
        },
        {
            "time": 23,
            "x": 0,
            "y": -4,
            "rotation": 90
        },
        {
            "time": 25,
            "x": 4,
            "y": 4,
            "rotation": 45
        },
        {
            "time": 25.4,
            "x": -4,
            "y": -4,
            "rotation": 45
        },
        {
            "time": 25.8,
            "x": -4,
            "y": 4,
            "rotation": 45
        },
        {
            "time": 26.2,
            "x": 4,
            "y": -4,
            "rotation": 45
        },
        {
            "time": 26.6,
            "x": 0,
            "y": 4,
            "rotation": 0
        },
        {
            "time": 27,
            "x": 0,
            "y": -4,
            "rotation": 0
        },
        {
            "time": 27.4,
            "x": 4,
            "y": 0,
            "rotation": 0
        },
        {
            "time": 27.8,
            "x": -4,
            "y": 0,
            "rotation": 0
        }
    ]    
}

sessionStorage.setItem("Active Map", "");
document.getElementById(`choose-map`).addEventListener("change", (e) => {
    let mapName = document.getElementById(`choose-map`).value;
    if(mapName === "random") {
        sessionStorage.setItem("Active Map", "");
        // window.location.href = "/";
    } else {
        if(!maps.hasOwnProperty(mapName)) {
            sessionStorage.setItem("Active Map", mapName);
        } else {
            const fileContent = maps[mapName];
            sessionStorage.setItem("Active Map", mapName);
            sessionStorage.setItem(mapName, JSON.stringify(fileContent));
        }
    }    
});

document.getElementById(`submit_map`).addEventListener("click", () => {
    const errorElement = document.getElementById("error-message");
    if(document.getElementById(`map_file`).files.length === 0) {
        errorElement.textContent = "No File Detected!";
        return;
    }
    let fileToRead = document.getElementById(`map_file`).files[0];
    let mapName = document.getElementById(`map_name`).value;
    if(!mapName) {
        errorElement.textContent = "Map Name is Required.";
        return;
    }
    let fileread = new FileReader();
    fileread.onload = (e) => {
        let content = e.target.result;
        console.log(typeof content);
        if (validJSON(content)) {
            let customMaps = JSON.parse(sessionStorage.getItem("Custom Maps"));

            if(!customMaps) customMaps = [];
            if(customMaps.length >= 5) {
                errorElement.textContent = "You can only add up to 5 maps.";
                return;
            }

            const selectElement = document.getElementById("choose-map");

            const option = document.createElement("option");
            option.value = mapName;
            option.text = mapName;
            selectElement.appendChild(option);
            // set the map object
            sessionStorage.setItem(mapName, content); // error with this save.
            customMaps.push(mapName);
            sessionStorage.setItem("Custom Maps", JSON.stringify(customMaps));
            errorElement.textContent = "Successfully Uploaded Map!";
            document.getElementById(`map_name`).value = "";
            const fileInput = document.getElementById("map_file");
            const newFileInput = document.createElement("input");
            newFileInput.type = "file";
            newFileInput.id = "map_file";

            fileInput.parentNode.replaceChild(newFileInput, fileInput);
        } else {
            errorElement.textContent = "Invalid File!"
            return;
        }
        console.log(sessionStorage);
    };
    fileread.readAsText(fileToRead);
});

const selectElement = document.getElementById("choose-map");
let customMaps = JSON.parse(sessionStorage.getItem("Custom Maps"));
console.log(customMaps);
if(customMaps) {
    customMaps.forEach((map) => {
        const option = document.createElement("option");
        option.value = map;
        option.text = map;
        selectElement.appendChild(option);
    });
}