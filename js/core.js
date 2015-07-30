/*
Этот модуль создает необходимые объекты из абстрактных классов, а затем запускает выполнение игры
 */
var model = new modelClass(); //создаем объект модель
var view = new abstractView(); //создаем объект представление


model.parse(); /**перебераем строку-схему лабиринта. см model.js 9:5*/

view.setScene(); /** вставляем "холст" в документ. На нем будет рендерится анимация*/
view.render(); //запускем анимацию
view.createMaze(model.objCollection); //создаем сам лабиринт
view.createRays(); //создаем датчики расстояния до препятствий по всем сторонам света