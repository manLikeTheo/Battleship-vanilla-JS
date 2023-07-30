import Gameboard from "./gameboard";
import Player from "./player";
import Computer_Player from "./computer_player";
import gameHTML from "./gameHTML";
import position_ships_HTML from "./position_ships_HTML";

class DOM_CONSOLE {
    constructor() {
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.isWinnerThenAnnounce = this.isWinnerThenAnnounce.bind(this);
        this.shipLocations = {
            carrier: null,
            battleship: null,
            cruiser: null,
            submarine: null,
            destroyer: null,
        };

        this.currentShip = null;
        this.placeCurrentShip = null;
        this.letterNumberHash = {
            "A": 1,
            "B": 2,
            "C": 3,
            "D": 4,
            "E": 5,
            "F": 6,
            "G": 7,
            "H": 8,
            "I": 9,
            "J": 10,
        };

        this.numberLetterHash = {
            1: 'A',
            2: 'B',
            3: 'C',
            4: 'D',
            5: 'E',
            6: 'F',
            7: 'G',
            8: 'H',
            9: 'I',
            10: 'J'
        };
    }

    restartGame(player) {
        player.playerMakesFirstMove = false;
        domConsole.shipLocations = {
            carrier: null,
            battleship: null,
            cruiser: null,
            submarine: null,
            destroyer: null,
        };

        domConsole.currentShip = null;
        domConsole.placeCurrentShip = null;
        domConsole.renderPlaceShipsScreen(player);
    }

    startGamePlay(player) {
        const thePlayer = new Player(player.name);
        const playerGameboard = new Gameboard("player");
        const computer = new Computer_Player();
        const computerGameboard = new Gameboard("computer");

        for(const [shipName, arrOfCoords] of Object.entries(domConsole.shipLocations)) {
            const shipNameCapitalized = shipName.slice(0, 1).toUpperCase() + shipName.slice(1);
            playerGameboard.createShipAndPlaceOnBoard(shipNameCapitalized, ...arrOfCoords);
        }

        const computerCoords = computer.randomlyPlaceComputerShips();
        for(const [shipName, arrOfCoords] of Object.entries(computerCoords)){
            const shipNameCapitalized = shipName.slice(0, 1).toUpperCase() + shipName.slice(1);
            computerGameboard.createShipAndPlaceOnBoard(shipNameCapitalized);
        }
        domConsole.renderGameplay(playerGameboard, computerGameboard, thePlayer, computer);
    }

    handleKeyDown(e) {
        if(e.code = "Enter") {
            e.preventDefault();
            document.querySelector(".start-button").click();
        }
    }

    selectNextShip() {
        const ships = domConsole.shipLocations;
        if(ships.carrier === null) {
            domConsole.currentShip = "carrier";
        } else if(ships.battleship === null) {
            domConsole.currentShip = "battleship";
        } else if(ships.cruiser === null) {
            domConsole.currentShip = "cruiser";
        } else if(ships.currentShip === "submarine") {
            domConsole.currentShip = "submarine";
        } else if(ships.destroyer === null) {
            domConsole.currentShip = "destroyer";
        }
    }

    isWinnerThenAnnounce(playerGameboard, computerGameboard, player) {
        const status = document.querySelector(".status");
        let winner;
        if(playerGameboard.getAllPlayersShipsSunk() && computerGameboard.getAllPlayersShipsSunk()) {
            winner = "DRAW!";
        }

        if(playerGameboard.getAllPlayersShipsSunk()) {
            winner = "ENEMY";
        }

        if(computerGameboard.getAllPlayersShipsSunk()) {
            winner = "PLAYER";
        }

        if(winner) {
            if(winner === "ENEMY") {
                status.textContent = "GAME OVER. ENEMY HAS SUNK ALL YOUR SHIPS!";
            } else if(winner === "DRAW") {
                status.textContent = "BOTH FLEET SUNK! IT'S A DRAW!";
            } else if(winner === "PLAYER") {
                `status.innerHTML = "YOU HAVE DECIMATED THE ENEMY FLEET! GAME OVER!"
                <a class = "play-again" href="#">PLAY AGAIN</a>
                `;
                const playAgain = document.querySelector(".play-again");
                playAgain.addEventListener("click", () => {
                    domConsole.restartGame(player);
                });               
            }
        }
    }

