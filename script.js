const plane = document.getElementById('plane');

// Initial positions and settings
let planePosition = 200; // Starting position from the top of the game div
const step = 10; // Pixels the plane moves up or down per key press
let score = 0; // Player's score
let speed = 5; // Initial speed of the obstacles
let spawnInterval = 2000; // Interval in milliseconds to spawn new WTCs

const obstacles = []; // Array to hold all WTC elements

// Add an event listener to handle key presses
document.addEventListener('keydown', (event) => {
    const game = document.getElementById('game');
    const gameHeight = game.clientHeight;
    const planeHeight = plane.clientHeight;

    if (event.key === 'ArrowUp' || event.key === 'w') {
        // Move the plane up, ensuring it doesn't go above the game boundary
        planePosition = Math.max(0, planePosition - step);
    } else if (event.key === 'ArrowDown' || event.key === 's') {
        // Move the plane down, ensuring it doesn't go below the game boundary
        planePosition = Math.min(gameHeight - planeHeight, planePosition + step);
    }

    // Update the plane's position
    plane.style.top = `${planePosition}px`;
});

// Function to create a new WTC element
function createWTC() {
    const game = document.getElementById('game');
    const wtc = document.createElement('div');
    wtc.classList.add('wtc');
    wtc.style.position = 'absolute';
    wtc.style.width = '128px';
    wtc.style.height = '128px';
    wtc.style.backgroundImage = 'url("assets/twin_towers.png")';
    wtc.style.backgroundSize = 'cover';
    wtc.style.backgroundRepeat = 'no-repeat';
    wtc.style.left = `${game.clientWidth}px`;
    wtc.style.top = `${Math.random() * (game.clientHeight - 128)}px`;
    game.appendChild(wtc);
    obstacles.push(wtc);
}

// Function to move all WTCs
function moveWTCs() {
    const game = document.getElementById('game');
    const planeRect = plane.getBoundingClientRect();

    obstacles.forEach((wtc, index) => {
        const wtcRect = wtc.getBoundingClientRect();
        let wtcPosition = parseInt(wtc.style.left);

        // Move WTC to the left
        wtcPosition -= speed;
        if (wtcPosition < -128) {
            // Remove WTC if it goes off-screen
            game.removeChild(wtc);
            obstacles.splice(index, 1);
        } else {
            wtc.style.left = `${wtcPosition}px`;
        }

        // Check for collision
        if (
            planeRect.right > wtcRect.left &&
            planeRect.left < wtcRect.right &&
            planeRect.bottom > wtcRect.top &&
            planeRect.top < wtcRect.bottom
        ) {
            // Collision detected
            score += 1;
            updateScore();
            game.removeChild(wtc);
            obstacles.splice(index, 1);
        }
    });

    // Gradually increase speed over time
    speed += 0.001;

    // Continue moving
    requestAnimationFrame(moveWTCs);
}

// Function to update the score display
function updateScore() {
    const scoreDisplay = document.getElementById('score');
    scoreDisplay.textContent = `Score: ${score.toString().padStart(5, '0')}`;
}

// Set initial styles and start the game
document.addEventListener('DOMContentLoaded', () => {
    const game = document.getElementById('game');

    // Create and style the score display
    const scoreDisplay = document.createElement('div');
    scoreDisplay.id = 'score';
    scoreDisplay.style.position = 'absolute';
    scoreDisplay.style.top = '10px';
    scoreDisplay.style.right = '10px';
    scoreDisplay.style.fontSize = '50px';
    scoreDisplay.style.color = 'black';
    scoreDisplay.style.fontFamily = 'Hachicro, "Undertale Battle Font", sans-serif';
    scoreDisplay.textContent = `Score: ${score.toString().padStart(5, '0')}`;
    game.appendChild(scoreDisplay);

    // Set the plane styles to use the image
    plane.style.position = 'absolute';
    plane.style.top = `${planePosition}px`;
    plane.style.left = '50px'; // Fixed position from the left of the game div
    plane.style.width = '80px';
    plane.style.height = '80px';
    plane.style.backgroundImage = 'url("assets/plane.png")';
    plane.style.backgroundSize = 'cover';
    plane.style.backgroundRepeat = 'no-repeat';

    // Spawn WTCs at regular intervals
    setInterval(createWTC, spawnInterval);

    // Start moving the WTCs
    moveWTCs();
});
