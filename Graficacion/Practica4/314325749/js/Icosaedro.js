/**
 * Amaya López Dulce Fernanda | 314195856
 * Lechuga Martinez Jose Eduardo | 314325749
 * Practica 4 - Graficación por computadora 2020-2
 */

import Matrix4 from "./Matrix4.js";

export default class Icosaedro {
    /**
     * @param {WebGLRenderingContext} gl
     * @param {Number[]} color
     * @param {Number} width
     * @param {Number} height
     * @param {Number} length
     * @param {Matrix4} initial_transform
     */
    constructor(gl, color, width = 1, initial_transform) {
        this.gl = gl;
        this.color = color;
        this.width = width;
        this.initial_transform = initial_transform;

        width = width / 3;

        // razón áurea
        var goldenRatio = 1.6180339887;

        let width_m_goldenRatio = width * goldenRatio;
        let vertices = [
            0, width, width_m_goldenRatio,
            0, width, -width_m_goldenRatio,
            0, -width, width_m_goldenRatio,
            0, -width, -width_m_goldenRatio,
            width, width_m_goldenRatio, 0,
            width, -width_m_goldenRatio, 0,
            -width, width_m_goldenRatio, 0,
            -width, -width_m_goldenRatio, 0,
            width_m_goldenRatio, 0, width,
            width_m_goldenRatio, 0, -width,
            -width_m_goldenRatio, 0, width,
            -width_m_goldenRatio, 0, -width
        ];

        // arreglo de caras
        let caras = [
            10, 0, 2,
            0, 8, 2,
            8, 5, 2,
            5, 7, 2,
            7, 10, 2,
            6, 0, 10,
            11, 6, 10,
            7, 11, 10,
            7, 3, 11,
            5, 3, 7,
            9, 3, 5,
            8, 9, 5,
            4, 9, 8,
            0, 4, 8,
            6, 4, 0,
            11, 3, 1,
            6, 11, 1,
            4, 6, 1,
            9, 4, 1,
            3, 9, 1
        ];

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
