const gameContainer = document.getElementById("game");

const magicCards = [
  ['karn', 'https://c1.scryfall.com/file/scryfall-cards/large/front/3/9/391a965c-31f9-4adb-a872-3e497d659b3c.jpg?1562544068'],
  ['liliana', 'https://c1.scryfall.com/file/scryfall-cards/large/front/d/7/d75ebba8-34ca-47a0-bf13-8318ad73b343.jpg?1557576510'],
  ['ajani', 'https://c1.scryfall.com/file/scryfall-cards/large/front/3/3/33e44e04-8330-49ca-906c-bb9bf0bc84ce.jpg?1562827754'],
  ['teferi', 'https://c1.scryfall.com/file/scryfall-cards/large/front/5/d/5d10b752-d9cb-419d-a5c4-d4ee1acb655e.jpg?1562736365'],
  ['kiora', 'https://c1.scryfall.com/file/scryfall-cards/large/front/0/c/0c5c6b15-b72d-4341-92c2-7469210452da.jpg?1562839809'],
  ['karn', 'https://c1.scryfall.com/file/scryfall-cards/large/front/3/9/391a965c-31f9-4adb-a872-3e497d659b3c.jpg?1562544068'],
  ['liliana', 'https://c1.scryfall.com/file/scryfall-cards/large/front/d/7/d75ebba8-34ca-47a0-bf13-8318ad73b343.jpg?1557576510'],
  ['ajani', 'https://c1.scryfall.com/file/scryfall-cards/large/front/3/3/33e44e04-8330-49ca-906c-bb9bf0bc84ce.jpg?1562827754'],
  ['teferi', 'https://c1.scryfall.com/file/scryfall-cards/large/front/5/d/5d10b752-d9cb-419d-a5c4-d4ee1acb655e.jpg?1562736365'],
  ['kiora', 'https://c1.scryfall.com/file/scryfall-cards/large/front/0/c/0c5c6b15-b72d-4341-92c2-7469210452da.jpg?1562839809']
]

const cardBackSrc = 'https://media.magic.wizards.com/image_legacy_migration/magic/images/mtgcom/fcpics/making/mr224_back.jpg';

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want to research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledCards = shuffle(magicCards);

let clickCount = 0;

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card

function createDivsForImages(imgSrcArray) {
  for (let imgSrc of imgSrcArray) {
    // create a divs Based On "https://www.w3schools.com/howto/howto_css_flip_card.asp"
    const divContainer = document.createElement("div");
    const divCardInner = document.createElement("div");
    const divCardFront = document.createElement("div");
    const divCardBack = document.createElement("div");
    const cardBack = document.createElement("img");
    const cardFront = document.createElement('img');

    //add classes
    divContainer.classList.add('flip-card');
    divCardInner.classList.add('flip-card-inner');
    divCardBack.classList.add('flip-card-back');
    divCardFront.classList.add('flip-card-front');

    //create hierarchy
    divContainer.append(divCardInner);
    divCardInner.append(divCardBack);
    divCardInner.append(divCardFront);
    divCardBack.append(cardBack);
    divCardFront.append(cardFront);

    cardBack.classList.add(imgSrc[0]); //give new image a class name
    cardBack.src = cardBackSrc;
    cardFront.src = imgSrc[1];

    // call a function handleCardClick when a div is clicked on
    divContainer.addEventListener("click", function (event) {
      console.log("This is event.target: ", event.target)
      //if user made less than two guesses at once, handleCardClick executes
      if (clickCount < 2 && !(event.target.classList.contains("matched"))) {
        handleCardClick(event);
      }
    });

    // append the div to the element with an id of game
    gameContainer.append(divContainer);
  }
}

let lastCard;

let score = 0;
let currentScoreDisplay = document.querySelector('.current-score');
// TODO: Implement this function!
function handleCardClick(event) {

  console.log("In handled click");

  const eventContainerDiv = event.target.parentElement.parentElement;
  eventContainerDiv.style.transform = 'rotateY(180deg)';

  if (lastCard) { //if use has guessed their first card

    if (lastCard !== eventContainerDiv.parentElement) { //if last card and new click are not equal

      score++; //full guess of a match increments score
      currentScoreDisplay.innerText = `${score}`;

      if (lastCard.firstElementChild.firstElementChild.firstElementChild.className == event.target.className) { //check img class to see card name
        
        eventContainerDiv.lastElementChild.firstElementChild.classList.add("matched"); //add "matched" to cardBack img
        lastCard.firstElementChild.lastElementChild.firstElementChild.classList.add("matched");

        lastCard = ''; //reset for new guess
        clickCount = 0;
        foundCount += 2;
        gameCompletionCheck();

      } else { //if it's not a match
        clickCount++; //add to click count to prevent further clicks

        setTimeout(function () {
          lastCard.firstElementChild.style.transform = 'rotateY(0deg)'; //rotate cards back
          eventContainerDiv.style.transform = 'rotateY(0deg)';
          lastCard = '';
        }, 1000);
        setTimeout(function () {
          clickCount = 0; //reset click count after animation finishes
        }, 1400)
      }
    } else { console.log("You clicked the same card!"); }

  }
  else {
    lastCard = eventContainerDiv.parentElement;
    clickCount++;
  }
}

//when Start button is clicked
let startButton = document.querySelector('#start');

startButton.addEventListener("click", function (event) {
  resetButton.style.display = 'inline';    //make reset button appear
  startButton.style.display = 'none';
  if (event.target.className) {
    console.log("Game Started already");
  } else {
    createDivsForImages(shuffledCards);
    event.target.classList.toggle("inProgress");
  }
})

let foundCount = 0;
let bestScoreDisplay = document.querySelector('.best-score');

if (localStorage.getItem('best-score')) { //if local-storage of best score exists
  bestScoreDisplay.innerText = localStorage.getItem('best-score');//set best score display equal to that string
}

function gameCompletionCheck() {
  if (foundCount === gameContainer.children.length) {

    if (localStorage.getItem('best-score')) {
      if (score < parseInt(localStorage.getItem('best-score'))) {
        localStorage.setItem('best-score', `${score}`);
        bestScoreDisplay.innerText = localStorage.getItem('best-score');
      }
    } else {
      localStorage.setItem('best-score', `${score}`);
      bestScoreDisplay.innerText = `${score}`;
    }

  }
}

let resetButton = document.querySelector('#reset');
resetButton.addEventListener("click", resetGame);

function resetGame() {
  let numGamePieces = gameContainer.children.length;
  let i = 0;
  while (i < numGamePieces) {
    gameContainer.firstElementChild.remove();
    i++;
  }

  foundCount = 0;

  // resetButton.style.display = 'none';

  score = 0;
  currentScoreDisplay.innerText = `${score}`;

  shuffledCards = shuffle(magicCards);

  createDivsForImages(shuffledCards);
}

//write a function that will
  //check if score is lower than best score in local storage
  //if score is lower, save score to local storage

/* */

//this url grabs a random magic card
//https://gatherer.wizards.com/Pages/Card/Details.aspx?action=random

//javascript needs to
  //1) go to the random card url
  //2) find div with class "card-image"
  //3) grab img src attribute value (should be image location)
  //4) set div background to card image