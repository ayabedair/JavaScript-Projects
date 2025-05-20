'use strict';

let secretNumber = Math.trunc(Math.random() * 20) + 1;

const initScore = Number(document.querySelector('.score').textContent);

let score = initScore;

let maxScore = 0;

const displayMessage = function (message) {
  document.querySelector('.message').textContent = message;
};

const check = function () {
  const guess = Number(document.querySelector('.guess').value);

  // No Input
  if (!guess) {
    document.querySelector('.message').textContent = 'No Input!!';
  }
  // Player Wins
  else if (guess === secretNumber) {
    displayMessage('🎊 Correct Number');

    // Change background color
    document.querySelector('body').style.backgroundColor = '#60b347';

    // Show the number With different width
    document.querySelector('.number').textContent = secretNumber;
    document.querySelector('.number').style.width = '30rem';

    // Update highest score
    if (score > maxScore) {
      maxScore = score;

      // Set highest score
      document.querySelector('.highscore').textContent = maxScore;
    }
  }
  // Guesses
  else if (score > 1) {
    displayMessage(guess > secretNumber ? '⬆️Too High!' : '⬇️Too Low!');

    // Update score
    score--;
    document.querySelector('.score').textContent = score;
  }
  // No more Guesses
  else {
    displayMessage('☠️You Lost');
    document.querySelector('.score').textContent = 0;
  }
};

document.querySelector('.check').addEventListener('click', check);
document.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') check();
});

document.querySelector('.again').addEventListener('click', function () {
  // Generate new secrete number
  secretNumber = Math.trunc(Math.random() * 20) + 1;

  // Reset score
  document.querySelector('.score').textContent = initScore;

  // Start Guessing
  displayMessage('Start guessing...');

  // Reset background color
  document.querySelector('body').style.backgroundColor = '#222';

  // Reset the score lable
  document.querySelector('.number').textContent = '?';
  document.querySelector('.number').style.width = '15rem';

  // Set highest score
  document.querySelector('.highscore').textContent = maxScore;
});
