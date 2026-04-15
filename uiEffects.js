/* =============================================================
   gameOver()
   Transitions to the end screen. Shows win or loss message based
   on remaining lives. Updates high score in localStorage if the
   current score is a new record.
   ============================================================= */
export function gameOver(lives, score, questionsAnswered) {
    let answerButtons = document.querySelectorAll(".answer-btn");
    answerButtons.forEach((btn) => {
        btn.disabled = true;
    });

    // Hide game and welcome screens, show game over screen
    document.getElementById("welcome-screen").style.display = "none";
    document.querySelector("header").style.display = "none";
    document.getElementById("game-over-container").style.display = "flex";
    document.getElementById("game-container").style.display = "none";

    // Display win or loss heading based on remaining lives
    if (lives > 0) {
        document.getElementById("game-over-heading").textContent = "You Win!";
        document.getElementById("game-over-heading").style.color = "green";
    } else {
        document.getElementById("game-over-heading").textContent = "Game Over!";
        document.getElementById("game-over-heading").style.color = "red";
    }

    // Check and update high score using localStorage for persistence
    let highScore = localStorage.getItem("highScore") || 0;

    document.getElementById("final-score").textContent = `Score: ${score}`;
    document.getElementById("questions-correct").textContent = `Correct Answers: ${questionsAnswered}`;

    if (score > highScore) {
        localStorage.setItem("highScore", score);
        highScore = score;
        document.getElementById("high-score").textContent = `Best Score: ${highScore} - New Record!`;
    } else {
        document.getElementById("high-score").textContent = `Best Score: ${highScore}`;
    }
}





// Removes the last heart icon from the lives display
export function removeHeart() {
    const hearts = document.querySelectorAll(".heart");
    if (hearts.length > 0) {
        hearts[hearts.length - 1].remove();
    }
}

// Updates a progress dot to show correct (green) or wrong (red)
export function markDot(index, correct) {
    let dots = document.querySelectorAll(".progress-dot");
    if (dots[index]) {
        dots[index].classList.add(correct ? "correct" : "wrong");
    }
}