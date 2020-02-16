/**
 * Lechuga Martínez José Eduardo
 * 314325749
 * joselechuga194@ciencias.unam.mx
 */

let canvas = this.document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

/**
 * Para determinar una epicicloide es necesario establecer dos radios
 * r = que corresponde al círculo móvil (el epiciclo)
 * R = kr correspondiente al radio del círculo fijo.
 *
 * Las ecuaciones paramétricas que definen una epicicloide son las siguientes:
 *  x(θ) = r(k + 1) cos(θ) − r cos((k + 1) θ)
 *  y(θ) = r(k + 1) sin(θ) − r sin((k + 1) θ)
 */

function epicicloide(radioMovil, k) {
  const r = radioMovil * k;
  let test = [];
  let i = 0;
  let n = 0;

  do {
    // xn = r * (k + 1) * Math.cos(n) - r * Math.cos((k + 1) * n);
    // yn = r * (k + 1) * Math.sin(n) - r * Math.sin((k + 1) * n);
    xn = console.log(`X=${xn}, Y=${yn}`);
    i++;
    n++;

    ctx.beginPath();
    ctx.lineTo(xn, yn);
    ctx.strokeStyle = "white";
    ctx.stroke();
  } while (i < 100);
}

epicicloide(3, 2);
