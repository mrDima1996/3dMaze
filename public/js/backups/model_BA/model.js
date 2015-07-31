function modelClass() {
    this.factory = new abstractFactory();
    /**
     *схематичный рисунок лабиринта, который в последствиий спарсится в лабиринт.
     * в дальнейшем "строка-схема"
     */
    this.objCollection = [];
    this.sourse = '.____.\
|    |__\
| X  :__|\
|_.._|';


    /**
     *координаты игрока. Пока нулевые.
     */
    this.gazer = {
        x: 0,
        y: 0,
        z: 0
    };
    this._coordsPointer = {
        x: 0,
        y: 0,
        z: 0
    }; //текущие координаты обхода.
}



modelClass.prototype = {

    sayHi: function() {
        alert('s');
    },





    /**
     *функция, которая парсит всю строку-схему
     */
    parse: function() {
        for (var i = 0; i < this.sourse.length; i++) {
            this._parseHandler(this.sourse[i],i);
        }
    },

    _parseHandler: function(symbol,i) {
        switch (symbol) {
            case '\\':
                this._coordsPointer.x += 10;
                this._coordsPointer.z = 0;
                break;

            case 'X':
                this.gazer.x = this._coordsPointer.x;
                this.gazer.y = this._coordsPointer.y;
                this.gazer.z = this._coordsPointer.z;

                break;

            case ' ':
                this._coordsPointer.z += 4;

                break;

            case '.':
                break;

            case '_':
                this._coordsPointer.z -= 5;
                var wall = this.factory.Wall.createHorizontalWall(this._coordsPointer);
                this.objCollection.push(wall);
                break;

            case '|':
                objCollection.push(factory.createWall.createVerticalWall());
                break;

            case ':':
                objCollection.push(factory.createDoor.createVerticalDoor());
                break;

            case ',':
                this._coordsPointer.z -= 10;
                objCollection.push(factory.createDoor.createHorizontalDoor());
                break;
            default:
                alert('error');
                break;



        }
    },


    /**
     *функция обрабатывает символы строки-схемы
     *@param char - symbol.
     */



};