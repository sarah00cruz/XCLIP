/*******************************************************************************************************************
      Moody
    by Scott Kildall

  Color Palette Values:

  Black: #031927
  Turquoise: #3ED8D2
  Canary: #FFF689
  Sizzling Red: #F2545B
  Pale Purple: #E9D6EC

    Uses the p5.ComplexStateMachine library. Check the README.md + source code documentation
    The index.html needs to include the line:  <script src="p5.complexStateManager.js"></script>
*********************************************************************************************************************/

var complexStateMachine;           // the ComplexStateMachine class
var clickablesManager;             // our clickables manager
var clickables;                    // an array of clickable objects

var currentStateName = "";
var moodImage;

var bkColor = '#031927';
var textColor = '#E9D6EC';

var buttonFont;

function preload() {
  clickablesManager = new ClickableManager('data/clickableLayout_more.csv');
  complexStateMachine = new ComplexStateMachine("data/interactionTable_more.csv", "data/clickableLayout_more.csv");

  buttonFont = loadFont("AtariClassic-ExtraSmooth.ttf");
}

// Setup code goes here
function setup() {
  createCanvas(1280, 720);
  imageMode(CENTER);

  // setup the clickables = this will allocate the array
  clickables = clickablesManager.setup();

  // setup the state machine with callbacks
  complexStateMachine.setup(clickablesManager, setImage, stateChanged);

  // call OUR function to setup additional information about the p5.clickables
  // that are not in the array
  setupClickables();
 }


// Draw code goes here
function draw() {
  drawBackground();
  drawImage();
  drawOther();
  drawUI();
}

function setupClickables() {
  // All clickables to have same effects
  for( let i = 0; i < clickables.length; i++ ) {
    clickables[i].onHover = clickableButtonHover;
    clickables[i].onOutside = clickableButtonOnOutside;
    clickables[i].onPress = clickableButtonPressed;
    clickables[i].textFont = "Roboto Mono";
    clickables[i].width = 250;
  }
}

// tint when mouse is over
clickableButtonHover = function () {
  this.color = "#F2545B";
  this.noTint = false;
  this.tint = "#FF0000";
}

// color a light gray if off
clickableButtonOnOutside = function () {
  // backto our gray color
  this.color = "#E9D6EC";
}

clickableButtonPressed = function() {
  complexStateMachine.clickablePressed(this.name);
}

// this is a callback, which we use to set our display image
function setImage(imageFilename) {
  moodImage = loadImage(imageFilename);
}

// this is a callback, which we can use for different effects
function stateChanged(newStateName) {
    currentStateName = newStateName;
    console.log(currentStateName);
}


//==== KEYPRESSED ====/
function mousePressed() {
  // if( currentStateName === "Splash" ) {
  //   complexStateMachine.newState("Instructions");
  // }
}

//==== MODIFY THIS CODE FOR UI =====/

function drawBackground() {
  background(color(bkColor));
}

function drawImage() {
  if( moodImage !== undefined ) {
    image(moodImage, width/2, height/2);
  }
}

function drawOther() {
  push();

   // Draw mood — if not on Splash or Instructions screen
   if( currentStateName !== "Splash" && currentStateName !== "Instructions") {
    fill(color(textColor));
    textFont(buttonFont);
    textSize(24);
    //text(currentStateName, width/2, 50);
  }

  pop();
}

//-- right now, it is just the clickables
function drawUI() {
  clickablesManager.draw();
}
