export let cards = {};

export function loadJSON(filename) {
    fetch(`/json/${filename}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error("File not found");
            }
            return response.json();
        })
        .then(data => {
            cards = data;
        })
        .catch(error => {
            console.error("Error while opening JSON:", error);
        });
}

export function ydc_parse(data) {
    let header = data.slice(0, 8);
    let body = data.slice(8);

    let main_deck_size = new DataView(body.buffer).getUint16(0, true);
    body = body.slice(2);

    //Print size in hex
    console.log(main_deck_size.toString(16));

    let main_deck = [];
    for (let i = 0; i < main_deck_size; i++) {
        let card_id = new DataView(body.buffer).getUint16(0, true);
        body = body.slice(2);
        main_deck.push(card_id);
    }

    let extra_deck_size = new DataView(body.buffer).getUint16(0, true);
    body = body.slice(2);

    let extra_deck = [];
    for (let i = 0; i < extra_deck_size; i++) {
        let card_id = new DataView(body.buffer).getUint16(0, true);
        body = body.slice(2);
        extra_deck.push(card_id);
    }

    let side_deck_size = new DataView(body.buffer).getUint16(0, true);
    body = body.slice(2);

    let side_deck = [];
    for (let i = 0; i < side_deck_size; i++) {
        let card_id = new DataView(body.buffer).getUint16(0, true);
        body = body.slice(2);
        side_deck.push(card_id);
    }

    return { header, main_deck, extra_deck, side_deck };
}


export function ydk_parse(data) {
    let lines = data.split("\n");
    let main_deck = [];
    let extra_deck = [];
    let side_deck = [];
    let deck = null;

    for (let line of lines) {
        line = line.trim();
        if (line === "#main") {
            deck = main_deck;
        } else if (line === "#extra") {
            deck = extra_deck;
        } else if (line === "#side") {
            deck = side_deck;
        }
        else {
            deck.push(password2id(line));
        }
    }

    return {main_deck, extra_deck, side_deck };
}


export function id2password(id) {
    return cards[id.toString()] || null;
}


export function password2id(password) {
    for (let key in cards) {
        if (cards[key] === password) {
            return parseInt(key);
        }
    }
    return null;
}

loadJSON(document.getElementById("game-selector").value);