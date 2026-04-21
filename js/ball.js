class Ball {
    constructor(gameScreen, size) {
        this.gameScreen = gameScreen;
        this.size = size;

        this.left = 0;
        this.top = 0;

        this.baseSpeedX = 3;
        this.baseSpeedY = -4;

        this.speedX = this.baseSpeedX;
        this.speedY = this.baseSpeedY;

        this.acceleration = 1.0008;
        this.maxSpeed = 9;

        this.isLaunched = false;

        this.element = document.createElement("img");
        this.element.className = "ball";
        this.element.src = "../images/Ball.png";

        this.element.style.width = this.size + "px";
        this.element.style.height = this.size + "px";

        this.updatePosition();
        this.gameScreen.appendChild(this.element);
    }

    updatePosition() {
        this.element.style.left = this.left + "px";
        this.element.style.top = this.top + "px";
    }

    stickToPlayer(player) {
        this.left = player.left + (player.width / 2) - (this.size / 2);
        this.top = player.top - this.size - 2;
        this.updatePosition();
    }

    resetOnPlayer(player) {
        this.isLaunched = false;
        this.speedX = this.baseSpeedX;
        this.speedY = this.baseSpeedY;
        this.stickToPlayer(player);
    }

    launch() {
        if (this.isLaunched) {
            return;
        }

        this.isLaunched = true;
    }

    move() {
        if (!this.isLaunched) {
            return;
        }

        this.left += this.speedX;
        this.top += this.speedY;

        const currentSpeed = Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY);

        if (currentSpeed < this.maxSpeed) {
            this.speedX *= this.acceleration;
            this.speedY *= this.acceleration;
        }

        this.updatePosition();
    }
}