var houseSum = 0;
var playerSum = 0;

var houseAce = 0;
var playerAce = 0; 

var hiddenCard;
var deck;                                           //Establish variables

var ableHit = true;                                //Define : Player can hit if sum of cards is <=21.

window.onload = function() {                        //When browser window loads, start primary functions. 
    makeDeck();
    shuffle();
    gameStart();   
}

function makeDeck() {
    let rank = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];     //values
    let suits = ["C", "D", "H", "S"];                                                  //types
    deck = [];

    for (let i = 0; i < suits.length; i++) {
        for (let j = 0; j < rank.length; j++) {      //Nested for loop to create array of rank and suits cards. 
            deck.push(rank[j] + "-" + suits[i]);
        }
    }
}

function shuffle() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length); //For each i in deck index, pick a j, swap the two.  
        let x = deck[i];
        deck[i] = deck[j];
        deck[j] = x;
    }
    console.log(deck);
}

function gameStart() {
    hiddenCard = deck.pop();       //Face down card pulled from array. Set to hidden cardback in HTML by default. 
    houseSum += getValue(hiddenCard);                   //House sum increased but hidden. 
    houseAce += checkAceCount(hiddenCard);              //Checks hidden card for ace.
    while (houseSum < 17) {                             //While sum of house is less than 17, it will continue to hit.Blackjack rule of soft 17.   
        let addCard = document.createElement("img");
        let card = deck.pop();                          //Create a new card element and pull from deck array. 
        addCard.src = "./cards/" + card + ".png";       //Source is the cards directory. 
        houseSum += getValue(card);                     //House card sum increases again. 
        houseAce += checkAceCount(card);                //Check that card for Ace. 
        document.getElementById("houseCards").append(addCard);//Update dealer card graphic in HTML with 2nd card. 
    }
    console.log(houseSum);

    for (let i = 0; i < 2; i++) {                          //For the player, get dealt 2 cards, no hidden.  
        let addCard = document.createElement("img");       //Mostly same process as above.  
        let card = deck.pop();
        addCard.src = "./cards/" + card + ".png";
        playerSum += getValue(card);
        playerAce += checkAceCount(card);
        document.getElementById("playerCards").append(addCard);                     
    }

    console.log(playerSum);
    document.getElementById("hitme").addEventListener("click", hitme);   //Add buttons for hitme and stay. 
    document.getElementById("stay").addEventListener("click", stay);

}

function hitme() {
    if (!ableHit) {
        return;                    //If not able to hit, stops from going further. Otherwise, add cards. 
    }
    let addCard = document.createElement("img");
    let card = deck.pop();
    addCard.src = "./cards/" + card + ".png";
    playerSum += getValue(card);
    playerAce += checkAceCount(card);
    document.getElementById("playerCards").append(addCard);

    if (checkSum(playerSum, playerAce) > 21) {   //Check if player hand is >21, if true, no more hitting. 
        ableHit = false;
    }
}

function stay() {
    houseSum = checkSum(houseSum, houseAce);   //If this button was pressed, it means it's time to calc both sums. 
    playerSum = checkSum(playerSum, playerAce);
    ableHit = false;
    document.getElementById("hiddenCard").src = "./cards/" + hiddenCard + ".png";//Reveal hidden card.Change from default to new card png. 

    let message = "";                                               //Define win conditions messages. 
    if (playerSum > 21) {
        message = "You Lose!";                                      //Player>21. Player loses. 
    }
    else if (houseSum > 21) {                                       //House>21. Player wins. 
        message = "You win!";
    }
    
    else if (playerSum == houseSum) {                               //Tie 
        message = "Tie!";
    }
    else if (playerSum > houseSum) {                                
        message = "You Win!";
    }
    else if (playerSum <houseSum) {
        message = "You Lose!";
    }

    document.getElementById("houseSum").innerText = houseSum;           //Shows scores of house and player. 
    document.getElementById("playerSum").innerText = playerSum;
    document.getElementById("results").innerText = message;             //Shows result text. 
}


function getValue(card) {
    let data = card.split("-");     //Data of card is split into rank and suit. 
    let rank = data[0];             //Index of 0 of data array is the rank of the card. 

    if (isNaN(rank)) {              //if the rank is not a number such as face cards and ace, Ace is  by default 11. 
        if (rank == "A") {          
            return 11;
        }
        return 10;                  //Face cards are 10. 
    }
    return parseInt(rank);          //If not a face or Ace card, get integer from rank string array.    
}

function checkAceCount(card) {           
    if (card[0] == "A") {           //Check if first card is an ace. 
        return 1;
    }
    return 0;
}

function checkSum(playerSum, playerAce) {             //If playerSum of cards is higher than 21, and has an Ace,
    while (playerSum > 21 && playerAce > 0) {         //Reduce the player sum by 10 and ace by 1. Repeat if needed. 
        playerSum -= 10;
        playerAce -= 1;
    }
    return playerSum;
}