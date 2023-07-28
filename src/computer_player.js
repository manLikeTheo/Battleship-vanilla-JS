class Computer_Player extends Player {
    constructor() {
        super();
    }

    generateRandomCoordinates() {
        const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
        const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
        const randomIndex1 = Math.floor(Math.random() * 10);
        const randomIndex2 = Math.floor(Math.random() * 10);
        return letters[randomIndex1] + numbers[randomIndex2];
    }

    attack(gameBoard) {
        let coords = this.generateRandomCoordinates();
        if(!this.getCoordiatesAlreadyShotByThisPlayer(coords)) {
            const result = gameBoard.receiveAttack(coords);
            this.shotsFiredByPlayer.add(coords);
            return result;
        } else {
            return this.attack(gameBoard);
        }
    }

    randomlyPlaceComputerShips() {
        const letterNumberHash = {
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

        const numberLetterHash = {
            1: "A",
            2: "B",
            3: "C",
            4: "D",
            5: "E",
            6: "F",
            7: "G",
            8: "H",
            9: "I",
            10: "J",
        };

        let remainderGridCoordinates = [];

        //initial grid to place a ship
        for(let i = 0; i <= 10; i++) {
            for(let letter of Object.keys(letterNumberHash)) {
                remainderGridCoordinates.push(letter + i);
            }
        }

        const shipLocations = {
            carrier: placeHorizontallyOrVertically(5),
            battleship: placeHorizontallyOrVertically(4),
            cruiser: placeHorizontallyOrVertically(3),
            submarine: placeHorizontallyOrVertically(3),
            destroyer: placeHorizontallyOrVertically(2),
        };

        return shipLocations;

        function placeHorizontallyOrVertically(ship_length) {
            let coords = null;
            //invoke until one returns "valid" coordinates
            while(coords === null) {
                if(Math.random() >= 0.5) {
                    coords = placeShipHorizontally(ship_length);
                } else {
                    coords = placeShipVertically(ship_length);
                }
            }
            return coords;
        }

        function placeShipHorizontally(ship_length) {
            const randomLetter = _.sample(Object.keys(letterNumberHash));
            const randomNumber = _.sample(Object.values(letterNumberHash));
            const randomCoord = randomLetter + randomNumber;

            //random coord already occupied by another ship on enemy board
            if(!remainderGridCoordinates.includes(randomCoord)) {
                return null;
            } else {
                //if out of board bounds. i.e > 10 * 10 dimension of board
                if(randomNumber + (ship_length - 1) > 10) {
                    return null;
                } else {
                    const coordsAlreadyOccupied = [];
                    const coordsForShip = [];
                    coordsForShip.push(randomCoord);
                    
                    for(let i = 1; i < ship_length; i++) {
                        const newNumber = randomNumber + i;
                        const newCoord = randomLetter + newNumber;

                        if(!remainderGridCoordinates.includes(newCoord)) {
                            coordsAlreadyOccupied.push(newCoord);
                        }
                        coordsForShip.push(newCoord);
                    }

                    //coords where computer is trying to place ship is already occupied, return null
                    if(coordsAlreadyOccupied.length > 0) {
                        return null;
                    } else {
                        remainderGridCoordinates = remainderGridCoordinates.filter( coord => {
                            for(let choosenCoord of coordsForShip) {
                                if(coord === choosenCoord) return false;
                            }
                            return true;
                        });
                        return coordsForShip;
                    }
                }
            }
        }

        function placeShipVertically(ship_length) {
            const randomLetter = _.sample(Object.keys(letterNumberHash));
            const randomNumber = _.sample(Object.values(letterNumberHash));
            const randomCoord = randomLetter + randomNumber;

            if(!remainderGridCoordinates.includes(randomLetter + randomNumber)) {
                return null;
            } else {
                const randomLetterCoded = letterNumberHash[randomLetter];

                //if number out of grid dimension bounds
                if(randomLetterCoded + (ship_length - 1) > 10) {
                    return null;
                } else {
                    const coordsAlreadyOccupied = [];
                    const coordsForShip = [];
                    coordsForShip.push(randomCoord);

                    for(let i = 0; i < ship_length; i++) {
                        const newLetterCoded = randomLetterCoded + i;
                        const newLetter = numberLetterHash[newLetterCoded];
                        const newCoord = newLetter + randomNumber;

                        if(remainderGridCoordinates.includes(newCoord)) {
                            coordsAlreadyOccupied.push(newCoord);
                        }
                        coordsForShip.push(newCoord);
                    }

                    if(coordsAlreadyOccupied.length > 0) {
                        return null;
                    } else {
                        //remove coords=inates for the currently selected ship from the available coords
                        remainderGridCoordinates = remainderGridCoordinates.filter(coord => {
                            for(let choosenCoord of coordsForShip) {
                                if(coord === choosenCoord) return false;
                            }
                            return true;
                        });
                        return coordsForShip;
                    }
                }
            }
        }
    }
}

export default Computer_Player;