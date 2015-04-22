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

var Events =
{
    Nothing: function()
    {
        this.title = "Nothing";
        this.description = "Nothing significant has happened. You continue to live your life the way you did last year.";
        this.probability = 0.5;

        this.result = function(game)
        {
            return;
        }
    },

    Death: function()
    {
        this.title = "Death";
        this.description = "You were sitting on the toilet, reading a newspaper. Your friend Bruce Willis came over to your place and saw a gun on the table. He opened the bathroom door, and both of you looked into each others' eyes. Then he shot you. A while later, your son Tyrion Lannister used a crossbow and shot you twice.";
        this.probability = 0.025;

        this.result = function(game)   
        {
            game.done = true;
        }
    },

    Illness: function()
    {
        this.title = "Illness";
        this.description = "For the past years, you've made terrible diet and health decisions. Earlier, you decided to go diving in the freezing cold river, on a dare. A day later, you felt the onset of sickness. Flu maybe? Hypothermia? Pneumonia? Or maybe worse.";
        this.probability = 0.1;

        this.result = function(game)   
        {
            var random = Math.random();
            game.health -= Math.round(random * 25.0);
        }
    },

    Injury: function()
    {
        this.title = "Injury";
        this.description = "While hiking through the forests, you came across a cliff. You wanted to climb it and impress your friends. While trying to take a selfie on the cliff, you fell. Maybe you shouldn't have taken that risk.";
        this.probability = 0.15;

        this.result = function(game)
        {
            var random = Math.random();
            game.heatlh -= Math.round(random * 50.0);
        }

        this.choices = function(game)
        {
            return [];
        }
    },

    Earthquake: function()
    {
        this.title = "Earthquake";
        this.description = "You didn't think it would happen. Or maybe you did. But it doesn't matter. Your home is toppled, your belongings are destroyed, but you're alive and okay."
        this.probability = 0.075;

        this.result = function(game)
        {

        }
    },

    Recession: function()
    {
        this.title = "Recession";
        this.description = "In addition to the recession, the government suddenly has a huge need for money, since it needs to pay off the billions of dollars it owes to China. This is because China's technological and military advances have surpassed the United States, and they're threatening war if the U.S. doesn't pay up. Income tax has increased."
        this.probability = 0.05;

        this.result = function(game)
        {
            var random = Math.random();
            this.inctax = Math.min(0.5 * random + this.inctax, 1.0)
        }
    },

    Prosperity: function()
    {
        this.title = "Prosperity";
        this.description = "There has been a sudden period of economic growth; new jobs are everywhere, resources are abundant, and everyone is happy. Income tax, for all brackets, have decreased.";
        this.probability = 0.05;

        this.result = function(game)
        {
            var random = Math.random();
            this.inctax = Math.max(this.inctax - 0.2 * random, 0.0)
        }
    },

    Promotion: function()
    {
        this.title = "Promotion";
        this.description = "The company you work for has had its best quarter, earning much more revenue than in the previous decade. Your manager just promoted you so you have a raise.";
        this.probability = 0.05;

        this.result = function(game)
        {
            var growth = 1.0 + (Math.random() / 4.0)
            game.salary *= growth;

            var bonus = game.salary / 10.0;
            game.savings += bonus;
        }
    },

    Divorce: function()
    {
        this.title = "Divorce";
        this.description = "Your spouse and you have been arguing for a while, and you can't stand them anymore. Also, there's this cutie at work you're kind of interested in, and in a spur of the moment thing, you decide to file for divorce. Unfortunately, you didn't sign a prenuptial agreement, and you happen to be the only one working, so you just lost half your money.";
        this.probability = 0.01;

        this.result = function(game)
        {
            game.savings *= 0.5;
            game.inctax = Math.max(1.0, game.inctax + 0.01);
        }
    },

    Accident: function()
    {
        this.title = "Accident";
        this.description = "While driving down a lonely road deep in the forests, your eyes slowly flickered as sleep deprivation took over. A deer came out of nowhere and your reflexes were fast enough to avoid the deer, but you swerved off the road, slamming into a tree. Did you spend 15 minutes on saving 15% or more on car insurance?";
        this.probability = 0.05;

        this.result = function(game)
        {

        }
    },
};




var Decisions =
{
    BuyCarInsurance: function(game)
    {

    },

    BuyHomeInsurance: function(game)
    {

    },

    BuyHealthInsurance: function(game)
    {

    },

    BuyLifeInsurance: function(game)
    {

    },

    BuyStocks: function(game)
    {

    },

    BuyBonds: function(game)
    {

    },

    BuyMutualFunds: function(game)
    {

    },

    SellStocks: function(game)
    {

    },

    SellBonds: function(game)
    {

    },

    SellMutualFunds: function(game)
    {

    },

    ObtainEducation: function(game)
    {
        this.savings -= 120000.0;
        this.savings -= 4.0 * this.salary;

        this.salary = Math.random() * 100000.0;
    },

    WorkStartup: function(game)
    {
        
    }
};




