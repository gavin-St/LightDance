document.addEventListener('introDone', function() {
    const scripts = [
        "utils/initializeScene.js",
        "components/initializeGenerator.js"
    ];

    const modules = [   // Specify which scripts are modules
        "components/initializeGenerator.js"
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

document.addEventListener('generatorInitialized', function() {
    const scripts = [
        "components/light.js",
        "components/tracker.js",
        "utils/generateBlocks.js",
    ];

    const modules = [   // Specify which scripts are modules
        "components/tracker.js",
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

document.addEventListener('mapReady', function() {
    const script = document.createElement('script');
    script.src = "lightTracker/findLightCoords.js";
    script.type = "module";
    document.body.appendChild(script);
}, {once: true})