    renderPlaceShipsScreen(player) {
        domConsole.selectNextShip();

        document.removeEventListener("keydown", domConsole.handleKeyDown);

        const body = document.querySelector("body");
        body.innerHTML = position_ships_HTML;

        const status = document.querySelector(".status");
        const changeAxisBtn = document.querySelector(".change-axis");
        const cells = document.querySelector(".cell");

        const playerNameCapitalized = player.name.toUpperCase();
        const capitalizeShipName = domConsole.currentShip.toUpperCase();
        let axis = "VERTICAL";

        status.textContent = `ADMIRAL ${playerNameCapitalized}, PLACE YOUR ${capitalizeShipName}`;

        changeAxisBtn.textContent = axis;

        changeAxisBtn.addEventListener("click", handleChangeAxis);
        cells.forEach(cell => cell.addEventListener("mouseover", handleMouseOver));
        cells.forEach(cell => cell.addEventListener("click", handleClick));

        function handleChangeAxis() {
            if(axis === "VERTICAL") {
                axis = "HORIZONTAL";
            } else { 
                axis = "VERTICAL"; 
            }
            changeAxisBtn.textContent = "Axis";
        }

        function handleClick() {
            if(domConsole.placeCurrentShip === null) return //do nothing if ship can't be placed on clicked spot
        }

        //cell already has another ship occupying it
        for(const coord of domConsole.placeCurrentShip) {
            for(const arrOfCoords of Object.values(domConsole.shipLocations)) {
                if(arrOfCoords) {
                    if(arrOfCoords.includes(coord)) return //do nothing;
                }
            }
        }

        //place ship on visual board
        for(const coord of domConsole.placeCurrentShip) {
            const cell = document.querySelector(`.cell.player.${coord}`);
            cell.classList.add("ship-permanent");
        }

        //makes a new variable here tu update curentShip
        const lowerCaseShipName = domConsole.currentShip;
        domConsole.shipLocations[lowerCaseShipName] = domConsole.placeCurrentShip;

        //game-play load after last ship gets placed
        if(domConsole.currentShip === "destroyer") {
            domConsole.startGamePlay(player);
        }

        domConsole.selectNextShip();

        const caseSensitiveShipName = domConsole.currentShip.toUpperCase();
        status.textContent = `ADMIRAL ${playerNameCapitalized}, PLACE YOUR ${caseSensitiveShipName}`;
    }
    
    getLengthOfShipToPlace() {
        let length;
        const ship = domConsole.currentShip;
        if(ship === "carrier") {
            length = 5;
        } else if(ship === "battleship") {
            length = 4;
        } else if(ship === "cruiser" || ship === "submarine") {
            length = 3;
        } else if(ship === "destroyer") {
            length = 2;
        }
        return length;
    }

    handleMouseOver(e) {
        cells.forEach(cell => cell.classList.remove("ship"));

        domConsole.placeCurrentShip = null;

        const length = this.getLengthOfShipToPlace();
        
        const mousePointerCoord = e.currentTarget.classList[2];
        const coordLetter = mousePointerCoord.slice(0,1);
        const coordNumber = Number(mousePointerCoord.slice(1));

        if(axis === "HORIZONTAL") {
            const digitOfCoordsWhereShipsCanBePlaced = [];
            for(let i = 0; i < length; i++) {
                const nextCellNum = coordNumber + i;
                //if where the mouse is currently is out of the bounds of the board, do nothing
                if(nextCellNum > 10) return;
                digitOfCoordsWhereShipsCanBePlaced.push(nextCellNum);
            }

            domConsole.placeCurrentShip = digitOfCoordsWhereShipsCanBePlaced.map(number => {
                return coordLetter + number;
            });
        }

        if(axis = "VERTICAL") {
            const { letterNumberHash, numberLetterHash } = domConsole;
            const letterCoded = letterNumberHash[coordLetter];
            const lettersOfCoordsWhereShipMightBePlaced = [];

            for(let i = 0; i < length; i++) {
                let nextCellLeterCoded = letterCoded + i;

                if(nextCellLeterCoded > 10) return; //do nothing if it will go outside board
                nextCellLeterCoded = String(nextCellLeterCoded);
                const nextCellLetter = numberLetterHash[nextCellLeterCoded];
                lettersOfCoordsWhereShipMightBePlaced.push(nextCellLetter);
            }
            domConsole.placeCurrentShip = lettersOfCoordsWhereShipMightBePlaced.map(letter => letter + coordNumber);
        }

        //show ships shadow if it can occupy where the mouse is hoveriing
        if(domConsole.placeCurrentShip) {
            for(const coord of domConsole.placeCurrentShip) {
                const cell = document.querySelector(`.cell.player.${coord}`);
                cell.classList.add("ship");
            }
        }
    }

