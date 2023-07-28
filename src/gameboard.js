import Ship from "./ship";

export default class Gameboard {
    constructor(player) {
        this.occupiedLocations = new Map();
        this.missedShotsFromEnemy = new Set();
        this.player = player;
    }

    createShipAndPlaceOnBoard(ship_name, ...locations) {
        if(this.getAnyOccupiedLocations(locations)) {
            return `Can't place! Location already has ship`
        }
        const ship = new Ship(ship_name);
        this.occupiedLocations.set(ship, new Set(locations));
    }

    getAnyOccupiedLocations(locations) {
        for(let setOfLocations of this.occupiedLocations.values()) {
            for(let location of locations) {
                if(setOfLocations.has(location)) {
                    return true;
                }
            }
        }
    }

    receiveAttack(locationCoordinates) {
        for(let [ship, setOfLocations] of this.occupiedLocations.entries()) {
            if(setOfLocations.has(locationCoordinates)) {
                ship.hit(locationCoordinates);
                if(ship.isSunk()) {
                    return ["ship sunk", ship.ship_type];
                } else if(!ship.isSunk()) {
                    return ["hit ship", ship.ship_type];
                }
            }
        }
        this.missedShotsFromEnemy.add(locationCoordinates);
        return `missed shot!`;
    }

    getAllPlayersShipsSunk() {
        const arrOfShips = this.occupiedLocations.keys();
        for(let ship of arrOfShips) {
            if(ship.isSunk() === false) {
                return false;
            }
        }
        return true;
    }
}