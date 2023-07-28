export default class Ship {
    constructor(ship_type) {
        this.ship_type = ship_type;
        this.hitLocations = new Set();

        switch (ship_type) {
            case "Destroyer":
                this.length = 2;
                break;

            case "Battleship":
                this.length = 4;
                break;
        
            case "Cruiser":
                this.length = 3;
                break;
        
            case "Submarine":
                this.length = 3;
                break;
        
            case "Carrier":
                this.length = 5;
                break;
        }
    }

    hit(location) {
        this.hitLocations.add(location);
    }

    isSunk() {
        return (this.length === this.hitLocations.size);
    }
}