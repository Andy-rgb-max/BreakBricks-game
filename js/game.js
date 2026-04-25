class Game {
    constructor() {
        this.startScreen = document.querySelector("#game-intro");
        this.gameScreen = document.querySelector("#game-screen");
        this.endScreen = document.querySelector("#game-end");
        this.gameContainer = document.querySelector("#game-container");

        this.scoreboard = document.querySelector("#score");
        this.finalScoreboard = document.querySelector("#final-score");

        this.livesContainer = document.querySelector(".right");
        this.heartElements = document.querySelectorAll(".heart-logo");

        this.width = 500;
        this.height = 600;

        this.player = null;
        this.ball = null;
        this.bricks = [];

        this.score = 0;
        this.lives = 3;

        this.gameIsOver = false;
        this.gameIntervalId = null;

        this.playerWidth = 110;
        this.playerHeight = 20;
        this.playerStartLeft = (this.width / 2) - (this.playerWidth / 2);
        this.playerStartTop = this.height - 40;

        this.hitSound = new Audio("./sounds/beep.wav");
        this.breakSound = new Audio("./sounds/boop.wav");
        this.backgroundMusic = new Audio("./sounds/game.wav");
        this.endSound = new Audio("./sounds/end.wav");

        this.hitSound.volume = 0.6;
        this.breakSound.volume = 0.7;
        this.backgroundMusic.volume = 0.05;
        this.backgroundMusic.loop = true;
        this.endSound.volume = 0.5;

    }

    start() {
        this.startScreen.style.display = "none";
        this.startNewGame();
        this.startBackgroundMusic();
    }

    restart() {
        this.endScreen.style.display = "none";
        this.startNewGame();
        this.startBackgroundMusic();
    }

    startNewGame() {
        if (this.gameIntervalId) {
            clearInterval(this.gameIntervalId);
            this.gameIntervalId = null;
        }

        this.gameScreen.style.width = this.width + "px";
        this.gameScreen.style.height = this.height + "px";

        this.gameScreen.style.display = "block";
        this.endScreen.style.display = "none";

        this.score = 0;
        this.lives = 3;
        this.gameIsOver = false;

        this.updateScore();
        this.updateLivesDisplay();

        this.clearOldGameElements();
        this.createPlayer();
        this.createBall();
        this.createBricks();

        this.gameIntervalId = setInterval(() => {
            this.gameLoop();
        }, 1000 / 60);
    }

    clearOldGameElements() {
        const oldElements = this.gameScreen.querySelectorAll(".player, .ball, .brick");
        oldElements.forEach((element) => {
            element.remove();
        });
    }

    createPlayer() {
        this.player = new Player(
            this.gameScreen,
            this.playerStartLeft,
            this.playerStartTop,
            this.playerWidth,
            this.playerHeight,
            this.width
        );
    }

    createBall() {
        this.ball = new Ball(this.gameScreen, 18);
        this.ball.resetOnPlayer(this.player);
    }

    createBricks() {
        this.bricks = [];

        const brickRows = [
            {
                fluo: "./images/Vert fluo.png",
                normal: "./images/Vert.png"
            },
            {
                fluo: "./images/Orange fluo.png",
                normal: "./images/Orange.png"
            },
            {
                fluo: "./images/jaune fluo.png",
                normal: "./images/jaune.png"
            },
            {
                fluo: "./images/Bleu fluo.png",
                normal: "./images/Bleu.png"
            }
        ];

        const columns = 8;
        const brickHeight = 24;
        const gap = 8;
        const sidePadding = 10;
        const topOffset = 70;

        const brickWidth = (this.width - (sidePadding * 2) - (gap * (columns - 1))) / columns;

        for (let row = 0; row < brickRows.length; row++) {
            for (let column = 0; column < columns; column++) {
                const left = sidePadding + column * (brickWidth + gap);
                const top = topOffset + row * (brickHeight + gap);

                const brick = new Brick(
                    this.gameScreen,
                    left,
                    top,
                    brickWidth,
                    brickHeight,
                    brickRows[row].fluo,
                    brickRows[row].normal
                );

                this.bricks.push(brick);
            }
        }
    }

    gameLoop() {
        this.update();

        if (this.gameIsOver) {
            clearInterval(this.gameIntervalId);
            this.gameIntervalId = null;

            this.gameScreen.style.display = "none";
            this.endScreen.style.display = "block";
            this.updateFinalScore();
        }
    }

    update() {
        this.player.move();

        if (this.ball.isLaunched) {
            this.ball.move();

            this.handleWallCollisions();
            this.handlePlayerCollision();
            this.handleBrickCollisions();
            this.checkIfBallIsLost();
        } else {
            this.ball.stickToPlayer(this.player);
        }
    }

    handleWallCollisions() {
        if (this.ball.left <= 0) {
            this.ball.left = 0;
            this.ball.speedX = Math.abs(this.ball.speedX);
        }

        if (this.ball.left + this.ball.size >= this.width) {
            this.ball.left = this.width - this.ball.size;
            this.ball.speedX = -Math.abs(this.ball.speedX);
        }

        if (this.ball.top <= 0) {
            this.ball.top = 0;
            this.ball.speedY = Math.abs(this.ball.speedY);
        }

        this.ball.updatePosition();
    }

    handlePlayerCollision() {
        if (!this.isColliding(this.ball, this.player)) {
            return;
        }

        if (this.ball.speedY > 0) {
            this.ball.top = this.player.top - this.ball.size;

            const ballCenter = this.ball.left + this.ball.size / 2;
            const playerCenter = this.player.left + this.player.width / 2;
            const hitPosition = (ballCenter - playerCenter) / (this.player.width / 2);

            this.ball.speedX = hitPosition * 5;
            this.ball.speedY = -Math.abs(this.ball.speedY);

            if (Math.abs(this.ball.speedY) < 4) {
                this.ball.speedY = -4;
            }

            this.ball.updatePosition();
        }
    }

    handleBrickCollisions() {
        for (let i = 0; i < this.bricks.length; i++) {
            const brick = this.bricks[i];

            if (this.isColliding(this.ball, brick)) {
                this.bounceBallOnBrick(brick);

                const result = brick.hit();
                this.score += result.points;
                this.updateScore();

                if (result.destroyed) {
                    this.playEffectSound(this.breakSound);
                    this.bricks.splice(i, 1);
                } else {
                    this.playEffectSound(this.hitSound);
                }

                break;
            }
        }
    }

    bounceBallOnBrick(brick) {
        const ballCenterX = this.ball.left + this.ball.size / 2;
        const ballCenterY = this.ball.top + this.ball.size / 2;
        const brickCenterX = brick.left + brick.width / 2;
        const brickCenterY = brick.top + brick.height / 2;

        const dx = ballCenterX - brickCenterX;
        const dy = ballCenterY - brickCenterY;

        const combinedHalfWidths = (this.ball.size / 2) + (brick.width / 2);
        const combinedHalfHeights = (this.ball.size / 2) + (brick.height / 2);

        const overlapX = combinedHalfWidths - Math.abs(dx);
        const overlapY = combinedHalfHeights - Math.abs(dy);

        if (overlapX < overlapY) {
            if (dx > 0) {
                this.ball.left = brick.left + brick.width;
            } else {
                this.ball.left = brick.left - this.ball.size;
            }

            this.ball.speedX *= -1;
        } else {
            if (dy > 0) {
                this.ball.top = brick.top + brick.height;
            } else {
                this.ball.top = brick.top - this.ball.size;
            }

            this.ball.speedY *= -1;
        }

        this.ball.updatePosition();
    }

    checkIfBallIsLost() {
        if (this.ball.top + this.ball.size >= this.height) {
            this.loseLife();
        }
    }

    loseLife() {
        this.lives--;
        this.updateLivesDisplay();

        if (this.lives <= 0) {
            this.gameIsOver = true;
            
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
            this.playEffectSound(this.endSound);

            return;
        }

        this.player.resetPosition(this.playerStartLeft, this.playerStartTop);
        this.ball.resetOnPlayer(this.player);
    }

    updateScore() {
        this.scoreboard.textContent = this.score;
        this.updateFinalScore();
    }

    updateFinalScore() {
        this.finalScoreboard.textContent = this.score;
    }

    updateLivesDisplay() {
        this.heartElements.forEach((heart, index) => {
            if (index < this.lives) {
                heart.style.display = "block";
            } else {
                heart.style.display = "none";
            }
        });
    }

    startBackgroundMusic() {
        if (this.backgroundMusic.paused) {
            this.backgroundMusic.play().catch(() => {});
        }
    }

    playEffectSound(sound) {
        const soundCopy = sound.cloneNode();
        soundCopy.volume = sound.volume;
        soundCopy.play().catch(() => {});
    }

    isColliding(objectA, objectB) {
        const objectAWidth = objectA.width || objectA.size;
        const objectAHeight = objectA.height || objectA.size;
        const objectBWidth = objectB.width || objectB.size;
        const objectBHeight = objectB.height || objectB.size;

        return (
            objectA.left < objectB.left + objectBWidth &&
            objectA.left + objectAWidth > objectB.left &&
            objectA.top < objectB.top + objectBHeight &&
            objectA.top + objectAHeight > objectB.top
        );
    }
}
