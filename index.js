

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
    const amountAndStartPanel = document.getElementById("amountAndStart");
    amountAndStartPanel.style.display = "none";
})

const deck = shuffleDeck(createDeck());

document.getElementById("hitButton").addEventListener("click", () => {
    dealCard(deck, "playerCardGrid");
});


function calculateScorePlayer () {
    const playerCards = document.querySelectorAll("#playerCardGrid .card");
    let totalPoints = 0;
    const playerScoreAmount = document.getElementById("playerScoreAmount");

    for (let i = 0; i < playerCards.length; i++) {
        const stringToNumber = Number(playerCards[i].dataset.points);
        totalPoints += stringToNumber;
        playerScoreAmount.textContent = totalPoints;

        if (totalPoints === 21) {
            playerScoreAmount.textContent = "BJ"
        }      

        if (totalPoints > 21) {
            playerScoreAmount.textContent = "Bust";
        }

    }
}

function calculateScoreDealer() {
    const dealerCards = document.querySelectorAll("#dealerCardGrid  .card");
    let totalPoints = 0;
    const dealerScoreAmount = document.getElementById("dealerScoreAmount");


    for (let i = 0; i < dealerCards.length; i++) {
        const stringToNumber = Number(dealerCards[i].dataset.points);
        totalPoints += stringToNumber;
        dealerScoreAmount.textContent = totalPoints;

        if (totalPoints === 21) {
            dealerScoreAmount.textContent = "BJ"
        }

        if (totalPoints > 21) {
            dealerScoreAmount.textContent = "Bust";
        }
    }
}