function Game(gameLoop)
{
    this.gameLoop = gameLoop;
    this.year = 0;
    this.counter = 0;

    this.totalPayout = 0;

    this.player = "name";
    this.image = "image";

    // this.choices = [];
    // this.events = [new Events.Nothing(), new Events.Death(), new Events.Illness(), new Events.Injury(), new Events.Recession(), new Events.Prosperity(), new Events.Divorce()];

    // this.savings = 0.0;
    // this.health = 100.0;
    // this.salary = 0.0;
    // this.interest = 0.01;
    // this.inctax = 0.25;

    // this.insurance = {};
    // this.mortgage = 2000.0

    this.insurance = [];

    this.targets = [];

    this.characters = [new Target.OldLady(), new Target.DrugUser(), new Target.Student(), new Target.RichPerson(), new Target.PoliceOfficer(), new Target.Unemployed(), new Target.HomelessPerson()];

    // goes to 100
    this.suspicion = 0;

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
            console.log(instance);
            return instance;
        } else {
            // Keep looking
            tempTotalProb += thisChar.probability;
        }
    }
    return null;
};


// Game.prototype.check_done = function()
// {
//     if (this.done == true || this.health <= 0)
//     {
//         return true;
//     }
//     return false;
// };

// Game.prototype.random_event = function()
// {
//     var random = Math.random();
//     var incident;
//     var probability = 0.0;
//     for (var i = 0; i < this.events.length; i++)
//     {
//         incident = this.events[i];
//         probability += incident.probability;
//         if (random < probability)
//         {
//             incident.result(this);
//             return incident;
//         }
//     }
//     return null;
// };

// Game.prototype.make_decision = function(decision)
// {
//     decision.result(this);
// };

// Game.prototype.list_choices = function()
// {
//     return this.choices;
// };

// Game.prototype.apply_effects = function()
// {
//     this.savings += (1.0 - this.inctax) * this.salary;
//     this.savings *= (1.0 + this.interest);
//     this.health -= 0.5;


//     for (key in Object.keys(this.insurance))
//     {
//         this.savings -= this.insurance[key];
//     }
// };

Game.prototype.evaluate = function(target)
{
    if (target.dependents == 0 || target.age >= 80)
    {
        return 0;
    }

};

Game.prototype.payoff = function(target)
{
    return target.income
};


Game.prototype.update = function ()
{
    this.counter++;
    for (var i = 0; i < this.targets.length; i++)
    {
        var target = this.targets[i];
        this.targets.expiration--;
        if (this.targets.expiration <= 0)
        {
            this.targets.expiration = 0;
            gameloop.hideTarget(target.htmlInst);
        }
        gameloop.updateTarget(target);
    }

    // Every 20 * 100 ms = 2 sec, create a new target;
    if (this.counter % 20 == 0) {
        var newTarget = this.generateChar();
        this.instantiate(newTarget);
        this.targets.push(newTarget);
    }
};

Game.prototype.instantiate = function (target) {
    target.htmlInst = gameloop.createTarget(target);
    target.payoff = this.evaluate(target);
};

var Target =
{
    OldLady: function()
    {
        this.name = "OldLady";
        this.description = "Your favorite harmless old lady.";
        this.age = 50 + Math.round(Math.random() * 50); // E(X) = 75
        this.health = Math.min(1.0, 2.0 * 0.6 * Math.random());

        this.value = 5000 * Math.round(Math.random() * 100); // E(X) = 250000
        this.income = 500 * Math.round(Math.random() * 100); // E(X) = 25000
        this.dependents = Math.round(Math.random()); // E(X) = 0.5

        this.expiration = 100;
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

        this.expiration = 100;
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

        this.expiration = 100;
        this.probability = 0.1;
    },

    RichPerson: function()
    {
        // this.name = 
        // this.description = 
        // this.age = 
        // this.health = 

        // this.value = 
        // this.income = 
        // this.dependents = 

        // this.expiration = 
        this.probability = 0.1;
    },

    PoliceOfficer: function()
    {
        // this.name = 
        // this.description = 
        // this.age = 
        // this.health = 

        // this.value = 
        // this.income = 
        // this.dependents = 

        // this.expiration = 
        this.probability = 0.1;
    },

    Unemployed: function()
    {
        this.name = "Unemployed";
        this.description = "Someone without a job, who currently is looking";
        this.age = 20 + Math.round(50 * Math.random());
        this.health = Math.min(1.0, 2.0 * 0.4 * Math.random());

        this.value = 100 * Math.round(Math.random() * 100);
        this.income = 0.0;
        this.dependents = Math.round(4 * Math.random());

        this.expiration = 100;
        this.probability = 0.1;
    },

    HomelessPerson: function()
    {
        // this.name = 
        // this.description = 
        // this.age = 
        // this.health = 

        // this.value = 
        // this.income = 
        // this.dependents = 

        // this.expiration = 
        this.probability = 0.1;
    }
};

// print(new Target.OldLady());
 // This now done in gameloop.js
// Game = new Game();


// console.log(Game)



/* to check if game is over */

// if (Game.check_done == true)
// {
//    /*** YOUR CODE HERE ***/
// }


/* make a random event happen */

// evnt = Game.random_event()


/* list choices after event has occurred */

// chces = Game.list_choices()


/* make a decision from one of the choices */

// index = 0
// chce = chces[index]
// dcsn = Game.make_decision(chce)


/* apply residual/recurring effects */

// Game.apply_effects()
