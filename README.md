Luke Jordan 
Assignment 3: Modular Refactoring 
#
#
# Warning: The Open Trivia Database is having a lot of issues when running the application.
# Both this version, and the old fully working assignment 2 version will only display 1 set of questions
# completely disregarding the chosen topic. The application on both versions will also take around 1-2 minutes 
# to load the questions. After looking into it, me and Dakota had found out that our IP had been banned from accessing 
# the open trivia database for some reason. 
#
# Everything works the exact same on this new refactored version as it did on the old assignment 2 version.
#
#
 

# Task 1: Modular Architecture Proposal 

Analyze your current Assignment 2 Code and propose a modular design using ES6 modules with proper separation of concerns. Document it in your report. 

# a) Describe your current architecture. Short description of how your JavaScript code is 

organized, addressing the following: 

▪ How many JavaScript files do you have? 

▪ What does each file do? 

▪ Where are responsibilities mixed together? 

Create a file/module dependency diagram that visualizes your current code 

organization. Use LucidApp to generate your diagram. Export the diagram as an image 

and embed it in your README file. Diagram example: 

 

The current architecture of our code from assignment 2 is extremely simple and barebones. We only have 2 java script files that are doing anything, and those 2 files are: Script.js and Streak.js. The Script.js file is the main java script file that runs almost all of our java script code. There are a lot of responsibilities within this file since it pretty much does everything, these things include: Sound/Audio, Controls, Small visual functions for health and number of questions correct, intro screen event handlers, visual effects for the screen, game state switching, fetching data from the open trivia database, actual game logic, and finally game over state. This file will be extremely important to refactor due to almost all of the java script code being in one file, and I will need to make sure that I group things based on what they do, so the code and game logic don’t break. For the other file, Streak.js, it is just a single modular function that controls the logic of if a player is on a streak in the game. This file will likely stay the same as the function is separated perfectly from all the code in Script.js. The problem with our current layout of how we have our java script files structured is that the Script.js violates the single responsibility principle due to the many different responsibilities that are overlapping.  

 

Diagram 1: 
![Original Code without modular redesign](LucidAppCharts/Original%20Module%20Layout.png)



# b) Propose a modular design using ES6 modules with proper separation of concerns. 

Design a future modular structure with at least three modules, each with a single clear 
responsibility, and propose any refactoring needed. 

- For each module, list its name, a one-sentence description of its responsibility, 	and a few bullet points of what functions, classes, or variables it would expose. 

- For each refactor item, a one-sentence description of its purpose. Consider the 

following Code Quality Standards if you have not already: 

a. Naming conventions 

b. Single responsibility principle 

c. Don’t Repeat Yourself (DRY) principle 

d. Error Handling (apply if relevant) 

- Create a file/module dependency diagram that visualizes your new code 		organization. 

Use LucidApp to generate your diagram. Export the diagram as an image and embed it 

in your README file 

 

 

For a future modular structure, I think there are 3 important modules that could be created to help with the overall organization and design of the code. These modules being: gameLogic.js, fetchLogic.js, and uiEffects.js. 

 
* gameLogic.js: This module would oversee most of the game logic, specifically, it will be in charge of displaying the questions and answers after you guess and will make sure to keep track of the score. 

    EXPOSES: 
    - displayQuestionsAndAnswers() - This method checks if the answer is correct or 	not, and also oversees displaying the streak and keeping track of the user score.	

    - startTimer() - Controlling the in-game timer to answer the question, penalizing the 	player if time is up, and flashing red if the player is low on time. 

    - nextQuestion() - advancing to the next question no matter if the player got it right or 	wrong. 

    - Game state variables (score, lives, streak, questions Array) 

 

* fetchLogic.js: This module would strictly deal with fetching and grabbing the data for the questions from the Open Trivia Database. 

    EXPOSES: 
    - fetchData() - Selecting a specific category, and selecting a difficulty level 

 

