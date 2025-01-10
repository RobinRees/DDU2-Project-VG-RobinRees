

function createDeck() {
    const suits = ["Hearts", "Spades", "Diamonds", "Clubs"];
    const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

    const deck = [];

    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
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

function dealCard (deck, playerCardGridId) {
    if (deck.length === 0) {
        alert("Kortleken är slut");
        return;
    }

    const card = deck.pop();
    const suitSymbols = { Hearts: '♥', Spades: '♠', Diamonds: '♦', Clubs: '♣' };
    const playerCardGrid = document.getElementById("playerCardGrid");

    const cardElement = document.createElement("div");
    cardElement.classList.add("card", card.suit.toLowerCase());
    cardElement.innerHTML = `<div class="value">${card.value}</div><div class="suit">${suitSymbols[card.suit]}</div>`;

    playerCardGrid.appendChild(cardElement);
}

const deck = shuffleDeck(createDeck());

document.getElementById("dealButton").addEventListener("click", () => {
    dealCard(deck, "playerCardGrid");
})


/*
function renderDeck(deck) {
    const container = document.getElementById('deckContainer');

    const suitSymbols = {
        Hearts: '♥',
        Spades: '♠',
        Diamonds: '♦',
        Clubs: '♣'
    };

    for (let i = 0; i < deck.length; i++) {
        const card = deck[i];
        const cardElement = document.createElement('div');
        cardElement.classList.add('card', card.suit.toLowerCase());
        cardElement.innerHTML = `
            <div class="value">${card.value}</div>
            <div class="suit">${suitSymbols[card.suit]}</div>
        `;
        container.appendChild(cardElement);
    }
}

const deck = createDeck();
renderDeck(deck);

*/