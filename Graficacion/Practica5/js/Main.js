// Se importan las clases a utilizar
import Matrix4 from "./Matrix4.js";
import Vector3 from "./Vector3.js";

import Utils from "./Utils.js";
import Cilindro from "./Cilindro.js";
import Cono from "./Cono.js";
import Dodecaedro from "./Dodecaedro.js";
import Esfera from "./Esfera.js";
import Icosaedro from "./Icosaedro.js";
import Octaedro from "./Octaedro.js";
import PrismaRectangular from "./PrismaRectangular.js";
import Tetraedro from "./Tetraedro.js";
import Toro from "./Toro.js";

window.addEventListener("load", function (evt) {
  // se obtiene una referencia al canvas
  let canvas = document.getElementById("the_canvas");

  // se obtiene una referencia al contexto de render de WebGL
  const gl = canvas.getContext("webgl");

  // si el navegador no soporta WebGL la variable gl no está definida
  if (!gl) throw "WebGL no soportado";

  //Creamos el programa con los shaders
  let program = createProgram(
    gl,
    createShader(gl, gl.VERTEX_SHADER, document.getElementById("2d-vertex-shader").text),
    createShader(gl, gl.FRAGMENT_SHADER, document.getElementById("2d-fragment-shader").text)
  );

  //Este objeto se lo pasaremos a la funcion draw de cada figura
  let shader_locations = {
    positionAttribute: gl.getAttribLocation(program, "a_position"),
    colorAttribute: gl.getAttribLocation(program, "a_color"),
    normalAttribute: gl.getAttribLocation(program, "a_normal"),
    lightPosition: gl.getUniformLocation(program, "u_light_position"),
    PVM_matrix: gl.getUniformLocation(program, "u_PVM_matrix"),
    VM_matrix: gl.getUniformLocation(program, "u_VM_matrix"),
    colorUniformLocation: gl.getUniformLocation(program, "u_color"),
  }

  // // se construye una referencia al attribute "a_position" definido en el shader
  // let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  // let colorUniformLocation = gl.getUniformLocation(program, "u_color");
  // let PVM_matrixLocation = gl.getUniformLocation(program, "u_PVM_matrix");

  // se crean y posicionan los modelos geométricos, uno de cada tipo
  let geometry = [
    new Cilindro(
      gl,
      [1, 0, 0, 1],
      2,
      2,
      16,
      16,
      Matrix4.translate(new Vector3(-5, 0, -5))
    ),
    new Cono(
      gl,
      [0, 1, 0, 1],
      2,
      2,
      16,
      16,
      Matrix4.translate(new Vector3(0, 0, -5))
    ),
    new Dodecaedro(
      gl,
      [0, 0, 1, 1],
      2,
      Matrix4.translate(new Vector3(5, 0, -5))
    ),
    new Esfera(
      gl,
      [0, 1, 1, 1],
      2,
      16,
      16,
      Matrix4.translate(new Vector3(-5, 0, 0))
    ),
    new Icosaedro(gl, [1, 0, 1, 1], 2, Matrix4.translate(new Vector3(0, 0, 0))),
    new Octaedro(gl, [1, 1, 0, 1], 2, Matrix4.translate(new Vector3(5, 0, 0))),
    new Tetraedro(
      gl,
      [0.5, 0.5, 0.5, 1],
      2,
      Matrix4.translate(new Vector3(0, 0, 5))
    ),
    new Toro(
      gl,
      [0.25, 0.25, 0.25, 1],
      4,
      1,
      16,
      16,
      Matrix4.translate(new Vector3(5, 0, 5))
    ),
    new PrismaRectangular(
      gl,
      [1, 0.2, 0.3, 1],
      2,
      3,
      4,
      Matrix4.translate(new Vector3(-5, 0, 5))
    ),
  ];

  //Creamos el shader para la luz
  let light_program = createProgram(
    gl,
    createShader(gl, gl.VERTEX_SHADER, document.getElementById("light-vertex-shader").text),
    createShader(gl, gl.FRAGMENT_SHADER, document.getElementById("light-fragment-shader").text)
  );
  let light_locations = {
    positionAttribute: gl.getAttribLocation(light_program, "a_position"),
    PVM_matrix: gl.getUniformLocation(light_program, "u_PVM_matrix")
  };
  let lightPos = [0, -2, 0, 1];
  let lightPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, lightPositionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lightPos), gl.STATIC_DRAW);

  // se activa la prueba de profundidad, esto hace que se utilice el buffer de profundidad para determinar que píxeles se dibujan 
  gl.clearColor(0, 0, 0, 0);
  gl.enable(gl.DEPTH_TEST);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // se define la posición de la cámara (o el observador o el ojo)
  // let camera = new Vector3(0, 11, 7); Camara original -------------------
  let camera = new Vector3(0, 3, 7);
  // se define la posición del centro de interés, hacia donde observa la cámara
  let coi = new Vector3(0, 0, 0);
  // se crea una matriz de cámara (o vista)
  let viewMatrix = Matrix4.lookAt(camera, coi, new Vector3(0, 1, 0));

  // se construye la matriz de proyección en perspectiva
  let projectionMatrix = Matrix4.perspective(
    (75 * Math.PI) / 180,
    canvas.width / canvas.height,
    1,
    2000
  );

  // se define una matriz que combina las transformaciones de la vista y de proyección
  let viewProjectionMatrix = Matrix4.multiply(projectionMatrix, viewMatrix);
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function draw() {
    // se le indica a WebGL cual es el tamaño de la ventana donde se despliegan los gráficos
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    // se limpia la pantalla con un color negro transparente
    gl.clearColor(0, 0, 0, 0.5);
    // se limpian tanto el buffer de color, como el buffer de profundidad
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // se le indica a WebGL que programa debe utilizar
    // recordando, un programa en este contexto es una pareja compuesta por un shader de vértices y uno de fragmentos
    gl.useProgram(program);

    for (let i = 0; i < geometry.length; i++) {
      geometry[i].draw(gl, shader_locations, lightPos, viewMatrix, viewProjectionMatrix);
    }

    // // //Esto es para dibujar la posicion de la luz
    // gl.useProgram(light_program);
    // gl.uniformMatrix4fv(light_locations.PVM_matrix, false, viewProjectionMatrix.toArray());
    // gl.enableVertexAttribArray(light_locations.positionAttribute);
    // gl.bindBuffer(gl.ARRAY_BUFFER, lightPositionBuffer);
    // gl.vertexAttribPointer(light_locations.positionAttribute, 4, gl.FLOAT, false, 0, 0);
    // gl.drawArrays(gl.POINTS, 0, 1);

  }

  draw();
});

//////////////////////////////////////////////////////////
// Funciones de utilería para la construcción de shaders
//////////////////////////////////////////////////////////
/**
 * Función que crear un shader, dado un contexto de render, un tipo y el código fuente
 */
function createShader(gl, type, source) {
  let shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

/**
 * Función que toma un shader de vértices con uno de fragmentos y construye un programa
 */
function createProgram(gl, vertexShader, fragmentShader) {
  let program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  let success = gl.getProgramParameter(program, gl.LINK_STATUS);

  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
}
