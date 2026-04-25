class Player {
    constructor(gameScreen, left, top, width, height, gameWidth) {
        this.gameScreen = gameScreen;
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
        this.gameWidth = gameWidth;

        this.speed = 6;
        this.directionX = 0;

        this.element = document.createElement("img");
        this.element.className = "player";
        this.element.src = "./images/Paddle.png";

        this.element.style.width = this.width + "px";
        this.element.style.height = this.height + "px";

        this.updatePosition();
        this.gameScreen.appendChild(this.element);
    }

    updatePosition() {
        this.element.style.left = this.left + "px";
        this.element.style.top = this.top + "px";
    }

    move() {
        this.left += this.directionX * this.speed;

        if (this.left < 0) {
            this.left = 0;
        }

        if (this.left + this.width > this.gameWidth) {
            this.left = this.gameWidth - this.width;
        }

        this.updatePosition();
    }

    resetPosition(left, top) {
        this.left = left;
        this.top = top;
        this.directionX = 0;
        this.updatePosition();
    }
}
