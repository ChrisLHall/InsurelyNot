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
    $("#statusString").html("Time Elapsed: <b>" + (this.game.counter / 10).toFixed(1) + "</b>, Total Payout: <b>$" + this.game.totalPayout.toFixed(2) + "</b>");
    $("#suspicion").html(this.game.suspicion);
};

GameLoop.prototype.createTarget = function (template) {
    var result = this.orderTemplate.clone();

    result.css("display", this.orderTemplateDisp);
    result.find("#charName").html(template.name);
    result.find("#charDesc").html(template.description);
    result.find("#charAge").html(template.age);
    result.find("#charIncome").html(template.income);
    result.find("#charDeps").html(template.dependents);
    result.find("#charTime").html(template.expiration / 10);

    return result;
};

GameLoop.prototype.updateTarget = function (target) {
    var remaining = target.expiration;
    if (remaining < 0) {
        remaining = 0;
    }
    target.find("#charTime").html(remaining / 10);
};

GameLoop.prototype.hideTarget = function (target) {
    if (target.css("display") != "none") {
        target.css("display", "none");
    }
};

/** Use this function after a payout has been chosen. */
GameLoop.prototype.createPayoutRow = function (target) {
    var result = this.rowTemplate.clone();

    result.css("display", this.rowTemplateDisp);
    result.find("#name").html(target.name);
    var payout = this.game.evaluate(target);
    result.find("#payout").html(payout);
    // TODO OH GOD THIS IS SOOOO WRONG
    this.game.totalPayout += payout;
    result.find("#suspicion").html(target.age);
    result.find("#comment").html("Hmm I don't really have anything to say about this.");

    return result;
};

var gameloop = new GameLoop();

/*
this.name = 
this.description = 
this.age = 
this.health = 

this.income = 
this.dependents = 

this.expiration =
*/
