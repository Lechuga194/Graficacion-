// Se importan las clases a utilizar
import Matrix4 from "./Matrix4.js";
import Vector3 from "./Vector3.js";
import ImageLoader from "./ImageLoader.js";
import Camera from "./Camera.js";
import Skybox from "./Skybox.js";


import Cilindro from "./Cilindro.js";
import Cono from "./Cono.js";
import Esfera from "./Esfera.js";
import Dodecaedro from "./Dodecaedro.js";
import Icosaedro from "./Icosaedro.js";
import Octaedro from "./Octaedro.js";
import PrismaRectangular from "./PrismaRectangular.js";
import Tetraedro from "./Tetraedro.js";
import Toro from "./Toro.js";

window.addEventListener("load", function () {
  ImageLoader.load(
    // la lista de imágenes que se van a cargar, en este caso solo es una
    ["bookshelf.png", "pasto.jpg", "skybox.png",],
    function () {
      // se obtiene una referencia al canvas
      let canvas = document.getElementById("the_canvas");

      // se obtiene una referencia al contexto de render de WebGL
      const gl = canvas.getContext("webgl");

      // si el navegador no soporta WebGL la variable gl no está definida
      if (!gl) throw "WebGL no soportado";

      //Skybox
      let skybox = new Skybox(gl, Matrix4.scale(new Vector3(1000, 1000, 1000)));

      //Referencia al checkbox para vista ortogonal
      let ortogonal = document.getElementById("ortogonal");
      //Referencia a la seleccion de camara
      let cambiar_camara = document.getElementById("cambiar_camara");
      //Referencia a checkboc para iniciar la animación
      let iniciar_animacion = document.getElementById("iniciar_animacion");

      //Creamos el programa para iluminacion difusa
      let program = createProgram(
        gl,
        createShader(
          gl,
          gl.VERTEX_SHADER,
          document.getElementById("texture_2d-vertex-shader").text
        ),
        createShader(
          gl,
          gl.FRAGMENT_SHADER,
          document.getElementById("texture_2d-fragment-shader").text
        )
      );


      //Este objeto se lo pasaremos a la funcion draw de cada figura (Difusa)
      let material_shader_locations = {
        positionAttribute: gl.getAttribLocation(program, "a_position"),
        colorAttribute: gl.getAttribLocation(program, "a_color"),
        normalAttribute: gl.getAttribLocation(program, "a_normal"),
        lightPosition: gl.getUniformLocation(program, "u_light_position"),
        PVM_matrix: gl.getUniformLocation(program, "u_PVM_matrix"),
        VM_matrix: gl.getUniformLocation(program, "u_VM_matrix"),
        colorUniformLocation: gl.getUniformLocation(program, "u_color"),
        texcoordAttribute: gl.getAttribLocation(program, "a_texcoord"),
      };

      ///////////////////////////////////////////////Creamos las texturas///////////////////////////////////////////////////

      let textures = ["bookshelf.png", "pasto.jpg", "skybox.png",];

      let textura_bookshelf = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, textura_bookshelf);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        ImageLoader.getImage(textures[0])
      );
      gl.generateMipmap(gl.TEXTURE_2D);

      let textura_pasto = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, textura_pasto);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        ImageLoader.getImage(textures[1])
      );
      gl.generateMipmap(gl.TEXTURE_2D);

      ///////////////////////////////////////////ILUMINACION///////////////////////////////////////////////////////////////////////

      //Informacion de la iluminacion
      let lightPos = [3, 1, 5, 1];
      let lightPositionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, lightPositionBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(lightPos),
        gl.STATIC_DRAW
      );

      // se activa la prueba de profundidad, esto hace que se utilice el buffer de profundidad para determinar que píxeles se dibujan
      gl.enable(gl.DEPTH_TEST);

      /////////////////////////////////////CAMARA/////////////////////////////////////////////////////////////////////////////////

      //Se crea la camara principal
      let camera1 = new Camera(new Vector3(0, 2.5, 10), new Vector3(0, 0, 0), new Vector3(0, 1, 0));

      //Se crea la camara secundaria
      let camera2 = new Camera(new Vector3(0, 5, 2), new Vector3(0, 0, 0), new Vector3(0, 1, 0));

      //Definimos esta camara para poder cambiarla con el evento de cambio de camara (por defecto esta en la principal)
      let camera = camera1;

      ////////////////////////////////////Matrices de proyeccion///////////////////////////////////////////////////////////////////

      let aspect = canvas.width / canvas.height

      // Se construye la matriz de proyección en perspectiva
      let projectionMatrix_perspective = Matrix4.perspective(
        (75 * Math.PI) / 180,
        aspect,
        1,
        2000
      );

      // Se construye la matrix de proyeccion ortogonal
      let projectionMatrix_ortogonal = Matrix4.ortho(-30, 30, -aspect, aspect, 1, 20000)

      let projectionMatrix = projectionMatrix_perspective;
      let viewProjectionMatrix = Matrix4.multiply(projectionMatrix, camera.getMatrix());

      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      //Matriz especifica para el skybox
      let projectionViewMatrix_SKYBOX;

      //El bloque basico tendra una de dimensiones 5*5*5 (por defecto en el constructor)
      //Los bloques medios 3*5*5

      // se crean y posicionan los modelos geométricos
      let piso = new PrismaRectangular(gl, [1, 0.2, 0.3, 1], Matrix4.translate(new Vector3(0, -5, 0)), 5, 500, 500);
      let mesaEncantamiento = new PrismaRectangular(gl, [1, 0.2, 0.3, 1], Matrix4.translate(new Vector3(0, 0, 0)), 3, 5, 5);
      let mesaEncantamientoLibro = new PrismaRectangular(gl, [1, 0.2, 0.3, 1], Matrix4.multiply(Matrix4.translate(new Vector3(0, 3.5, 0)), Matrix4.rotateZ(-15)), 1, 2.5, 3);

      let bookshelfModesl = [
        new PrismaRectangular(gl, [1, 0.2, 0.3, 1], Matrix4.translate(new Vector3(5, 0, 10))),    //librero 1
        new PrismaRectangular(gl, [1, 0.2, 0.3, 1], Matrix4.translate(new Vector3(10, 0, 10))),   //librero 2
        new PrismaRectangular(gl, [1, 0.2, 0.3, 1], Matrix4.translate(new Vector3(10, 0, 5))),    //librero 3
        new PrismaRectangular(gl, [1, 0.2, 0.3, 1], Matrix4.translate(new Vector3(10, 0, 0))),    //librero 4
        new PrismaRectangular(gl, [1, 0.2, 0.3, 1], Matrix4.translate(new Vector3(10, 0, -5))),   //librero 5
        new PrismaRectangular(gl, [1, 0.2, 0.3, 1], Matrix4.translate(new Vector3(10, 0, -10))),  //librero 6
        new PrismaRectangular(gl, [1, 0.2, 0.3, 1], Matrix4.translate(new Vector3(5, 0, -10))),   //librero 7
        new PrismaRectangular(gl, [1, 0.2, 0.3, 1], Matrix4.translate(new Vector3(0, 0, -10))),   //librero 8
        new PrismaRectangular(gl, [1, 0.2, 0.3, 1], Matrix4.translate(new Vector3(-5, 0, -10))),  //librero 9
        new PrismaRectangular(gl, [1, 0.2, 0.3, 1], Matrix4.translate(new Vector3(-10, 0, -10))), //librero 10
        new PrismaRectangular(gl, [1, 0.2, 0.3, 1], Matrix4.translate(new Vector3(-10, 0, -5))),  //librero 11
        new PrismaRectangular(gl, [1, 0.2, 0.3, 1], Matrix4.translate(new Vector3(-10, 0, 0))),   //librero 12
        new PrismaRectangular(gl, [1, 0.2, 0.3, 1], Matrix4.translate(new Vector3(-10, 0, 5))),   //librero 13
        new PrismaRectangular(gl, [1, 0.2, 0.3, 1], Matrix4.translate(new Vector3(-10, 0, 10))),  //librero 14
        new PrismaRectangular(gl, [1, 0.2, 0.3, 1], Matrix4.translate(new Vector3(-5, 0, 10))),   //librero 15
      ];

      //Funcion que se encarga de dibujar las distintas figuras

      function draw() {
        // se le indica a WebGL cual es el tamaño de la ventana donde se despliegan los gráficos
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        // se limpia la pantalla con un color negro transparente
        gl.clearColor(0, 0, 0, 0.5);
        // se limpian tanto el buffer de color, como el buffer de profundidad
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        //En este caso le indicamos que use el programa para iluminacion difusa
        gl.useProgram(program);

        //Iteramos y dibujamos los libreros de la escena
        bookshelfModesl.forEach(shelf => {
          shelf.draw(
            gl,
            material_shader_locations,
            lightPos,
            camera.getMatrix(),
            viewProjectionMatrix,
            textura_bookshelf
          );
        })

        piso.draw(gl, material_shader_locations, lightPos, camera.getMatrix(), viewProjectionMatrix, textura_pasto);
        mesaEncantamiento.draw(gl, material_shader_locations, lightPos, camera.getMatrix(), viewProjectionMatrix, textura_pasto);
        mesaEncantamientoLibro.draw(gl, material_shader_locations, lightPos, camera.getMatrix(), viewProjectionMatrix, textura_pasto);

        //Dibujamos el skybox
        projectionViewMatrix_SKYBOX = Matrix4.multiply(projectionMatrix, camera.getMatrix());
        skybox.draw(gl, projectionViewMatrix_SKYBOX);
      }

      //Primera vez que se llama a draw
      draw();

      //////////////////////////////////////////ANIMACION DE GEOMETRIA///////////////////////////////////////////////////////////////////
      /**
       * Funcion para animar los objetos 3d de la escena NOTA: Estas animaciones no se pueden detener en tiempo de ejecucion
       * newTransform = Matrix4.multiply(Matrix4.rotateX(-angle), currentTransform); //Gira como reloj (viendolo desde el lateral)
       * newTransform = Matrix4.multiply(Matrix4.rotateY(-angle), currentTransform); //Gira como carro derrapando (piso)
       * newTransform = Matrix4.multiply(Matrix4.rotateZ(-angle), currentTransform); //Gira como reloj (frente mio)
       * newTransform = Matrix4.multiply(Matrix4.rotateY(angle), newTransform); //Esto para girar en multiples ejes y
       * newTransform = Matrix4.multiply(Matrix4.rotateZ(angle), newTransform); //Esto para girar en multiples ejes z
       * @param {Objeto3D} obj 
       * @param {Float} velocidad entre más grande el valor, la animacion sera más lenta
       * @param {String} axis "x","y","z"
       * @param {String} direccion "+" o "-"
       * @param {Int} angle 
       * @param {Float} time_step 
       * @returns {Object} Con las funciones de iniciar o detener su animacion
       */
      let animarGeometria = (obj, velocidad = 500, axis = "y", direccion = "+", angle = 0, time_step = 0.01) => {
        axis = axis.toLowerCase();
        let lastTime = Date.now();
        let current = 0;
        let elapsed = 0;
        let max_elapsed_wait = 30 / 1000;
        let counter_time = 10000;
        let angle_incr = Math.PI / velocidad;
        let currentTransform = obj.getTransform();
        let newTransform;
        let id;

        function animaGeometria() {
          current = Date.now();
          elapsed = (current - lastTime) / 1000;
          if (elapsed > max_elapsed_wait) {
            elapsed = max_elapsed_wait;
          }
          if (counter_time > time_step) {
            if (direccion === "+") {
              switch (axis) {
                case "x":
                  newTransform = Matrix4.multiply(Matrix4.rotateX(angle), currentTransform); //Gira sobre el eje X
                  break;
                case "y":
                  newTransform = Matrix4.multiply(Matrix4.rotateY(angle), currentTransform); //Gira sobre el eje Y
                  break;
                case "z":
                  newTransform = Matrix4.multiply(Matrix4.rotateZ(angle), currentTransform); //Gira sobre el eje Z
                  break;
              }
            } else {
              switch (axis) {
                case "x":
                  newTransform = Matrix4.multiply(Matrix4.rotateX(-angle), currentTransform); //Gira sobre el eje X en eje -
                  break;
                case "y":
                  newTransform = Matrix4.multiply(Matrix4.rotateY(-angle), currentTransform); //Gira sobre el eje Y en eje -
                  break;
                case "z":
                  newTransform = Matrix4.multiply(Matrix4.rotateZ(-angle), currentTransform); //Gira sobre el eje Z en eje -
                  break;
              }
            }
            obj.setTransform(newTransform)
            angle += angle_incr
            draw();
            counter_time = 0;
          }
          counter_time += elapsed;
          lastTime = current;
          window.requestAnimationFrame(animaGeometria);
        }
        window.requestAnimationFrame(animaGeometria);
      }

      // animarGeometria(skybox, 4000);
      // geometry.forEach(model => {
      //   animarGeometria(model);
      // })

      animarGeometria(mesaEncantamientoLibro, 250, "y", "+")

      ////////////////////////////////////////////////////////EVENTOS////////////////////////////////////////////////////////////////////


      //Evento para pintar en ortogonal
      ortogonal.addEventListener("change", function () {
        if (ortogonal.checked) {
          projectionMatrix = projectionMatrix_ortogonal;
        } else {
          projectionMatrix = projectionMatrix_perspective;
        }
        viewProjectionMatrix = Matrix4.multiply(projectionMatrix, camera.getMatrix());
        draw();
      })

      //Evento para cambiar la camara
      cambiar_camara.addEventListener("change", function () {
        if (cambiar_camara.checked) {
          camera = camera2;
        } else {
          camera = camera1;
        }
        draw();
      })

      /**
       * Eventos para manejar la camara con el teclado
       */
      window.addEventListener("keydown", (evt) => {
        //Guardamos la posicion actual de la camara y creamos una variable para la posicion nueva
        let currentPosition = camera.getPos();
        let newPosition;
        //Variable para determinar la velocidad de moviemiento de la camara
        let velocidad = 0.8;
        //Variable para alejar o aumentar el zoom 
        let distancia = 20;

        if (evt.key == "w") {
          newPosition = Vector3.add(currentPosition, new Vector3(0, velocidad, 0));
          camera.setPos(newPosition)
          draw();
        }
        if (evt.key == "s") {
          newPosition = Vector3.add(currentPosition, new Vector3(0, -velocidad, 0));
          camera.setPos(newPosition)
          draw();
        }
        if (evt.key == "a") {
          newPosition = Vector3.add(currentPosition, new Vector3(-velocidad, 0, 0));
          camera.setPos(newPosition)
          draw();
        }
        if (evt.key == "d") {
          newPosition = Vector3.add(currentPosition, new Vector3(velocidad, 0, 0));
          camera.setPos(newPosition)
          draw();
        }
        if (evt.key == "o") {
          newPosition = Vector3.add(currentPosition, new Vector3(0, 0, -velocidad));
          camera.setPos(newPosition)
          draw();
        }
        if (evt.key == "p") {
          newPosition = Vector3.add(currentPosition, new Vector3(0, 0, velocidad));
          camera.setPos(newPosition)
          draw();
        }
        if (evt.key == "x") {
          newPosition = Vector3.add(currentPosition, new Vector3(currentPosition.x / distancia, currentPosition.y / distancia, currentPosition.z / distancia));
          camera.setPos(newPosition)
          draw();
        }
        if (evt.key == "z") {
          newPosition = Vector3.add(currentPosition, new Vector3(-currentPosition.x / distancia, -currentPosition.y / distancia, -currentPosition.z / distancia));
          camera.setPos(newPosition)
          draw();
        }
        if (evt.key == "b") {
          newPosition = new Vector3(1500, 500, 1500)
          camera.setPos(newPosition)
          draw();
        }
      });

      // variable donde se almacena la posición del mouse cuando se presiona el mouse sobre el canvas 
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
    }
  );
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
