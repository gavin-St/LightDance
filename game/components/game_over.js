document.addEventListener('gameDone', function() {
    const titleElement = document.getElementById("level_title");
    titleElement.innerHTML = "GAME OVER"; 
    setTimeout(function() {
        window.location.href = '../';
    }, 5000);
}, {once: true});

document.addEventListener('victory', function() {
    const titleElement = document.getElementById("level_title");
    titleElement.innerHTML = "YOU WIN!"; 
    setTimeout(function() {
        window.location.href = '../';
    }, 5000);
}, {once: true});