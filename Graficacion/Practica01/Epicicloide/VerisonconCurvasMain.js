/**
 * Lechuga Martínez José Eduardo
 * 314325749
 * joselechuga194@ciencias.unam.mx
 */
let stack = [];
let canvas = this.document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

//Dibuja las lineas de eje
ctx.beginPath();
ctx.setLineDash([4, 4]);
ctx.strokeStyle = "rgb(135, 174, 189)";
ctx.moveTo(canvas.width / 2, 0);
ctx.lineTo(canvas.width / 2, canvas.height);
ctx.moveTo(0, canvas.height / 2);
ctx.lineTo(canvas.width, canvas.height / 2);
ctx.stroke();

ctx.beginPath();
ctx.setLineDash([]);
ctx.strokeStyle = "white";
ctx.lineWidth = 1;
ctx.save();
ctx.translate(canvas.width / 2, canvas.height / 2);
// function epicicloide(k) {
//   r = 10;
//   for (let i = 0; i <= 360; i++) {
//     x = r * (k + 1) * Math.cos(i) - r * Math.cos((k + 1) * i);
//     y = r * (k + 1) * Math.sin(i) - r * Math.sin((k + 1) * i);
//     ctx.lineTo(x, y);
//     ctx.stroke();
//   }
// }

function epicicloide(k) {
  r = 10;
  let puntos = [];
  for (let i = 0; i < 360; i++) {
    x = r * (k + 1) * Math.cos(i) - r * Math.cos((k + 1) * i);
    y = r * (k + 1) * Math.sin(i) - r * Math.sin((k + 1) * i);
    puntos[i] = [x, y];
  }
  let puntosParaFuncion = toma(puntos, 3);

  for (let i = 0; i < puntosParaFuncion.length; i++) {
    curva(
      ctx,
      puntosParaFuncion[i][0][0],
      puntosParaFuncion[i][0][1],
      puntosParaFuncion[i][1][0],
      puntosParaFuncion[i][1][1],
      puntosParaFuncion[i][2][0],
      puntosParaFuncion[i][2][1],
      0,
      0
    );
  }
}

epicicloide(1);

/***********************************************************************
 * Toma un arreglo y crea otro con subdivisiones de tamaño n
 * Solo funciona para arreglos cuya longitud es multiplo de n
 * @param {Arreglo a partir} array
 * @param {numero de elementos por tupla del nuevo arreglo} n
 * ************ Para probar la funcion toma ****************
 * let a = [1, 2, 3, 4, 5, 6, 7, 8, 9];
 * b = toma(a, 3);
 * for (let i = 0; i < b.length; i++) {
 *   console.log(`Posicion ${i} = ${b[i]}`);
 * }
 * *******************************************************************/

function toma(array, n) {
  //auxiliar para mantener el numero de inicio del slice
  let aux = 0;
  let newA = [];
  for (let i = n; i <= array.length; i += n) {
    let sub = array.slice(aux, i);
    newA.push(sub);
    aux = aux + n;
  }
  return newA;
}

/****************************************************************/

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
