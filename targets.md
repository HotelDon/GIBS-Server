Targets
------
Move targeting is a bit more complicated than you might realize, especially if you want to leave
open the possiblity for 2v2, 3v3, or free-for-all style battles in the future. We'll start with the 
two you're likely to use if you decide to ignore multi-battles. 

##### Single Foe
This is as simple as it gets. You pick a single opponent, and the move will execute with them as the
sole target. In multi-battles, you may choose any foe on the battlefield, but not any teammates you
might have. If there is only one foe, it will select the (only) target for you. Any instance of "useOn: target" will then cause that result to affect them when the move executes. 

##### None
If your move doesn't target anyone and only preforms actions on the battler that used it (in most 
cases, because it's a buff of some kind), then select none to bypass the target selection. You don't
NEED to do this, but it helps alleviate any confusion. This will also make it so "useOn: target" will do nothing instead. 

This is where things get a bit more confusing.