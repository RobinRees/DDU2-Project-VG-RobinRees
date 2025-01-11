const notification = document.getElementById("notificationParagraph");
const amountAndStartPanel = document.getElementById("amountAndStart");
const dealerScoreAmount = document.getElementById("dealerScoreAmount");
const playerScoreAmount = document.getElementById("playerScoreAmount");

function createDeck() {
    const suits = ["Hearts", "Spades", "Diamonds", "Clubs"];
    const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
    const points = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "10", "10", "10", "11"/*[1, 11]*/];

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

function dealCard (deck, gridId) {
    if (deck.length === 0) {
        alert("Kortleken är slut");
        return;
    }

    const card = deck.pop();
    const suitSymbols = { Hearts: '♥', Spades: '♠', Diamonds: '♦', Clubs: '♣' };
    const cardGrid = document.getElementById(gridId);

    const cardElement = document.createElement("div");
    cardElement.classList.add("card", card.suit.toLowerCase());
    cardElement.innerHTML = `<div class="value">${card.value}</div><div class="suit">${suitSymbols[card.suit]}</div>`;
    cardElement.dataset.points = card.points;

    cardGrid.appendChild(cardElement);

    if (gridId === "playerCardGrid") {
        calculateScorePlayer();
    }

    if (gridId === "dealerCardGrid") {
        calculateScoreDealer();
    }
}

function startGame(deck) {
    const playerGridId = "playerCardGrid";
    const dealerGridId = "dealerCardGrid";
    let i = 0;

    function dealNextCardTimer() {
        if (i < 4) {
            if (i % 2 === 0) {
                dealCard(deck, dealerGridId);
            } else {
                dealCard(deck, playerGridId);
            }
            i++;
            setTimeout(dealNextCardTimer, 400);
        }
    }
    dealNextCardTimer();
}

document.getElementById("dealButton").addEventListener("click", () =>{
    startGame(deck);
    amountAndStartPanel.style.display = "none";
    const playingButtons = document.getElementById("playingButtons");
    playingButtons.style.display = "block";
})

const deck = shuffleDeck(createDeck());

document.getElementById("hitButton").addEventListener("click", () => {
    dealCard(deck, "playerCardGrid");
});

document.getElementById("stopButton").addEventListener("click", () => {
    const playingButtons = document.getElementById("playingButtons");
    playingButtons.style.display = "none";

    function dealerDrawCard () {
        if (Number(dealerScoreAmount.textContent) < 17) {
            setTimeout(() => {
                dealCard(deck, "dealerCardGrid");
                dealerDrawCard();
            }, 1000);
        } else {
            checkWinner();
        }
        
    }

    dealerDrawCard();
});

function calculateScorePlayer () {
    const playerCards = document.querySelectorAll("#playerCardGrid .card");
    let totalPoints = 0;
    const playingButtons = document.getElementById("playingButtons");

    for (let i = 0; i < playerCards.length; i++) {
        const stringToNumber = Number(playerCards[i].dataset.points);
        totalPoints += stringToNumber;
        playerScoreAmount.textContent = totalPoints;

        if (totalPoints === 21) {
            playerScoreAmount.textContent = "BJ"
        }      

        if (totalPoints > 21) {
            playerScoreAmount.textContent = "Bust";
            notification.textContent = "Bust, you lost (amount)";
            playingButtons.style.display = "none";
            notification.style.display = "block"

            setTimeout(() => {
                notification.textContent = "Place a new Bet to try again";
                amountAndStartPanel.style.display = "block";
            }, 1500);

            setTimeout(() => {
                notification.style.display = "none";
            }, 3000);

            resetDeck();
        }

    }
}

function calculateScoreDealer() {
    const dealerCards = document.querySelectorAll("#dealerCardGrid  .card");
    let totalPoints = 0;


    for (let i = 0; i < dealerCards.length; i++) {
        const stringToNumber = Number(dealerCards[i].dataset.points);
        totalPoints += stringToNumber;
        dealerScoreAmount.textContent = totalPoints;

        if (totalPoints === 21) {
            dealerScoreAmount.textContent = "BJ"
        }

        if (totalPoints > 21) {
            dealerScoreAmount.textContent = "Bust";
            notification.textContent = "dealer Bust, you won (amount)"
            notification.style.display = "block";

            setTimeout(() => {
                notification.textContent = "Place a new Bet to play again";
                amountAndStartPanel.style.display = "block";
            }, 1500);

            setTimeout(() => {
                notification.style.display = "none";
            }, 3000);

            resetDeck();
            
        }
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
    if (dealerScore === "Bust") {
        notification.textContent = "dealer Bust, you won (amount)";
    } else if (playerScore === "Bust") {
        notification.textContent = "You Bust, dealer won amount";
    } else if (playerScore === "BJ" && dealerScore !== "BJ") {
        notification.textContent = "Blackjack, you won (amount)";
    } else if (dealerScore === "BJ" && playerScore !== "Bj") {
        notification.textContent = "Dealer has Blackjack! You lost (amount)";
    } else if (playerScore === "BJ" && dealerScore === "BJ") {
        notification.textContent = "Both have Blackjack! It's a tie";
    } else {
        const playerPoints = Number(playerScore);
        const dealerPoints = Number(dealerScore);

        if (playerPoints > dealerPoints) {
            notification.textContent = "You Won (amount)";
        } else if (playerPoints < dealerPoints) {
            notification.textContent = "Dealer Won, you lost (amount)";
        } else {
            notification.textContent = "Its a tie, you get (amount) back";
        }
    }

    notification.style.display = "block";

    setTimeout(() => {
        notification.textContent = "Place a new Bet to play again";
        amountAndStartPanel.style.display = "block";
    }, 1500);

    setTimeout(() => {
        notification.style.display = "none";
    }, 3000);


    resetDeck();
}