/**
 * Lechuga Martínez José Eduardo
 * 314325749
 * joselechuga194@ciencias.unam.mx
 */
let stack = [];
let canvas = this.document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let generar = document.getElementById("generar");
let limpiar = document.getElementById("limpiar");
dibujaLineas();

limpiar.addEventListener("click", function() {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  dibujaLineas();
  ctx.restore();
});

generar.addEventListener("click", function(event) {
  event.preventDefault();
  let r = +document.getElementById("radio").value;
  let k = +document.getElementById("subdivisiones").value;
  epicicloide(r, k);
});

function dibujaLineas() {
  //Dibuja las lineas del eje
  ctx.beginPath();
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = "rgb(135, 174, 189)";
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.moveTo(0, canvas.height / 2);
  ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.stroke();
}

//Asigna propiedades para las lineas de la epicicloide
ctx.beginPath();
ctx.setLineDash([]);
ctx.fillStyle = "white";

//Translada la epicicloide al origen
ctx.translate(canvas.width / 2, canvas.height / 2);

/**
 * funcion que dibuja la epicicloide de k segmentos
 * @param {numero de iteracion sobre la circunferencia} k
 */
function epicicloide(r, k) {
  for (let i = 0; i <= 360; i++) {
    x = r * (k + 1) * Math.cos(i) - r * Math.cos((k + 1) * i);
    y = r * (k + 1) * Math.sin(i) - r * Math.sin((k + 1) * i);
    ctx.fillRect(x, y, 1, 1);
  }
}
