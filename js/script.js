window.onload = function () {
    const startBtn = document.getElementById("start-btn");
    const restartBtn = document.getElementById("restart-btn");

    let game = null;

    startBtn.addEventListener("click", function () {
        if (!game) {
            game = new Game();
        }

        game.start();
    });

    restartBtn.addEventListener("click", function () {
        if (!game) {
            game = new Game();
        }

        game.restart();
    });

    document.addEventListener("keydown", function (event) {
        if (!game || !game.player) {
            return;
        }

        if (event.key === "ArrowLeft" || event.key === "ArrowRight" || event.code === "Space") {
            event.preventDefault();
        }

        if (event.key === "ArrowLeft") {
            game.player.directionX = -1;
        }

        if (event.key === "ArrowRight") {
            game.player.directionX = 1;
        }

        if (event.code === "Space") {
            game.ball.launch();
        }
    });

    document.addEventListener("keyup", function (event) {
        if (!game || !game.player) {
            return;
        }

        if (event.key === "ArrowLeft" && game.player.directionX < 0) {
            game.player.directionX = 0;
        }

        if (event.key === "ArrowRight" && game.player.directionX > 0) {
            game.player.directionX = 0;
        }
    });
};