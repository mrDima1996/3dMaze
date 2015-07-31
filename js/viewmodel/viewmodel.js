/*
Обрабатывает действия пользователя и отправляет в view
 */

//работает только под мозилу
 var onMouseMove = function(event) {
      var gazer = model.getGazer(); //получение информации об игроке
      var cameraData = copy(gazer); 

     cameraData.angle.y -= event.mozMovementX * 0.005;

     view.setCameraAngle({
         x: cameraData.angle.x,
         y: cameraData.angle.y,
         z: cameraData.angle.z
     });

 };
 document.addEventListener('mousemove', onMouseMove, false);
var isShot = false; //для кулдауна выстрела


//функция позволяющая обрабатывать одновременное нажатие нескольких клавищ, указанных в объекте ниже
//сама функция не моя, как работает - понимаю смутно.
 var keyboardControls = (function() {
     var keys = {
         SP: 32,
         W: 87,
         A: 65,
         S: 83,
         D: 68,
         UP: 38,
         LT: 37,
         DN: 40,
         RT: 39
     };
     var keysPressed = {};

     (function(watchedKeyCodes) {
         var handler = function(down) {
             return function(e) {
                 if (down) {

                 } else {
                     var t = null;
                 };
                 var index = watchedKeyCodes.indexOf(e.keyCode);
                 if (index >= 0 && index != 123 && index != 116) {
                     e.preventDefault();
                     keysPressed[watchedKeyCodes[index]] = down;


                 }



             };
         };


         window.addEventListener("keydown", handler(true), false);
         window.addEventListener("keyup", handler(false), false);
     })([
         keys.SP, keys.W, keys.A, keys.S, keys.D, keys.UP, keys.LT, keys.DN, keys.RT
     ]);
     return function() {

         //собственно, реакция на нажатую кнопку

         //получение информации об игроке
         var gazer = model.getGazer();
         var cameraData = copy(gazer); 
         var vX = cameraData.position.x;
         var vY = cameraData.position.y;
         var vZ = cameraData.position.z;
       

         if (keysPressed[87]) { //вперед
             cameraData.position.z -= 0.2 * Math.cos(cameraData.angle.y);
             cameraData.position.x -= 0.2 * Math.sin(cameraData.angle.y);

         }

         if (keysPressed[83]) { //назад
             cameraData.position.z += 0.2 * Math.cos(cameraData.angle.y);
             cameraData.position.x += 0.2 * Math.sin(cameraData.angle.y);
         }

         if (keysPressed[65]) { //влево
             cameraData.position.z -= 0.2 * Math.cos(cameraData.angle.y + Math.PI / 2);
             cameraData.position.x -= 0.2 * Math.sin(cameraData.angle.y + Math.PI / 2);
         }

         if (keysPressed[68]) { //вправо
             cameraData.position.z += 0.2 * Math.cos(cameraData.angle.y + Math.PI / 2);
             cameraData.position.x += 0.2 * Math.sin(cameraData.angle.y + Math.PI / 2);
         }

         if (keysPressed[38]) { //камеру вверх
             cameraData.angle.x -= 0;
         }

         if (keysPressed[40]) { //камеру вниз
             cameraData.angle.x += 0;
         }
         if (keysPressed[37]) { //камеру влево
             cameraData.angle.y += 0.1;
         }

         if (keysPressed[39]) { //камеру вправо
             cameraData.angle.y -= 0.1;
         }

         if (keysPressed[32]) { //нажали пробел
             if (!isShot) {
                 shot();
                 isShot = true;
                 setTimeout(function() {isShot = false}, 50);
             }
         }

         // поворот камеры осуществляеться в любом случае
          view.setCameraAngle({
             x: cameraData.angle.x,
             y: cameraData.angle.y,
             z: cameraData.angle.z
         });

         // если герой врезался в стену, то откатить изменения обратно
         var hits = isHit(cameraData);
         if (!hits[0]) {

             view.setCameraPosition({
                 x: cameraData.position.x,
                 y: cameraData.position.y,
                 z: cameraData.position.z
             });


             model.setGazerCoords({
                 x: cameraData.position.x,
                 y: cameraData.position.y,
                 z: cameraData.position.z
             })

         }  else {
             // а если может идти, то отослать изменения во view
              cameraData.position.x = 0;
             //bulletHit(hits[1]);
              model.setGazerCoords({
                 x: vX,
                 y: vY,
                 z: vZ
             })
         }

        
     }
 })();

 setInterval(keyboardControls, 25)
setInterval(moveBullets, 0)

//создать пулю
function shot(){

    var gazer = model.gazer;
    var bullets = model.bullets;

    var newBullet = model.abstractFactory.createBullet(gazer);
    var threeObjBullet = view.createBullet(newBullet.size, newBullet.position, newBullet.angle, newBullet.id);
    model.bullets.push(threeObjBullet);

};

//передвинуть все пули
function moveBullets(){
    var bullets = model.bullets;
    for (var i = 0; i < bullets.length; i++) {
        bulletMove(bullets[i]);
    }
};

function bulletMove(obj){
    var bullets = model.bullets;
    var gazer = model.gazer;
    obj.position.z -= 0.1 * Math.cos(obj.rotation.y);
    obj.position.x -= 0.1 * Math.sin(obj.rotation.y);
    var hit = isHit(obj);
    if (hit[0]) {
        if (hit[1].name != gazer.id){
            for (var i = 0; i < bullets.length; i++) {
                if (bullets[i]==obj) {
                    bullets.splice(i,1);
                }
            }
            view._scene.remove(obj);
        }
    };


        //view._scene.remove(obj);
        //console.log(obj.position.x +' ' + obj.position.y +' ' + obj.position.z);
}

//Проверяет столкновения любого объекта с любыми другими
 function isHit(obj) {
     var rays = view.rayCasters;
     var hit = false;
     var lengths = [];
     var objs = [];
     var intersects;
     for (var key in rays) {
     /*
     всего лучей 4: вперед, назад, влево и вправо
     код снимает координаты объекта и "выстреливает" лучом в нужное направление
     */
         rays[key].ray.origin.copy(obj.position);
         intersects = rays[key].intersectObjects(view._scene.children); //любое пересечение
         /*если первое пересечение хоть чему-то равно,
         то добавить дистанцию пересечения.
         если нет, добавить 10000
         */
         if (intersects[0] !== undefined) {

             while (true) {
                 if (intersects === undefined) break;
                 if (intersects[0].object.class == 'bullet') {
                    intersects.splice(0, 1);
                    if (intersects.length ==0 ) break;
                 } else {
                     break;
                 }
             }

             if (intersects[0] !== undefined ) {
                 lengths.push(intersects[0].distance);
                 objs.push(intersects[0].object);
             } else {
                 lengths.push(10000);
                 objs.push(null);
             }
         }

     };
     //если расстояния до пересечения меньше размеров объекта, то объект врезался во что-то
     if (lengths.length == 0) return [false, null];
     if (lengths[0] < obj.size.z/2) return [true, objs[0]];
     if (lengths[1] < obj.size.z/2) return  [true, objs[1]];
     if (lengths[2] < obj.size.x/2) return  [true, objs[2]];
     if (lengths[3] < obj.size.x/2) return  [true, objs[3]];


     return [false, null];


 };

 function copy(b) {
    var a = {};
    for (var key in b) {
        a[key] = b[key];
    }
    return a;
 }