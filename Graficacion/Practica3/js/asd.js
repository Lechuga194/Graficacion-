/**
 * Amaya López Dulce Fernanda | 314195856
 * Lechuga Martinez Jose Eduardo | 314325749
 * Practica 02 - Graficación por computadora 2020-2
 */

import Vector3 from "./Vector3.js";

class Matrix3 {
  constructor(
    a00 = 1,
    a01 = 0,
    a02 = 0,
    a10 = 0,
    a11 = 1,
    a12 = 0,
    a20 = 0,
    a21 = 0,
    a22 = 1
  ) {
    this.a00 = a00;
    this.a01 = a01;
    this.a02 = a02;
    this.a10 = a10;
    this.a11 = a11;
    this.a12 = a12;
    this.a20 = a20;
    this.a21 = a21;
    this.a22 = a22;
  }

  /**
   * Regresa la suma de las matrices
   * @param {Matrix3} m1
   * @param {Matrix3} m2
   * @returns {Matrix3} Matriz resultante
   */
  static add(m1, m2) {
    return new Matrix3(
      m1.a00 + m2.a00,
      m1.a01 + m2.a01,
      m1.a02 + m2.a02,
      m1.a10 + m2.a10,
      m1.a11 + m2.a11,
      m1.a12 + m2.a12,
      m1.a20 + m2.a20,
      m1.a21 + m2.a21,
      m1.a22 + m2.a22
    );
  }

  /**
   * Metodo que calcula el determinante de una matriz 3x3
   * @param {Number} m00
   * @param {Number} m01
   * @param {Number} m02
   * @param {Number} m10
   * @param {Number} m11
   * @param {Number} m12
   * @param {Number} m20
   * @param {Number} m21
   * @param {Number} m22
   * @return {Number}
   */
  determinant3x3(m00, m01, m02, m10, m11, m12, m20, m21, m22) {
    return (
      m00 * m10 * m22 +
      m10 * m21 * m02 +
      m20 * m01 * m12 -
      (m10 * m01 * m22 + m00 * m21 * m12 + m20 * m11 * m02)
    );
  }

  /**
   * Regresa la matriz adjunta
   * @returns {Matrix3} Matriz adjunta
   */
  adjoint() {
    return new Matrix3(
      this.determinant2x2(this.a11, this.a12, this.a21, this.a22),
      -this.determinant2x2(this.a10, this.a12, this.a20, this.a22),
      this.determinant2x2(this.a10, this.a11, this.a20, this.a21),
      -this.determinant2x2(this.a01, this.a02, this.a21, this.a22),
      this.determinant2x2(this.a00, this.a02, this.a20, this.a22),
      -this.determinant2x2(this.a00, this.a01, this.a20, this.a21),
      this.determinant2x2(this.a01, this.a02, this.a11, this.a12),
      -this.determinant2x2(this.a00, this.a02, this.a10, this.a12),
      this.determinant2x2(this.a00, this.a01, this.a10, this.a11)
    );
  }

  /**
   * Metodo que clona la matriz
   * @returns {Matrix3} Matriz Clonada
   */
  clone() {
    const clone = this;
    return clone;
  }

  /**
   * Regresa el determinante de la matriz
   * @returns {Number} Determinante
   */
  determinant() {
    const d1 = this.a00 * this.a11 * this.a22;
    const d2 = this.a10 * this.a21 * this.a02;
    const d3 = this.a20 * this.a01 * this.a12;
    const ds1 = this.a02 * this.a11 * this.a20;
    const ds2 = this.a12 * this.a21 * this.a00;
    const ds3 = this.a22 * this.a01 * this.a10;
    return d1 + d2 + d3 - (ds1 + ds2 + ds3);
  }

