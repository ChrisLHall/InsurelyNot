/*

General Game Loop

initialize game

while game is not done:
    
    random event occurs (if any)
    apply results of event to game
    
    user makes a decision from choices
    apply decision to game

    make any recurring changes to game (interest, costs, etc.)
    increment time

return game results

*/

var print = console.log

var TARGET_DURATION = 40;

function Game(gameLoop)
{
    this.gameLoop = gameLoop;
    this.year = 0;
    this.counter = 0;
    this.spawnCount = TARGET_DURATION - 1;

    this.totalPayout = 0;

    this.player = "name";
    this.image = "image";

    this.insurance = [];

    this.targets = [];

    this.characters = [new Target.OldLady(), new Target.DrugUser(), new Target.Student(), new Target.RichPerson(), new Target.PoliceOfficer(), new Target.Unemployed(), new Target.HomelessPerson()];

    // goes to 100
    this.totalSuspicion = 0;

    this.done = false; // whether the game is finished
}

Game.prototype.generateChar = function () {
    var totalProb = 0;
    for (var i = 0; i < this.characters.length; i++)
    {
        totalProb += this.characters[i].probability;
    }
    var randomNum = Math.random() * totalProb;
    var tempTotalProb = 0;
    for (var k = 0; k < this.characters.length; k++)
    {
        var thisChar = this.characters[k];
        if (tempTotalProb + thisChar.probability > randomNum)
        {
            // Instantiate this one
            var instance = new (Object.getPrototypeOf(thisChar).constructor)();
            return instance;
        } else {
            // Keep looking
            tempTotalProb += thisChar.probability;
        }
    }
    return null;
};

Game.prototype.evaluate = function(target)
{
    if (target.dependents == 0 || target.age >= 80)
    {
        return 0;
    }
    var adjusted = 0.0;
    var totalTax = 0;
    var bracket, myBracket;
    var inctax = 
    [
        {
            lower: 0, 
            upper: 9075,
            tax: 0.1
        },
        {
            lower: 9075, 
            upper: 36900,
            tax: 0.15
        },
        {
            lower: 36900,
            upper: 89350,
            tax: 0.25
        },
        {
            lower: 89350,
            upper: 186350,
            tax: 0.28
        },
        {
            lower: 186350,
            upper: 405100,
            tax: 0.33
        },
        {
            lower: 405100,
            upper: 406750,
            tax: 0.35
        },
        {
            lower: 406750,
            upper: 1000000000,
            tax: 0.39
        }
    ];
    for (var i = 0; i < inctax.length; i++)
    {
        bracket = inctax[i];
        if (target.income >= bracket.lower && target.income <= bracket.upper)
        {
            totalTax += (target.income - bracket.lower) * bracket.tax;
            break;
        } else if (target.income > bracket.upper) {
            totalTax += (bracket.upper - bracket.lower) * bracket.tax;
        }
    }

    console.log(totalTax);
    adjusted = target.income - totalTax;

    // Burial expenses
    var payout = 8000 + Math.random() * 1500;
    // Years to cover
    var yearsToCover = Math.min(30, Math.max(60 - target.age, 0));
    // 0.8 is the fudge factor
    payout += adjusted * 0.8 * yearsToCover;

    // College funds
    if (target.age < 60) {
        payout += 69000 * target.dependents * Math.min(20, Math.max(0, 60 - target.age)) / 20;
    }

    if (Math.random() < Math.max(0, 0.4 - 0.1 * target.dependents))
    {
        return 0.0;
    }
    return payout;
};

Game.prototype.suspicion = function(target)
{
    var risk = 0.0;

    risk += target.income / 1000000.0;
    risk += target.value / 4000000.0;
    risk += (100.0 - target.age) / 800.0;
    risk += target.dependents / 30.0;

    //risk = Math.min(2.0 * Math.random() * risk, 1.0);
    risk *= 0.8 + 0.4 * Math.random();

    return risk;
};

Game.prototype.payoff = function(target)
{
    return target.income;
};


Game.prototype.update = function ()
{
    if (this.done) {
        return;
    }

    this.totalSuspicion += 0.0005;
    if (this.totalSuspicion >= 1) {
        for (var i = 0; i < this.targets.length; i++)
        {
            gameloop.hideTarget(this.targets[i]);
        }
        this.done = true;
        gameloop.showGameOverText();
    }

    this.counter++;
    for (var i = 0; i < this.targets.length; i++)
    {
        var target = this.targets[i];
        target.expiration--;
        if (target.expiration <= 0)
        {
            target.expiration = 0;
            gameloop.hideTarget(target);
        }
        gameloop.updateTarget(target);
    }

    this.spawnCount++;
    if (this.spawnCount == TARGET_DURATION) {
        var newTarget = this.generateChar();
        this.instantiate(newTarget);
        this.targets.push(newTarget);
        this.spawnCount = 0;
    }
};

