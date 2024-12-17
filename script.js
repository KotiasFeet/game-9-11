const plane = document.getElementById('plane');

// Initial positions and settings
let planePosition = 200; // Starting position from the top of the game div
const step = 10; // Pixels the plane moves up or down per key press
let score = 0; // Player's score
let speed = 5; // Initial speed of the obstacles
let spawnInterval = 2000; // Interval in milliseconds to spawn new WTCs

const obstacles = []; // Array to hold all WTC elements
const bullets = []; // Array to hold bullets

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
    } else if (event.key === ' ') {
        // Shoot a bullet when space is pressed
        shootBullet();
    }

    // Update the plane's position
    plane.style.top = `${planePosition}px`;
});

// Function to shoot a bullet
function shootBullet() {
    const game = document.getElementById('game');
    const bullet = document.createElement('div');
    bullet.classList.add('bullet');
    bullet.style.position = 'absolute';
    bullet.style.width = '10px';
    bullet.style.height = '5px';
    bullet.style.backgroundColor = 'red';
    bullet.style.left = '130px'; // Slightly ahead of the plane
    bullet.style.top = `${planePosition + 37}px`; // Align bullet with plane's center
    
    const shootSound = new Audio('assets/shoot_sound.mp3'); // Load sound effect
    shootSound.volume = 1.0; // Loud volume
    shootSound.play();
    
    game.appendChild(bullet);
    bullets.push(bullet);
}

// Function to move bullets
function moveBullets() {
    const game = document.getElementById('game');

    bullets.forEach((bullet, index) => {
        let bulletPosition = parseInt(bullet.style.left);
        bulletPosition += 10; // Move bullet to the right

        if (bulletPosition > game.clientWidth) {
            // Remove bullet if it goes off-screen
            game.removeChild(bullet);
            bullets.splice(index, 1);
        } else {
            bullet.style.left = `${bulletPosition}px`;
        }
    });

    requestAnimationFrame(moveBullets);
}

// Function to create a new WTC element
function createWTC() {
    const game = document.getElementById('game');
    const wtc = document.createElement('div');
    wtc.classList.add('wtc');
    wtc.style.position = 'absolute';

    // Randomly decide the WTC size (128x128 or 256x256)
    const size = Math.random() > 0.5 ? 128 : 256;
    wtc.style.width = `${size}px`;
    wtc.style.height = `${size}px`;

    wtc.style.backgroundImage = 'url("assets/twin_towers.png")';
    wtc.style.backgroundSize = 'cover';
    wtc.style.backgroundRepeat = 'no-repeat';
    wtc.style.left = `${game.clientWidth}px`;
    wtc.style.top = `${Math.random() * (game.clientHeight - size)}px`;
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
        if (wtcPosition < -256) {
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
    moveBullets();
});
