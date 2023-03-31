let cards = document.querySelectorAll(".card");
let timerEl = document.querySelector("#timer");
let playAgainBtn = document.querySelector("#play-again");

const flipSound = new Audio("sounds/fist-punch-or-kick-7171.mp3");
const matchSound = new Audio("sounds/yay-6120.mp3");
const victorySound = new Audio("victory.mp3");
const failureSound = new Audio("failure.mp3");
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let numMatches = 0;
let numMoves = 0;
let timeLimit = 60; // 30 seconds time limit
let timeRemaining = timeLimit;
let timer;
let gameStarted = false;
let gameWon = false;

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  flipSound.play(); // Play flip sound effect
  this.classList.add("flip", "card-flip");

  if (!hasFlippedCard) {
    // first click
    hasFlippedCard = true;
    firstCard = this;
    if (!gameStarted) {
      gameStarted = true;
      startTimer();
    }
  } else {
    // second click
    hasFlippedCard = false;
    secondCard = this;
    numMoves++;

    if (firstCard.dataset.framework === secondCard.dataset.framework) {
      // cards match
      firstCard.removeEventListener("click", flipCard);
      secondCard.removeEventListener("click", flipCard);
      matchSound.play(); // Play match sound effect
      numMatches++;

      if (numMatches === cards.length / 2) {
        // all cards have been matched
        stopTimer();
        gameWon = true;
        victorySound.play();
      }
    } else {
      // cards don't match
      lockBoard = true;
      setTimeout(() => {
        firstCard.classList.remove("flip");
        secondCard.classList.remove("flip");
        lockBoard = false;
      }, 1000);
    }
  }
}

(function showBackCards() {
  setTimeout(() => {
    cards.forEach((card) => {
      card.classList.add("flip");
      setTimeout(() => {
        card.classList.remove("flip");
      }, 1000);
    });
  }, 2000);
})();

function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  matchSound.play(); // Play match sound effect

  resetBoard();
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");

    resetBoard();
  }, 1500);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function startTimer() {
  timer = setInterval(() => {
    timeRemaining--;
    document.getElementById("timer").textContent = `Time: ${timeRemaining}s`;

    if (timeRemaining <= 0) {
      if (gameWon == false) {
        // time's up
        clearInterval(timer);
        document.getElementById("timer").textContent = "Time: 0s";
        lockBoard = true;
        failureSound.play();
      } else {
        clearInterval(timer);
        document.getElementById("timer").textContent = "OMGARD u won";
      }
    }
  }, 1000);
}
function stopTimer() {
  clearInterval(timer);
  console.log(setInterval);
}

(function shuffle() {
  cards.forEach((card) => {
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  });
})();

cards.forEach((card) => card.addEventListener("click", flipCard));

startTimer();
