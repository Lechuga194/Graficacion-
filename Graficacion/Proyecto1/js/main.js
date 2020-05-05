/**
 * Amaya López Dulce Fernanda | 314195856
 * Lechuga Martinez Jose Eduardo | 314325749
 * Proyecto - Graficación por computadora 2020-2
 */

import { Vector3 } from "./Vector3.js";
import { Vector4 } from "./Vector4.js";
import { Matrix4 } from "./Matrix4.js";

//Definicion del canvas y contexto de dibujo
let canvas = document.getElementById("the_canvas");
const ctx = document.getElementById("the_canvas").getContext("2d");

//Seleccion del input
const inputButton = document.getElementById("myFile");

//Seleccion de el documento
const input = document.querySelector('input[type="file"]');

//Seleccion de variables para camara
let camX = document.getElementById("camaraX");
let camY = document.getElementById("camaraY");
let camZ = document.getElementById("camaraZ");

//seleccion de variables para el punto de interes
let interX = document.getElementById("interesX");
let interY = document.getElementById("interesY");
let interZ = document.getElementById("interesZ");

//Agregamos las variables a un arreglo
let inputXYZ = [camX, camY, camZ, interX, interY, interZ];

let verticesAux = []; //Arreglo auxiliar para guardar los vertices del parseo
let vertices = [0]; //Arreglo que guardara los vertices (inicia con 0 por que los obj cuentan desde 1)
let caras = []; //Arreglo que guardara las caras
let camara = new Vector3(0, 0, 3); //Define la posicion de la camara
let pi = new Vector3(0, 0, 0); //Definie el punto de interes
let vistaAux = new Vector3(0, 1, 0);
let vista = Matrix4.lookAt(camara, pi, vistaAux); //Matriz de vista

//Matriz de perspectiva
let matrizProyeccion = Matrix4.perspective(
  (90 * Math.PI) / 180,
  canvas.width / canvas.height,
  0.1,
  2000
);

// se crea una matrix que conjunta las transformaciones de la cámara y de la proyección
let vistaProyeccion = Matrix4.multiply(matrizProyeccion, vista);

inputButton.addEventListener("click", function () {
  canvas.width = canvas.width; //Esto es para limpiar el canvas por completo
});

/**
 * Maneja los eventos para cuando cambian los input de la camara o el centro de interes
 */
inputXYZ.forEach(function (input) {
  input.addEventListener("change", function () {
    canvas.width = canvas.width; //Esto es para limpiar el canvas por completo
    camara = new Vector3(camX.value, camY.value, camZ.value);
    pi = new Vector3(interX.value, interY.value, interZ.value);
    vista = Matrix4.lookAt(camara, pi, new Vector3(0, 1, 0));
    vistaProyeccion = Matrix4.multiply(matrizProyeccion, vista);
    dibuja();
  });
});

/**
 * Esta función en necesaria ya que estamos usando 2D para dibujar los objetos 3D
 * Cuando veamos WebGL esta transformación desaparece, ya que WebGL realiza la transformación automáticamente
 */
function imageTransform(w, h, v) {
  // hay que notar que las coordenadas de los puntos se dividen entre su componente w, lo que es necesario para aplicar de forma completa la transformación de proyección
  return {
    x: ((v.x / v.w) * w) / 2 + w / 2,
    y: ((-v.y / v.w) * h) / 2 + h / 2,
    z: v.z / v.w,
  };
}

/**
 * Evento para detectar cambios de archivo
 * y agregar los nuevos datos a sus respectivos
 * arreglos.
 */
input.addEventListener(
  "change",
  function (e) {
    const lector = new FileReader();
    lector.readAsText(input.files[0]);

    /**
     * Parser para el archivo
     */
    lector.onload = function () {
      const lineas = lector.result.split("\n"); //Separa el doc por lineas

      lineas.forEach((linea) => {
        //REGEX para vertices
        if (
          /v (-)?[0-9]+.[0-9]+ (-)?[0-9]+.[0-9]+ (-)?[0-9]+.[0-9]+/.test(linea)
        ) {
          linea = linea.split(/ /);
          linea.splice(0, 1);
          for (let i = 0; i < linea.length; i++) {
            linea[i] = parseFloat(linea[i]);
          }
          let vector = [linea[0], linea[1], linea[2]];
          verticesAux.push(vector);
        } else {
          //REGEX para caras
          if (
            /f [0-9]+\/([\/]+)?[0-9]+(\/([\/]+)?[0-9]+)? [0-9]+\/([\/]+)?[0-9]+(\/([\/]+)?[0-9]+)? [0-9]+\/([\/]+)?[0-9]+(\/([\/]+)?[0-9]+)?/.test(
              linea
            )
          ) {
            linea = linea.split(/ /);
            linea.splice(0, 1);
            for (let i = 0; i < linea.length; i++) {
              linea[i] = linea[i].split("//");
              linea[i] = parseInt(linea[i]);
            }
            let cara = [linea[0], linea[1], linea[2]];
            caras.push(cara);
          }
        }
      });
      addVertices();
      canvas.width = canvas.width; //Esto es para limpiar el canvas por completo
      dibuja();
    };
  },
  false
);

/**
 * Funcion que transforma el resultado del parseo a objetos Vector4
 * y los agrega al arreglo vertices
 */
function addVertices() {
  for (let i = 0; i < verticesAux.length; i++) {
    vertices.push(
      new Vector4(verticesAux[i][0], verticesAux[i][1], verticesAux[i][2], 1)
    );
  }
}

/**
 * Funcion que dibuja las caras sobre el canvas
 */
function dibuja() {
  let vertex;
  ctx.beginPath();
  ctx.strokeStyle = " rgb(233, 178, 188)";
  caras.forEach((cara) => {
    cara.forEach((vertex_index, index) => {
      // transformacion de vertices
      vertex = imageTransform(
        canvas.width,
        canvas.height,
        vistaProyeccion.multiplyVector(vertices[vertex_index])
      );
      if (index == 0) {
        ctx.moveTo(vertex.x, vertex.y);
      }
      ctx.lineTo(vertex.x, vertex.y);
    });
    ctx.closePath();
    ctx.stroke();
  });
}
