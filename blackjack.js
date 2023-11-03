var dealerSum = 0;
var yourSum =0;

var dealerAceCount=0;
var yourAceCount =0;

var yourCash = 500;

var hidden;
var deck;

var canHit = true; //allows the player to draw while yourSum <= 21

window.onload = function() {
  buildDeck();
  shuffleDeck();
  startGame();
}

function buildDeck() {
  let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  let types = ["C", "D", "H", "S"];
  deck=[];

  for (let i =0; i< types.length; i++) {
    for (let j=0; j< values.length; j++){
      deck.push(values[j] + "-" + types[i]); //A-C -> K-C, A-D -> K-D
    }
  }
}

function shuffleDeck() {
  for (let i =0; i< deck.length; i++) {
    let j=Math.floor(Math.random() * deck.length); // (0-1) * 52 => (0-51.9999)
    let temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }
  console.log(deck);
}

function startGame() {
  hidden = deck.pop();
  dealerSum += getValue(hidden);
  dealerAceCount += checkAce(hidden);
  //document.getElementById("your-cash").innerText = "$" + yourCash;
  /* console.log(hidden);
  console.log(dealerSum); */
  //deal cards to dealer
  let cardImg = document.createElement("img");
  let card = deck.pop();
  cardImg.src = "./resources/cards/" + card + ".png";
  cardImg.classList.add('cards');
  dealerSum += getValue(card);
  dealerAceCount += checkAce(card);
  document.getElementById("dealer-cards").append(cardImg);
  //console.log(dealerSum);

  for(let i=0; i<2; i++) {
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./resources/cards/" + card + ".png";
    cardImg.classList.add('cards');
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);
  }
  displayYourSum();

  //console.log(yourSum);
  document.getElementById("hit").addEventListener("click", hit);
  document.getElementById("stay").addEventListener("click", stay);
}

function hit() {
  if(!canHit) {
    return;
  }
  let cardImg = document.createElement("img");
  let card = deck.pop();
  cardImg.src = "./resources/cards/" + card + ".png";
  cardImg.classList.add('cards');
  yourSum += getValue(card);
  yourAceCount += checkAce(card);
  yourSum = reduceAce(yourSum, yourAceCount);

  document.getElementById("your-cards").append(cardImg);
  displayYourSum();

  if (yourSum > 21) {
    canHit = false;
    calculate();
  }
  
}

function stay() {
  canHit = false;
  calculate();
}

function calculate() {

  document.getElementById("hidden").src = "./resources/cards/" + hidden + ".png";
  dealerTurn();
  
  let message = "";
  if (yourSum > 21) {
    message = "You lose!";
  }
  else if (dealerSum > 21) {
    message = "You win!";
  }
  //both you and dealer <= 21
  else if( yourSum == dealerSum) {
    message = "Tie!";
  }
  else if (yourSum > dealerSum) {
    message = "You win!";
  }
  else if (yourSum < dealerSum) {
    message = "You lose!";
  }
  document.getElementById("dealer-sum").innerText = dealerSum;
  document.getElementById("your-sum").innerText = yourSum;
  document.getElementById("results").innerText = message;
}



function getValue(card) {
  let data = card.split("-"); // Split the values into [value, suit]
  let value = data[0];

  if (isNaN(value)) { //If face card. 
    if (value == "A") {
      return 11;
    }
    return 10;
  }

  return parseInt (value);

}

function checkAce(card) {
  if (card[0] == "A") {
    return 1;
  }
  return 0;
}

function reduceAce(playerSum, playerAceCount) {
  while (playerSum > 21 && playerAceCount > 0) {
    playerSum -= 10;
    playerAceCount -= 1;
  }
  return playerSum;
}

function dealerTurn() {
  while (dealerSum < 17) {
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./resources/cards/" + card + ".png";
    cardImg.classList.add('cards');
    dealerSum += getValue(card);
    dealerAceCount += checkAce(card);
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    setTimeout(function() {
      document.getElementById("dealer-cards").append(cardImg);
    }, 500)
  }
}

function reset() {
  yourSum=0;
  yourAceCount=0;
  dealerSum=0;
  dealerAceCount=0;

  while (document.getElementById("dealer-cards").firstElementChild) {
    document.getElementById("dealer-cards").removeChild(document.getElementById("dealer-cards").firstElementChild);
  }
  while (document.getElementById("your-cards").firstElementChild) {
    document.getElementById("your-cards").removeChild(document.getElementById("your-cards").firstElementChild);
  }

  dealDealer();
  dealYou();
  document.getElementById("dealer-sum").innerText = "";
  displayYourSum();
  document.getElementById("results").innerText = "";

  canHit = true;


}

function displayYourSum(){
  document.getElementById("your-sum").innerText = yourSum;
}

function dealYou() {
  for(let i=0; i<2; i++) {
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    cardImg.classList.add('cards');
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);
  }
}

function dealDealer() {
  let cardImg = document.createElement("img");
  cardImg.src = "./cards/BACK.png";
  cardImg.classList.add('cards');
  cardImg.id = "hidden";
  document.getElementById("dealer-cards").appendChild(cardImg);

  hidden = deck.pop();
  dealerSum += getValue(hidden);
  dealerAceCount += checkAce(hidden); 

  let card = deck.pop();
  let cardImg2 = document.createElement("img");
  cardImg2.src = "./cards/" + card + ".png";
  cardImg2.classList.add('cards');
  dealerSum += getValue(card);
  dealerAceCount += checkAce(card);
  document.getElementById("dealer-cards").appendChild(cardImg2);
}
