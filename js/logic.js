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

    this.characters = [new Target.OldLady(), new Target.DrugUser(), new Target.Student(), new Target.RichPerson(), new Target.UpperMiddleClass(), new Target.AveragePerson(), new Target.PoliceOfficer(), new Target.Unemployed(), new Target.HomelessPerson()];

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

Game.prototype.chooseComment = function(target)
{
    var commentIndex = Math.floor(Math.random() * target.comments.length);
    return target.comments[commentIndex];
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
        // No more expiration
        /*
        if (target.expiration <= 0)
        {
            target.expiration = 0;
            gameloop.hideTarget(target);
        }
        */
        gameloop.updateTarget(target);
    }

    this.spawnCount++;
    if (this.spawnCount == TARGET_DURATION) {
        var newTarget = this.generateChar();
        this.instantiate(newTarget);
        this.targets.push(newTarget);
        // No more expiration
        //this.spawnCount = 0;
    }
};

Game.prototype.instantiate = function (target) {
    target.payout = this.evaluate(target);
    target.suspicion = this.suspicion(target);
    target.comment = this.chooseComment(target);
    target.htmlInst = gameloop.createTarget(target, this.accept.bind(this, target), this.reject.bind(this, target));
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
        this.name = "Adorable Old Lady";
        this.description = "Your favorite harmless old lady.";
        this.comments = ["Young man, you're in trouble now.", "Do you have an oven here? I need to bake cookies for my grandchildren.", "Let me make you a scarf!"];
        this.age = 60 + Math.round(Math.random() * 40); // E(X) = 75
        this.health = Math.min(1.0, 2.0 * 0.5 * Math.random());

        this.value = 300000 + 9000 * Math.round(Math.random() * 100);
        this.income = 20000 + 300 * Math.round(Math.random() * 100); // E(X) = 25000
        this.dependents = Math.round(Math.random()); // E(X) = 0.5

        this.expiration = TARGET_DURATION;
        this.probability = 2;
    },

    DrugUser: function()
    {
        this.name = "Drug Addict";
        this.description = "The typical town junkie, has unsanitary and unhealthy habits.";
        this.comments = ["Wheeeeew you're insane, let me get some of that insurance money for that good kush and alcohol!", "I can't remember if I got insurance...what's insurance? Actually stop talking I'm too stoned", "Weeeeeeeeeeeeeeeeeeeeed", "Wait, where are we? Is this my house? Did I move recently?"];
        this.age = 20 + Math.round(Math.random() * 20);
        this.health = Math.min(1.0, 2.0 * 0.2 * Math.random());

        this.value = 3000 + 300 * Math.round(Math.random() * 100);
        this.income = 10000 + 300 * Math.round(Math.random() * 100);
        this.dependents = Math.floor(Math.random() * 3);

        this.expiration = TARGET_DURATION;
        this.probability = 1;
    },

    Student: function()
    {
        this.name = "Student";
        this.description = "A university student, trying to get some college by going to knowledge.";
        this.comments = ["Oh thanks! Now I don't have to pay off all those student loans!", "My parents are going to be worried that I'm actually dead, when can I tell them?", "I should have done this earlier instead of going to college!", "I AM ENJOYING LEARNING ABOUT LIFE INSURANCE!"];
        this.age = 18 + Math.round(Math.random() * 5)
        this.health = Math.min(1.0, 2.0 * 0.9 * Math.random());

        this.value = 1000 + 50 * Math.round(Math.random() * 100);
        this.income = 100 * Math.round(Math.random() * 100);
        this.dependents = Math.round(Math.random() * 0.7); // hack to get 2/7 chance of child

        this.expiration = TARGET_DURATION;
        this.probability = 2;
    },

    RichPerson: function()
    {
        this.name = "Rich Person";
        this.description = "Somebody in the 1%. Down with the 1%.";
        this.comments = ["What the hell did you do that for?!? I was living a great life! I'm going to sue you!", "You do realize I could basically retire at any time right?", "Wait, I don't hate insurance companies! I own one!"];
        this.age = 50 + Math.round(Math.random() * 20);
        this.health = 0.69;

        this.value = 1000000 + 50000 * Math.round(Math.random() * 100);
        this.income = 500000 + 15000 * Math.round(Math.random() * 100);
        this.dependents = Math.floor(Math.random() * 3);

        this.expiration = TARGET_DURATION;
        this.probability = 1;
    },

    UpperMiddleClass: function()
    {
        this.name = "Upper Middle Class";
        this.description = "Not super rich, but doing very well financially.";
        this.comments = ["Yeah I hate evil companies, but I was doing fine. This is such a pain!", "Woohoo! I thought I left my social justice days behind after college but this is great!", "Now that we're in hiding can you show me where the bathroom is?"];
        this.age = 35 + Math.round(Math.random() * 25);
        this.health = 1.5 * Math.random();

        this.value = 400000 + 6000 * Math.round(Math.random() * 100);
        this.income = 80000 + 1000 * Math.round(Math.random() * 100);
        this.dependents = Math.floor(Math.random() * 4);

        this.expiration = TARGET_DURATION;
        this.probability = 2;
    },

    AveragePerson: function()
    {
        this.name = "Average Person";
        this.description = "A normal middle class working individual.";
        this.comments = ["Meh.", "Hmm I don't really have anything to say about this.", "Stick it to the man! Thanks for doing this Dyler Turden.", "Think of the children! I hope they aren't too worried."];
        this.age = 30 + Math.round(Math.random() * 20);
        this.health = 0.2 * Math.random();

        this.value = 100000 + 800 * Math.round(Math.random() * 100);
        this.income = 35000 + 500 * Math.round(Math.random() * 100);
        this.dependents = Math.floor(Math.random() * 5);

        this.expiration = TARGET_DURATION;
        this.probability = 3;
    },

    PoliceOfficer: function()
    {
        this.name = "Police Officer";
        this.description = "Did you hear about that life insurance fraud case?";
        this.comments = ["Wow, they're never going to suspect I was in on this!", "I should arrest you right now.", "What the hell is wrong with you?! Oh wait mmm I like being rich though.", "This is soooooo morally ambiguous."];
        this.age = 25 + Math.round(40 * Math.random());
        this.health = Math.min(1.0, 2.0 * 0.5 * Math.random());

        this.value = 150000 + 2000 * Math.round(Math.random() * 100);
        this.income = 60000 + 600 * Math.round(Math.random() * 100);
        this.dependents = Math.round(4 * Math.random());

        this.expiration = TARGET_DURATION;
        this.probability = 1;
    },

    Unemployed: function()
    {
        this.name = "Unemployed";
        this.description = "Someone without a stable job. Occasionally works small jobs.";
        this.comments = ["I can barely support myself! This is great.", "Wow, so I don't need to work anymore.", "Holy cow I hope the insurance payout is good, it's been a financial tough spot recently."]
        this.age = 20 + Math.round(50 * Math.random());
        this.health = Math.min(1.0, 2.0 * 0.6 * Math.random());

        this.value = 5000 + 100 * Math.round(Math.random() * 100);
        this.income = 1000 + 100 * Math.round(Math.random() * 100);
        this.dependents = Math.round(4 * Math.random());

        this.expiration = TARGET_DURATION;
        this.probability = 2;
    },

    HomelessPerson: function()
    {
        this.name = "Homeless Person";
        this.description = "Doesn't have a home at the moment."
        this.comments = ["New set of clothes weeeeeeeee", "Oh look I accidentally gambled it all away T.T", "Can I afford a place to live now?", "I did an experiment like this back when I was a professor at MIT, but I had to quit because they asked me to invent smartphones. Look where that got me."];
        this.age = 30 + Math.round(Math.random() * 20);
        this.health = Math.min(1.0, 2.0 * 0.15 * Math.random());

        this.value = 10 * Math.round(Math.random() * 100);
        this.income = 10 * Math.round(Math.random() * 100);
        this.dependents = Math.round(0.5 * Math.random());

        this.expiration = TARGET_DURATION;
        this.probability = 1;
    }
};

