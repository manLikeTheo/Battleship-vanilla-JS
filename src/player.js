export default class Player {
    constructor(name) {
        this.name = name;
        this.shotsFiredByPlayer = new Set();
        this.playerMadeFirstMove = false;
    }

    attack(coords, gameBoard) {
        if(!this.getCoordinatesAlreadyShotByThisPlayer(coords)) {
            const result = gameBoard.receiveAttack(coords);
            if(Array.isArray(result)) return result;
            if(result === "missed shot") return "attack missed!";
        }
        if(this.getCoordinatesAlreadyShotByThisPlayer(coords)) {
            return "repeat shot";
        }
    }

    getCoordinatesAlreadyShotByThisPlayer(coords) {
        return this.shotsFiredByPlayer.has(coords);
    }
}