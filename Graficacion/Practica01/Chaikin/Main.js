/**
 * Lechuga Martínez José Eduardo
 * 314325749
 * joselechuga194@ciencias.unam.mx
 */

let stack = [];
let canvas = this.document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

/**
 * Funcion para determinar la distancia
 * entre dos puntos en el plano
 * @param {Punto x1} x1
 * @param {Punto x2} x2
 * @param {Punto y1} y1
 * @param {Punto y2} y2
 */
function distancia(x1, x2, y1, y2) {
  let xs = x2 - x1;
  let ys = y2 - y1;
  xs = Math.pow(xs, 2);
  ys = Math.pow(ys, 2);
  return Math.sqrt(xs + ys);
}

/**
 * Funcion para ejecutar el algoritmo de Chaikin
 * @param {Contexto del canvas} ctx
 * @param {Coordenada x del primer punto} P1_x
 * @param {Coordenada y del primer punto} P1_y
 * @param {Coordenada x del segundo punto} P2_x
 * @param {Coordenada y del segundo punto} P2_y
 * @param {Coordenada x del tercer punto} P3_x
 * @param {Coordenada y del tercer punto} P3_y
 * @param {Coordenada x del cuarto punto} P4_x
 * @param {Coordenada y del cuarto punto} P4_y
 */
function curva(ctx, P1_x, P1_y, P2_x, P2_y, P3_x, P3_y, P4_x, P4_y) {
  //Colocamos el puntero en el punto P1
  ctx.moveTo(P1_x, P1_y);
  ctx.lineWidth = 5;

  //Agregamos los puntos al stack
  stack.push(P3_x);
  stack.push(P3_y);
  stack.push(P4_x);
  stack.push(P4_y);

  //Creamos un P4 como punto medio de P2 y P3
  P4_x = (P2_x + P3_x) / 2;
  P4_y = (P2_y + P3_y) / 2;

  do {
    //Comparamos si la distancia entre los puntos es mayor a 3 para reasignar valores
    if (distancia(P1_x, P4_x, P1_y, P4_y) > 2 * Math.sqrt(2)) {
      P3_x = (P2_x + P4_x) / 2;
      P3_y = (P2_y + P4_y) / 2;
      P2_x = (P2_x + P1_x) / 2;
      P2_y = (P2_y + P1_y) / 2;

      stack.push(P3_x);
      stack.push(P3_y);
      stack.push(P4_x);
      stack.push(P4_y);

      P4_x = (P2_x + P3_x) / 2;
      P4_y = (P2_y + P3_y) / 2;
    } else {
      //Linea dibujada
      ctx.beginPath();
      ctx.lineTo(P1_x, P1_y);
      ctx.lineTo(P4_x, P4_y);
      ctx.strokeStyle = "white";
      ctx.stroke();

      //Reemplazando P1 por P4
      P1_x = P4_x;
      P1_y = P4_y;

      //Pop del stack
      P4_y = stack.pop();
      P4_x = stack.pop();
      P2_y = stack.pop();
      P2_x = stack.pop();
    }
  } while (stack.length != 0);
}

//Puntos para crear un gatitokawai

//Orejas
curva(ctx, 320, 150, 250, 67, 96, 800, 0, 0);
curva(ctx, 450, 150, 524, 77, 680, 800, 0, 0);
curva(ctx, 330, 170, 422, 170, 450, 175);

//Ojos
curva(ctx, 260, 260, 290, 240, 321, 275, 0, 0);
curva(ctx, 470, 260, 500, 240, 526, 287, 0, 0);

//Nariz
curva(ctx, 397, 282, 422, 260, 372, 258, 0, 0);
curva(ctx, 397, 282, 375, 260, 421, 258, 0, 0);
curva(ctx, 397, 282, 414, 307, 440, 250, 0, 0);
curva(ctx, 397, 282, 374, 307, 355, 250, 0, 0);

//Bigotes
curva(ctx, 500, 283, 525, 294, 550, 275, 0, 0);
curva(ctx, 500, 293, 525, 308, 550, 290, 0, 0);
curva(ctx, 280, 280, 260, 295, 225, 265, 0, 0);
curva(ctx, 280, 290, 260, 305, 225, 285, 0, 0);