* uiEffects.js: This module would deal with just small methods that effect the overall look of the game, like the module that already exists, streak.js. 

    EXPOSES: 
    - removeHeart() - Removes one of the pixel art hearts from the top, displaying that the player has lost a life 

    - markDot() - Updates the progress dot/bar at the very top of the screen while playing based on if the user got the question right or wrong. 

    - streakImage() - Updates the UI to show that the player has answered multiple questions in a row and is now displaying a streak. 

    - All logic for the sounds 

Diagram 2:
![Proposed Modular Design](LucidAppCharts/Proposed%20Modular%20Design.png)

 
 

# Task 2: Implement at least 2 refactor changes

# a) Select 2 module-level refactors and implement them in your copy of the repository.
Requirements:
- Your modules must use proper syntax to expose or bring in dependencies from
functions, classes, or variables.
- You must extract logic and split it into separate files. Simple renaming or moving
a simple function alone does not count as a full change.
- The refactor changes must be drawn from the modular design you proposed in
Task 1.
- Functional equivalence: Your refactored code must work identically to your
original Assignment 2 submission:
▪ All features must remain functional
▪ User experience should be unchanged
▪ No features removed or broken during refactoring

# b) Document the changes in the report. List each refactored module, including a short,
# structured bullet-point description that explains its purpose and the changes made.

 NOT NEEDED, But final updated Diagram after making revisions:
 ![Final Diagram Used](LucidAppCharts/Final%20Diagram%20Used.png)


The two modules I decided to refactor were gameLogic.js and uiEffects.js 
# gameLogic.js: 

* There are a lot of new methods within this new java script file called gameLogic.js 

* The reason I decided to create a module for the gameLogic was because so much of the code originally was focused on the game logic, and a lot of the gameLogic code was mixed in with other things like the UI and fetching the actual data. 

* For starters, I moved almost every single variable into the gameLogic.js file because almost every variable was used strictly in functions that dealt with the game's logic. 

* There are also 4 different imports from the uiEffects.js file that deal with changing the UI after a specific event happens. 

* The very first function in gameLogic.js is a new method called startGame(). This function is called in script.js, and the main function of it is to reset the score after each round as well as call the function that handles all the logic within the game. 

* I decided to create this new function because the original function displayQuestionAndAnswers() dealt with so many different things, that I thought it would just be easier to split up all the different parts of it for readability and clarity reasons. 

* Next, there is a function called checkAnswerVsQuestion(). This function oversees checking if the players Answer matches the correct answer or not. Within this code there are also several method calls from the uiEffects module to have the UI change depending on if the player got the question right or wrong, or even if the player is on a streak. I also decided to create this new method because this was also part of the original displayQuestionAndAnswers() and the code was somewhat cluttered which made it hard to see exactly what was going on. 

* Next is the startTimer() function. This function is the exact same as it was when it was in the script.js file. I decided to move this file into the gameLogic.js file because the timer is a big part of the game, and without its logic you could take forever to guess the questions. 

* The final method that I added to gameLogic.js was nextQuestion() function. This function also remained pretty much the same as before. I decided to move this function into gameLogic.js because part of the logic is being able to move to the next question. 

* Overall, after creating this new file to handle pretty much all the games logic, the code is much easier to read and troubleshoot if there are errors, as everything for how the games logic works is in one spot. 

 

# uiEffects.js: 

* This module was made to handle the smaller methods that did things regarding the user interface while playing. 

* Originally, all the functions were in script.js 

* The first function is gameOver(). This function oversees the different things that happen once you lose the game. This function is specifically helpful when it comes to the user interface because we have our entire game happen on one page. It is also directly involved with the UI as once you lose the game; your entire screen will change. 

* The next function is removeHeart(). All this does is remove one of the heart icons after you get a question wrong. This is directly impacted with the UI as seeing the hearts change is important for the user to be able to see. 

* The final function in uiEffects.js is markDot(). This function is very similar to the last as it is short, and all it does is update the visual at the top of the screen to let the user know how many questions they have gotten right, and how many they have gotten wrong. 

* Overall, I'm glad that all the uiEffects have their own file now, as they used to be scattered throughout the original code. This made it hard to go in and change things as you didn’t know if changing one thing regarding the UI would mess something up with the game's overall logic. 
 

 

 

 

 

 

 

 