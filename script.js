"use strict";

// INITIALIZATION
const numberInput = document.querySelector(".inputNumber");
const checkButton = document.querySelector(".buttonCheck");
const triesLabel = document.querySelector(".labelTries");
const highScoreLabel = document.querySelector(".labelHighScore");
const newPlayerButton = document.querySelector(".buttonNewPlayer");
const winner_loser = document.querySelector(".winner_loser");
const rangeWarning = document.querySelector(".rangeWarning");
const higher_lower = document.querySelector(".higher_lower");
const guessesDisp = document.querySelector(".guesses");
const correctNumberLabel = document.querySelector(".correctNumberLabel");
const difficultySelector = document.querySelector(".selectorDifficulty");
const numbersSelector = document.querySelector(".selectorNumbers");
const startButton = document.querySelector(".buttonStart");
const difficultyPar = document.querySelector(".parDifficulty");
const challengeMessage = document.querySelector(".challengeMessage");
const playerNameInput = document.querySelector(".inputPlayerName");
const playerNameSpan = document.querySelector(".welcome");
const highestScorerLabel = document.querySelector(".labelHighestScorer");
const welcome = document.querySelector(".welcome");
const enterName = document.querySelector(".buttonEnter");
const endGameButton = document.querySelector(".buttonEndGame");
const selectors = document.querySelector(".selectors");

// global variables
let range;
let difficulty;
let tries;
let secretNumber;
let guesses = [];
let level;
let thisLevel;
let highScore;
let data = JSON.parse(localStorage.getItem("scores"));
let highScores = data;
let highScorers;

disableGame();

////////////////////////////ALL BUTTONS////////////////////////////////////////////////////////////////////////////

enterName.addEventListener("click", function () {
  let playerName = playerNameInput.value;
  welcome.textContent = playerName;
  triesLabel.textContent = tries;
  enterName.disabled = true;
  playerNameInput.disabled = true;
});

startButton.addEventListener("click", function () {
  clearFields();
  enableGame();
  resetValues();
  clearLabels();
  thisLevel = highScores.find((e) => e.levelName == level);
  highScore = thisLevel.highscore;
  highScorers = thisLevel.players;
  highScoreLabel.textContent = `${highScore} ${highScorers}`;
  numbersSelector.disabled = true;
  difficultySelector.disabled = true;
  startButton.disabled = true;

  newNumber();
  challengeMessage.textContent = `I'm thinking of a number between 1 and ${range}.🤔 
  Try guess my secret
  number in ${tries} tries or less!`;
  triesLabel.textContent = tries;
});

// *this button implements the game logic, see bottom of this code for explanation of how it works*
checkButton.addEventListener("click", function () {
  thisLevel = highScores.find((e) => e.levelName == level);
  const currentNumber = Number(numberInput.value);
  guesses.push(currentNumber);
  guessesDisp.textContent = guesses;
  tries--;
  triesLabel.textContent = tries;
  if (!(currentNumber > 0 && currentNumber <= range)) {
    rangeWarning.textContent = `Enter a number between 1 and ${range}!`;
    rangeWarning.style.backgroundColor = "red";
  } else {
    rangeWarning.textContent = "";
    if (!(currentNumber === secretNumber)) {
      if (!(tries > 0)) {
        disableGame();
        clearFields();
        newPlayerButton.disabled = false;
        endGameButton.disabled = false;
        document.body.style.backgroundColor = "red";
        const loserMessage = `You lose!`;
        correctNumberLabel.textContent = `Correct number is ${secretNumber}`;
        winner_loser.textContent = loserMessage;
      } else {
        if (currentNumber > secretNumber)
          higher_lower.textContent = "Try lower!📉";
        else {
          higher_lower.textContent = "Try higher!📈";
        }
      }
    } else {
      checkButton.disabled = true;
      higher_lower.textContent = "";
      if (tries > thisLevel.highscore) {
        thisLevel.highscore = tries;
        highScoreLabel.textContent = highScore;
        thisLevel.players.splice(0, thisLevel.players.length);
        thisLevel.players.push(playerNameSpan.textContent);
        thisLevel.highscore = tries;
        highScoreLabel.textContent = `${thisLevel.highscore} ${thisLevel.players}`;
      } else if (tries === thisLevel.highscore) {
        thisLevel.players.push(playerNameSpan.textContent);
        highScoreLabel.textContent = `${thisLevel.highscore} ${thisLevel.players}`;
      }
      localStorage.setItem("scores", JSON.stringify(highScores));
      document.body.style.backgroundColor = "green";
      disableGame();
      clearFields();
      newPlayerButton.disabled = false;
      endGameButton.disabled = false;
      const winnerMessage = `Correct!`;
      winner_loser.textContent = winnerMessage;
      correctNumberLabel.textContent = `Correct number is ${currentNumber}`;
    }
  }
});

newPlayerButton.addEventListener("click", function () {
  enableGame();
  clearFields();
  clearLabels();
  resetValues();
  newNumber();
});

endGameButton.addEventListener("click", function () {
  disableGame();
  clearFields();
  clearLabels();
  resetValues();
  highScoreLabel.textContent = null;
  numbersSelector.disabled = false;
  difficultySelector.disabled = false;
  startButton.disabled = false;
  tries = null;
  triesLabel.textContent = tries;
});

////////////////////// UTILITY FUNCTIONS//////////////////////////////////////////////////////////////

function newNumber() {
  secretNumber = Math.floor(Math.random() * range) + 1;
}

function clearFields() {
  playerNameInput.value = null;
  numberInput.value = null;
}

function clearLabels() {
  higher_lower.textContent = "";
  rangeWarning.textContent = "";
  correctNumberLabel.textContent = "?";
  winner_loser.textContent = "";
  welcome.textContent = "";
  guessesDisp.textContent = "";
}

function resetValues() {
  document.body.style.backgroundColor = "#2e2d2d";
  range = Number(numbersSelector.options[numbersSelector.selectedIndex].text);
  difficulty = difficultySelector.selectedIndex;
  tries = Math.trunc(range / (difficulty + 1) - range / 10);
  triesLabel.textContent = tries;
  level = `${numbersSelector.options[numbersSelector.selectedIndex].text}${
    difficultySelector.options[difficultySelector.selectedIndex].text
  }`.replaceAll(" ", "");
}

function disableGame() {
  newPlayerButton.disabled = true;
  checkButton.disabled = true;
  numberInput.disabled = true;
  playerNameInput.disabled = true;
  enterName.disabled = true;
  endGameButton.disabled = true;
}

function enableGame() {
  newPlayerButton.disabled = false;
  checkButton.disabled = false;
  numberInput.disabled = false;
  playerNameInput.disabled = false;
  enterName.disabled = false;
  endGameButton.disabled = false;
}

/////////////////////////// CHECK NUMBER BUTTON LOGIC////////////////////////////////////////////////////////////////////////////////

// Accept User input
// Display new guess
// Reduce number of tries left by 1
// Check if number between 1 and 30
// If not, display invalid input message
// Check if number is secret number
// If not secret number
//  Check number of tries left
//  If less than one
//    Disable check button
//    Display loser message
//   Else if greater than zero
//    Check if number higher or lower than secret number
//    If lower, display go lower
//    If higher, display go higher
// If secret number
//  Disable check button
//  Check if tries left > high score
//    If greater, replace high score with tries left
//    If equal, add name to high score
//  Disable check button
//  Display winner message
