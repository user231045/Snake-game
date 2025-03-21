let snakeColor = '#414141'; // Default snake color

//reference html elements
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');

//setting up game variables
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let direction = 'right';
let highScore = 0;
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;
let ateFood = false;

//drawing the game board, snake, and food
function draw() {
    board.innerHTML = '';
    drawSnake();
    drawFood();
    updateScore();
}

//drawing the snake; allows for snake color to be changed
function drawSnake() {
    snake.forEach((segment) => {
        const snakeElement = createGameElement('div', 'snake');
        snakeElement.style.backgroundColor = snakeColor;
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
    });
}

//creating a game element
function createGameElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

//setting the position of the snake and food on the game board
function setPosition(element, position) {
    element.style.gridRow = position.x;
    element.style.gridColumn = position.y;
}

//drawing the food and playing the eat sound only when the snake eats the food
function drawFood() {
    if (gameStarted) {
        const foodElement = createGameElement('div', 'food');
        setPosition(foodElement, food);
        board.appendChild(foodElement);
        if (ateFood) {
            playEatSound();
            ateFood = false;
        }
    }
}

//function to play the eat sound
function playEatSound() {
    const eatSound = document.getElementById('eatSound');
    eatSound.play();
}

//generating the food at random coordinates on the game board and ensuring that the food does not appear on the snake
function generateFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * gridSize) + 1,
            y: Math.floor(Math.random() * gridSize) + 1,
        };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));

    return newFood;
}

//moving the snake and givung the snake instructions on what to do when it hits the wall or itself, also increasing the speed of the snake as it eats more food
function move() {
    const head = { ...snake[0] };
    switch (direction) {
        case 'up':
            head.x--;
            break;
        case 'down':
            head.x++;
            break;
        case 'left':
            head.y--;
            break;
        case 'right':
            head.y++;
            break;
    }
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        ateFood = true; // Set the flag to true when the snake eats the food
        food = generateFood();
        increaseSpeed();
        clearInterval(gameInterval);
        gameInterval = setInterval(() => {
            move();
            checkCollision();
            draw();
        }, gameSpeedDelay);
    } else {
        snake.pop();
    }
}

//starting the game and allowing the snake to move in the direction of the arrow keys
function startGame() {
    const selectedColor = document.getElementById('snake-color').value;
    snakeColor = selectedColor; // Assuming you add a variable for snake color
    gameStarted = true;
    instructionText.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

//handling the key press events and allowing the snake to move in the direction of the arrow keys
function handleKeyPress(event) {
    console.log('Key pressed:', event.key);
    if (!gameStarted && (event.keyCode === 32 || event.key === ' ')) {
        startGame();
    } else {
        switch (event.key) {
            case 'ArrowUp':
                direction = 'up';
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowLeft':
                direction = 'left';
                break;
            case 'ArrowRight':
                direction = 'right';
                break;
        }
    }
}

//adding event listeners to the document and handling the key press events
document.addEventListener('keydown', handleKeyPress);

//increasing the speed of the snake as it eats more food; the snake will move faster as it eats more food and the game speed delay will decrease
function increaseSpeed() {
    if (gameSpeedDelay > 150) {
        gameSpeedDelay -= 5;
    } else if (gameSpeedDelay > 100) {
        gameSpeedDelay -= 3;
    } else if (gameSpeedDelay > 50) {
        gameSpeedDelay -= 2;
    } else if (gameSpeedDelay > 25) {
        gameSpeedDelay -= 1;
    }
}

//checking for collision with the wall or itself and resetting the game if the snake hits the wall or itself; also playing the game over sound
function checkCollision() {
    const head = snake[0];

    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
        resetGame();
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
        }
    }
}

//function to play the game over sound when the snake hits the wall or itself
function playGameOverSound() {
    const gameOverSound = document.getElementById('gameOverSound');
    gameOverSound.play();
}

//resetting the game when the snake hits the wall or itself and updating the high score only if the current score is higher than the high score
function resetGame() {
    playGameOverSound(); // Play game over sound
    updateHighScore();
    stopGame();
    snake = [{ x: 10, y: 10 }];
    food = generateFood();
    direction = 'right';
    gameSpeedDelay = 200;
    updateScore();
}

//updating the score as the snake eats more food 
function updateScore() {
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3, '0');
}

//stopping the game when the snake hits the wall or itself and displaying the instruction text and logo
function stopGame() {
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = 'block';
    logo.style.display = 'block';
}

//updating the high score only if the current score is higher than the high score 
function updateHighScore() {
    const currentScore = snake.length - 1;
    if (currentScore > highScore) {
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3, '0');
    }
    highScoreText.style.display = 'block';
}