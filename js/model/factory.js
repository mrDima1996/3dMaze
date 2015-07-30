/*
���� ������ ������ ��� �������� ����������� ������� ��������� ���������.
��� ����������� ������� ����������� ���������� ������������ �������,
� ������������ ��� ������, ������� ��� ���������. ��-����, ����������, �������.
 */
function abstractFactory() {
    this.abstractFactory = {};



    abstractFactory = {
        abstractWallFactory: function() {}, //�������, ��������� �����
        abstractDoorFactory: function() {}, //�������, ��������� �����
        abstractFloorNRoofFactory: function() {}, //�������, ��������� ��� � �������
        abstractLightFactory: function() {}, //�������, ��������� ������ �� ������. ������ �� ��������.

        /*
        ���������� ���������� ��� �������������� �� �������� ����������� � ��������.
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

        // �������� ��������� ��������� ��� ������ ��������������,
        // ������������ coords � ������ ��� �������.
        newCoords: function(coords, size) {
            var newCoord = {
                x: coords.x + size.x,
                y: coords.y,
                z: coords.z - size.z
            };
            return newCoord;
        },
        /*
        ���������� ������. ���������� ���������� � ������ �������� ���� "�������������"
        �� ������� ������� ���� ������. ������ ������������� , � ����� �������������
        ������� � ��������� ���������� � �������.
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

        //������� ����
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
        createHorizontalWall: function(coords) { //������� �������������� �����...
            return abstractFactory.createObj(coords, [{//... � ��� ������ ���������
                x: 0.4,
                y: 4,
                z: 4
            }]);
        },


        createVerticalWall: function(coords) {//������������
            return abstractFactory.createObj(coords, [{
                x: 5,
                y: 4,
                z:0.4
            }]);
        }
    };



        abstractFactory.abstractDoorFactory.prototype = {
        createVerticalDoor: function(coords) { //������� ������������ �����
            return abstractFactory.createObj(coords, [{//������� �� ���� ���������������
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


        createHorizontalDoor: function(coords) { //... �������������� �����

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