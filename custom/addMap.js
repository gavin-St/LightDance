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
document.getElementById(`submit_map`).addEventListener("click", () => {
    let fileToRead = document.getElementById(`map_file`).files[0];
    let mapName = document.getElementById(`map_name`).value;
    let output = document.getElementById(`output_text`);
    let fileread = new FileReader();
    let objs = undefined;
    fileread.onload = (e) => {
        let content = e.target.result;
        console.log(typeof content);
        if (validJSON(content)) {
             // set the name of the map
            sessionStorage.setItem("Active Map", mapName);
            // set the map object
            sessionStorage.setItem(mapName, content); // error with this save.
            mapIndex++;
            output.innerHTML = "map read!";
        } else {
            output.innerHTML = "error, failed to read file.";
            return;
        }
        console.log(sessionStorage);
    };
    fileread.readAsText(fileToRead);
});