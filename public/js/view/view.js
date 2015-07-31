/*
Єтот модуль полностью ответственный за отрисовку картинки на экране. Содержит методы прорисовки как отдельных элементов
так и глобальной прорисовки лабиринта. Отвечает за перемещение камеры. Содержит методы получения координат любого объекта
 */

function abstractView() {
    this._scene = new THREE.Scene(); //создаем объект сцены
    this._light = new THREE.AmbientLight(0x808080); //создаем объект света
    this._aspect = window.innerWidth / window.innerHeight; //получаем размеры экрана
    this._camera = new THREE.PerspectiveCamera(75, this._aspect, 0.1, 1000); //создаем объект камеры
    this._renderer = new THREE.WebGLRenderer(); //создаем объект рендерера
    this.rayCasters = {}; // объект датчиков расстояния до объектов. Будет заполнятся ниже

    this._texture = new THREE.ImageUtils.loadTexture( 'texture.jpg' ); //подтягиваем картинку с текстурой
    this._texture.wrapS = this._texture.wrapT = THREE.ClampToEdgeWrapping; //настройки текстуры, которые, к слову, нихрена не работают
    this._texture.repeat.set(1, 1);//тоже настройки текстуры
    this._texture.minFilter = THREE.NearestFilter;
    //задаем материал, из которого будут создаваться нарисованные обекты
    this._material = new THREE.MeshLambertMaterial({map: this._texture});
    this._bulletMaterial = new THREE.MeshNormalMaterial();
   //функция отвечающая за анимацию.
    this.render = function() {
        var self = this;
       
        var render = function() {
            requestAnimationFrame(render);
            self._renderer.render(self._scene, self._camera);

        };
        render();
    };
    //создает лучи датчики расстояния.
    this.createRays = function() {
        this.rayCasters.Zfront = new THREE.Raycaster();
        this.rayCasters.Zfront.ray.direction.set( 0, 0, -1 );

        this.rayCasters.Zback = new THREE.Raycaster();
        this.rayCasters.Zback.ray.direction.set( 0, 0, 1 );

        this.rayCasters.xLeft = new THREE.Raycaster();
        this.rayCasters.xLeft.ray.direction.set( -1, 0, 0 );

        this.rayCasters.xRight = new THREE.Raycaster();
        this.rayCasters.xRight.ray.direction.set( 1, 0, 0 );
        
    };

}



abstractView.prototype = {
    setScene: function() { /** вставляем "холст" в документ. На нем будет рендерится анимация*/
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this._renderer.domElement);
        this._scene.add(this._light);
    },

    getSceneChild: function() { //получить потомка сцены. Сиречь, нарисованный объект.
        return this._scene.children;
    },
    
    /**
     *создает прямоугольник по заданным координатам
     *@param (object) coords - координаты. {x:,y:,z:}
     *@param (object) position - координаты. {x:,y:,z:}
     */
    createRectangle: function(size, position) {
        var texture = THREE.ImageUtils.loadTexture('texture.jpg'); 

        var geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
        
        var cube = new THREE.Mesh(geometry, this._material);
        cube.size = size;
        cube.class = 'wall';
        cube.name = 'wall';
        cube.position.x = position.x;
        cube.position.y = position.y;
        cube.position.z = position.z;
        this._scene.add(cube);
    },
    createBullet: function(size, position, rotation, id) {


        var geometry = new THREE.BoxGeometry(size.x, size.y, size.z);

        var cube = new THREE.Mesh(geometry, this._bulletMaterial);
        cube.class = 'bullet';
        cube.name = id;
        cube.size = size;
        cube.position.x = position.x;
        cube.position.y = position.y;
        cube.position.z = position.z;

        cube.rotation.x = rotation.x;
        cube.rotation.y = rotation.y;
        cube.rotation.z = rotation.z;
        this._scene.add(cube);
        return cube;

    },

    /**
     *ставит камеру по заданным координатам
     *@param (object) coords - координаты. {x:,y:,z:}
     */
    setCameraPosition: function(coords) {
        this._camera.position.x = coords.x;
        this._camera.position.y = coords.y;
        this._camera.position.z = coords.z;
    },

    /**
     *поворачивает камеру по заданным угам
     *@param (object) angle - угол. {x:,y:,z:}
     */
     setCameraAngle: function(angle) {

        this._camera.rotation.x = angle.x;
        this._camera.rotation.y = angle.y;
        this._camera.rotation.z = angle.z;
    },
    //возвращает данные камеры - ее позицию и поворот
    getCameraData: function() {
        var coords = {x: this._camera.position.x, y: this._camera.position.y, z: this._camera.position.z};
        var rotate = {x: this._camera.rotation.x, y: this._camera.rotation.y, z: this._camera.rotation.z};
        return {coord: coords, angle: rotate};
    },

    /*
    Рисует лабиринт.
    @param objArray (array) - массив из массивов. В каждом вложенном масиве - объект координат дя отрисовки.
    как-то вот так:
    [[obj1],[obj2],[[ob3_1],[obj3_2]],[{size: [x:,y:,z:], coords: [x:,y:,z:]}]]
     */
    createMaze: function(objArray) {
        var wall;
        var rectangle;
        for (var i = 0; i < objArray.length; i++) {
            wall = objArray[i];
            for (var j = 0; j < wall.length; j++) {
                var rectangle = wall[j];
                this.createRectangle(rectangle.size, rectangle.coords);
            }
        }
    },

    createFloorNRoof: function(coods, y) {

    }







};