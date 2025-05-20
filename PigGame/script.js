'use strict';

// Selecting elements
const score0El = document.querySelector('#score--0');
const score1El = document.querySelector('#score--1');
const current0El = document.querySelector('#current--0');
const current1El = document.querySelector('#current--1');
const diceEl = document.querySelector('.dice');
const btnRoll = document.querySelector('.btn--roll');
const btnNew = document.querySelector('.btn--new');
const btnHold = document.querySelector('.btn--hold');
const player0 = document.querySelector('.player--0');
const player1 = document.querySelector('.player--1');

// Initail states
score0El.textContent = 0;
score1El.textContent = 0;
diceEl.classList.add('hidden');

// Needed vars
let currentPlayer = 0;
let currentScore0 = 0,
  currentScore1 = 0;
let finalScore0 = 0,
  finalScore1 = 0;
let playing = true;

// Functions
const rollDice = function () {
  if (playing) {
    // Generate a random dice number
    const diceNum = Math.trunc(Math.random() * 6) + 1;

    // Show dice
    diceEl.classList.remove('hidden');
    diceEl.src = `dice-${diceNum}.png`;

    // Switch if the number is 1
    if (diceNum != 1) {
      // Add score
      if (currentPlayer) {
        currentScore1 += diceNum;
        current1El.textContent = currentScore1;
      } else {
        currentScore0 += diceNum;
        current0El.textContent = currentScore0;
      }
    } else {
      // Switch players
      switchPlayers();
    }

    checkForWinner();
  }
};

const switchPlayers = function () {
  if (currentPlayer) {
    current1El.textContent = '0';
    currentPlayer = 0;
    currentScore1 = 0;
  } else {
    current0El.textContent = '0';
    currentPlayer = 1;
    currentScore0 = 0;
  }
  player0.classList.toggle('player--active');
  player1.classList.toggle('player--active');
};

const hold = function () {
  if (playing) {
    if (currentPlayer) {
      finalScore1 += currentScore1;
      score1El.textContent = finalScore1;
    } else {
      finalScore0 += currentScore0;
      score0El.textContent = finalScore0;
    }
    switchPlayers();
    checkForWinner();
  }
};

const checkForWinner = function () {
  if (finalScore0 >= 100) {
    // player 0 wins
    player0.classList.remove('active--player');
    player0.classList.add('player--winner');
    playing = false;
    diceEl.classList.add('hidden');
  } else if (finalScore1 >= 100) {
    // player 1 wins
    player1.classList.remove('active--player');
    player1.classList.add('player--winner');
    playing = false;
    diceEl.classList.add('hidden');
  }
};

// Rolling the dice
btnRoll.addEventListener('click', rollDice);

// Hold
btnHold.addEventListener('click', hold);

// New game
btnNew.addEventListener('click', function () {
  playing = true;
  score0El.textContent = 0;
  score1El.textContent = 0;
  current1El.textContent = 0;
  current0El.textContent = 0;
  diceEl.classList.add('hidden');
  currentPlayer = 0;
  (currentScore0 = 0), (currentScore1 = 0);
  (finalScore0 = 0), (finalScore1 = 0);
  player0.classList.add('player--active');
  player1.classList.remove('player--active');
  player0.classList.remove('player--winner');
  player1.classList.remove('player--winner');
});
