class Utils {

  identity() {
    return [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]
  }

  translate(tx, ty, tz) {
    return [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      tx, ty, tz, 1
    ];
  }

  rotateX(rad) {
    let c = Math.cos(rad);
    let s = Math.sin(rad);

    return [
      1, 0, 0, 0,
      0, c, s, 0,
      0, -s, c, 0,
      0, 0, 0, 1
    ];
  }

  rotateY(rad) {
    let c = Math.cos(rad);
    let s = Math.sin(rad);

    return [
      c, 0, -s, 0,
      0, 1, 0, 0,
      s, 0, c, 0,
      0, 0, 0, 1
    ];
  }

  rotateZ(rad) {
    let c = Math.cos(rad);
    let s = Math.sin(rad);

    return [
      c, s, 0, 0,
      -s, c, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ];
  }

  scale(sx, sy, sz) {
    return [
      sx, 0, 0, 0,
      0, sy, 0, 0,
      0, 0, sz, 0,
      0, 0, 0, 1
    ];
  }

  lookAt(cameraPos, coi, up) {
    let w = this.normalize(this.subtract(cameraPos, coi));
    let u = this.normalize(this.cross(up, w));
    let v = this.normalize(this.cross(w, u));

    let base = [
      u[0], v[0], w[0], 0,
      u[1], v[1], w[1], 0,
      u[2], v[2], w[2], 0,
      0, 0, 0, 1,
    ];
    let trans = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      -cameraPos[0], -cameraPos[1], -cameraPos[2], 1
    ];

    return this.multiply(base, trans);
  }

  perspective(fieldOfViewInRadians, aspect, near, far) {
    var ftan = 1 / Math.tan(fieldOfViewInRadians / 2);

    return [
      ftan / aspect, 0, 0, 0,
      0, ftan, 0, 0,
      0, 0, (near + far) / (near - far), -1,
      0, 0, (2 * far * near) / (near - far), 0
    ];
  }

  cross(a, b) {
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0]
    ];
  }

  subtract(a, b) {
    return [
      a[0] - b[0],
      a[1] - b[1],
      a[2] - b[2]
    ];
  }

  add(a, b) {
    return [
      a[0] + b[0],
      a[1] + b[1],
      a[2] + b[2]
    ];
  }

  distance(a, b) {
    return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2);
  }

  normalize(v) {
    var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);

    if (length > 0.00001) {
      return [
        v[0] / length,
        v[1] / length,
        v[2] / length
      ];
    } else {
      return [0, 0, 0];
    }
  }

  multiply(a, b) {
    let m = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        for (let k = 0; k < 4; k++) {
          m[i * 4 + j] = (m[i * 4 + j] || 0) + b[i * 4 + k] * a[k * 4 + j];
        }
      }
    }

    return m;
  }

  /**
   * 
   */
  multiplyVector(m, v) {
    let a00 = m[0];
    let a01 = m[1];
    let a02 = m[2];
    let a03 = m[3];
    let a10 = m[4];
    let a11 = m[5];
    let a12 = m[6];
    let a13 = m[7];
    let a20 = m[8];
    let a21 = m[9];
    let a22 = m[10];
    let a23 = m[11];
    let a30 = m[12];
    let a31 = m[13];
    let a32 = m[14];
    let a33 = m[15];

    let w = (a03 * v[0] + a13 * v[1] + a23 * v[2] + a33 * 1);

    return [
      a00 * v[0] + a10 * v[1] + a20 * v[2] + a30 * 1,
      a01 * v[0] + a11 * v[1] + a21 * v[2] + a31 * 1,
      a02 * v[0] + a12 * v[1] + a22 * v[2] + a32 * 1,
      w
    ];
  }
}

let UTILS = new Utils();
export default UTILS;