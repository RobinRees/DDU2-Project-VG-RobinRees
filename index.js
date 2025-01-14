const notification = document.getElementById("notificationParagraph");
const amountAndStartPanel = document.getElementById("amountAndStart");
const dealerScoreAmount = document.getElementById("dealerScoreAmount");
const playerScoreAmount = document.getElementById("playerScoreAmount");
let playerMoney = 300;
const amountInText = document.getElementById("amountInText");
amountInText.textContent = `${playerMoney}$`;
let currentBet = 0;

function createDeck() {
    const suits = ["Hearts", "Spades", "Diamonds", "Clubs"];
    const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
    const points = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "10", "10", "10", "11"];

    const deck = [];

    for (let suit of suits) {
        for (let i = 0; i < values.length; i++) {
            deck.push({
                suit,
                value: values[i],
                points: points[i]
            });
        }
    }
    return deck;
}

function shuffleDeck(deck) {
    for (let i = 0; i < deck.length; i++) {
        const randomIndex = Math.floor(Math.random() * deck.length);
        const temp = deck [i];
        deck[i] = deck[randomIndex];
        deck[randomIndex] = temp;
    }
    return deck;
}

function dealCard (deck, gridId, isHidden = false) {
    const card = deck.pop();
    const suitSymbols = { Hearts: '♥', Spades: '♠', Diamonds: '♦', Clubs: '♣' };
    const cardGrid = document.getElementById(gridId);

    const cardElement = document.createElement("div");
    cardElement.classList.add("card");

    if (isHidden) {
        cardElement.classList.add("hiddenCard")
        cardElement.innerHTML = `<div class="back"></div>`;
        cardElement.dataset.hiddenPoints = card.points;
        cardElement.dataset.suit = suitSymbols[card.suit];
        cardElement.dataset.value = card.value;
    } else {
        const suitClass = card.suit.toLowerCase();
        cardElement.innerHTML = `<div class="value">${card.value}</div><div class="suit ${suitClass}">${suitSymbols[card.suit]}</div>`;
        cardElement.dataset.points = card.points;
    }

    cardGrid.appendChild(cardElement);

    if (gridId === "playerCardGrid") {
        calculateScorePlayer();
    } else if (gridId === "dealerCardGrid") {
        calculateScoreDealer();
    }
    return card;
}

function startGame(deck) {
    const playerGridId = "playerCardGrid";
    const dealerGridId = "dealerCardGrid";
    let i = 0;

    function dealNextCardTimer() {
        if (i === 0) {
            dealCard(deck, dealerGridId);
        } else if (i === 1) {
            dealCard(deck, playerGridId);
        } else if (i === 2) {
            dealCard(deck, dealerGridId, true);
        } else if (i === 3) {
            dealCard(deck, playerGridId);
        } else {
            return;
        }
        i++;
        setTimeout(dealNextCardTimer, 400);
    }
    dealNextCardTimer();
}

const deck = shuffleDeck(createDeck());

document.getElementById("hitButton").addEventListener("click", () => {
    dealCard(deck, "playerCardGrid");
});

document.getElementById("stopButton").addEventListener("click", () => {
    const playingButtons = document.getElementById("playingButtons");
    playingButtons.style.display = "none";

    revealHiddenCard();

    function dealerDrawCard () {
        if (Number(dealerScoreAmount.textContent) < 17) {
            setTimeout(() => {
                dealCard(deck, "dealerCardGrid");
                calculateScoreDealer();
                dealerDrawCard();
            }, 1000);
        } else {
            checkWinner();
        }
        
    }

    dealerDrawCard();
});

function calculateAces(cards) {
    let totalPoints = 0;
    let aceCount = 0;

    for (let card of cards) {
        const points = Number(card.dataset.points);
        totalPoints += points;
        if (card.dataset.points === "11") {
            aceCount++;
        }
    }

    while (totalPoints > 21 && aceCount > 0) {
        totalPoints -= 10;
        aceCount--;
    }

    return totalPoints;
}

function calculateScorePlayer () {
    const playerCards = document.querySelectorAll("#playerCardGrid .card");
    const totalPoints = calculateAces(playerCards);
    const playingButtons = document.getElementById("playingButtons");

        playerScoreAmount.textContent = totalPoints;

        if (totalPoints === 21) {
            playerScoreAmount.textContent = "BJ";
        } else if (totalPoints > 21) {
            playerScoreAmount.textContent = "Bust";
            notification.textContent = `Bust! You lost ${currentBet}$`;
            playerMoney -= currentBet;
            amountInText.textContent = `${playerMoney}$`;

            playingButtons.style.display = "none";
            notification.style.display = "block";

            if (playerMoney <= 0) {
                showLossScreen();
                return;
            }

            setTimeout(() => {
                notification.textContent = "Place a new Bet to try again";
            }, 1500);

            setTimeout(() => {
                notification.style.display = "none";
                resetDeck();
                amountAndStartPanel.style.display = "block";
            }, 3000);
        } 

}

