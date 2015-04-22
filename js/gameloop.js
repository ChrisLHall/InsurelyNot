var GameLoop = function () {
    this.game = new Game(this);
    this.orderTemplate = $("#orderTemplate");
    this.orderTemplateDisp = this.orderTemplate.css("display");
    this.orderTemplate.css("display", "none");
    console.log(this.orderTemplateDisp);
    this.rowTemplate = $("#templateRow");
    this.rowTemplateDisp = this.rowTemplate.css("display");
    this.rowTemplate.css("display", "none");
    console.log(this.rowTemplateDisp);
};

GameLoop.prototype.loop = function () {
    this.game.update();
    this.updateStatus();
};

/** Initialize this game loop and then execute the loop every INTERVAL
 * milliseconds. */
GameLoop.prototype.start = function (interval) {
    this.loop();
    // call this.loop on this instance every INTERVAL milliseconds
    setInterval(this.loop.bind(this), interval);
};

GameLoop.prototype.updateStatus = function () {
    var gameOverString = "";
    if (this.game.done) {
        gameOverString = "GAME OVER! ";
    }
    $("#statusString").html(gameOverString + "Time Elapsed: <b>" + (this.game.counter / 10).toFixed(1) + "</b>, Total Payout: <b>$" + this.game.totalPayout.toFixed(2) + "</b>");
    $("#suspicion").html(this.game.suspicion);
};

GameLoop.prototype.createTarget = function (template, acceptFunc, rejectFunc) {
    var result = this.orderTemplate.clone();

    result.css("display", this.orderTemplateDisp);
    result.css("background-color", genRandomColor());
    console.log(result.css("background-color"));
    var spans = result.find("span");
    spans.eq(0).html(template.name);
    spans.eq(1).html("" + (template.expiration / 10).toFixed(1) + "s");
    spans.eq(2).html(template.description);

    var string;
    if (template.suspicion < 0.1)
    {
        string = "Nobody cares about this target. Just kill them already.";
    }
    else if (template.suspicion > 0.3)
    {
        string = "Meh. You could get away it. Wanna take a chance?";
    }
    else
    {
        string = "There's a high chance you'll be caught if you try killing this target.";
    }

    spans.eq(3).html(string);
    spans.eq(4).html(template.age);
    spans.eq(5).html(template.income);
    spans.eq(6).html(template.dependents);
    spans.eq(7).html(template.expiration / 10);

    var buttons = result.find("input");
    buttons.eq(0).click(acceptFunc);
    buttons.eq(1).click(rejectFunc);

    $("#orderContainer").append(result);
    return result;
};

GameLoop.prototype.updateTarget = function (target) {
    var remaining = target.expiration;
    if (remaining < 0) {
        remaining = 0;
    }
    var spans = target.htmlInst.find("span");
    spans.eq(1).text((remaining / 10).toFixed(1));
};

GameLoop.prototype.hideTarget = function (target) {
    target = target.htmlInst;
    if (target.css("display") != "none") {
        target.css("display", "none");
    }
};

GameLoop.prototype.showGameOverText = function () {
    $("#orderContainer").css("text-align", "left");
    $("#orderContainer").css("padding", "10px");
    $("#orderContainer").html("<span style='font-size: 4em;'>Game over! You got caught!</span>");
}

/** Use this function after a payout has been chosen. */
GameLoop.prototype.createPayoutRow = function (target) {
    var result = this.rowTemplate.clone();

    result.css("display", this.rowTemplateDisp);
    var tds = result.find("td");
    tds.eq(0).html(target.name);
    tds.eq(1).html("$" + target.payout.toFixed(2));
    tds.eq(2).html((target.suspicion * 100).toFixed(1) + "%");
    tds.eq(3).html("Hmm I don't really have anything to say about this.");

    $("#rowContainer").append(result);
    return result;
};

var gameloop = new GameLoop();

var genRandomColor = function () {
    var digits = ['8', '9', 'a', 'b', 'c', 'd', 'e'];
    var result = "#";
    for (var i = 0; i < 3; i++) {
        result += digits[Math.floor(Math.random() * digits.length)];
    }
    return result;
};

/*
this.name = 
this.description = 
this.age = 
this.health = 

this.income = 
this.dependents = 

this.expiration =
*/