Game.prototype.instantiate = function (target) {
    target.htmlInst = gameloop.createTarget(target, this.accept.bind(this, target), this.reject.bind(this, target));
    target.payout = this.evaluate(target);
    target.suspicion = this.suspicion(target);
};

Game.prototype.accept = function (target) {
    gameloop.hideTarget(target);
    gameloop.createPayoutRow(target);
    this.totalPayout += target.payout;
    this.totalSuspicion += target.suspicion;
    if (this.totalSuspicion >= 1) {
        this.done = true;
        gameloop.showGameOverText();
    }
    // Reset counter
    this.spawnCount = TARGET_DURATION - 1;
};

Game.prototype.reject = function (target) {
    gameloop.hideTarget(target);
    // Reset counter
    this.spawnCount = TARGET_DURATION - 1;
};

var Target =
{
    OldLady: function()
    {
        this.name = "OldLady";
        this.description = "Your favorite harmless old lady.";
        this.age = 50 + Math.round(Math.random() * 50); // E(X) = 75
        this.health = Math.min(1.0, 2.0 * 0.5 * Math.random());

        this.value = 5000 * Math.round(Math.random() * 100); // E(X) = 250000
        this.income = 500 * Math.round(Math.random() * 100); // E(X) = 25000
        this.dependents = Math.round(Math.random()); // E(X) = 0.5

        this.expiration = TARGET_DURATION;
        this.probability = 0.1;
    },

    DrugUser: function()
    {
        this.name = "DrugUser";
        this.description = "The typical town junkie, has unsanitary and unhealthy habits.";
        this.age = 20 + Math.round(Math.random() * 20);
        this.health = Math.min(1.0, 2.0 * 0.2 * Math.random());

        this.value = 300 * Math.round(Math.random() * 100);
        this.income = 300 * Math.round(Math.random() * 100);
        this.dependents = Math.round(Math.random() * 4);

        this.expiration = TARGET_DURATION;
        this.probability = 0.1;
    },

    Student: function()
    {
        this.name = "Student";
        this.description = "A university student, trying to get some college by going to knowledge.";
        this.age = 18 + Math.round(Math.random() * 5)
        this.health = Math.min(1.0, 2.0 * 0.9 * Math.random());

        this.value = 50 * Math.round(Math.random() * 100);
        this.income = 50 * Math.round(Math.random() * 100);
        this.dependents = Math.round(Math.random() * 1);

        this.expiration = TARGET_DURATION;
        this.probability = 0.1;
    },

    RichPerson: function()
    {
        this.name = "RichPerson";
        this.description = "Somebody in the 1%. Down with the 1%.";
        this.age = 69;
        this.health = 0.69;

        this.value = 1000000
        this.income = 200000
        this.dependents = 5

        this.expiration = TARGET_DURATION;
        this.probability = 0.1;
    },

    PoliceOfficer: function()
    {
        this.name = "PoliceOfficer";
        this.description = "Got to have some diversity. Diversifyyy your bondsss.";
        this.age = 30 + Math.round(40 * Math.random());
        this.health = Math.min(1.0, 2.0 * 0.5 * Math.random());

        this.value = 6000 * Math.round(Math.random() * 100);
        this.income = 1000 * Math.round(Math.random() * 100);
        this.dependents = Math.round(6 * Math.random());

        this.expiration = TARGET_DURATION;
        this.probability = 0.1;
    },

    Unemployed: function()
    {
        this.name = "Unemployed";
        this.description = "Someone without a job.";
        this.age = 20 + Math.round(50 * Math.random());
        this.health = Math.min(1.0, 2.0 * 0.6 * Math.random());

        this.value = 100 * Math.round(Math.random() * 100);
        this.income = 0.0;
        this.dependents = Math.round(4 * Math.random());

        this.expiration = TARGET_DURATION;
        this.probability = 0.1;
    },

    HomelessPerson: function()
    {
        this.name = "HomelessPerson";
        this.description = "Doesn't have a home, but might be renting!"
        this.age = 30 + Math.round(Math.random() * 20);
        this.health = Math.min(1.0, 2.0 * 0.15 * Math.random());

        this.value = 10 * Math.round(Math.random() * 100);
        this.income = 10 * Math.round(Math.random() * 100);
        this.dependents = Math.round(0.5 * Math.random());

        this.expiration = TARGET_DURATION;
        this.probability = 0.1;
    }
};
