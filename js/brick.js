class Brick {
    constructor(gameScreen, left, top, width, height, fluoImage, normalImage) {
        this.gameScreen = gameScreen;
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;

        this.fluoImage = fluoImage;
        this.normalImage = normalImage;

        this.hitCount = 0;

        this.element = document.createElement("img");
        this.element.className = "brick";
        this.element.src = this.fluoImage;

        this.element.style.width = this.width + "px";
        this.element.style.height = this.height + "px";

        this.updatePosition();
        this.gameScreen.appendChild(this.element);
    }

    updatePosition() {
        this.element.style.left = this.left + "px";
        this.element.style.top = this.top + "px";
    }

    hit() {
        this.hitCount++;

        if (this.hitCount === 1) {
            this.element.src = this.normalImage;
            return {
                points: 1,
                destroyed: false
            };
        }

        if (this.hitCount === 2) {
            this.element.remove();
            return {
                points: 2,
                destroyed: true
            };
        }
    }
}