  /**
   * Devuelve verdadero en caso de que sus argumentos sean
   * aproximadamente iguales (con una ε = 0.000001), y falso en caso contrario
   * @param {Matrix3} m1
   * @param {Matrix3} m2
   * @returns {Boolean} Igualdad aproximada
   */
  static equals(m1, m2) {
    const epsilon = 0.000001;
    const equa00 = m1.a00 - m2.a00;
    const equa01 = m1.a01 - m2.a01;
    const equa02 = m1.a02 - m2.a02;
    const equa10 = m1.a10 - m2.a10;
    const equa11 = m1.a11 - m2.a11;
    const equa12 = m1.a12 - m2.a12;
    const equa20 = m1.a20 - m2.a20;
    const equa21 = m1.a21 - m2.a21;
    const equa22 = m1.a22 - m2.a22;

    return (
      equa00 < epsilon &&
      equa00 >= 0 &&
      equa01 < epsilon &&
      equa01 >= 0 &&
      equa02 < epsilon &&
      equa02 >= 0 &&
      equa10 < epsilon &&
      equa10 >= 0 &&
      equa11 < epsilon &&
      equa11 >= 0 &&
      equa12 < epsilon &&
      equa12 >= 0 &&
      equa20 < epsilon &&
      equa20 >= 0 &&
      equa21 < epsilon &&
      equa21 >= 0 &&
      equa22 < epsilon &&
      equa22 >= 0
    );
  }

  /**
   * Devuelve verdadero en caso de que sus argumentos sean
   * exactamente iguales y falso en caso contrario
   * @param {Matrix3} m1
   * @param {Matrix3} m2
   */
  static exactEquals(m1, m2) {
    return (
      m1.a00 == m2.a00 &&
      m1.a01 == m2.a01 &&
      m1.a02 == m2.a02 &&
      m1.a10 == m2.a10 &&
      m1.a11 == m2.a11 &&
      m1.a12 == m2.a12 &&
      m1.a20 == m2.a20 &&
      m1.a21 == m2.a21 &&
      m1.a22 == m2.a22
    );
  }

  /**
   * Asigna los valores de la matriz identidad a la matriz
   */
  identity() {
    this.a00 = 1;
    this.a01 = 0;
    this.a02 = 0;
    this.a10 = 0;
    this.a11 = 1;
    this.a12 = 0;
    this.a20 = 0;
    this.a21 = 0;
    this.a22 = 1;
  }

  /**
   * Regresa la matriz inversa
   * @returns {Matrix3} Matriz inversa
   */
  invert() {
    let A = this.adjoint();
    A = A.transpose();
    let B = A.determinant();
    return Matrix3.divide(A, B);
  }

  /**
   * Función auxiliar que devuelve la matriz resultante de dividir una matriz entre un número.
   * @param {Matrix3} m
   * @param {Number} n
   * @return {Matrix3}
   */
  static divide(m, n) {
    let A = new Matrix3();
    for (let i = 10; i < 40; i += 10) {
      for (let j = 1; j < 4; j++) {
        A.mySet(i + j, m.get(i + j) / n);
      }
    }

    return A;
  }

  /**
   * Regresa la multiplicacion de dos matrices
   * @param {Matrix3} m1
   * @param {Matrix3} m2
   * @returns {Matrix3} Matriz multiplicada
   */
  static multiply(m1, m2) {
    const mula00 = m1.a00 * m2.a00 + m1.a01 * m2.a10 + m1.a02 * m2.a20;
    const mula01 = m1.a00 * m2.a01 + m1.a01 * m2.a11 + m1.a02 * m2.a21;
    const mula02 = m1.a00 * m2.a02 + m1.a01 * m2.a12 + m1.a02 * m2.a22;
    const mula10 = m1.a10 * m2.a00 + m1.a11 * m2.a10 + m1.a12 * m2.a20;
    const mula11 = m1.a10 * m2.a01 + m1.a11 * m2.a11 + m1.a12 * m2.a21;
    const mula12 = m1.a10 * m2.a02 + m1.a11 * m2.a12 + m1.a12 * m2.a22;
    const mula20 = m1.a20 * m2.a00 + m1.a21 * m2.a10 + m1.a22 * m2.a20;
    const mula21 = m1.a20 * m2.a01 + m1.a21 * m2.a11 + m1.a22 * m2.a21;
    const mula22 = m1.a20 * m2.a02 + m1.a21 * m2.a12 + m1.a22 * m2.a22;
    const mulMatrix = new Matrix3(
      mula00,
      mula01,
      mula02,
      mula10,
      mula11,
      mula12,
      mula20,
      mula21,
      mula22
    );
    return mulMatrix;
  }

