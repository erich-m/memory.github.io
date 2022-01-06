let buttons = [[0,0],[0,0,0,0],[0,0,0,0,0,0,0,0]];
let flashController;

let startButton;
let difficultyButton;
let instructionButton;
let invertButton;
let soundbutton;

let difficulty = 1;
let speed = 1;

let header = 0;

let invertStatus = false;
let volume = true;

let initialGameStatus = false;
let initialValue = 0;
let gameStatus = 0;
//0 if start menu
//1 if watch mode
//2 in repeat mode
let score = 0;
let currentScore = 0;
let highScore = [[0,0,0],[0,0,0],[0,0,0]];

let currentWidth;
let currentHeight;

let scaleX = 1;
let scaleY = 1;

let gameFont;
let gameLogo;

let instructions;

let monoSynth;
let notes = [261.6256,293.6648,329.6276,349.2282,391.9954,440.0000,493.8833,523.2511,587.3295,659.2551,698.4565,783.9909,880.0000,987,7666];

let version;

let wwTh;
let wwSx;
let whHf;
let xValues;
let yValues;
let wValues;
let hValues;
let rValue;
let margins;
let buttonColors;
let buttonOffsets;

function preload(){
	gameFont = loadFont('assets/font.ttf');
}

function setup() {
	createCanvas(windowWidth, windowHeight);

	wwTh = windowWidth/3;
	wwSx = windowWidth/6;
	whHf = windowHeight/2;
	
	xValues = [[0,2*wwTh],[0,2*wwTh,0,2*wwTh],[0,wwSx,4*wwSx,5*wwSx,0,wwSx,4*wwSx,5*wwSx]];
	yValues = [[0,0],[0,0,whHf,whHf],[0,0,0,0,whHf,whHf,whHf,whHf]];
	wValues = [[wwTh,wwTh],[wwTh,wwTh,wwTh,wwTh],[wwSx,wwSx,wwSx,wwSx,wwSx,wwSx,wwSx,wwSx]];
	hValues = [[height,height],[whHf,whHf,whHf,whHf],[whHf,whHf,whHf,whHf,whHf,whHf,whHf,whHf]];
	rValue = 20;
	margins = 20;
	buttonColors = [[color('#F52E2E'),color('#5463FF')],[color('#F52E2E'),color('#5463FF'),color('#FFC717'),color('#1F9E40')],[color('#F52E2E'),color('#5463FF'),color('#FF6619'),color('#24D4C4'),color('#FFC717'),color('#1F9E40'),color('#D41CE5'),color('#616161')]];
	buttonOffsets = 70;
	//setup buttons
	let buttonCount = 0;
	for(var b = 0;b < buttons.length;b++){
		for(var l = 0;l < buttons[b].length;l++){
			buttons[b][l] = new Button(xValues[b][l],yValues[b][l],wValues[b][l],hValues[b][l],rValue,margins,buttonColors[b][l],buttonOffsets,l,notes[l],volume);
			buttons[b][l].enableButton();
			buttons[b][l].enableUserControl();
			buttonCount++;
		}
	}
	
	textFont(gameFont);

	startButton = new MenuButton(wwTh,whHf - windowHeight/6,wwTh,windowHeight/3,windowHeight/6-margins,margins,color('#4A4559'),buttonOffsets/2,8,notes[8],volume,"START",0.4)
	startButton.enableButton();
	startButton.enableUserControl();

	difficultyButton = new MenuButton(wwTh,6*windowHeight/9,wwTh,windowHeight/9,rValue,margins,color('#4A4559'),buttonOffsets/2,9,notes[9],volume,"DIFFICULTY LEVEL: " + (difficulty+1),0.4);
	difficultyButton.enableButton();
	difficultyButton.enableUserControl();

	speedButton = new MenuButton(wwTh,7*windowHeight/9,wwTh,windowHeight/9,rValue,margins,color('#4A4559'),buttonOffsets/2,10,notes[10],volume,"SPEED MULTIPLIER: " + speed,0.4);
	speedButton.enableButton();
	speedButton.enableUserControl();

	instructionButton = new MenuButton(wwTh,8*windowHeight/9,wwTh,windowHeight/9,rValue,margins,color('#4A4559'),buttonOffsets/2,11,notes[11],volume,"HOW TO PLAY & CREDITS",0.4);
	instructionButton.enableButton();
	instructionButton.enableUserControl();

	invertButton = new MenuButton(wwTh,2*windowHeight/3-0.15*windowHeight/3,0.15*wwTh,0.15*windowHeight/3,0.05*wwTh,0,color('#4A4559'),buttonOffsets/2,12,notes[12],volume,"Invert",0.34);
	invertButton.enableButton();
	invertButton.enableUserControl();

	flashController = new FlashController(speed,difficulty);

	soundButton = new MenuButton(2*wwTh-0.15*wwTh,2*height/3-0.15*windowHeight/3,0.15*wwTh,0.15*windowHeight/3,0.05*wwTh,0,color('#4A4559'),buttonOffsets/2,12,notes[13],!volume,"Sound",0.34);
	soundButton.enableButton();
	soundButton.enableUserControl();

	gameLogo = loadImage('assets/logo.png');
	instructions = loadImage('assets/instruction.png');

	getAudioContext().suspend();
	monoSynth = new p5.MonoSynth();

	for(var c = 0;c < 5;c++){
		flashController.updateSequence();
	}

	version = createElement('h6','Version: Beta 1.0' + join(flashController.getSequence(),'') + ' Optimized for widescreen display');
	version.position(windowWidth-300,windowHeight-40);
}

