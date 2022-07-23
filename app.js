const person = window.prompt("Please enter your name", "Player");
const tileDisplay = document.querySelector(".tile-container");
const keyboard = document.querySelector(".key-container");
const messageDisplay = document.querySelector(".message-container");
const gameContainer = document.querySelector(".game-container");
const closeBtn = document.querySelector(".closebtn");
const congo = document.querySelector(".congo");
const staticPage = document.querySelector(".static-page");
const static = document.querySelector(".static");

static.addEventListener("click", () => {
  congo.style.display = "none";
  staticPage.style.display = "inline";
});

const helpName = document.querySelector(".help_name");
helpName.innerHTML = `Greeting ${person},`;

closeBtn.addEventListener("click", () => {
  gameContainer.style.display = "flex";
});

const randomDigit = Math.floor(Math.random() * 100000 + 10000);
const wordle = randomDigit.toString();
console.log(wordle);

const keys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "<-", "ENTER"];

const guessRows = [
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
];
let Player = [];
let isGameOver = false;
let currentRow = 0;
let currentTile = 0;

guessRows.forEach((guessRow, guessRowIndex) => {
  const rowElement = document.createElement("div");
  rowElement.setAttribute("id", "guessRow-" + guessRowIndex);
  guessRow.forEach((guess, guessIndex) => {
    const tileElement = document.createElement("div");
    tileElement.setAttribute(
      "id",
      "guessRow-" + guessRowIndex + "-tile-" + guessIndex
    );
    tileElement.classList.add("tile");
    rowElement.append(tileElement);
  });
  tileDisplay.append(rowElement);
});

keys.forEach((key) => {
  const buttonElement = document.createElement("button");
  buttonElement.textContent = key;
  buttonElement.setAttribute("id", key);
  buttonElement.addEventListener("click", () => handleClick(key));
  keyboard.append(buttonElement);
});

const handleClick = (letter) => {
  if (letter === "<-") {
    deleteLetter();
    return;
  }
  if (letter === "ENTER") {
    checkRow();
    return;
  }
  addLetter(letter);
};

const addLetter = (letter) => {
  if (currentTile < 5 && currentRow < 6) {
    const tile = document.getElementById(
      "guessRow-" + currentRow + "-tile-" + currentTile
    );
    tile.textContent = letter;
    guessRows[currentRow][currentTile] = letter;
    tile.setAttribute("data", letter);
    currentTile++;
  }
};

const deleteLetter = () => {
  if (currentTile > 0) {
    currentTile--;
    const tile = document.getElementById(
      "guessRow-" + currentRow + "-tile-" + currentTile
    );
    tile.textContent = "";
    guessRows[currentRow][currentTile] = "";
    tile.setAttribute("data", "");
  }
};

const checkRow = () => {
  const guess = guessRows[currentRow].join("");
  if (currentTile > 4) {
    flipTile();
    if (wordle == guess) {
      congo.style.display = "inline";
      congo.innerHTML = `\n⭐⭐⭐⭐⭐ \nCongratulation \n 
                                ${person}`;
      //showMessage(`Magnificent ${person}`);
      document.body.style.color = "#121212";
      isGameOver = true;
      return;
    } else {
      if (currentRow >= 5) {
        isGameOver = false;
        showMessage("Game Over");
        return;
      }
      if (currentRow < 5) {
        currentRow++;
        currentTile = 0;
      }
    }
  }
};

const showMessage = (message) => {
  const messageElement = document.createElement("p");
  messageElement.textContent = message;
  messageDisplay.append(messageElement);

  setTimeout(() => messageDisplay.removeChild(messageElement), 5000);
};

const addColorToKey = (keyLetter, color) => {
  const key = document.getElementById(keyLetter);
  key.classList.add(color);
};

const flipTile = () => {
  const rowTiles = document.querySelector("#guessRow-" + currentRow).childNodes;
  let checkWordle = wordle;
  const guess = [];

  rowTiles.forEach((tile) => {
    guess.push({ letter: tile.getAttribute("data"), color: "grey-overlay" });
  });

  guess.forEach((guess, index) => {
    if (guess.letter == wordle[index]) {
      guess.color = "green-overlay";
      checkWordle = checkWordle.replace(guess.letter, "");
    }
  });

  guess.forEach((guess) => {
    if (checkWordle.includes(guess.letter)) {
      guess.color = "yellow-overlay";
      checkWordle = checkWordle.replace(guess.letter, "");
    }
  });

  rowTiles.forEach((tile, index) => {
    setTimeout(() => {
      tile.classList.add("flip");
      tile.classList.add(guess[index].color);
      addColorToKey(guess[index].letter, guess[index].color);
    }, 500 * index);
  });

  DataCall();
};

/* -------------------------API WORKS----------------------------------------------------------*/

const uid = Date.now().toString(36)+Math.random().toString(36);
const DataCall = () => {
  let Data = {
    "Authorization":person,
    "gameid": uid,
    "hit": false,
    "response": "yg-yy",
    "sequence": guessRows,
    "time": new Date().toISOString(),
    "try": wordle,
    "type": "daily"
  }

  fetch("https://yang.codem.gmbh/api/practice-game", {
    method: "POST",
    headers: {'Content-Type': 'application/json'}, 
    body: JSON.stringify(Data)
  }).then(res => {
    console.log("Request complete! response:", Data);
  });
};

let data = {
  name: person,
  isWin: "YES",
  trial: 4,
};

let personData = [
  { name: "Name", isWin: "IsWin", trial: "Trial" },
  { name: "Salil", isWin: "No", trial: 6 },
  { name: "Captain", isWin: "YES", trial: 1 },
  { name: "IronMan", isWin: "YES", trial: 2 },
  { name: "Shanchi", isWin: "No", trial: 6 },
];

personData.push(data);

window.onload = () => {
  loadTableData(personData);
};

function loadTableData(personData) {
  const tableBody = document.getElementById("tableData");
  let dataHtml = "";

  for (let person of personData) {
    dataHtml += `<tr><td>${person.name}</td><td>${person.isWin}</td><td>${person.trial}</td></tr>`;
  }
  tableBody.innerHTML = dataHtml;
}
