var GameLoop = function () {
    this.game = new Game();
    this.startTime = 0; // TODO
    this.totalPayout = 0; // TODO
};

GameLoop.prototype.init = function () {

};

GameLoop.prototype.loop = function () {
    this.startTime += 1; // TODO
    this.updateStatus();
};

GameLoop.prototype.start = function (interval) {
    this.init();
    setInterval(this.loop.bind(this), interval);
};

GameLoop.prototype.updateStatus = function () {
    $("#statusString").html("Time: <b>" + this.startTime + "</b>, Total Payout: <b>" + this.totalPayout + "</b>")
};

var game = new GameLoop();
