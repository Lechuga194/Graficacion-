/**
 * Amaya López Dulce Fernanda | 314195856
 * Lechuga Martinez Jose Eduardo | 314325749
 * Practica 02 - Graficación por computadora 2020-2
 */

import { Vector3 } from "./Vector3.js";

export class Matrix3 {
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
    this.a11 = a00;
    this.a12 = a01;
    this.a13 = a02;
    this.a21 = a10;
    this.a22 = a11;
    this.a23 = a12;
    this.a31 = a20;
    this.a32 = a21;
    this.a33 = a22;
  }

  /**
   * Función auxiliar que devuelve un elemento de la función.
   * @return {Number}
   */
  get(i) {
    switch (i) {
      case 11:
        return this.a11;
        break;
      case 12:
        return this.a12;
        break;
      case 13:
        return this.a13;
        break;
      case 21:
        return this.a21;
        break;
      case 22:
        return this.a22;
        break;
      case 23:
        return this.a23;
        break;
      case 31:
        return this.a31;
        break;
      case 32:
        return this.a32;
        break;
      case 33:
        return this.a33;
        break;
      default:
        return 0;
    }
  }

  /**
   * Función auxiliar que asigna un valor un elemento de la función.
   * @param {Number} i, elemento de la matriz donde se hará las asignación.
   * @param {Number} j, número a asignar.
   * @return {Number}
   */
  mySet(i, j) {
    switch (i) {
      case 11:
        this.a11 = j;
        break;
      case 12:
        this.a12 = j;
        break;
      case 13:
        this.a13 = j;
        break;
      case 21:
        this.a21 = j;
        break;
      case 22:
        this.a22 = j;
        break;
      case 23:
        this.a23 = j;
        break;
      case 31:
        this.a31 = j;
        break;
      case 32:
        this.a32 = j;
        break;
      case 33:
        this.a33 = j;
        break;
    }
  }

  /**
   * Función que devuelve la suma dos matrices.
   * @param {Matrix3} m1
   * @param {Matrix3} m2
   * @return {Matrix3}
   */
  static add(m1, m2) {
    let A = new Matrix3();
    for (let i = 10; i < 40; i = i + 10) {
      for (let j = 1; j < 4; j++) {
        A.mySet(i + j, m1.get(i + j) + m2.get(i + j));
      }
    }

    return A;
  }

  /**
   * Función que devuelve la matriz adjunta, de la matriz con que se invoca la función.
   * @return {Matrix3}
   */
  adjoint() {
    let b00 = this.cofactor(1, 1);
    let b01 = this.cofactor(1, 2);
    let b02 = this.cofactor(1, 3);
    let b10 = this.cofactor(2, 1);
    let b11 = this.cofactor(2, 2);
    let b12 = this.cofactor(2, 3);
    let b20 = this.cofactor(3, 1);
    let b21 = this.cofactor(3, 2);
    let b22 = this.cofactor(3, 3);

    return new Matrix3(b00, b01, b02, b10, b11, b12, b20, b21, b22);
  }

  /**
   * Función auxiliar que calcular el cofactor del elemento en la posición i, j de la matriz con que se llama.
   * @param {Number} i
   * @param {Number} j
   * @return {Number}
   */
  //       1  2
  cofactor(i, j) {
    let b00, b01, b10, b11;
    if (i > 1) {
      if (i == 3) {
        if (j > 1) {
          b00 = this.get(11);
          b10 = this.get(21);
        } else {
          b00 = this.get(12);
          b10 = this.get(22);
        }

        if (j == 3) {
          b01 = this.get(12);
          b11 = this.get(22);
        } else {
          b01 = this.get(13);
          b11 = this.get(23);
        }
      } else {
        if (j > 1) {
          b00 = this.get(11);
          b10 = this.get(31);
        } else {
          b00 = this.get(12);
          b10 = this.get(32);
        }
        if (j == 3) {
          b01 = this.get(12);
          b11 = this.get(32);
        } else {
          b01 = this.get(13);
          b11 = this.get(33);
        }
      }
    } else {
      if (j > 1) {
        b00 = this.get(21);
        b10 = this.get(31);
      } else {
        b00 = this.get(22);
        b10 = this.get(32);
      }
      if (j == 3) {
        b01 = this.get(22);
        b11 = this.get(32);
      } else {
        b01 = this.get(23);
        b11 = this.get(33);
      }
    }

    let a = Matrix3.determinant2x2(b00, b01, b10, b11);

    return Math.pow(-1, i + j) * a;
  }

  /**
   * Función que devuelve un objeto el cual contiene los mismos valores que el objeto desde el cual se invocó la función.
   * @return {Matrix3}
   */
  clone() {
    let A = new Matrix3();

    for (let i = 10; i < 40; i += 10) {
      for (let j = 1; j < 4; j++) {
        A.mySet(i + j, this.get(i + j));
      }
    }

    return A;
  }

  /**
   * Función que devuelve el determinante de la matriz.
   * @return {Number}
   */
  determinant() {
    let x =
      this.get(11) *
      Matrix3.determinant2x2(
        this.get(22),
        this.get(23),
        this.get(32),
        this.get(33)
      );
    let y =
      this.get(12) *
      Matrix3.determinant2x2(
        this.get(21),
        this.get(23),
        this.get(31),
        this.get(33)
      );
    let z =
      this.get(13) *
      Matrix3.determinant2x2(
        this.get(21),
        this.get(22),
        this.get(31),
        this.get(32)
      );

    return x - y + z;
  }

  /**
   * Función auxiliar que calcula el determiante de una matriz 2x2.
   * @param {Number} a00
   * @param {Number} a01
   * @param {Number} a10
   * @param {Number} a11
   * @return {Number}
   */
  static determinant2x2(a00, a01, a10, a11) {
    return a00 * a11 - a01 * a10;
  }

  /**
   * Función que devuelve verdadero en caso de que sus argumentos sean exactamente iguales, y falso en caso contrario.
   * @param {Matrix3} m1
   * @param {Matrix3} m2
   * @return {Boolean}
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
   * Función que asigna los valores de la matriz identidad a la matriz desde donde se invocó la función.
   */
  identity() {
    for (let i = 10; i < 40; i += 10) {
      for (let j = 1; j < 4; j++) {
        if ((i + j) % 11 == 0) this.mySet(i + j, 1);
        else this.mySet(i + j, 0);
      }
    }
  }

  /**
   * Función que devuelve la matriz inversa de la matriz con la que se invocó la función.
   * @return {Matrix3}
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
   * Función que devuelve la multiplicación de dos matrices.
   * @param {Matrix3} m1
   * @param {Matrix3} m2
   * @return {Matrix3}
   */
  static multiply(m1, m2) {
    A.mySet(
      11,
      Matrix3.auxMultiply(
        m1.get(11),
        m1.get(12),
        m1.get(13),
        m2.get(11),
        m2.get(21),
        m2.get(31)
      )
    );
    A.mySet(
      12,
      Matrix3.auxMultiply(
        m1.get(11),
        m1.get(12),
        m1.get(13),
        m2.get(12),
        m2.get(22),
        m2.get(32)
      )
    );
    A.mySet(
      13,
      Matrix3.auxMultiply(
        m1.get(11),
        m1.get(12),
        m1.get(13),
        m2.get(13),
        m2.get(23),
        m2.get(33)
      )
    );

    A.mySet(
      21,
      Matrix3.auxMultiply(
        m1.get(21),
        m1.get(22),
        m1.get(23),
        m2.get(11),
        m2.get(21),
        m2.get(31)
      )
    );
    A.mySet(
      22,
      Matrix3.auxMultiply(
        m1.get(21),
        m1.get(22),
        m1.get(23),
        m2.get(12),
        m2.get(22),
        m2.get(32)
      )
    );
    A.mySet(
      23,
      Matrix3.auxMultiply(
        m1.get(21),
        m1.get(22),
        m1.get(23),
        m2.get(13),
        m2.get(23),
        m2.get(33)
      )
    );

    A.mySet(
      31,
      Matrix3.auxMultiply(
        m1.get(31),
        m1.get(32),
        m1.get(33),
        m2.get(11),
        m2.get(21),
        m2.get(31)
      )
    );
    A.mySet(
      32,
      Matrix3.auxMultiply(
        m1.get(31),
        m1.get(32),
        m1.get(33),
        m2.get(12),
        m2.get(22),
        m2.get(32)
      )
    );
    A.mySet(
      33,
      Matrix3.auxMultiply(
        m1.get(31),
        m1.get(32),
        m1.get(33),
        m2.get(13),
        m2.get(23),
        m2.get(33)
      )
    );

    return A;
  }

  /**
   * Función auxilir para multiply
   * @param {Number} a1
   * @param {Number} a2
   * @param {Number} a3
   * @param {Number} b1
   * @param {Number} b2
   * @param {Number} b3
   * @return {Number}
   */
  static auxMultiply(a1, a2, a3, b1, b2, b3) {
    return a1 * b1 + a2 * b2 + a3 * b3;
  }

  /**
   * Función que devuelve una matriz que es el resultado de multiplicar cada componente por un escalar.
   * @param {Matrix3} m1
   * @param {Number} c
   * @return {Matrix3}
   */
  static multiplyScalar(m1, c) {
    let A = new Matrix3();
    for (let i = 10; i < 40; i += 10) {
      for (let j = 1; j < 4; j++) {
        A.mySet(i + j, m1.get(i + j) * c);
      }
    }

    return A;
  }

  /**
   * Función que devuelve el vector resultado de multiplicar el vector v por la matriz con que se llama la función
   * @param {Vector3} v
   * @return {Vector3}
   */
  multiplyVector(v) {
    let a1 = new Vector3(this.get(11), this.get(12), this.get(13));
    let a2 = new Vector3(this.get(21), this.get(22), this.get(23));
    let a3 = new Vector3(this.get(31), this.get(32), this.get(33));

    let b1 = Vector3.dot(a1, v);
    let b2 = Vector3.dot(a2, v);
    let b3 = Vector3.dot(a3, v);

    return new Vector3(b1, b2, b3);
  }

  /**
   * Función que devuelve una matriz de 3 × 3 que representa una transformación de rotación en theta radianes.
   * @param {Number} theta
   * @return {Matrix3}
   */
  static rotate(theta) {
    return new Matrix3(
      Math.cos(theta),
      -Math.sin(theta),
      0,
      Math.sin(theta),
      Math.cos(theta),
      0,
      0,
      0,
      1
    );
  }

  /**
   * Función que devuelve una matriz de 3 × 3 que representa una transformación de escalamiento, con el factor sx como escalamiento en x y sy como escalamiento en y .
   * @param {Number} sx
   * @param {Number} sy
   * @return {Matrix3}
   */
  static scale(sx, sy) {
    return new Matrix3(sx, 0, 0, 0, sy, 0, 0, 0, 1);
  }

  /**
   * Función que asigna nuevos valores a los componentes de la matriz con que se llama.
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
    this.mySet(11, a00);
    this.mySet(12, a01);
    this.mySet(13, a02);
    this.mySet(21, a10);
    this.mySet(22, a11);
    this.mySet(23, a12);
    this.mySet(31, a20);
    this.mySet(32, a21);
    this.mySet(33, a22);
  }

  /**
   * Función que sustrae componente a componente la matriz m2 de la matriz m1.
   * @param {Matrix3} m1
   * @param {Matrix3} m2
   * @return {Matrix3}
   */
  static subtract(m1, m2) {
    let A = new Matrix3();
    for (let i = 10; i < 40; i = i + 10) {
      for (let j = 1; j < 4; j++) {
        A.mySet(i + j, m1.get(i + j) - m2.get(i + j));
      }
    }

    return A;
  }

  /**
   * Función que devuelve una matriz de 3 × 3 que representa una transformación de traslación, con tx como la traslación en x y ty como la traslación en y .
   * @param {Number} tx
   * @param {Number} ty
   * @return {Matrix3}
   */
  static translate(tx, ty) {
    return new Matrix3(1, 0, tx, 0, 1, ty, 0, 0, 1);
  }

  /**
   * Función que devuelve la matriz transpuesta de la matriz desde donde se invocó la función.
   * @return {Matrix3}
   */
  transpose() {
    let A = this.clone();

    A.mySet(12, this.get(21));
    A.mySet(13, this.get(31));
    A.mySet(23, this.get(32));
    A.mySet(21, this.get(12));
    A.mySet(31, this.get(13));
    A.mySet(32, this.get(23));

    return A;
  }
}
