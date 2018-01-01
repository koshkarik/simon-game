const onOffButton = document.querySelector('.onOff-wrapper');
const onOffCheckbox = document.querySelector('.onOff');
const playAreas = document.querySelectorAll('.square');
const gameText = document.querySelector('.game-text');
const start = document.querySelector('.start-btn');
const gameCircle = document.querySelector('.simon-setup');
const strictButton = document.querySelector('.strict-wrapper');
const strictCheckbox = document.querySelector('.strict-check');
const strictChecker = document.querySelector('.strict-checker');
const sounds = document.querySelectorAll('.sound');
let playerInt;
let gameInterval;
let nextRoundInd;
let afterMistInt;
let strictFlag = false;
let letsgo = false;
let clickableFlag = false;
let turnOnOffFlag = false;
let gameOn = false;
let countGameProgress = 0;
let timeToDecision;
let timeToNextPiece = 1000;
let recentPlayerChoices = [];
let gameState = [];

function clearAllTimeouts() {
	clearTimeout(gameInterval);
	clearTimeout(timeToDecision);
	clearTimeout(playerInt);
	clearTimeout(nextRoundInd);
	clearTimeout(afterMistInt);

}

function getRandomNumber() {
	return Math.floor(Math.random() * 4);
}

function addGamePiece() {
	gameState.push(getRandomNumber());
}

function makeActiveColor(num) {
	playAreas[num].classList.add('active');
} 
function removeActiveColor(num) {
	playAreas[num].classList.remove('active');
}

function playGameState() {
	clearAllTimeouts();
	if (!turnOnOffFlag) {
		return;
	}
	else {
		if (countGameProgress < gameState.length) {
		showRound();
		makeActiveColor(gameState[countGameProgress]);
		playSound();
		gameInterval = setTimeout(function() {
			removeActiveColor(gameState[countGameProgress]);
			countGameProgress++;
			setTimeout(function(){
				playGameState();
			}, 200);
			

	}, timeToNextPiece);
} else {
	clearAllTimeouts();
	playerPhase();
}
	}
	
	
	

}

function soundOnTouch(el) {
	sounds.forEach(function(sound) {
		if (sound.dataset.num === el.dataset.num) {
			sound.play();
		}
	})
}


function playSound(soundPiece) {
	sounds.forEach(function(sound) {
		if (Number(sound.dataset.num) === gameState[countGameProgress]) {
			sound.play();
		}
	});
}


function checkPlayerMoves() {
	timeToDecision = setTimeout(function() {
		writeText('too long!!!');
		makeClickable(0);
			setTimeout(function(){
				clearText();
				playGameState();
			}, 700);
		
		
	}, 2000);

}

function makeClickable(change) {
	if (change === 1) {
		clickableFlag = true;
		playAreas.forEach(function(area) {
			area.classList.add('clickable');
		});
	}
	else if (change === 0) {
		clickableFlag = false;
		playAreas.forEach(function(area) {
			area.classList.remove('clickable');
		});
	}
}
function playerPhase() {
	playerInt = setTimeout(function(){
		countGameProgress = 0;
		makeClickable(1);
		checkPlayerMoves();
		}, 200); 
}

function checkMove(el) {
	recentPlayerChoices.push(Number(el.dataset.num));
	console.log(recentPlayerChoices);
	console.log(gameState);
	if (recentPlayerChoices.toString() === gameState.toString()) {
		console.log('startNext');
		clearTimeout(timeToDecision);
		startNextRound();
	}
	else if (recentPlayerChoices[countGameProgress] === gameState[countGameProgress]) {
		clearTimeout(timeToDecision);
		clearAllTimeouts()
		console.log(timeToDecision);
		countGameProgress++;
		checkPlayerMoves();
	}
	else {
		console.log('wrong');
		clearAllTimeouts();
		console.log(recentPlayerChoices[countGameProgress]);
		console.log(gameState[countGameProgress]);
		clearTimeout(timeToDecision);
		gameAfterMistake();
	}
}

function writeText(text) {
	gameText.textContent = text;
}
function showRound() {
	if (gameState.length <= 9) {
		gameText.textContent = '0' + gameState.length;
	}
	else {
		gameText.textContent = gameState.length;
	}
}

function clearText() {
	gameText.textContent = '';
}

function startNextRound() {
	makeClickable(0);
	countGameProgress = 0;
	recentPlayerChoices = [];
	addGamePiece();
	//writeText('Next round');
	clearAllTimeouts();
	writeText('Next round');
	nextRoundInd = setTimeout(function(){
		clearText();
		playGameState();
	}, 1500);
}

function startGame() {
	addGamePiece();
	countGameProgress = 0;
	playGameState();	
}

function gameAfterMistake() {
	countGameProgress = 0;
	recentPlayerChoices = [];
	writeText('Wrong!!!');
	makeClickable(0);
	clearAllTimeouts();
	if (strictFlag) {
		setTimeout(startNewGame, 1000);
		return;
	}
	afterMistInt = setTimeout(function(){
		clearText();
		playGameState();
	}, 1500);
	
}

function turnOff() {
	countGameProgress = 0;
	recentPlayerChoices = [];
	makeClickable(0);
	clearAllTimeouts();
	clearText();
	gameState = [];
	playAreas.forEach(function(area) {
		if (area.classList.contains('active')) {
			area.classList.remove('active');
		}
	});
	start.classList.remove('active-start');
}

function removeStrict() {
	strictCheckbox.checked = false;
	strictFlag = false;
	if (strictChecker.classList.contains('strict-active')) {
		strictChecker.classList.remove('strict-active');
	}
}

function startNewGame() {
			clearAllTimeouts();
			clearText();
			console.log('clearAll');
			countGameProgress = 0;
			recentPlayerChoices = [];
			makeClickable(0);
			
			clearText();
			gameState = [];
			playAreas.forEach(function(area) {
			if (area.classList.contains('active')) {
				area.classList.remove('active');
					}	
				});
			writeText('new game');
			setTimeout(function() {
				clearText();
				startGame();
			}, 1000);
}

start.addEventListener('click', function(){
	if (turnOnOffFlag) {
		if (gameState.length !== 0) {
			startNewGame();	
		}
		else {
			startGame();
		}
		
	}
});

onOffButton.addEventListener('click', function(){
	if (!onOffCheckbox.checked) {
		onOffCheckbox.checked = true;
		gameCircle.classList.add('setup-active');
		turnOnOffFlag = true;
		start.classList.add('active-start');
		writeText('lets play');
	}
	else {
		gameCircle.classList.remove('setup-active');
		onOffCheckbox.checked = false;
		turnOnOffFlag = false;
		removeStrict()
		turnOff();
	}
});

playAreas.forEach(function(area){
	area.addEventListener('mousedown', function() {
		if (clickableFlag) {
			soundOnTouch(area);
			area.classList.add('active');
			checkMove(area);
		}
	});
	area.addEventListener('mouseup', function() {
			area.classList.remove('active');
	}); 

});

strictButton.addEventListener('click', function() {
	if (turnOnOffFlag) {
		if (!strictFlag) {
			strictCheckbox.checked = true;
			strictChecker.classList.add('strict-active');
			console.log(strictCheckbox.checked);
			strictFlag = true;
			console.log('strictMode');
		}
		else {
			removeStrict();
		}
	}
	
});






