/* =============================================================
   Global State
   Tracks the current game session: score, lives, question progress,
   and answer streak for the bonus multiplier.
   Imports from streak.js (modules)
   ============================================================= */

import { startGame } from './gameLogic.js';

let lives;
let questions = [];



/* =============================================================
   Keyboard Controls
   Allows players to select answers using number keys 1-4.
   The event listener checks if the game is active (buttons enabled)
   before triggering a click on the corresponding answer button.
   ============================================================= */
document.addEventListener("keydown", (e) => {
  // Number keys 1-4 select answer buttons during gameplay
  const key = parseInt(e.key);
  if (key >= 1 && key <= 4) {
    const buttons = document.querySelectorAll(".answer-btn");
    if (buttons[key - 1] && !buttons[key - 1].disabled) {
      buttons[key - 1].click();
    }
  }

  // Got rid of space bar start on home screen when not hovering
  // Space bar triggers Play or Play Again buttons
  if (e.key === " " || e.code === "Space") {
    //e.preventDefault();
    //const playBtn = document.getElementById("btn1");
    const restartBtn = document.getElementById("restart-btn");
    //if (playBtn && playBtn.offsetParent !== null) {
      //playBtn.click();
    //} 
    // else
    if (restartBtn && restartBtn.offsetParent !== null) {
      restartBtn.click();
    }
  }
});




/* =============================================================
   initQuiz()
   Entry point when the player clicks PLAY. Handles:
   1. Setting lives based on difficulty selection
   2. Animating the logo from the home screen into the top bar
   3. Running a 3-2-1 countdown before the first question
   4. Fetching questions from the API (started early, awaited later)
   ============================================================= */
async function initQuiz() {
  // Start the API fetch immediately so data loads during the countdown
  const dataPromise = fetchData();

  // Set lives based on selected difficulty
  const difficulty = document.getElementById("difficulty-select").value;
  if (difficulty === "easy") {
    lives = 5;
  } else if (difficulty === "hard") {
    lives = 3;
  } else {
    lives = 4;
  }

  // Dynamically generate heart icons to match the number of lives
  const livesContainer = document.getElementById("lives-container");
  livesContainer.innerHTML = '<span class="sr-only">Lives remaining:</span> ';
  for (let i = 0; i < lives; i++) {
    const heart = document.createElement("img");
    heart.className = "heart";
    heart.src = "Images/heart.png";
    heart.alt = "Life";
    livesContainer.appendChild(heart);
  }

  /* --- Logo animation: moves the home screen logo into the top bar --- */

  // Capture logo position before any layout changes happen
  const logo = document.querySelector(".title");
  const logoRect = logo.getBoundingClientRect();

  // Move logo out of its container into body so it stays visible during transition
  document.body.appendChild(logo);

  // Pin logo at its current position using fixed positioning
  logo.style.position = "fixed";
  logo.style.left = logoRect.left + "px";
  logo.style.top = logoRect.top + "px";
  logo.style.width = logoRect.width + "px";
  logo.style.height = logoRect.height + "px";
  logo.style.zIndex = "100";

  // Switch from welcome screen to game layout
  document.getElementById("welcome-screen").style.display = "none";
  document.querySelector("header").style.display = "none";
  document.querySelector(".overall_page").style.padding = "0";
  document.querySelector(".overall_page").style.border = "none";
  document.querySelector(".overall_page").style.margin = "0";
  document.querySelector(".question-banner").style.display = "none";
  document.querySelector(".answers").style.display = "none";
  document.getElementById("game-container").style.display = "flex";

  // Calculate where the top bar logo sits, then animate toward it
  const topBarLogo = document.querySelector(".top-bar-logo");
  const targetRect = topBarLogo.getBoundingClientRect();

  // Force a reflow so the CSS transition triggers from the current position
  logo.offsetHeight;
  logo.classList.add("title-animating");
  logo.style.left = targetRect.left + "px";
  logo.style.top = targetRect.top + "px";
  logo.style.width = targetRect.width + "px";
  logo.style.height = targetRect.height + "px";

  /* --- Countdown: 3, 2, 1 before the first question --- */
  const overlay = document.createElement("div");
  overlay.id = "countdown-overlay";
  document.getElementById("game-container").appendChild(overlay);

  for (let i = 3; i >= 1; i--) {
    overlay.textContent = i;
    await new Promise(r => setTimeout(r, 1000));
  }

  // Swap: reveal the real top bar logo and clean up the animated one
  topBarLogo.style.visibility = "";
  logo.remove();
  overlay.remove();
  document.querySelector(".question-banner").style.display = "";
  document.querySelector(".answers").style.display = "";

  // Await the API data that was fetched during the countdown
  const data = await dataPromise;
  questions = data.results;
  
  //New module function call
  startGame(questions, lives);
}

/* =============================================================
   fetchData()
   Fetches trivia questions from the Open Trivia DB API.
   Builds the URL with optional category and difficulty filters.
   Falls back to a local JSON file if the API is unavailable.
   ============================================================= */
async function fetchData() {
  try {
    const categorySelect = document.getElementById("category-select");
    const categoryID = categorySelect.value;

    let apiUrl = `https://opentdb.com/api.php?amount=10&type=multiple`;
    if (categoryID) {
      apiUrl += `&category=${categoryID}`;
    }
    const difficultySelect = document.getElementById("difficulty-select").value;
    if (difficultySelect) {
      apiUrl += `&difficulty=${difficultySelect}`;
    }
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    // If the API fails (rate limit, network error), load fallback questions
    console.error("API fetch failed, loading fallback questions:", error);
    const fallback = await fetch("triviaAPI.json");
    const data = await fallback.json();
    return data;
  }
}

//Since script.js is a module this is needed to be able to click the button
window.initQuiz = initQuiz;