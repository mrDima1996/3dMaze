function modelClass() {
    this.abstractFactory = new abstractFactory(); /**объект с методами создания всего нужного в лабиринте*/

    /**
     *схематичный рисунок лабиринта, который в последствиий спарсится в лабиринт.
     * в дальнейшем "строка-схема"
     */
    this.objCollection = [];
    this.sourse = '.    . .. .___.&\
.    . . | . . |&\
.    . . |_.,._|&\
.____. .  .| | . .&\
|    |_.__.|,|_._._.&\
|    :_.__.: :_._._|&\
|____| .__.|,|_._.&\
       |  .. . . |&\
       |  .. .X. |&\
       |__.._._._|  ';
    



    /**
     *координаты игрока. Пока нулевые.
     */
    this.gazer = {
        coords: {
             x: 0,
             y: 0,
             z: 0
        },
        size: {
             x: 1,
             y: 2,
             z: 1
        },
        angle: {
             x: 0,
             y: 0,
             z: 0
        }
    };
    //текущие координаты обхода.
    this._coordsPointer = {
        x: 0,
        y: 0,
        z: 0
    };
}



modelClass.prototype = {

    sayHi: function() {
        alert('s');
    },


    getGazer: function() { //геттер данных игрока
        return  this.gazer;
    },

    setGazerCoords: function(coords) {//сеттер координат игрока
         this.gazer.coords = coords;

    },


    /**
     *функция, которая парсит всю строку-схему
     */
    parse: function() {
        for (var i = 0; i < this.sourse.length; i++) {
            this._parseHandler(this.sourse[i], i);
        };
        var x = this._coordsPointer.x;
        var y = this._coordsPointer.y;
        var z = this._coordsPointer.z;
        
        var floor = [];
        floor.push(this.abstractFactory.createRectangle({x: 0,y: 0,z: 0}, {x: x, y: 0,z: Math.abs(z)}));
        floor.push(this.abstractFactory.createRectangle({x: 0,y: 4,z: 0}, {x: x, y: 0,z: Math.abs(z)}));

        this.objCollection.push(floor);

        view.setCameraPosition(this.gazer.coords);
    },

    /**
     *функция обрабатывает символы строки-схемы
     *@param char - symbol.
     */
    _parseHandler: function(symbol, i) {
        switch (symbol) {
            case '&':
                /**перенос строки*/
                this._coordsPointer.x += 5;
                this._coordsPointer.z = 0;
                break;

            case 'X':
                /**место игрока*/
                this.gazer.coords.x = this._coordsPointer.x;
                this.gazer.coords.y = this._coordsPointer.y+2;
                this.gazer.coords.z = this._coordsPointer.z;
                this._coordsPointer.z -= 4;
                break;

            case ' ':
                /**пустое место*/
                this._coordsPointer.z -= 4;

                break;

            case 'o':
                /**пустое место*/
                this.objCollection.push(this.abstractFactory.lightFactory.createCandle(this._coordsPointer));
                this._coordsPointer.z -= 4;

                break;

            case '.':
                /**тупо ничего*/
                break;

            case '_':
                /** горизонтальная стена*/


                this.objCollection.push(this.abstractFactory.wallFactory.createHorizontalWall(this._coordsPointer));
                this._coordsPointer.z -= 4;
                break;

            case '|':
                /**вертикальная стена*/
                var abstractCoords = this._coordsPointer;
                abstractCoords.x -= 5;
                this.objCollection.push(this.abstractFactory.wallFactory.createVerticalWall(abstractCoords));
                abstractCoords.x += 5;

               
                break;

            case ':':
                /**вертикальяная дверь*/
                var abstractCoords = this._coordsPointer;
                abstractCoords.x -= 5;
                this.objCollection.push(this.abstractFactory.doorFactory.createVerticalDoor(abstractCoords));
                abstractCoords.x += 5;
                

              
                break;

            case ',':
                /**горизонтальная дверь*/
                this.objCollection.push(this.abstractFactory.doorFactory.createHorizontalDoor(this._coordsPointer));
                this._coordsPointer.z -= 4;
                break;
            default:
                /**если что-то другое*/
                alert('error in maze Scheme');
                break;



        }
    }
}