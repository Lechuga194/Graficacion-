/**
 * Amaya López Dulce Fernanda | 314195856
 * Lechuga Martinez Jose Eduardo | 314325749
 * Practica 4 - Graficación por computadora 2020-2
 */

import Matrix4 from "./Matrix4.js";
import Vector3 from "./Vector3.js";
import Vector4 from "./Vector4.js";

export default class Tetraedro {
    /**
     * @param {WebGLRenderingContext} gl
     * @param {Number[]} color
     * @param {Number} width
     * @param {Matrix4} initial_transform
     */
    constructor(gl, color, width = 1, initial_transform) {
        this.gl = gl;
        this.color = color;
        this.width = width;
        this.initial_transform = initial_transform;


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

        //Buffer para las caras
        let caras = this.getCaras();
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

    /**
   * Metodo para obtener las normales
   * @param {Array} vertices
   */
    getNormals(vertices) {
        let normals = [];

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

    getVertices() {
        let angle = 2 * Math.PI / 3;
        let width = this.width;
        let x = width * 2 * Math.sqrt(2) / 3;
        let y = 0;
        let z = -width / 3;
        let x0 = x * Math.cos(angle) + y * Math.sin(angle);
        let y0 = -x * Math.sin(angle) + y * Math.cos(angle);

        let pos = [
            0, 0, width,
            x0, y0, z,
            x0, -y0, z,
            x, y, z
        ];

        let caras = this.getCaras();
        let vertices = [];

        for (let i = 0; i < caras.length; i++) {
            vertices.push(
                pos[caras[i] * 3],
                pos[caras[i] * 3 + 1],
                pos[caras[i] * 3 + 2]
            );
        }

        return vertices;
    }

    getCaras() {
        return [
            1, 3, 2,
            0, 1, 2,
            0, 2, 3,
            0, 3, 1
        ]
    }
}
