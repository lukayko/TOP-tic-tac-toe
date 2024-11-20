const GameBoard = (function () {
  let board = ["", "", "", "", "", "", "", "", ""];
  const gameBoardElement = document.querySelector("#gameboard");

  const getBoard = () => board;

  const render = () => {
    let gameBoardHTML = "";

    board.forEach((btn, index) => {
      gameBoardHTML += `<button id="index-${index}" data-playable="true" class='border rounded-md shadow-white bg-white/5 hover:bg-white/10 hover:shadow-indigo-600 hover:shadow-sm hover:border-indigo-600'>${btn}</button>`;
    });

    gameBoardElement.innerHTML = gameBoardHTML;
    document.querySelectorAll('[data-playable = "true"]').forEach((btn) => {
      btn.addEventListener("click", GameController.handleClick);
    });
  };

  const reset = () => {
    board = ["", "", "", "", "", "", "", "", ""];
    gameBoardElement.innerHTML = "";
  };

  const update = (index, symbol) => {
    board[index] = symbol;

    render();
  };

  return { getBoard, render, update, reset };
})();

const CreatePlayer = (name, symbol) => {
  return { name, symbol };
};

const GameController = (function () {
  let players = [];
  let activePlayer;
  let gameOver = false;

  const resetBtn = document.querySelector("#reset-button");

  const switchActivePlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const checkForWin = (board) => {
    let winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < winningCombinations.length; i++) {
      const [a, b, c] = winningCombinations[i];
      if (board[a] && board[a] == board[b] && board[a] == board[c]) {
        return true;
      }
    }
    return false;
  };

  function checkForTie() {
    return GameBoard.getBoard().every((btn) => btn !== "");
  }

  const reset = () => {
    GameBoard.reset();
    DisplayController.renderMessage("Please set player names");

    players = [];
    activePlayer = players[0];
    gameOver = false;
    resetBtn.disabled = true;

    document.querySelector("#player-one").value = "";
    document.querySelector("#player-two").value = "";

    resetBtn.classList.add("hidden");
    playBtn.addEventListener("click", start);
  };

  const start = () => {
    playBtn.removeEventListener("click", start);
    resetBtn.disabled = false;
    resetBtn.classList.remove("hidden");
    resetBtn.addEventListener("click", reset);

    players = [
      CreatePlayer(document.querySelector("#player-one").value, "X"),
      CreatePlayer(document.querySelector("#player-two").value, "O"),
    ];

    GameBoard.render();
    activePlayer = players[0];
    DisplayController.renderMessage(`${activePlayer.name}'s turn!`);
  };

  const handleClick = (e) => {
    if (gameOver) {
      return;
    }

    const index = parseInt(e.target.id.split("-")[1]);

    if (GameBoard.getBoard()[index] !== "") {
      return;
    }

    GameBoard.update(index, activePlayer.symbol);

    if (checkForWin(GameBoard.getBoard())) {
      gameOver = true;
      GameBoard.render();
      DisplayController.renderMessage(`${activePlayer.name} Won!`);
      return;
    }

    if (checkForTie(GameBoard.getBoard())) {
      gameOver = true;
      DisplayController.renderMessage(`It's a tie!`);
      return;
    }

    switchActivePlayer();
    DisplayController.renderMessage(`${activePlayer.name}'s turn!`);
  };

  return { handleClick, start, reset };
})();

const DisplayController = (function () {
  const messageElement = document.querySelector("#game-message");
  messageElement.innerHTML = "Please set player names";

  function renderMessage(message) {
    messageElement.innerHTML = message;
  }

  return {
    renderMessage,
  };
})();

const playBtn = document.querySelector("#play-button");
playBtn.addEventListener("click", GameController.start);
