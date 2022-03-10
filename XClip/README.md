# p5.2DAdventure
#### by Scott Kildall
www.kildall.com


## Overview
p5.2DAventure uses a state machine to make an avatar-based navigation from a large set of rooms. Using CSV tables, it manages the allocation of images and data, avatar navigation, mouse + keyboard navigation between states and button display.

Requires the [p5.play](https://molleindustria.github.io/p5.play/) library, the [forked version of p5.clickable](https://github.com/scottkildall/p5.clickable) if you want to use buttons.

What this will allow you to do is to create complex graphics and offload the management and navigation of these to this external library.


## ToDo
** keycode navigation not yet implemented
** documentation on creating sublcasses

## Errors in 2DAdventure

Because 2DAdventure.js abstracts a lot of the class allocation and management, the errors may seem obscure. Here are some of the ones you might encounter (ignore the line numbers)

### Classname Problem

If you have (1) a misspelled class name or a non-existent one in the adventureStates.csv table, you will get this error. In this case, I specified a class name called "Instructions Screen", but had not yes implemented it.

ReferenceError: InstructionsScreen is not defined
    at eval (eval at setup (p5.2DAdventure.js:37),
    

## Adding it your index.html

The easiest way to use this library it to place it in the same folder as your sketch.

Then, add the line below to the index.html file so that you can access it in your sketch.js

  <script src="p5.2DAdventure.js"></script>
  
## Setting up the CSV files

This can seem like the most confusing aspect of it, but once you get the hang of it, the navigation functions and automatic loading/unloading make the maze-mapping really easy.

**(1) States table,** usually what I title **_adventureStates.csv_** — this is the state machine map. It has a list of state names (often these correspond to rooms) and the Class name that they correspond to.

The AdventureMachine will load these CSV files in its constructor function as tables and in setup(), it will read the data from tables.

What the core functionality of AdventureMachine does is:
(1) allocate classes specific for each state; (2) manage unload() and load() functions, essentially asset managarment; (3) allow the user to make specific drawing or interactions based on subclasses.

**The end result** is that you can have a very efficient multi-room adventure game that is really cool and easy-to-code! 

**PNGRoom** is a class that is built into 2DAdventure.js and simple shows a PNG image in its background. Your avatar (the player sprite) can move from room to room.

**MazeRoom** is a subclass of PNGRoom and not yet implemented.

**Other classes** may be defined and in this example we have an **InstructionsScreen** and an **AvatarSelectionScreen** class. Both of these are custom classes for a specific project, defined in ***sketch.js***

**PNGFilename** is the name of a .png file


![](ReadMeImages/state_table.png)

(2) **Interaction Table**, usually what I call **_interactionTable.csv_** — shows how you get from state to state.


From the **CurrentState**, you can have various paths to a **NextState**. These can be keyboard events, mouse events, clickable buttons or map directions, where you travel from one room to another.

For example, in the table below, we see some of the following interactions:
(a) when you are on the Splash screen, ANY mouse pressed event will take you to the Instructions screen

(b) On the Instrctions Screen, there are 2 buttons: Start Game and Select Avatar. They take you to the Start state (room) and the AvatarSelection screen, respectively.

(c) Map directions are specied by N-S-E-W keys and occur when your player avatar goes in that direction on the screen.


![](ReadMeImages/interaction_table.png)

**_clickableLayout.csv_** - optional, if you want to use the layout tools with the forked p5.clickable class that I have made: [https://github.com/scottkildall/p5.clickable](https://github.com/scottkildall/p5.clickable).

**What this does** is use the same functions as the ClickableManager, except that you have an additional column called **State**, which will automatically show/hide whatever buttons appear for that state.

For example, in this table. The Instructions screen has two bottons: **Start Game** and **Select Avatar**. By adding this field to my forked p5.clickable repo and setting it to the Adventure Manager upon startup, this will make it so that these automatically get shown and hidden when these states are active.

**If you want to use a button for multiple states**, just leave the State column empty.

![](ReadMeImages/clickable_layout.png)


## Sketches
### Simple
This uses a 4 room, NW-NE-SE-SW maze. There's no splash screen or keyboard or mouse navigation, just avatar navigation with the interaction table. This does not use a clickable layout

### MoodyMaze

This has 9 maze rooms, 1 splash screen, 1 instructions screen and an avatar selection screen.

The Splash screen uses a a mouseclick to go to Instructions. Instructions will let you start the "game" (it's not really a game), or select an avatar. The 9 rooms all are in the interaction map. 

All rooms are of class type PNGRoom (built into 2DAdventure.js), except that InstructionsRoom and SelectAvatarRoom are subclassed from PNGRoom and in the sketch.js file.

This uses a clickable layout to help with the buttons


## Functions

**constructor**(statesFilename, interactionTableFilename, clickableLayoutFilename = null)

The constructor takes two arguments with an optional 3rd argument.

1st argument: the statesFilename as a CSV (see Setting up the CSV files). This shows

2nd argument: the ineractionTableFilename as a CSV (see Setting up the CSV files)

3rd argument: the clickableLayoutFilename as a CSV (see Setting up the CSV files).

	// make a gobal variable
	var adventureManager
	
	// allocate in preload
	function preload() {
	    adventureManager = new AdventureManager('data/adventureStates.csv', 'data/interactionTable.csv', 'data/clickableLayout.csv');
	}

**always call constructor in preload** since the tables won't be available until setup().


**setPlayerSprite(playerSprite)**
    
	// create a sprite without an animation
	playerSprite = createSprite(width/2, height/2, 80, 80);
	  
	  // use this to track movement from toom to room in adventureManager.draw()
	  adventureManager.setPlayerSprite(playerSprite);

best to call this in the setup() function

**setClickableManager(clickableManager)** this will specify a clickableManager objects from the P5Clickable (forked) library. Only call this if you are planning to use the clickables layout for this class.

	
	// Allocate clickables manager in the preload function like this
	
	clickablesManager = new ClickableManager('data/clickableLayout.csv');
	
  
	// In setup(), set the clickables manager
	
	adventureManager.setClickableManager(clickablesManager);


**setup()** this will initialize the AdventureManager. Call this in the last line of the setup() function.

	 // This will load the images, go through state and interation tables, etc
	  adventureManager.setup();


**getStateName()** returns the current state name

	// this prevents sprites from being drawn if we are on the splash screen
	if( adventureManager.getStateName() !== "Splash" ) {
	  drawSprites();
	}
	
	
	
**draw()** call this in your draw() loop, every time. This will track state changes and load/unload states for you and do other essential tasks.

	// draw adventure manager, then buttons, then sprites
	function draw() {
	  // draws background rooms and handles movement from one to another
	  adventureManager.draw();
	
	  // draw the p5.clickables, in front of the mazes but behind the sprites 
	  clickablesManager.draw();
	
	  // this is a function of p5.js, not of this sketch
      drawSprites();
	}
	

**keyPressed()** passes a key pressed event to the AdventureManager, do this in your keyPressed() p5.js function.

	function keyPressed() {
	  // dispatch to elsewhere
	  adventureManager.keyPressed(key); 
	}


**mouseReleased()** passes a mouseReleased() event to the AdventureManager, do this in your mouseReleased() p5.js function.


	function mouseReleased() {
	  adventureManager.mouseReleased();
	}

**clickablePressed(clickableName)** a p5.clickable object was pressed. Looks for it in the interaction table and clickable layout and will move to a different state, if possible.

This is the clickable callback functon. It will pass **the name** of the clickable button to the AdventureManager, which will look it up in its various classes and change the state to the appropriate room.


	clickableButtonPressed = function() {
	  // these clickables are ones that change your state
	  // so they route to the adventure manager to do this
	  adventureManager.clickablePressed(this.name);
	} 
  

**setChangedStateCallback(callbackFunction)** sets a callback function for when a you change to a new state. This gets called in the draw() function when the state is changed, but before load() and unload() happens.



	// do this in setup(). 
	// changedState is the name of a callback function
	adventureManager.setChangedStateCallback(changedState);
	
	



The callback function should be in your sketch.js code, like this:





	function changedState(currentStateStr, newStateStr) {
		print("changedState callback:");
		print("current state = " + currentStateStr);
		print("new state = " + newStateStr);
	} 
  
  


## License
CC BY: This license allows reusers to distribute, remix, adapt, and build upon the material in any medium or format, so long as attribution is given to the creator. The license allows for commercial use.
