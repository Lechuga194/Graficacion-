/**
 * Amaya López Dulce Fernanda | 314195856
 * Lechuga Martinez Jose Eduardo | 314325749
 * Practica 4 - Graficación por computadora 2020-2
 */

import Matrix4 from "./Matrix4.js";
import Utils from "./Utils.js";
import Vector3 from "./Vector3.js";
import Vector4 from "./Vector4.js";

export default class Esfera {
    /**
     * @param {WebGLRenderingContext} gl
     * @param {Number[]} color
     * @param {Number} width
     * @param {Number} height
     * @param {Number} length
     * @param {Matrix4} initial_transform
     */
    constructor(gl, color, radius = 1, Nu = 2, Nv = 2, initial_transform) {
        this.gl = gl;
        this.color = color;
        this.radius = radius;
        this.initial_transform = initial_transform;

        let phi, theta, x, y, z;

        let verticesAux = [];
        let vertices = [];
        let carasAux = [];
        let caras = [];

        // se calculan los vertices de la esfera haciendo un barrido en círculos paralelos
        // de arriba a abajo en Y
        verticesAux.push([0, radius, 0]);
        for (let i = 1; i < Nu; i++) {
            phi = (i * Math.PI) / Nu;

            for (let j = 0; j < Nv; j++) {
                theta = (j * 2 * Math.PI) / Nv;

                x = radius * Math.sin(phi) * Math.cos(theta);
                y = radius * Math.cos(phi);
                z = radius * Math.sin(phi) * Math.sin(theta);

                verticesAux.push([x, y, z]);
            }
        }
        verticesAux.push([0, -radius, 0]);

        // se generan los triángulos que tienen en común al polo norte (índice 0)
        for (let i = 0; i < Nv; i++) {
            carasAux.push([
                0,
                ((i + 1) % Nv) + 1,
                (i % Nv) + 1
            ]);
        }

        // se generan los triángulos que tienen en común al polo sur (índice vertices.length-1, i.e. el último vértice)
        for (let i = 0; i < Nv; i++) {
            carasAux.push([
                vertices.length - 1,
                vertices.length - 1 - Nv + i,
                vertices.length - 1 - Nv + ((i + 1) % Nv)
            ]);
        }

        // se generan los cuadriláteros correspondientes a las caras restantes
        for (let i = 1; i < Nu - 1; i++) {
            for (let j = 0; j < Nv; j++) {
                carasAux.push([
                    j + 1 + (i - 1) * Nv,
                    (j + 1) % Nv + 1 + (i - 1) * Nv,
                    (j + 1) % Nv + 1 + i * Nv,
                    j + 1 + i * Nv
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

        /////////////////////////////////////////////NORMALES

        let normals = [];
        let v1, v2, v3, n;

        for (let i = 0; i < vertices.length; i += 9) {
            // se crean arreglos de tres elementos para representar cada vértice y simplificar los cálculos
            v1 = [vertices[i], vertices[i + 1], vertices[i + 2]];
            v2 = [vertices[i + 3], vertices[i + 4], vertices[i + 5]];
            v3 = [vertices[i + 6], vertices[i + 7], vertices[i + 8]];

            // la normal se calcula como el producto cruz de dos vectores sobre el plano que define el triángulo determinado por los vertices v1, v2 y v3
            n = Utils.normalize(
                Utils.cross(Utils.subtract(v1, v2), Utils.subtract(v2, v3))
            );

            // como se está usando flat shading los tres vértices tiene la misma normal asociada
            normals.push(n[0], n[1], n[2], n[0], n[1], n[2], n[0], n[1], n[2]);
        }

        ////////////////////////////////////////////////////////

        this.numeroCaras = caras.length;

        // se guarda la referencia a la transformación incial, en caso de que no se reciba una matriz, se asigna la matriz identidad
        this.initial_transform = initial_transform || Matrix4.identity();

        //Buffer para los vertices
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        //Buffer para las normales
        this.normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

        //Buffer para las caras
        this.indexBuffer = gl.createBuffer();
        if (!this.indexBuffer) {
            alert("Algo pasó INDEX buffer");
            console.log("Fail creating a index buffer");
            return -1;
        }
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(
            gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(caras),
            gl.STATIC_DRAW
        );

        //Se activa el buffer de color
        this.colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        let colors = [];
        if (!color) {
            color = [Math.random(), Math.random(), Math.random(), 1];
        }
        for (let i = 0; i < vertices.length / 3; i++) {
            colors = colors.concat(color);
        }

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

        this.num_elements = vertices.length;
    }

    /**
     * @param {WebGLRenderingContext} gl
     * @param {Object} shader_locations
     * @param {Array} lightPos
     * @param {Matrix4} projectionMatrix // Manda la informacion de la matriz de proyeccion y vista
     */
    draw(gl, shader_locations, lightPos, viewMatrix, projectionMatrix) {
        //Se activa el buffer de la posicion
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(shader_locations.positionAttribute, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shader_locations.positionAttribute);

        //Se activa el buffer para las normales
        gl.enableVertexAttribArray(shader_locations.normalAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(shader_locations.normalAttribute, 3, gl.FLOAT, false, 0, 0);

        //Buffer para el color
        gl.enableVertexAttribArray(shader_locations.colorAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.vertexAttribPointer(shader_locations.colorAttribute, 4, gl.FLOAT, false, 0, 0);
        // se envía la información del color    
        gl.uniform4fv(shader_locations.colorUniformLocation, this.color);

        // se calcula la matriz de transformación de modelo, vista y proyección
        let viewModelMatrix = Matrix4.multiply(viewMatrix, this.initial_transform);
        gl.uniformMatrix4fv(shader_locations.VM_matrix, false, viewModelMatrix.toArray());

        // se enviá la dirección de la luz
        let auxLightPos = new Vector4(lightPos[0], lightPos[1], lightPos[2], lightPos[3])
        let lightPosView = viewMatrix.multiplyVector(auxLightPos);
        let lightPosViewArray = lightPosView.toArray();
        gl.uniform3f(shader_locations.lightPosition, lightPosViewArray[0], lightPosViewArray[1], lightPosViewArray[2]);

        // se envía la información de la matriz de transformación del modelo, vista y proyección
        let projectionViewModelMatrix = Matrix4.multiply(projectionMatrix, viewModelMatrix);
        gl.uniformMatrix4fv(shader_locations.PVM_matrix, false, projectionViewModelMatrix.toArray());

        // se dibuja
        gl.drawArrays(gl.TRIANGLES, 0, this.num_elements);
    }
}
