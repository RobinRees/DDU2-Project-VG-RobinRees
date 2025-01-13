const notification = document.getElementById("notificationParagraph");
const amountAndStartPanel = document.getElementById("amountAndStart");
const dealerScoreAmount = document.getElementById("dealerScoreAmount");
const playerScoreAmount = document.getElementById("playerScoreAmount");
let playerMoney = 300;
const amountInText = document.getElementById("amountInText");
amountInText.textContent = `${playerMoney}$`
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
    cardElement.classList.add("card", card.suit.toLowerCase());

    if (isHidden) {
        cardElement.classList.add("hiddenCard");
        cardElement.dataset.points = card.points;
    } else {
        cardElement.innerHTML = `<div class="value">${card.value}</div><div class="suit">${suitSymbols[card.suit]}</div>`;
        cardElement.dataset.points = card.points;
    }

    cardGrid.appendChild(cardElement);
}

function startGame(deck) {
    const playerGridId = "playerCardGrid";
    const dealerGridId = "dealerCardGrid";

    dealCard(deck, dealerGridId);
    dealCard(deck, playerGridId);
    dealCard(deck, dealerGridId, true);
    dealCard(deck, playerGridId);
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
    const dealerCards = document.querySelectorAll("#dealerCardGrid  .card");
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
        payout = currentBet * 2;
        playerMoney += payout;
        notification.textContent = `Dealer Bust! you won ${payout}$`;
    } else if (playerScore === "Bust") {
        playerMoney -= currentBet;
        notification.textContent = `You Bust! you lost ${currentBet}$`;
    } else if (playerScore === "BJ" && dealerScore !== "BJ") {
        payout = currentBet * 2.5;
        playerMoney += payout;
        notification.textContent = `Blackjack! You won ${payout}$`;
    } else if (dealerScore === "BJ" && playerScore !== "Bj") {
        playerMoney -= currentBet;
        notification.textContent = `Dealer has Blackjack! You lost ${currentBet}$`;
    } else if (playerScore === "BJ" && dealerScore === "BJ") {
        notification.textContent = "Both have Blackjack! It's a tie";
    } else {
        const playerPoints = Number(playerScore);
        const dealerPoints = Number(dealerScore);

        if (playerPoints > dealerPoints) {
            payout = currentBet * 2;
            playerMoney += payout;
            notification.textContent = `You won ${payout}$`;
        } else if (playerPoints < dealerPoints) {
            playerMoney -= currentBet;
            notification.textContent = `Dealer won! You lost ${currentBet}$`;
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

document.getElementById("customButton").addEventListener("click", () => {
    const customAmountInput = document.getElementById("dealAmountInput");
    customAmountInput.style.display = "inline-block";

    customAmountInput.addEventListener("change", () => {
        const customAmount = Number(customAmountInput.value);
        if (customAmount > 0) {
            startGameWithBet(customAmount);
            customAmountInput.style.display = "none";
        } else {
            alert("Please enter a valid amount.")
        }
    })
    

});

function revealHiddenCard () {
    const hiddenCard = document.querySelector("#dealerCardGrid .hiddenCard");
    if (hiddenCard) {
        const suitSymbols = { Hearts: '♥', Spades: '♠', Diamonds: '♦', Clubs: '♣' };
        const hiddenPoints = hiddenCard.dataset.hiddenPoints;

        hiddenCard.classList.remove("hiddenCard");
        hiddenCard.innerHTML = `<div class="value">${hiddenCard.dataset.value}</div><div class="suit">${suitSymbols[hiddenCard.dataset.suit]}</div>`;
        hiddenCard.dataset.points = hiddenPoints;
        calculateScoreDealer();
    }
}