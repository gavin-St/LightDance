document.addEventListener('introDone', function() {
    const scripts = [
        "utils/initializeScene.js",
        "components/light.js",
        "components/initializeGenerator.js",
        "components/tracker.js",
        "utils/generateBlocks.js",
        "lightTracker/findLightCoords.js"
    ];

    const modules = [   // Specify which scripts are modules
        "components/initializeGenerator.js",
        "components/tracker.js",
        "lightTracker/findLightCoords.js"
    ];

    scripts.forEach(scriptSrc => {
        const script = document.createElement('script');

        script.src = scriptSrc;

        // If the script is a module, set its type accordingly
        if (modules.includes(scriptSrc)) {
            script.type = "module";
        }

        document.body.appendChild(script);
    });
}, {once: true});
