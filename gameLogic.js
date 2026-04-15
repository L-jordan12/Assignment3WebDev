import { streakImage } from './streak.js';
import { gameOver } from './uiEffects.js';
import { removeHeart } from './uiEffects.js';
import { markDot } from './uiEffects.js';


// Audio feedback for correct/wrong answers and game over
let correct_answer_noise = new Audio("Sounds/correctanswer.wav");
let wrong_answer_noise = new Audio("Sounds/wronganswer.mp3");
let score = 0;
let timerInterval;
let streak = 0;
let questionsAnswered = 0;
let questionIndex = 0;
let lives;
let questions;

//NEW FUNCTION THAT WILL START THE GAME 
export function startGame(importQuestions, importLives){

    if (!importQuestions || importQuestions.length === 0) {
        console.error("No questions found to start the game!");
        return; 
    }
    
    questions = importQuestions;
    lives = importLives;

    // RESET GAME STATE
    questionIndex = 0;
    score = 0;
    streak = 0;
    questionsAnswered = 0;
    questionAndAnswerLogic();
}



function questionAndAnswerLogic() {
    

    /* =============================================================
       questionAndAnswerLogic()
       This function is in charge of running through the overall flow 
       of the game. Starts out by grabbing correct and incorrect questions
       and then shuffling them. Next startTimer function is called to start
       the clock. Finally, the last part of the logic is that once a button is clicked,
       it compares the clicked value to the correct value. This part is done
       in a new function called checkAnswerVsQuestion to help reduce clutter.
       ============================================================= */

    clearInterval(timerInterval);

    var current_question = questions[questionIndex];

    // Combine incorrect and correct answers, then shuffle randomly
    var current_answers = [
        current_question.incorrect_answers,
        current_question.correct_answer,
    ];
    current_answers = current_answers.flat(Infinity);
    current_answers.sort(() => Math.random() - 0.5);

    let question = document.querySelector(".question-banner h2");
    let answerButtons = document.querySelectorAll(".answer-btn");

    startTimer();
    question.innerHTML = current_question.question;

    // Assign each shuffled answer to a button and set up click handlers
    answerButtons.forEach((btn, index) => {
        var answerText = current_answers[index];
        btn.innerHTML = `${answerText}<span class="key-hint">${index + 1}</span>`;
        btn.onclick = () => {
            checkAnswerVsQuestion(current_answers[index], current_question.correct_answer, btn, current_answers, current_question, answerButtons);
        };
    });
}

//This function is in charge of checking if the answers are correct, and if so, updating the score, streak, and background color.
function checkAnswerVsQuestion(playerAnswer, correctAnswer, btn, current_answers, current_question, answerButtons) {
    var isCorrect = playerAnswer === correctAnswer;

    if (isCorrect) {
        // Correct answer: play sound, highlight green, add streak bonus
        correct_answer_noise.play();
        clearInterval(timerInterval);
        btn.style.backgroundColor = "green";
        streak++;
        score += 10 * streak;
        //Display the streak gif if a streak occured
        streakImage(streak);
        questionsAnswered += 1;
        document.querySelectorAll(".answer-btn").forEach((button) => {
            button.disabled = true;
        });
        document.getElementById("score").textContent = score;
        markDot(questionIndex, true);

        // Wait 2 seconds to show feedback, then advance
        setTimeout(() => {
            document.querySelectorAll(".answer-btn").forEach((button) => {
                button.style.backgroundColor = "";
                button.disabled = false;
            });
            clearInterval(timerInterval);
            nextQuestion();
        }, 2000);
    } else {
        // Wrong answer: highlight red, show correct answer in green
        document.querySelectorAll(".answer-btn").forEach((button) => {
            button.disabled = true;
        });
        wrong_answer_noise.play();
        streak = 0;
        //Remove the streak gif if question answered wrong 
        streakImage(streak);
        clearInterval(timerInterval);
        btn.style.backgroundColor = "red";

        // Reveal the correct answer by highlighting it in green
        answerButtons.forEach((button, i) => {
            if (current_answers[i] === current_question.correct_answer) {
                button.style.backgroundColor = "green";
            }
        });

        lives--;
        removeHeart();
        markDot(questionIndex, false);

        // If no lives left, end the game after showing feedback
        if (lives <= 0) {
            btn.disabled = true;
            lives = 0;
            setTimeout(() => {
                gameOver(lives, score, questionsAnswered);
            }, 2000);
            return;
        }

        // Wait 2 seconds to show feedback, then advance
        setTimeout(() => {
            document.querySelectorAll(".answer-btn").forEach((button) => {
                button.style.backgroundColor = "";
                button.disabled = false;
            });
            clearInterval(timerInterval);
            nextQuestion();
        }, 2000);
    }

}



/* =============================================================
   startTimer()
   Runs a 15-second countdown for each question. Updates the
   display every second. When 5 seconds remain, adds a flashing
   red warning animation. At 0 seconds, deducts a life and
   either ends the game or advances to the next question.
   ============================================================= */
function startTimer() {
    let timerElement = document.getElementById("timer");
    let timeRemaining = 15;
    let timerContainer = document.getElementById("timer-container");
    timerContainer.classList.remove("timer-warning");
    timerElement.textContent = timeRemaining;

    timerInterval = setInterval(() => {
        timeRemaining--;
        timerElement.textContent = timeRemaining;

        // Flash red warning when time is running low
        if (timeRemaining <= 5) {
            timerContainer.classList.add("timer-warning");
        }

        // Time's up: penalize the player and move on
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            markDot(questionIndex, false);
            lives--;
            removeHeart();
            if (lives === 0) {
                setTimeout(() => {
                    gameOver(lives, score, questionsAnswered);
                }, 2000);
                return;
            }
            nextQuestion();
        }
    }, 1000);
}


// Advances to the next question, or ends the game if all questions answered
function nextQuestion() {
    questionIndex++;
    if (questionIndex >= questions.length) {
        gameOver(lives, score, questionsAnswered);
        return;
    }
    questionAndAnswerLogic();
}

