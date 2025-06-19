// match cards

// === Sound ===
function playSound(){
    const audio = new Audio("/Assests/click-sound.wav");
    audio.play();
}

function playGameSound(){
    const audio = new Audio("/Assests/game sound.mp3");
    audio.play();
}

function playWinSound(){
    const audio = new Audio("/Assests/win sound.mp3");
    audio.play();
}

function playLoseSound(){
    const audio = new Audio("/Assests/fail.mp3");
    audio.play();
}

function playGameStartSound(){
    const audio = new Audio("/Assests/game-start sound.mp3");
    audio.play();
}

function playTipSound(){
    const audio = new Audio("/Assests/tip sound.mp3");
    audio.play();
}


// === Pages ===
const homePage = document.querySelector('.home-page');
const tipPage = document.querySelector('.tip-div');
const gamePage = document.querySelector('.game-page');
const resultPage = document.querySelector('.result-page');
const nextBtn = document.getElementById('next');
const newGameBtns = document.querySelectorAll('.start');
const timerDisplay = document.querySelector('.time');
const feedbackText = document.querySelector('.feedback');
const memoryLevel = document.querySelector('.myText p:nth-of-type(1)');
const finishedTime = document.querySelector('.myText p:nth-of-type(2)');

// Cards
const cardContainers = document.querySelectorAll('.div-container div');
let cardImages = [];
let flipped = [];
let matchedCount = 0;

// Timer
let seconds = 30;
let interval;

// Start Flow
newGameBtns[0].addEventListener('click', () => {
  playGameStartSound()
  playSound();
  homePage.style.display = 'none';
  tipPage.style.display = 'flex';
});

nextBtn.addEventListener('click', () => {
  playSound();
  tipPage.style.display = 'none';
  gamePage.style.display = 'flex';
  startGame();
});

// Game Setup
function startGame() {
  resetGame();
  shuffleCards();
  startTimer();
}

function resetGame() {
  seconds = 30;
  matchedCount = 0;
  flipped = [];
  timerDisplay.textContent = `00:30`;
  playGameSound();

  // Reset images and card divs
  cardContainers.forEach(div => {
    const img = div.querySelector('img');
    img.style.visibility = 'hidden';
    div.style.backgroundColor = '#CAB0FF';
    div.matched = false;
    div.classList.remove('matched');
  });

  // Shuffle cards
  shuffleCards();

  // Re-attach click events cleanly
  cardContainers.forEach(div => {
    div.removeEventListener('click', onCardClick); // Remove previous
    div.addEventListener('click', onCardClick);
  });
}

//Card Click Logic
function onCardClick(e) {
  const div = e.currentTarget;
  const img = div.querySelector('img');
  if (flipped.includes(div) || div.matched) return;

  playSound();
  img.style.visibility = 'visible';
  div.style.backgroundColor = '#A172FF';
  flipped.push(div);

  if (flipped.length === 2) {
    const [first, second] = flipped;
    const firstImg = first.querySelector('img').src;
    const secondImg = second.querySelector('img').src;

    if (firstImg === secondImg) {
      first.matched = true;
      second.matched = true;
      matchedCount += 2;
      flipped = [];

      playTipSound();
      first.style.backgroundColor = '#FF6D06';
      second.style.backgroundColor = '#FF6D06';

      if (matchedCount === 12) finishGame(true);
    } else {
      setTimeout(() => {
        flipped.forEach(div => {
          div.querySelector('img').style.visibility = 'hidden';
          div.style.backgroundColor = '#CAB0FF';
        });
        flipped = [];
      }, 800);
    }
  }
}

//Timer Logic
function startTimer() {
  interval = setInterval(() => {
    seconds--;
    timerDisplay.textContent = `00:${seconds < 10 ? '0' + seconds : seconds}`;

    if (seconds <= 0) {
      clearInterval(interval);
      finishGame(false);
    }
  }, 1000);
}

//End Game
function finishGame(won) {
  clearInterval(interval);
  gamePage.style.display = 'none';
  resultPage.style.display = 'flex';

  if (won) {
    playWinSound();
    feedbackText.textContent = '🎉\nYou did it';
    memoryLevel.textContent = '🧠 Memory level: Pro';
    finishedTime.textContent = `⌛ Finished in: ${30 - seconds} secs`;
  } else {
    playLoseSound();
    feedbackText.textContent = '😢\nTime’s Up!';
    memoryLevel.textContent = '🧠 Memory level: 😔';
    finishedTime.textContent = `⌛ You lasted: 30 secs`;
  }
}

//Restart Game from Result
newGameBtns[1].addEventListener('click', () => {
  playSound();
  resultPage.style.display = 'none';
  gamePage.style.display = 'flex';
  startGame();
});

//Shuffle Cards
function shuffleCards() {
  const images = Array.from(cardContainers).map(div => div.querySelector('img').src);
  const shuffled = [...images].sort(() => Math.random() - 0.5);

  cardContainers.forEach((div, i) => {
    const img = div.querySelector('img');
    img.src = shuffled[i];
    img.style.visibility = 'hidden'; // Make sure they're hidden again
  });
}