  /**
   * Regresa una matriz por un escalar
   * @param {Matrix3} m1
   * @param {Number} c
   * @returns {Matrix3}
   */
  static multiplyScalar(m1, c) {
    const ms00 = m1.a00 * c;
    const ms01 = m1.a01 * c;
    const ms02 = m1.a02 * c;
    const ms10 = m1.a10 * c;
    const ms11 = m1.a11 * c;
    const ms12 = m1.a12 * c;
    const ms20 = m1.a20 * c;
    const ms21 = m1.a21 * c;
    const ms22 = m1.a22 * c;
    const mulScalar = new Matrix3(
      ms00,
      ms01,
      ms02,
      ms10,
      ms11,
      ms11,
      ms12,
      ms20,
      ms21,
      ms22
    );

    return mulScalar;
  }

  /**
   * es una función que devuelve el vector resultado de multiplicar el vector v por la
   * matriz con que se llama la función. Esta función es la que nos va a permitir realizar las
   * transformaciones.
   * @param {Vector3} v
   * @returns {Vector3}
   */

  multiplyVector(v) {
    const x = this.a00 * v.x + this.a01 * v.y + this.a02 * v * z;
    const y = this.a10 * v.x + this.a11 * v.y + this.a12 * v * z;
    const z = this.a20 * v.x + this.a21 * v.y + this.a22 * v * z;
    const mulVect = new Vector3(x, y, z);
    return mulVect;
  }

  /**
   * función que devuelve una matriz de 3 × 3 que representa una transformación de
   * rotación en theta radianes.
   * @param {Number} theta
   * @return {Matrix3}
   */
  static rotate(theta) {
    const radians = (Math.PI / 180) * theta;
    const rotateMatrix = new Matrix3(
      Math.cos(radians),
      -Math.sin(radians),
      radians,
      Math.sin(radians),
      Math.cos(radians),
      radians,
      radians,
      radians,
      1
    );
    return rotateMatrix;
  }

  /**
   * función que devuelve una matriz de 3 × 3 que representa una transformación de
   * escalamiento, con el factor sx como escalamiento en x y sy como escalamiento en y.
   * @param {Number} sx
   * @param {Number} sy
   * @return {Matrix3}
   */
  static scale(sx, sy) {
    const scaleMatrix = new Matrix3(sx, 0, 0, 0, sy, 0, 0, 0, 1);
    return scaleMatrix;
  }

  /**
   * función que asigna nuevos valores a los componentes de la matriz con que se llama.
   * @param {Number} a00
   * @param {Number} a01
   * @param {Number} a02
   * @param {Number} a10
   * @param {Number} a11
   * @param {Number} a12
   * @param {Number} a20
   * @param {Number} a21
   * @param {Number} a22
   */
  set(a00, a01, a02, a10, a11, a12, a20, a21, a22) {
    this.a00 = a00;
    this.a01 = a01;
    this.a02 = a02;
    this.a10 = a10;
    this.a11 = a11;
    this.a12 = a12;
    this.a20 = a20;
    this.a21 = a21;
    this.a22 = a22;
  }

  /**
   * Función que sustrae componente a componente la matriz m2 de la matriz m1.
   * @param {Matrix3} m1
   * @param {Matrix3} m2
   * @return {Matrix3}
   */
  static subtract(m1, m2) {
    const subMatrix = new Matrix3(
      m1.a00 - m2.a00,
      m1.a01 - m2.a01,
      m1.a02 - m2.a02,
      m1.a10 - m2.a10,
      m1.a11 - m2.a11,
      m1.a12 - m2.a12,
      m1.a20 - m2.a20,
      m1.a21 - m2.a21,
      m1.a22 - m2.a22
    );
    return subMatrix;
  }

