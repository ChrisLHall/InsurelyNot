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




function Game()
{
    this.year = 0;

    this.player = "name";
    this.image = "image";

    this.choices = [];
    this.events = [new Events.Nothing(), new Events.Death(), new Events.Illness(), new Events.Injury(), new Events.Recession(), new Events.Prosperity(), new Events.Divorce()];

    this.savings = 0.0;
    this.health = 100.0;
    this.salary = 0.0;
    this.interest = 0.01;
    this.inctax = 0.25;

    this.insurance = {};
    this.mortgage = 2000.0

    this.done = false; // whether the game is finished
}



Game.prototype.check_done = function()
{
    if (this.done == true || this.health <= 0)
    {
        return true;
    }
    return false;
};

Game.prototype.random_event = function()
{
    var random = Math.random();
    var incident;
    var probability = 0.0;
    for (var i = 0; i < this.events.length; i++)
    {
        incident = this.events[i];
        probability += incident.probability;
        if (random < probability)
        {
            incident.result(this);
            return incident;
        }
    }
    return null;
};

Game.prototype.make_decision = function(decision)
{
    decision.result(this);
};

Game.prototype.list_choices = function()
{
    return this.choices;
};

Game.prototype.apply_effects = function()
{
    this.savings += (1.0 - this.inctax) * this.salary;
    this.savings *= (1.0 + this.interest);
    this.health -= 0.5;


    for (key in Object.keys(this.insurance))
    {
        this.savings -= this.insurance[key];
    }
};

/* // This now done in gameloop.js
Game = new Game();

evnt = Game.random_event();

console.log(evnt);
*/

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