    renderStartScreen() {
        const body = document.querySelector(body);
        const startScreen = document.createElement("div");
        startScreen.classList.add("start-screen");
        const title = document.createElement("h1");
        title.classList.add('title');
        title.textContent = 'BATTLESHIP';
        const titleContainer = document.createElement('div');
        titleContainer.classList.add('title-container');
        titleContainer.append(title);
        const nameForm = document.createElement('form');
        nameForm.classList.add('name-form');
        const nameInput = document.createElement('input');
        const nameLabel = document.createElement('label');
        nameLabel.classList.add('name-label');
        nameLabel.textContent = 'ENTER PLAYER NAME:';
        nameLabel.append(nameInput);
        nameInput.placeholder = 'BATTLESHIP COMBATANT';
        nameInput.classList.add('name-input');
        const startButton = document.createElement('a');
        startButton.textContent = 'START GAME';
        startButton.classList.add('start-button');
        startButton.href = '#';
        const controlsContainer = document.createElement('div');
        controlsContainer.classList.add('controls-container');
        nameForm.append(nameLabel, startButton);

        controlsContainer.append(nameForm, volume);
        startScreen.append(titleContainer, controlsContainer);
        setTimeout(() => {
            controlsContainer.classList.add('make-visible-and-white');
            titleContainer.classList.add('make-visible-and-white');
        }, 500);
        body.append(startScreen);
        this.sonarSound = new Audio(sonar);
        this.sonarSound.loop = true;
        this.introMusick = new Audio(introMusic);
        this.introMusick.addEventListener('ended', () => this.sonarSound.play());
  
        volume.addEventListener('click', domController.handleVolumeIconClick);
        startButton.addEventListener('click', handleStartBtn);
        document.addEventListener('keydown', domController.handleKeyDown);
    }

    handleStartBtn(e) {
        e.preventDefault();
        const playerName = nameInput.value;
        if(!playerName) {
            nameInput.focus();
            return;
        }
        const player = { name: playerName };
        domConsole.renderPlaceShipsScreen(player);
    }

    renderGameplay(playerGameboard, computerGameboard, player, computer) {
        const playerNameCapitalized = player.name.toUpperCase();

        const body = document.querySelector("body");
        body.innerHTML = gameHTML;

        const computerBoard = document.querySelector(".game-computer-board");
        const computerCells = computerBoard.querySelectorAll(".cell");
        const status = document.querySelector(".status");

        status.textContent = `WATING FOR ORDERS, ADMIRAL ${playerNameCapitalized}`;

        computerCells.forEach(cell => cell.addEventListener("click", handleClick));

        showPlayerShips();
    }

    createComputerAttackFunctionality() {
        //computer makes first attack after player
        let resultOfComputerPlay;
        let shipType;
        if(player.playerMakesFirstMove) {
            const result = computer.attack(playerGameboard);

            //if Array
            if(Array.isArray(result)) {
                resultOfComputerPlay = result[0];
                shipType = result[1].toUpperCase();
            }

            //simulate computer taking some time to make move
            setTimeout( ()=> {
                //show missed shots after enemy attacks
                showMissedShots();

                //show hits after enemy attack
                showHits();

                //If either players fleet hit/sunk
                if(resultOfComputerPlay === "hit ship") {
                    status.textContent = "THE " + shipType + "HAS BEEN HIT BY THE ENEMY!"; 
                } else if(resultOfComputerPlay === "sunk ship") {
                    status.textContent = 'THE ' + shipType + ' HAS BEEN DESTROYED BY THE ENEMY!';
                }
                //check if there is a winner everytime computer plays
                domConsole.isWinnerThenAnnounce(playerGameboard, computerBoard, player);
            }, 1500);
        }
    }
}

const domConsole = new DOM_CONSOLE();