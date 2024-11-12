const gameContainer = document.querySelector('.game-container');
const bird = document.getElementById('bird');
const scoreDisplay = document.getElementById('score');
let birdTop = 200;
let gravity = 2;
let isGameOver = false;
let score = 0;
let pipes = [];
const birdJumpStrength = 40;
const birdMaxHeight = 0;

function startGame() {
    bird.style.top = birdTop + 'px';
    createPipe();
    gameLoop();
}

function gameLoop() {
    if (isGameOver) return;

    // Apply gravity to bird
    if (birdTop < gameContainer.offsetHeight - bird.offsetHeight) {
        birdTop += gravity;
    } else {
        birdTop = gameContainer.offsetHeight - bird.offsetHeight;
    }
    bird.style.top = birdTop + 'px';

    // Move pipes and detect collisions
    pipes.forEach((pipeSet, index) => {
        pipeSet.x -= 2;
        pipeSet.topPipe.style.left = pipeSet.x + 'px';
        pipeSet.bottomPipe.style.left = pipeSet.x + 'px';

        if (pipeSet.x + pipeSet.width < 0) {
            // Remove off-screen pipes and update score
            pipeSet.topPipe.remove();
            pipeSet.bottomPipe.remove();
            pipes.splice(index, 1);
            score++;
            scoreDisplay.textContent = 'Score: ' + score;
            createPipe();
        }

        if (detectCollision(pipeSet)) {
            endGame();
        }
    });

    // Game Over condition if bird hits top or bottom of screen
    if (birdTop > gameContainer.offsetHeight - bird.offsetHeight || birdTop < birdMaxHeight) {
        endGame();
    } else {
        requestAnimationFrame(gameLoop);
    }
}

function createPipe() {
    const pipeHeight = Math.floor(Math.random() * 200) + 100;
    const gap = 150;
    const pipeX = 400;

    // Create top pipe
    const pipeTop = document.createElement('div');
    pipeTop.classList.add('pipe', 'pipe-top');
    pipeTop.style.height = pipeHeight + 'px';
    pipeTop.style.left = pipeX + 'px';
    gameContainer.appendChild(pipeTop);

    // Create bottom pipe
    const pipeBottom = document.createElement('div');
    pipeBottom.classList.add('pipe', 'pipe-bottom');
    pipeBottom.style.height = gameContainer.offsetHeight - pipeHeight - gap + 'px';
    pipeBottom.style.left = pipeX + 'px';
    gameContainer.appendChild(pipeBottom);

    // Add pipes to the array as a set
    pipes.push({
        x: pipeX,
        width: 60,
        topHeight: pipeHeight,
        gap: gap,
        topPipe: pipeTop,
        bottomPipe: pipeBottom,
    });
}

function detectCollision(pipeSet) {
    const birdRect = bird.getBoundingClientRect();
    const topPipeRect = pipeSet.topPipe.getBoundingClientRect();
    const bottomPipeRect = pipeSet.bottomPipe.getBoundingClientRect();

    return (
        birdRect.right > topPipeRect.left &&
        birdRect.left < topPipeRect.right &&
        (birdRect.top < topPipeRect.bottom || birdRect.bottom > bottomPipeRect.top)
    );
}

function endGame() {
    isGameOver = true;
    alert('Game Over! Your final score is: ' + score);
    location.reload();
}

// Add event listener for mouse click to make the bird jump
gameContainer.addEventListener('click', () => {
    if (!isGameOver) {
        if (birdTop - birdJumpStrength >= birdMaxHeight) {
            birdTop -= birdJumpStrength;
        }
    }
});

startGame();
