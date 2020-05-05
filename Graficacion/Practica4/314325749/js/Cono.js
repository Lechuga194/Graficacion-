/**
 * Amaya López Dulce Fernanda | 314195856
 * Lechuga Martinez Jose Eduardo | 314325749
 * Practica 4 - Graficación por computadora 2020-2
 */

import Matrix4 from "./Matrix4.js";

export default class Cono {
    /**
     * @param {WebGLRenderingContext} gl
     * @param {Number[]} color
     * @param {Number} width
     * @param {Number} height
     * @param {Number} length
     * @param {Matrix4} initial_transform
     */
    constructor(gl, color, radius = 1, height = 1, Nu = 2, Nv = 2, initial_transform) {
        this.gl = gl;
        this.color = color;
        this.initial_transform = initial_transform;

        let verticesAux = [];
        let vertices = [];
        let carasAux = [];
        let caras = [];

        // los vertices se construye de la base al vértice del cono
        // de abajo a arriba en Y
        for (let i = 0; i < Nv; i++) {
            for (let j = 0; j < Nu; j++) {
                verticesAux.push([
                    radius * (Nv - i) / Nv * Math.cos(j * 2 * Math.PI / Nu),
                    -height + i * 2 * height / Nv,
                    radius * (Nv - i) / Nv * Math.sin(j * 2 * Math.PI / Nu),
                ]);
            }
        }
        // el último punto que se agrega es el correspondiente al vértice del cono
        verticesAux.push([0, height, 0]);

        // se generan los triángulos que tienen en común al vértice del cono (índice vertices.length-1, i.e. el último vértice)
        for (let i = 0; i < Nu; i++) {
            carasAux.push([
                verticesAux.length - 1,
                verticesAux.length - 1 - Nu + i,
                verticesAux.length - 1 - Nu + (i + 1) % Nu
            ]);
        }

        // se generan los cuadriláteros correspondientes a las caras restantes
        for (let i = 0; i < Nv - 1; i++) {
            for (let j = 0; j < Nu; j++) {
                carasAux.push([
                    j + i * Nu,
                    (j + 1) % Nu + i * Nu,
                    (j + 1) % Nu + (i + 1) * Nu,
                    j + (i + 1) * Nu
                ]);
            }
        }

        /**
         * For auxiliar para acomodar los vertices
         */
        verticesAux.forEach(elem => {
            vertices.push(elem[0])
            vertices.push(elem[1])
            vertices.push(elem[2])
        })

        /**
         * For auxiliar para acomodar las caras y que se formen con dos triangulos
         */
        carasAux.forEach(function (cara) {
            caras.push(cara[0]);
            caras.push(cara[1]);
            caras.push(cara[2]);
            caras.push(cara[0]);
            caras.push(cara[2]);
            caras.push(cara[3]);
        })

        this.numeroCaras = caras.length;

        // se guarda la referencia a la transformación incial, en caso de que no se reciba una matriz, se asigna la matriz identidad
        this.initial_transform = initial_transform || Matrix4.identity();

        // se crea el buffer de posiciones para guardar los vértices del cubo
        this.positionBuffer = gl.createBuffer();
        if (!this.positionBuffer) {
            console.log("Fail creating a vertex buffer");
            return -1;
        }
        // se activa el buffer para asignarle los valores correspondientes
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        // se asigna los valores
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        // se crea un buffer para definir los índices de los vértices que forman una cara
        this.indexBuffer = gl.createBuffer();
        if (!this.indexBuffer) {
            alert("Algo pasó INDEX buffer");
            console.log("Fail creating a index buffer");
            return -1;
        }
        // se activa el buffer
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        // se asignan los valores
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(caras), gl.STATIC_DRAW);
    }

    /**
     * @param {WebGLRenderingContext} gl
     * @param {GLint} positionAttributeLocation //Manda la posicion de los vertices al GPU
     * @param {WebGLUniformLocation} colorUniformLocation //Manda el color del objeto al GPU
     * @param {WebGLUniformLocation} PVM_matrixLocation //Manda la informacion de la matriz (pers, vista, modelo)
     * @param {Matrix4} projectionViewMatrix // Manda la informacion de la matriz de proyeccion y vista
     */
    draw(
        gl,
        positionAttributeLocation,
        colorUniformLocation,
        PVM_matrixLocation,
        projectionViewMatrix
    ) {
        // se activa el buffer 
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        // se indica como se va a enviar la información al buffer
        gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
        // se activa el atributo para la posición
        gl.enableVertexAttribArray(positionAttributeLocation);

        // se envía la información del color    
        gl.uniform4fv(colorUniformLocation, this.color);

        // se calcula la matriz de transformación de modelo, vista y proyección
        let projectionViewModelMatrix = Matrix4.multiply(projectionViewMatrix, this.initial_transform);

        // se envía la información de la matriz de transformación
        gl.uniformMatrix4fv(PVM_matrixLocation, false, projectionViewModelMatrix.toArray());

        // se activa el buffer de índices
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        // se dibuja
        gl.drawElements(gl.TRIANGLES, this.numeroCaras, gl.UNSIGNED_SHORT, 0);
    }
}
