'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2025-08-22T17:01:17.194Z',
    '2025-08-27T23:36:17.929Z',
    '2025-08-28T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const formatMovementDate = function (locale, date) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed == 0) return 'Today';
  else if (daysPassed == 1) return 'Yesterday';
  else if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value.toFixed(2));
};

const displayMovements = function (acc, sort = false) {
  // Empty the container
  containerMovements.innerHTML = '';

  const combinedMovsDates = acc.movements.map((mov, i) => ({
    movement: mov,
    movementDate: acc.movementsDates.at(i),
  }));

  if (sort) combinedMovsDates.sort((a, b) => a.movement - b.movement);

  // Display each movement
  combinedMovsDates.forEach(function (obj, i) {
    const { movement, movementDate } = obj;
    const type = movement > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(movementDate);
    const displayDate = formatMovementDate(acc.locale, date);

    const formattedMovement = formatCur(movement, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
            <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">${displayDate}</div>
            <div class="movements__value">${formattedMovement}</div>
      </div>
    `;

    // Insert from the top (after begin)
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Calculate the balance by adding all the movements
const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce(
    (acc, movement) => acc + movement,
    0
  );
  labelBalance.textContent = `${formatCur(
    account.balance,
    account.locale,
    account.currency
  )}`;
};

const calcDisplaySummary = function (account) {
  const movements = account.movements;
  const interestRate = account.interestRate;

  const incomes = movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  const outcomes = movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  const interest = movements
    .filter(mov => mov > 0)
    .map(depo => (depo * interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);

  labelSumIn.textContent = `${formatCur(
    incomes,
    account.locale,
    account.currency
  )}`;
  labelSumOut.textContent = `${formatCur(
    Math.abs(outcomes),
    account.locale,
    account.currency
  )}`;
  labelSumInterest.textContent = `${formatCur(
    interest,
    account.locale,
    account.currency
  )}`;
};

// Create usernames by concatenating the first letter of each name (in lower case)
const createUsernames = function (accounts) {
  accounts.forEach(function (account) {
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (account) {
  // Display current movements
  displayMovements(account);

  // Display balance
  calcDisplayBalance(account);

  // Display summary
  calcDisplaySummary(account);
};

const startLogOutTimer = function () {
  // Set time to 5 minutes
  let time = 5 * 60;
  const tick = function () {
    // print remaining time to UI
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;

    // when 0 seconds, stop and log out
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }

    // reduce 1 second
    time--;
  };
  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  //
  return timer;
};

///////////////////////////////////////
// Event handlers
let currentAccount, timer;

btnLogin.addEventListener('click', function (e) {
  // Prevent from submitting (reloading the page)
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    // remove the curser
    inputLoginUsername.blur();
    inputClosePin.blur();

    // Display Welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    // Display UI
    containerApp.style.opacity = 1;

    // Display date using Intl
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    updateUI(currentAccount);
  } else {
    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    // remove the curser
    inputLoginUsername.blur();
    inputClosePin.blur();

    // Display Error message
    labelWelcome.textContent = `Wrong username or pin number`;

    // Hide UI
    containerApp.style.opacity = 0;
  }
});

btnTransfer.addEventListener('click', function (e) {
  // Prevent from submitting (reloading the page)
  e.preventDefault();

  const amout = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amout > 0 &&
    receiverAcc &&
    currentAccount.balance >= amout &&
    receiverAcc.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amout);
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movements.push(amout);
    receiverAcc.movementsDates.push(new Date().toISOString());

    inputTransferTo.blur();
    inputTransferAmount.blur();

    updateUI(currentAccount);

    // Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const loan = Math.floor(inputLoanAmount.value);

  if (loan > 0 && currentAccount.movements.some(mov => mov >= loan * 0.1)) {
    setTimeout(function () {
      currentAccount.movements.push(loan);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);

      inputLoanAmount.value = '';
      inputLoanAmount.blur();
    }, 3000);
  }

  // Reset timer
  clearInterval(timer);
  timer = startLogOutTimer();
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const accIndex = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    // Delete account
    accounts.splice(accIndex, 1);
    console.log(accIndex, accounts);

    // Hide UI
    containerApp.style.opacity = 0;

    // Display welcome message
    labelWelcome.textContent = 'Log in to get started';
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sortedState = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  sortedState = !sortedState;
  displayMovements(currentAccount, sortedState);
});
