// Se importan las clases a utilizar
import Matrix4 from "./Matrix4.js";
import Vector3 from "./Vector3.js";

import Cilindro from "./Cilindro.js";
import Cono from "./Cono.js";
import Esfera from "./Esfera.js";
import Dodecaedro from "./Dodecaedro.js";
import Icosaedro from "./Icosaedro.js";
import Octaedro from "./Octaedro.js";
import Tetraedro from "./Tetraedro.js";
import Toro from "./Toro.js";
import PrismaRectangular from "./PrismaRectangular.js";

import Camera from "./TrackballCamera.js";
import Teapot from "./Teapot.js";

window.addEventListener("load", function (evt) {
  // se obtiene una referencia al canvas
  let canvas = document.getElementById("the_canvas");

  // se obtiene una referencia al contexto de render de WebGL
  const gl = canvas.getContext("webgl");

  // si el navegador no soporta WebGL la variable gl no está definida
  if (!gl) throw "WebGL no soportado";

  // se obtiene la referencia al checkbox de iluminacion
  let especular = document.getElementById("especular_ckbx");

  //Creamos el programa para iluminacion difusa
  let program = createProgram(
    gl,
    createShader(gl, gl.VERTEX_SHADER, document.getElementById("difusa_2d-vertex-shader").text),
    createShader(gl, gl.FRAGMENT_SHADER, document.getElementById("difusa_2d-fragment-shader").text)
  );

  //Creamos el programa para iluminacion especular
  let especular_program = createProgram(
    gl,
    createShader(gl, gl.VERTEX_SHADER, document.getElementById("especular-2d-vertex-shader").text),
    createShader(gl, gl.FRAGMENT_SHADER, document.getElementById("especular-2d-fragment-shader").text)
  );

  //Este objeto se lo pasaremos a la funcion draw de cada figura (Difusa)
  let difusa_shader_locations = {
    positionAttribute: gl.getAttribLocation(program, "a_position"),
    colorAttribute: gl.getAttribLocation(program, "a_color"),
    normalAttribute: gl.getAttribLocation(program, "a_normal"),
    lightPosition: gl.getUniformLocation(program, "u_light_position"),
    PVM_matrix: gl.getUniformLocation(program, "u_PVM_matrix"),
    VM_matrix: gl.getUniformLocation(program, "u_VM_matrix"),
    colorUniformLocation: gl.getUniformLocation(program, "u_color"),
  }

  //Este objeto se lo pasaremos a la funcion draw de cada figura (Especular)
  let especular_shader_locations = {
    positionAttribute: gl.getAttribLocation(especular_program, "a_position"),
    colorAttribute: gl.getAttribLocation(especular_program, "a_color"),
    normalAttribute: gl.getAttribLocation(especular_program, "a_normal"),

    ambientColor: gl.getUniformLocation(especular_program, "u_ambient_color"),
    lightPosition: gl.getUniformLocation(especular_program, "u_light_position"),
    lightColor: gl.getUniformLocation(especular_program, "u_light_color"),
    shininess: gl.getUniformLocation(especular_program, "u_shininess"),

    PVM_matrix: gl.getUniformLocation(especular_program, "u_PVM_matrix"),
    VM_matrix: gl.getUniformLocation(especular_program, "u_VM_matrix"),
    colorUniformLocation: gl.getUniformLocation(especular_program, "u_color"),
  }

  // se crean y posicionan los modelos geométricos
  let geometry = [
    // new Cilindro(
    //   gl,
    //   [1, 0, 0, 1],
    //   2,
    //   2,
    //   16,
    //   16,
    //   Matrix4.translate(new Vector3(-5, 0, -5))
    // ),
    // new Dodecaedro(
    //   gl,
    //   [0, 0, 1, 1],
    //   2,
    //   Matrix4.translate(new Vector3(5, 0, -5))
    // ),
    // new Cono(
    //   gl,
    //   [0, 1, 0, 1],
    //   2,
    //   2,
    //   16,
    //   16,
    //   Matrix4.translate(new Vector3(0, 0, -5))
    // ),
    // new Esfera(
    //   gl,
    //   [0, 1, 1, 1],
    //   2,
    //   16,
    //   16,
    //   Matrix4.translate(new Vector3(-5, 0, 0))
    // ),
    // new Icosaedro(gl, [1, 0, 1, 1], 2, Matrix4.translate(new Vector3(0, 0, 0))),
    // new Octaedro(gl, [1, 1, 0, 1], 2, Matrix4.translate(new Vector3(5, 0, 0))),
    // new Tetraedro(
    //   gl,
    //   [0.5, 0.5, 0.5, 1],
    //   2,
    //   Matrix4.translate(new Vector3(0, 0, 5))
    // ),
    // new Toro(
    //   gl,
    //   [0.25, 0.25, 0.25, 1],
    //   4,
    //   1,
    //   16,
    //   16,
    //   Matrix4.translate(new Vector3(5, 0, 5))
    // ),
    new Teapot(gl, [0.5, 0, 0.75]),
    new PrismaRectangular(
      gl,
      [1, 0.2, 0.3, 1],
      20,
      30,
      40,
      Matrix4.translate(new Vector3(-5, 0, 5))
    )
  ];

  let lightPos = [3, 1, 5, 1];
  let lightPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, lightPositionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lightPos), gl.STATIC_DRAW);

  // se activa la prueba de profundidad, esto hace que se utilice el buffer de profundidad para determinar que píxeles se dibujan 
  gl.enable(gl.DEPTH_TEST);

  /////////////////////////////////////CAMARA/////////////////////////////////////////////////////////////////////////////////

  // // se define la posición de la cámara (o el observador o el ojo)
  // // let camera = new Vector3(0, 11, 7); Camara original -------------------
  // let camera = new Vector3(0, 2.5, 6);
  // // let camera = new Vector3(12, 5, 8);
  // // se define la posición del centro de interés, hacia donde observa la cámara
  // let coi = new Vector3(0, 0, 0);
  // // se crea una matriz de cámara (o vista)
  // let viewMatrix = Matrix4.lookAt(camera, coi, new Vector3(0, 1, 0));

  // // se construye la matriz de proyección en perspectiva
  // let projectionMatrix = Matrix4.perspective(
  //   (75 * Math.PI) / 180,
  //   canvas.width / canvas.height,
  //   1,
  //   2000
  // );
  // // se define una matriz que combina las transformaciones de la vista y de proyección
  // let viewProjectionMatrix = Matrix4.multiply(projectionMatrix, viewMatrix);

  let aspect = gl.canvas.width / gl.canvas.height;
  let projectionMatrix = (Matrix4.perspective(75 * Math.PI / 180, aspect, 1, 2000)).toArray();

  let projectionViewModelMatrix;

  let camera = new Camera([0, 0, 7], [0, 0, 0], [0, 1, 0]);

  let viewMatrix;


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //Funcion que se encarga de dibujar las distintas figuras
  function draw() {

    viewMatrix = camera.getMatrix();

    // se le indica a WebGL cual es el tamaño de la ventana donde se despliegan los gráficos
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    // se limpia la pantalla con un color negro transparente
    gl.clearColor(0, 0, 0, 0.5);
    // se limpian tanto el buffer de color, como el buffer de profundidad
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //Le indicamos que programa usar
    if (especular_ckbx.checked) {
      //En este caso usamos el programa para iluminacion especular
      gl.useProgram(especular_program);

      //Iteramos y dibujamos las geometrias pasandole la info de iluminacion
      for (let i = 0; i < geometry.length; i++) {
        gl.uniform3fv(especular_shader_locations.ambientColor, [0.2, 0.2, 0.2]);
        gl.uniform3fv(especular_shader_locations.lightColor, [1, 1, 1]);
        gl.uniform1f(especular_shader_locations.shininess, 10);
        geometry[i].draw(gl, especular_shader_locations, lightPos, viewMatrix, projectionMatrix);
      }
    } else {
      //En este caso le indicamos que use el programa para iluminacion difusa
      gl.useProgram(program);

      //Iteramos y dibujamos las geometrias
      for (let i = 0; i < geometry.length; i++) {
        geometry[i].draw(gl, difusa_shader_locations, lightPos, viewMatrix, projectionMatrix);
      }
    }
  }

  draw();

  especular.addEventListener("change", function () {
    draw();
  });


  //Funcionalidad de la camara 
  let initial_mouse_position = null;

  /**
   * Manejador de eventos para cuando se presiona el botón del mouse dentro del canvas
   */
  canvas.addEventListener("mousedown", (evt) => {
    initial_mouse_position = getMousePositionInCanvas(evt);
    canvas.addEventListener("mousemove", mousemove);
  });

  /**
   * Manejador de eventos para cuando se libera el botón del mouse en cualquier parte de la ventana (window)
   */
  window.addEventListener("mouseup", (evt) => {
    if (initial_mouse_position) {
      camera.finishMove(initial_mouse_position, getMousePositionInCanvas(evt));
    }
    canvas.removeEventListener("mousemove", mousemove);
    initial_mouse_position = null;
  });

  /**
   * Función que se encarga de llamar la función de rotación de la cámara, y redibuja la escena
   */
  function mousemove(evt) {
    camera.rotate(initial_mouse_position, getMousePositionInCanvas(evt));
    draw();
  }

  /**
   * Función que obtiene las coordenadas del mouse
   */
  function getMousePositionInCanvas(evt) {
    const rect = canvas.getBoundingClientRect();
    const x = evt.clientX - rect.left;
    const y = evt.clientY - rect.top;
    return { x: x, y: y };
  }

});


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