  /**
   * devuelve una matriz de 3 × 3 que representa una transformación de
   * traslación, con tx como la traslación en x y ty como la traslación en y.
   * @param {Number} tx
   * @param {Number} ty
   * @return {Matrix3}
   */
  static translate(tx, ty) {
    const translateMatrix = new Matrix3(1, 0, tx, 0, 1, ty, 0, 0, 1);
    return translateMatrix;
  }

  /**
   * función que devuelve la matriz transpuesta de la matriz desde donde se invocó la
   * función.
   * @return {Matrix3}
   */
  transpose() {
    const a00 = this.a00;
    const a01 = this.a10;
    const a02 = this.a20;
    const a03 = this.a30;
    const a10 = this.a01;
    const a11 = this.a11;
    const a12 = this.a21;
    const a13 = this.a31;
    const a20 = this.a02;
    const a21 = this.a12;
    const a22 = this.a22;
    const a23 = this.a32;
    const a30 = this.a03;
    const a31 = this.a13;
    const a32 = this.a23;
    const a33 = this.a33;

    const transMatrix = new Matrix3(
      a00,
      a01,
      a02,
      a03,
      a10,
      a11,
      a12,
      a13,
      a20,
      a21,
      a22,
      a23,
      a30,
      a31,
      a32,
      a33
    );

    return transMatrix;
  }
}

export default Matrix3;

// m1 = new Matrix3(2, 2, 2, 2, 2, 2, 2, 2, 2);
// m1_equ = new Matrix3(2, 2, 2, 2, 2, 2, 2, 2, 1.99999999999999999999);
// m2 = new Matrix3(3, 3, 3, 3, 3, 3, 3, 3, 3);
// m2_copy = new Matrix3(3, 3, 3, 3, 3, 3, 3, 3, 3);
// m3 = new Matrix3(-3, 2, 0, 1, -1, 2, -2, 1, 3);
// m4 = new Matrix3(-2, 4, 5, 6, 7, -3, 3, 0, 2);
// m5 = new Matrix3(2, -2, 2, 2, 1, 0, 3, -2, 2);
// mul1 = new Matrix3(0, -7, 3, 2, 4, -1, 12, 7, -6);
// mul2 = new Matrix3(5, 4, -3, 0, -6, 10, -2, 8, 11);
// //vector = new Vector3(1, 2, 3);

// /**
//  * Test add
//  */
// console.log(Matrix3.add(m1, m2));

// /**
//  * Test adjoint
//  */
// console.log(m3.adjoint());
// console.log(m5.adjoint());

// /**
//  * Test clone
//  */
// m1_copy = m1.clone();
// console.log(m1_copy);

// /**
//  * Test determinante
//  */
// console.log(m4.determinant());

// /**
//  * Test equals
//  */
// console.log("Equals: ***", Matrix3.exactEquals(m1, m1_equ));

// /**
//  * Test Exactequals
//  */

// console.log(Matrix3.exactEquals(m2, m2_copy));
// console.log(Matrix3.exactEquals(m2, m1));

// /**
//  * Test multiplicacion
//  */
// console.log(Matrix3.multiply(mul1, mul2));

// /**
//  * Test mul escalar
//  */

// console.log(Matrix3.multiplyScalar(m1, 5));

// //m1.multiplyVector(vector);

// /**
//  * Test nuevos valores
//  */
// console.log(m1);
// m1.set(10, 10, 10, 10, 10, 10, 10, 10, 10);
// console.log(m1);

// /**
//  * test substract
//  */

// let subA = new Matrix3(5, 5, 5, 5, 5, 5, 5, 5, 5);
// let subB = new Matrix3(2, 2, 2, 2, 2, 2, 2, 2, 2);
// let substractionTest = Matrix3.subtract(subA, subB);
// console.log(substractionTest);

// /**
//  * Transpuesta test
//  */

// let trs = new Matrix3(5, 6, 7, 8, 9, 2, 1, 3, 4);
// console.log(trs.transpose());
