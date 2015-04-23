var GameLoop = function () {
    this.game = new Game(this);
    this.orderTemplate = $("#orderTemplate");
    this.orderTemplateDisp = this.orderTemplate.css("display");
    this.orderTemplate.css("display", "none");
    this.rowTemplate = $("#templateRow");
    this.rowTemplateDisp = this.rowTemplate.css("display");
    this.rowTemplate.css("display", "none");
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
    $("#statusString").html(gameOverString + "Time Elapsed: <b>" + (this.game.counter / 10).toFixed(1) + "</b>, Total Payout: <b>$" + this.formatMoney(this.game.totalPayout) + "</b>");
    var susp = Math.min(1, this.game.totalSuspicion) * 100;
    $("#suspicion").html(susp.toFixed(1));
};

GameLoop.prototype.createTarget = function (template, acceptFunc, rejectFunc) {
    var result = this.orderTemplate.clone();

    result.css("display", this.orderTemplateDisp);
    result.css("background-color", genRandomColor());
    var spans = result.find("span");
    spans.eq(0).html(template.name);
    spans.eq(1).html("" + (template.expiration / 10).toFixed(1) + "s");
    spans.eq(2).html(template.description);

    var string;
    if (template.suspicion < 0.1)
    {
        string = "Nobody will notice if this target disappears.";
    }
    else if (template.suspicion < 0.3)
    {
        string = "This target's disappearance will be slightly suspicious.";
    }
    else
    {
        string = "Faking this target's death will be very suspicious.";
    }

    spans.eq(3).html(string);
    spans.eq(4).html(genUnknownText(template.age, 0.1));
    spans.eq(5).html(genUnknownText("$" + this.formatMoney(template.income), 0.2));
    spans.eq(6).html(genUnknownText(template.dependents, 0.1));
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
    tds.eq(1).html("$" + this.formatMoney(target.income));
    tds.eq(2).html(target.age);
    tds.eq(3).html(target.dependents);
    tds.eq(4).html("$" + this.formatMoney(target.payout));
    tds.eq(5).html((target.suspicion * 100).toFixed(1) + "%");
    tds.eq(6).html(target.comment);

    $("#rowContainer").append(result);
    return result;
};

GameLoop.prototype.formatMoney = function (value) {
    var initialStr = value.toLocaleString();
    var pos = initialStr.indexOf(".");
    if (pos != -1) {
        initialStr = initialStr.substring(0, pos + 3);
    }
    return initialStr;
}

var gameloop = new GameLoop();

var genRandomColor = function () {
    var digits = ['8', '9', 'a', 'b', 'c', 'd', 'e'];
    var result = "#";
    for (var i = 0; i < 3; i++) {
        result += digits[Math.floor(Math.random() * digits.length)];
    }
    return result;
};

var genUnknownText = function (text, chanceOfUnknown) {
    if (Math.random() < chanceOfUnknown) {
        return "???";
    }
    return text;
}
