const plane = document.getElementById('plane');

// Initial positions and settings
let planePosition = 200; // Starting position from the top of the game div
const step = 10; // Pixels the plane moves up or down per key press
let score = 0; // Player's score
let speed = 5; // Initial speed of the obstacles
let spawnInterval = 2000; // Interval in milliseconds to spawn new WTCs

const obstacles = []; // Array to hold all WTC elements
const bullets = []; // Array to hold bullets
let shootTextDisplayed = true; // Track if the shoot message is displayed
let moveUpTextDisplayed = true; // Track if 'Move Up' message is displayed
let moveDownTextDisplayed = true; // Track if 'Move Down' message is displayed

// Add an event listener to handle key presses
document.addEventListener('keydown', (event) => {
    const game = document.getElementById('game');
    const gameHeight = game.clientHeight;
    const planeHeight = plane.clientHeight;

    if (event.key === 'ArrowUp' || event.key === 'w') {
        // Move the plane up, ensuring it doesn't go above the game boundary
        planePosition = Math.max(0, planePosition - step);

        // Remove the 'Press A to Move Up' text if displayed
        if (moveUpTextDisplayed) {
            const moveUpText = document.getElementById('moveUpText');
            if (moveUpText) {
                moveUpText.remove();
                moveUpTextDisplayed = false;
            }
        }
    } else if (event.key === 'ArrowDown' || event.key === 's') {
        // Move the plane down, ensuring it doesn't go below the game boundary
        planePosition = Math.min(gameHeight - planeHeight, planePosition + step);

        // Remove the 'Press S to Move Down' text if displayed
        if (moveDownTextDisplayed) {
            const moveDownText = document.getElementById('moveDownText');
            if (moveDownText) {
                moveDownText.remove();
                moveDownTextDisplayed = false;
            }
        }
    } else if (event.key === ' ') {
        // Shoot a bullet when space is pressed
        shootBullet();

        // Remove the 'Press Space to Shoot' text if displayed
        if (shootTextDisplayed) {
            const shootText = document.getElementById('shootText');
            if (shootText) {
                shootText.remove();
                shootTextDisplayed = false;
            }
        }
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

    // Randomly decide the WTC size (from 128 to 256)
    const size = Math.floor(Math.random() * (256 - 128 + 1)) + 128;
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

    // Gradually increase speed and reduce spawn interval over time
    speed += 0.001;
    if (spawnInterval > 500) {
        spawnInterval -= 5;
    }

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

    // Create and style the 'Press Space to Shoot' message
    const shootText = document.createElement('div');
    shootText.id = 'shootText';
    shootText.style.position = 'absolute';
    shootText.style.top = '40%';
    shootText.style.left = '50%';
    shootText.style.transform = 'translate(-50%, -50%)';
    shootText.style.fontSize = '30px';
    shootText.style.color = 'red';
    shootText.style.fontFamily = 'Hachicro, "Undertale Battle Font", sans-serif';
    shootText.textContent = "PRESS 'SPACE' TO SHOOT";
    game.appendChild(shootText);

    // Create and style the 'Press A to Move Up' message
    const moveUpText = document.createElement('div');
    moveUpText.id = 'moveUpText';
    moveUpText.style.position = 'absolute';
    moveUpText.style.top = '45%';
    moveUpText.style.left = '50%';
    moveUpText.style.transform = 'translate(-50%, -50%)';
    moveUpText.style.fontSize = '30px';
    moveUpText.style.color = 'blue';
    moveUpText.style.fontFamily = 'Hachicro, "Undertale Battle Font", sans-serif';
    moveUpText.textContent = "PRESS 'A' TO MOVE UP";
    game.appendChild(moveUpText);

    // Create and style the 'Press S to Move Down' message
    const moveDownText = document.createElement('div');
    moveDownText.id = 'moveDownText';
    moveDownText.style.position = 'absolute';
    moveDownText.style.top = '50%';
    moveDownText.style.left = '50%';
    moveDownText.style.transform = 'translate(-50%, -50%)';
    moveDownText.style.fontSize = '30px';
    moveDownText.style.color = 'green';
    moveDownText.style.fontFamily = 'Hachicro, "Undertale Battle Font", sans-serif';
    moveDownText.textContent = "PRESS 'S' TO MOVE DOWN";
    game.appendChild(moveDownText);

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
    setInterval(() => {
        createWTC();
    }, spawnInterval);

    // Start moving the WTCs
    moveWTCs();
    moveBullets();
});
