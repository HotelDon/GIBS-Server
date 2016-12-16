Stat formulas
------
Stat formulas can use up to four variables to determine the value of a stat. They are baseValue, 
uniqueValue, statXP, and lvl. Not all systems will have all of these values enabled (except for lvl, 
which can't be turned off). If you use a value that isn't enabled, its value will always be zero. 

##### baseValue
This value is the same for all battler's of the same type, and is a predefined value.
##### uniqueValue
This value is a different value for each battler. Keep that in mind when deciding if baseValue or 
uniqueValue should have more influence over the final value of the stat. 
##### statXP
StatXP is earned by battling, and is seperate from XP used for leveling.
##### Example Formulas
If you You can use any number of rediculous mathematical operations to come up with your value, as 
long as it's supported in Math.js. 
###### Simple Formula
~~~~
statXP + uniqueValue + baseValue + lvl
~~~~
###### Slightly More Complex
~~~~
((statXP * 3) + (uniqueValue * 5) + (baseValue * lvl)) / 10
~~~~
###### Unncessarily Complex
~~~~
(lvl^3)/(sin(statXP mod 360)+sqrt(uniqueValue)+random(0, baseValue))
~~~~
Yes, that is a random number generator built into the formula. No, you should never do that. In 
fact, there are a lot of things MathJS can do that you should't do in your stat formulas, but it's 
a very powerful toolset and you can hang yourself with it if you really want to. 

If statements (moves)
------
If statments are defined using formulas, much in the same way stats are. Unlike stat formulas, 
If statement formulas should have a "true" or "false" result. This means it must contain at least 
one relational operator (==, !=, <, >, <=, >=), with one exception noted below. 
For Example: "user.[stat] < target.[stat]" is a simple, valid if statment formula. 

Formulas for If statements can use the following lists of variables. The prefixes user.[] and 
target.[] refer to the user of the move and the target, respectively (a move will always have a 
user, but might not always have a target).

#### Number Variables

These variables all return numbers. As a result, you can manipulate those results with any mathmatical
operations. For example, "user.[stat] + 20 >= target.[stat]" will only return true if if user.[stat]
is within 20 points of target.[stat] (this won't change the value of user.[stat]). It's also
possible to use multiple number variables together, like this: "user.[stat] - user.[otherStat] > 30"

##### user.[stat]/target.[stat] 
[stat] is the name of a battler stat (excluding HP). 
Refers to the value of [stat] of the battler after all stat mods.

##### user.[stat].flat/target.[stat].flat: 
The value of [stat] with NO stat mods applied. 

##### user.[stat].stage/target.[stat].stage
The current stage mod level of the specified stat. Will always return 0 if stage mods are disabled. 

##### user.currentHP/target.currentHP: 
The battler's current hp. 

##### user.maxHP/target.maxHP:
The battler's max HP. Useful for checking if the target is at full health. 

##### turnsElapsed: 
The amount of turns that have elapsed since the start of the battle. The battle starts on turn 0.

##### user.turnsSinceSwap/target.turnsSinceSwap: 
The number of turns that have elapsed since the battler has swapped in.
If checked the same turn a battler swaps it, turnsSinceSwap == 0. 

##### previousHits:
The number of times the move has applied damage using the dmg entry so far. Useful for multihit moves. 

#### String Variables
These variables return strings of text instead of numbers. Unlike number variables, these only
support two relational operators: == and !=, and can't be modified with mathmatical operators.   

##### user.elements/target.elements:
A list of the battler's current types.

##### user.[name]/target.[name]:
The name of the battler. 

#### Boolean Variables
Boolean variables return true or false directly. As such, they can stand alone in an if statement.
"user.pendingSwap" will return true if user.pendingSwap is true; "user.pendingSwap == true" is 
redundant, although still tecnically correct. 

##### user.pendingSwap/target.pendingSwap:
Returns true if the target creature is about to swap - use turnsSinceSwap if you need to detect
when a battler has just swapped. 