function calculateScoreDealer() {
    const dealerCards = document.querySelectorAll("#dealerCardGrid  .card:not(.hiddenCard)");
    const totalPoints = calculateAces(dealerCards);


        dealerScoreAmount.textContent = totalPoints;

        if (totalPoints === 21) {
            dealerScoreAmount.textContent = "BJ"
        } else if (totalPoints > 21) {
            dealerScoreAmount.textContent = "Bust";
        } 
    
}

function resetDeck () {
    document.getElementById("playerCardGrid").innerHTML = "";
    document.getElementById("dealerCardGrid").innerHTML = "";

    deck.length = 0;
    const newDeck = createDeck();
    const shuffledDeck = shuffleDeck(newDeck);

    for (let i = 0; i < shuffledDeck.length; i++) {
        deck.push(shuffledDeck[i]);
    }
}


function checkWinner() {
    const playerScore = playerScoreAmount.textContent;
    const dealerScore = dealerScoreAmount.textContent;
    let payout = 0;


    if (dealerScore === "Bust") {
        payout = currentBet;
        playerMoney += payout;
        notification.textContent = `Dealer Bust! you won ${payout}$`;
    } else if (playerScore === "Bust") {
        playerMoney -= currentBet;
        notification.textContent = `You Bust! you lost ${currentBet}$`;
        if (playerMoney <= 0) {
            showLossScreen();
            return;
        }
    } else if (playerScore === "BJ" && dealerScore !== "BJ") {
        payout = currentBet * 1.5;
        playerMoney += payout;
        notification.textContent = `Blackjack! You won ${payout}$`;
    } else if (dealerScore === "BJ" && playerScore !== "Bj") {
        playerMoney -= currentBet;
        notification.textContent = `Dealer has Blackjack! You lost ${currentBet}$`;


        if (playerMoney <= 0) {
            showLossScreen();
            return;
        }
    } else if (playerScore === "BJ" && dealerScore === "BJ") {
        notification.textContent = "Both have Blackjack! It's a tie";
    } else {
        const playerPoints = Number(playerScore);
        const dealerPoints = Number(dealerScore);

        if (playerPoints > dealerPoints) {
            payout = currentBet;
            playerMoney += payout;
            notification.textContent = `You won ${payout}$`;
        } else if (playerPoints < dealerPoints) {
            playerMoney -= currentBet;
            notification.textContent = `Dealer won! You lost ${currentBet}$`;

            if (playerMoney <= 0) {
                showLossScreen();
                return;
            }
        } else {
            notification.textContent = `It's a tie! You get back ${currentBet}$`;
        }
    }

    amountInText.textContent = `${playerMoney}$`

    notification.style.display = "block";

    setTimeout(() => {
        notification.textContent = "Place a new Bet to play again";
    }, 1500);

    setTimeout(() => {
        notification.style.display = "none";
        resetDeck();
        amountAndStartPanel.style.display = "block";
    }, 4000);



}

function startGameWithBet (betAmount) {
    if (betAmount > playerMoney) {
        alert("Not enough money to place this bet.");
        return;
    }

    currentBet = betAmount;
    startGame(deck);
    amountAndStartPanel.style.display = "none";
    const playingButtons = document.getElementById("playingButtons");
    playingButtons.style.display = "block";
}

document.getElementById("bet30").addEventListener("click", () => {
    startGameWithBet(30);
});

document.getElementById("bet60").addEventListener("click", () => {
    startGameWithBet(60);
});

document.getElementById("bet100").addEventListener("click", () => {
    startGameWithBet(100);
});

document.getElementById("allInButton").addEventListener("click", () => {
    startGameWithBet(playerMoney);
});

function showLossScreen () {
    const loseScreen = document.createElement("div");
    loseScreen.id = "loseScreen";

    const message = document.createElement("h1");
    message.textContent = "You loose!";
    loseScreen.appendChild(message);

    const restartButton = document.createElement("button");
    restartButton.textContent = "Restart";

    restartButton.addEventListener("click", () => {
        playerMoney = 300;
        amountInText.textContent = `${playerMoney}$`;
        resetDeck();
        amountAndStartPanel.style.display = "block";
        notification.style.display = "none";
        document.body.removeChild(loseScreen);
    });

    loseScreen.appendChild(restartButton);

    document.body.appendChild(loseScreen);
}

function revealHiddenCard () {
    const hiddenCard = document.querySelector(".hiddenCard");
    if (hiddenCard) {
        const points = hiddenCard.dataset.hiddenPoints;
        const suit = hiddenCard.dataset.suit;
        const value = hiddenCard.dataset.value;
        const suitClassMap = {
            '♥': 'hearts',
            '♦': 'diamonds',
            '♠': 'spades',
            '♣': 'clubs',
        };
        const suitClass = suitClassMap[suit];

        hiddenCard.classList.remove("hiddenCard");
        hiddenCard.innerHTML = `<div class="value">${value}</div><div class="suit ${suitClass}">${suit}</div>`;
        hiddenCard.dataset.points = points;

        calculateScoreDealer();
    }
}