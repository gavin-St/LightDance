let mapIndex = 0;


function validJSON(json) {
    try {
        JSON.parse(json); // Array of Objects.
    } catch {
        return false;
    }
    return true;
}

sessionStorage.setItem("Active Map", "");
document.getElementById(`choose-map`).addEventListener("change", (e) => {
    let mapName = document.getElementById(`choose-map`).value;
    if(mapName === "random") {
        sessionStorage.setItem("Active Map", "");
        // window.location.href = "/";
    } else {
        fetch(`../test_maps/${mapName}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }
            return response.text();
        })
        .then(fileContent => {
            console.log("file successfully read");
            console.log(fileContent);
            console.log(validJSON(fileContent));
            sessionStorage.setItem("Active Map", mapName);
            sessionStorage.setItem(mapName, fileContent);
            // window.location.href = "/";
        })
        .catch(err => {
            console.log("file does not exist in json folder");
            sessionStorage.setItem("Active Map", mapName);
            console.log(err);
        });
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