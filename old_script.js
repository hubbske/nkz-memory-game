const cards = document.querySelectorAll(".card");
const flipSound = new Audio("sounds/fist-punch-or-kick-7171.mp3");
const matchSound = new Audio("sounds/yay-6120.mp3");
const victorySound = new Audio("victory.mp3");

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let numMatches = 0;
let numMoves = 0;
let timeLeft = 60;

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  flipSound.play(); // Play flip sound effect

  this.classList.add("flip");

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return;
  }

  secondCard = this;
  checkForMatch();
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
  let timer = setInterval(function () {
    timeLeft--;
    document.getElementById("time-left").innerHTML = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      alert("Time's up! You lose.");
    }
  }, 1000);
}

(function shuffle() {
  cards.forEach((card) => {
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  });
})();

cards.forEach((card) => card.addEventListener("click", flipCard));
startTimer();
