/**
 * Amaya López Dulce Fernanda | 314195856
 * Lechuga Martinez Jose Eduardo | 314325749
 * Practica 4 - Graficación por computadora 2020-2
 */

import Matrix4 from "./Matrix4.js";
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
        this.Nu = Nu;
        this.Nv = Nv;

        // se guarda la referencia a la transformación incial, en caso de que no se reciba una matriz, se asigna la matriz identidad
        this.initial_transform = initial_transform || Matrix4.identity();

        //Buffer para los vertices
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        let vertices = this.getVertices();
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        //Buffer para las normales
        let normals = this.getNormals(vertices);
        this.normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

        //Buffer para coordenadas Uv
        let uv = this.getUV();
        this.UVBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.UVBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);

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
    draw(gl, shader_locations, lightPos, viewMatrix, projectionMatrix, texture) {
        // se activa la textura con la que se va a dibujar
        gl.bindTexture(gl.TEXTURE_2D, texture)

        //Se activa el buffer de la posicion
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(
            shader_locations.positionAttribute,
            3,
            gl.FLOAT,
            false,
            0,
            0
        );
        gl.enableVertexAttribArray(shader_locations.positionAttribute);

        //Se activa el buffer para las normales
        gl.enableVertexAttribArray(shader_locations.normalAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(
            shader_locations.normalAttribute,
            3,
            gl.FLOAT,
            false,
            0,
            0
        );

        // se envía la información de las coordenadas de textura
        gl.enableVertexAttribArray(shader_locations.texcoordAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.UVBuffer);
        gl.vertexAttribPointer(shader_locations.texcoordAttribute, 2, gl.FLOAT, false, 0, 0);

        //Buffer para el color
        gl.enableVertexAttribArray(shader_locations.colorAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.vertexAttribPointer(
            shader_locations.colorAttribute,
            4,
            gl.FLOAT,
            false,
            0,
            0
        );
        // se envía la información del color
        gl.uniform4fv(shader_locations.colorUniformLocation, this.color);

        // se calcula la matriz de transformación de modelo, vista y proyección
        let viewModelMatrix = Matrix4.multiply(viewMatrix, this.initial_transform);
        gl.uniformMatrix4fv(
            shader_locations.VM_matrix,
            false,
            viewModelMatrix.toArray()
        );

        // se enviá la dirección de la luz
        let auxLightPos = new Vector4(
            lightPos[0],
            lightPos[1],
            lightPos[2],
            lightPos[3]
        );
        let lightPosView = viewMatrix.multiplyVector(auxLightPos);
        let lightPosViewArray = lightPosView.toArray();
        gl.uniform3f(
            shader_locations.lightPosition,
            lightPosViewArray[0],
            lightPosViewArray[1],
            lightPosViewArray[2]
        );

        // se envía la información de la matriz de transformación del modelo, vista y proyección
        let projectionViewModelMatrix = Matrix4.multiply(
            projectionMatrix,
            viewModelMatrix
        );
        gl.uniformMatrix4fv(
            shader_locations.PVM_matrix,
            false,
            projectionViewModelMatrix.toArray()
        );

        // se dibuja
        gl.drawArrays(gl.TRIANGLES, 0, this.num_elements);
    }

    /**
   * Metodo para obtener las normales
   * @param {Array} vertices
   */
    getNormals() {
        let normals = [];
        let vertices = this.getVertices();

        for (let i = 0; i < vertices.length; i += 9) {
            // se crean arreglos de tres elementos para representar cada vértice y simplificar los cálculos
            let v1 = new Vector3(vertices[i], vertices[i + 1], vertices[i + 2]);
            let v2 = new Vector3(vertices[i + 3], vertices[i + 4], vertices[i + 5]);
            let v3 = new Vector3(vertices[i + 6], vertices[i + 7], vertices[i + 8]);

            let vAux = Vector3.cross(Vector3.subs(v1, v2), Vector3.subs(v2, v3));
            let n = vAux.normalize().toArray();

            // como se está usando flat shading los tres vértices tiene la misma normal asociada
            normals.push(n[0], n[1], n[2], n[0], n[1], n[2], n[0], n[1], n[2]);
        }
        return normals;
    }

    getVerticesAux() {
        let verticesAux = [];
        let Nv = this.Nv;
        let Nu = this.Nu;
        let radius = this.radius;
        let phi, theta, x, y, z;

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
        verticesAux.push([0, -this.radius, 0]);

        return verticesAux;
    }

    getVertices() {
        let verticesAux = this.getVerticesAux();
        let vertices = [];
        let tmp_faces = []

        // se generan los triángulos que tienen en común al polo norte (índice 0)
        for (let i = 0; i < this.Nv; i++) {
            tmp_faces.push([
                0,
                (i % this.Nv) + 1,
                ((i + 1) % this.Nv) + 1,
            ]);
        }

        // se generan los triángulos que tienen en común al polo sur
        for (let i = 0; i < this.Nv; i++) {
            tmp_faces.push([
                verticesAux.length - 1,
                verticesAux.length - 1 - this.Nv + i,
                verticesAux.length - 1 - this.Nv + ((i + 1) % this.Nv)
            ]);
        }


        // se generan los cuadriláteros correspondientes a las caras restantes
        for (let i = 1; i < this.Nu - 1; i++) {
            for (let j = 0; j < this.Nv; j++) {
                tmp_faces.push([
                    j + 1 + (i - 1) * this.Nv,
                    (j + 1) % this.Nv + 1 + (i - 1) * this.Nv,
                    (j + 1) % this.Nv + 1 + i * this.Nv,
                    j + 1 + i * this.Nv,
                ]);
            }
        }

        tmp_faces.forEach(face => {
            if (face.length == 4) {
                vertices = vertices
                    .concat(verticesAux[face[0]])
                    .concat(verticesAux[face[1]])
                    .concat(verticesAux[face[2]])
                    .concat(verticesAux[face[3]]);
            } else {
                vertices = vertices
                    .concat(verticesAux[face[0]])
                    .concat(verticesAux[face[1]])
                    .concat(verticesAux[face[2]]);
            }
        })

        return vertices;
    }

    /**
   * Metodo para obtener las coordenadas UV
   */
    getUV() {
        //Calculamos la coordenadas UV iterando las caras y asignando el valor de u y v respectivamente con un valor random (entre  y 1)
        let vertices = this.getVertices().length;
        let uv = [];
        for (let i = 0; i <= vertices; i++) {
            uv.push(Math.random());
            uv.push(Math.random());
        }
        return uv;
    }
}