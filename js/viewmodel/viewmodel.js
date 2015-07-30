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
         var vX = cameraData.coords.x;
         var vY = cameraData.coords.y;
         var vZ = cameraData.coords.z;
       

         if (keysPressed[87]) { //вперед
             cameraData.coords.z -= 0.1 * Math.cos(cameraData.angle.y);
             cameraData.coords.x -= 0.1 * Math.sin(cameraData.angle.y);

         }

         if (keysPressed[83]) { //назад
             cameraData.coords.z += 0.1 * Math.cos(cameraData.angle.y);
             cameraData.coords.x += 0.1 * Math.sin(cameraData.angle.y);
         }

         if (keysPressed[65]) { //влево
             cameraData.coords.z -= 0.1 * Math.cos(cameraData.angle.y + Math.PI / 2);
             cameraData.coords.x -= 0.1 * Math.sin(cameraData.angle.y + Math.PI / 2);
         }

         if (keysPressed[68]) { //вправо
             cameraData.coords.z += 0.1 * Math.cos(cameraData.angle.y + Math.PI / 2);
             cameraData.coords.x += 0.1 * Math.sin(cameraData.angle.y + Math.PI / 2);
         }

         if (keysPressed[38]) { //камеру вверх
             cameraData.angle.x -= 0;
         }

         if (keysPressed[40]) { //камеру вниз
             cameraData.angle.x += 0;
         }
         if (keysPressed[37]) { //камеру влево
             cameraData.angle.y += 0.05;
         }

         if (keysPressed[39]) { //камеру вправо
             cameraData.angle.y -= 0.05;
         }

         // поворот камеры осуществляеться в любом случае
          view.setCameraAngle({
             x: cameraData.angle.x,
             y: cameraData.angle.y,
             z: cameraData.angle.z
         });

         // если герой врезался в стену, то откатить изменения обратно
         if (!isHit(cameraData)[0]) {

             view.setCameraPosition({
                 x: cameraData.coords.x,
                 y: cameraData.coords.y,
                 z: cameraData.coords.z
             });


             model.setGazerCoords({
                 x: cameraData.coords.x,
                 y: cameraData.coords.y,
                 z: cameraData.coords.z
             })

         }  else {
             // а если может идти, то отослать изменения во view
              cameraData.coords.x = 0;

              model.setGazerCoords({
                 x: vX,
                 y: vY,
                 z: vZ
             })
         }

        
     }
 })();

 setInterval(keyboardControls, 25);

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
         rays[key].ray.origin.copy(obj.coords);
         intersects = rays[key].intersectObjects(view._scene.children); //любое пересечение
         /*если первое пересечение хоть чему-то равно,
         то добавить дистанцию пересечения.
         если нет, добавить 10000
         */
         if (intersects[0] !== undefined) {
             lengths.push(intersects[0].distance);
             objs.push(intersects[0].object);
         }

         else {
             lengths.push(10000);
             objs.push(null);
         }
     };

     //если расстояния до пересечения меньше размеров объекта, то объект врезался во что-то
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