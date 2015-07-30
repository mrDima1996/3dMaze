/*
Этот модуль служит для создания абстрактных классов элементов лабиринта.
Для большинства функций передаються координаты создаваемого объекта,
а возвращается уже объект, готовый для отрисовки. То-есть, координаты, размеры.
 */
function abstractFactory() {
    this.abstractFactory = {};



    abstractFactory = {
        abstractWallFactory: function() {}, //фабрика, создающая стены
        abstractDoorFactory: function() {}, //фабрика, создающая двери
        abstractFloorNRoofFactory: function() {}, //фабрика, создающая пол и потолок
        abstractLightFactory: function() {}, //фабрика, создающая факелы на стенах. Вообще не работает.

        /*
        возвращает координаты для прямоугольника по заданным координатам и размерам.
        @param coords (object {x:,y:,z:})
        @param size (object {x:,y:,z:})
         */
        createRectangle: function(coords, size) {
            var newRectangle = {};
            newRectangle.coords = {
                x: coords.x + size.x / 2,
                y: coords.y + size.y / 2,
                z: coords.z - size.z / 2
            };
            if (size.y == 1) newRectangle.coords.y += 3;
            newRectangle.size = size;
            return newRectangle;
        },

        // пересчет начальных координат для нового прямоугольника,
        // относительно coords с учётом его размера.
        newCoords: function(coords, size) {
            var newCoord = {
                x: coords.x + size.x,
                y: coords.y,
                z: coords.z - size.z
            };
            return newCoord;
        },
        /*
        создаеться объект. Передаются координаты и массив объектов типа "прямоугольник"
        из которых состоит этот объект. Массив перебераеться , а затем возвращаються
        готовые к отрисовке координаты и размеры.
         */
        createObj: function(coords, wallData, newCoordsData) {
            var newCoord = coords;
            var newWall = [];

            if (newCoordsData){
                for ( var i = 0; i < wallData.length; i++ ) {
                    var piece = this.createRectangle(newCoord, wallData[i]);
                    newCoord = this.newCoords(newCoord, newCoordsData[i]);
                    newWall.push(piece);
                }
            }else {
                for ( var i = 0; i < wallData.length; i++ ) {
                    var piece = this.createRectangle(newCoord, wallData[i]);
                    newCoord = this.newCoords(newCoord, wallData[i]);
                    newWall.push(piece);
                }
            }

            return newWall;
        },

        //создает пулю
        createBullet: function(gazer) {
            var newBullet = {};
            newBullet.position = {
                x: gazer.position.x,
                y: gazer.position.y,
                z: gazer.position.z
            };

            newBullet.angle = {
                x: gazer.angle.x,
                y: gazer.angle.y,
                z: gazer.angle.z
            };

            newBullet.size = {
                x: 0.1,
                y: 0.1,
                z: 0.1
            };

            newBullet.id = gazer.id;

            return newBullet;

        }

    };

    abstractFactory.abstractWallFactory.prototype = {
        createHorizontalWall: function(coords) { //создать горизонтальную стену...
            return abstractFactory.createObj(coords, [{//... с вот такими размерами
                x: 0.4,
                y: 4,
                z: 4
            }]);
        },


        createVerticalWall: function(coords) {//вертикальную
            return abstractFactory.createObj(coords, [{
                x: 5,
                y: 4,
                z:0.4
            }]);
        }
    };



        abstractFactory.abstractDoorFactory.prototype = {
        createVerticalDoor: function(coords) { //создать вертикальную дверь
            return abstractFactory.createObj(coords, [{//состоит из трех прямоугольников
                x: 1.5,
                y: 4,
                z: 0.4
            }, {
                x: 2,
                y: 1,
                z: 0.4
            }, {
                x: 1.5,
                y: 4,
                z: 0.4
            }], [{
                    x: 1.5,
                    y: 4,
                    z: 0
                }, {
                    x: 2,
                    y: 1,
                    z: 0
                }, {
                    x: 1.5,
                    y: 4,
                    z: 0
                }]

            );
        },


        createHorizontalDoor: function(coords) { //... горизонтальную дверь

            return abstractFactory.createObj(coords, [{
                x: 0.4,
                y: 4,
                z: 1
            }, {
                x: 0.4,
                y: 1,
                z: 2
            }, {
                x: 0.4,
                y: 4,
                z: 1
            }],
                [{
                    x: 0,
                    y: 4,
                    z: 1
                }, {
                    x: 0,
                    y: 1,
                    z: 2
                }, {
                    x: 0,
                    y: 4,
                    z: 1
                }]


            );
        }
    };

    abstractFactory.abstractFloorNRoofFactory.prototype = {
        create: function(coords, size) {
            var floorNRoof = [];

            var floor = createRectangle()
        }
    };

    abstractFactory.abstractLightFactory.prototype = {
        createCandle: function(coords) {
            return abstractFactory.createObj(coords, [{
                x: 0.1,
                y: 0.1,
                z: 0.1
            }]);
        }
    };

    abstractFactory.wallFactory = new abstractFactory.abstractWallFactory();
    abstractFactory.doorFactory = new abstractFactory.abstractDoorFactory();
    abstractFactory.lightFactory = new abstractFactory.abstractLightFactory();
    abstractFactory.loorNRoofFactory = new abstractFactory.abstractFloorNRoofFactory();
    return abstractFactory;
};