function draw() {
	background(255);
	renderHeading(header);
	scale(scaleX,scaleY);
	for(var i = 0;i < buttons[difficulty].length;i++){
		buttons[difficulty][i].render(0,7.5);
		buttons[difficulty][i].flash(speed,false,getId);
	}

	startButton.render(0,7.5);
	startButton.flash(speed,false,startSequence);

	difficultyButton.render(0,7.5);
	difficultyButton.flash(speed,false,updateDifficulty);

	speedButton.render(0,7.5);
	speedButton.flash(speed,false,updateSpeed);



	instructionButton.render(0,7.5);
	instructionButton.flash(speed,false,updateHeader);

	invertButton.render(0,5);
	invertButton.flash(speed,false,changeInvert);

	soundButton.render(0,5);
	soundButton.flash(speed,false,changeVolume);

	if(invertStatus){
		filter(INVERT);
	}
}

function updateSpeed(){
	if(!initialGameStatus){
		initialGameStatus = true;
		flashController.resetSequence();
	}
	if(speed == 1){
		speed = 1/2;
	}else if(speed == 0.5){
		speed = 1/3;
	}else{
		speed = 1;
	}
	speedButton.updateText("SPEED MULTIPLIER : " + (1/speed),0.4);
	flashController.updateSpeed(speed);
}

function updateDifficulty(){
	if(!initialGameStatus){
		initialGameStatus = true;
		flashController.resetSequence();
	}
	if(difficulty == 0){
		difficulty = 1;
	}else if(difficulty == 1){
		difficulty = 2;
	}else{
		difficulty = 0;
	}
	difficultyButton.updateText("DIFFICULTY: " + (1 + difficulty),0.4);
	flashController.updateDifficulty(difficulty);
}

function startSequence(){
	if(!initialGameStatus){
		initialGameStatus = true;
		flashController.resetSequence();
	}
	if(gameStatus == 0){
		for(var b = 0;b < buttons.length;b++){
			for(var l = 0;l < buttons[b].length;l++){
				buttons[b][l].disableUserControl();
			}
		}

		difficultyButton.disableButton();
		difficultyButton.disableUserControl();

		speedButton.disableButton();
		speedButton.disableUserControl();

		gameStatus = 1;

		startButton.disableUserControl();
		startButton.updateText("WATCH",0.35);
		
		flashController.updateSequence();
		flashController.playSequence(buttons,endWatch);
	}
}

function endWatch(){
	startButton.updateText("REPEAT",0.3);
	for(var b = 0;b < buttons.length;b++){
		for(var l = 0;l < buttons[b].length;l++){
			buttons[b][l].enableUserControl();
		}
	}
	gameStatus = 2;
}

function getId(id){
	if(!initialGameStatus){
		let initialSequence = flashController.getSequence();
		if(initialSequence[initialValue] == id){
			initialValue++;
			if(initialValue == initialSequence.length){
				initialGameStatus = true;
				flashController.resetSequence();

				for(var x = 0;x < highScore.length;x++){
					for(var y = 0;y < highScore[x].length;y++){
						highScore[x][y] = 9999;
					}
				}
			}
		}else{
			initialGameStatus = true;
			flashController.resetSequence();
		}
	}
	if(gameStatus == 2){
		let currentSequence = flashController.getSequence();

		if(currentSequence[currentScore] == id){
			currentScore++;
			if(currentScore == currentSequence.length){
				gameStatus = 0;
				score++;

				if(score > highScore[difficulty][speed]){
					highScore[difficulty][speed] = score;
				}

				startButton.updateText("SCORE: " + score + "\nCLICK TO\nCONTINUE",0.2);
				
				for(var b = 0;b < buttons.length;b++){
					for(var l = 0;l < buttons[b].length;l++){
						buttons[b][l].disableUserControl();
					}
				}

				startButton.enableUserControl();
				currentScore = 0;
			}
		}else{
			currentScore = 0;
			if(score > highScore[difficulty][speed]){
				highScore[difficulty][speed] = score;
			}

			for(var b = 0;b < buttons.length;b++){
				for(var l = 0;l < buttons[b].length;l++){
					buttons[b][l].disableUserControl();
				}
			}

			startButton.updateText("SCORE: " + score + "\nCLICK TO\nRESART",0.2);
			flashController.resetSequence();

			gameStatus = 0;

			startButton.enableUserControl();

			difficultyButton.enableButton();
			difficultyButton.enableUserControl();

			speedButton.enableButton();
			speedButton.enableUserControl();

			score = 0;
		}
	}
}

