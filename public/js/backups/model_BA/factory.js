function abstractFactory() {};



abstractFactory.prototype = {
    Wall: function() {},
    Door: function() {},

    createRectangle: function(coords, size) {
        var newRectangle = {};
        newRectangle.coords = {
            x: coords.x + size.x / 2,
            y: coords.y + size.y / 2,
            z: coords.z + size.z / 2
        };
        newRectangle.size = size;
        return newRectangle;
    },

    newCoords: function(coords, size) {
        var newCoord = {
            x: coords.x + size.x,
            y: coords.y + size.y,
            z: coords.z + size.z
        };
        return newCoord;
    }
};

abstractFactory.prototype.Wall.prototype = {
    createHorizontalWall: function(coords) {
        var newWall = [];

        var newCoord = newCoords(coords, {
            x: 0,
            y: 0,
            z: 0
        });
        var size = {
            x: 0,
            y: 4,
            z: 5
        };
        var piece = createRectangle(newCoord, size);

        newWall.push(piece);
        piece = null;
        return newWall;
    },
    

    createVerticalWall: function(coords) {
        var newWall = [];

        var newCoord = newCoords(coords, {
            x: 0,
            y: 0,
            z: 0
        });
        var size = {
            x: 8,
            y: 4,
            z: 0
        };
        var piece = createRectangle(newCoord, size);

        newWall.push(piece);
        piece = null;
        return newWall;
    }

};

abstractFactory.prototype.Door.prototype = {
    createHorizontalDoor: function(coords) {
        var newDoor = [];
        var newCoord = newCoords(coords, {
            x: 0,
            y: 0,
            z: 0
        });
        var size = {
            x: 4,
            y: 4,
            z: 0
        };
        piece = createRectangle(coords, size);
        newDoor.push(piece);


        newCoord = newCoord(coords, size);
        size = {
            x: 4,
            y: 4,
            z: 0
        };
        piece = createRectangle(newCoord, size);
        newDoor.push(piece);


        newCoord = newCoord(newCoord, size);
        size = {
            x: 2,
            y: 1,
            z: 0
        };
        piece = createRectangle(newCoord, size);
        newDoor.push(piece);

        piece = null;
        return newDoor;
    },

    createVerticalDoor: function(coords) {
        var newDoor = [];
        var newCoord = newCoords(coords, {
            x: 0,
            y: 0,
            z: 0
        });
        var size = {
            x: 0,
            y: 4,
            z: 4
        };
        piece = createRectangle(coords, size);
        newDoor.push(piece);


        newCoord = newCoord(coords, size);
        size = {
            x: 0,
            y: 4,
            z: 4
        };
        piece = createRectangle(newCoord, size);
        newDoor.push(piece);


        newCoord = newCoord(newCoord, size);
        size = {
            x: 0,
            y: 1,
            z: 2
        };
        piece = createRectangle(newCoord, size);
        newDoor.push(piece);

        piece = null;
        return newDoor;
    }
};