function updateHeader(){
	if(header == 0){
		header = 1;
	}else if(header == 1){
		header = 2;
	}else if(header == 2){
		header = 3;
	}else if(header == 3){
		header = 4;
	}else{
		header = 0;
	}
}

function renderHeading(heading){
	if(heading == 0){
		image(gameLogo,width/3,0,width/3,height/3);
	}else if(heading == 1){
		image(instructions,width/3,0,width/3,height/3);
	}else if(heading == 2){
		text("Session High Scores",width/2,30);
		let counter = 0;
		for(var d = 0;d < highScore.length;d++){
			for(var s = 0;s < highScore[d].length;s++){
				text("Difficulty ( " + (d+1) + " ), Speed ( " + (s+1) + " ) : " + highScore[d][s],width/2,60+0.03*counter*height);
				counter++;
			}
		}
	}else if(heading == 3){
		textAlign(CENTER,CENTER);
		noStroke();
		text("MEMORYMASTER\n\ndesigner : Erich MacLean\nPresident of Coding Club\n\nbased off the classic game of SIMON\n\nMade for Isaac\nVice President of coding club",width/2,height/6);
	}else{
		textAlign(CENTER,CENTER);
		noStroke();
		text("Change Log\nFixed window resizing bug",width/2,height/6);
	}
}

function changeInvert(){
	invertStatus = !invertStatus;
}

function changeVolume(){
	volume = !volume;
	for(var v = 0;v < buttons.length;v++){
		for(var n = 0;n < buttons[v].length;n++){
			buttons[v][n].updateVolume();
		}
	}
	startButton.updateVolume();
	difficultyButton.updateVolume();
	speedButton.updateVolume();
	instructionButton.updateVolume();
	soundButton.updateVolume();
	invertButton.updateVolume();
}

function windowResized(){
	resizeCanvas(windowWidth,windowHeight);
	wwTh = windowWidth/3;
	wwSx = windowWidth/6;
	whHf = windowHeight/2;
	
	xValues = [[0,2*wwTh],[0,2*wwTh,0,2*wwTh],[0,wwSx,4*wwSx,5*wwSx,0,wwSx,4*wwSx,5*wwSx]];
	yValues = [[0,0],[0,0,whHf,whHf],[0,0,0,0,whHf,whHf,whHf,whHf]];
	wValues = [[wwTh,wwTh],[wwTh,wwTh,wwTh,wwTh],[wwSx,wwSx,wwSx,wwSx,wwSx,wwSx,wwSx,wwSx]];
	hValues = [[height,height],[whHf,whHf,whHf,whHf],[whHf,whHf,whHf,whHf,whHf,whHf,whHf,whHf]];
	rValue = 20;
	margins = 20;

	for(var uX = 0;uX < buttons.length;uX++){
		for(var uY = 0;uY < buttons[uX].length;uY++){
			buttons[uX][uY].update(xValues[uX][uY],yValues[uX][uY],wValues[uX][uY],hValues[uX][uY],rValue,margins);
		}
	}

	startButton.update(wwTh,whHf - windowHeight/6,wwTh,windowHeight/3,windowHeight/6-margins,margins);
	difficultyButton.update(wwTh,6*windowHeight/9,wwTh,windowHeight/9,rValue,margins);
	speedButton.update(wwTh,7*windowHeight/9,wwTh,windowHeight/9,rValue,margins);
	instructionButton.update(wwTh,8*windowHeight/9,wwTh,windowHeight/9,rValue,margins);
	invertButton.update(wwTh,2*windowHeight/3-0.15*windowHeight/3,0.15*wwTh,0.15*windowHeight/3,0.05*wwTh,0);
	soundButton.update(2*wwTh-0.15*wwTh,2*height/3-0.15*windowHeight/3,0.15*wwTh,0.15*windowHeight/3,0.05*wwTh,0);
	version.position(windowWidth-300,windowHeight-40);
}