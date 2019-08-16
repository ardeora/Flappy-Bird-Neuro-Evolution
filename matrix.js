class Matrix {
  // Data of the matrix will be stored in a 2D array
  // Initialize a matrix with the given data
  // If data unavailable, Initialize a zero matrix
  constructor(r, c, data) {
    this.rows = r;
    this.cols = c;
    if (data) this.data = data;
    else {
      this.data = [];
      this.initBlankMatrix();
    }
  }

  // Creates a Zero Matrix
  initBlankMatrix() {
    this.data = [];
    for (let i = 0; i < this.rows; i++) {
      let arr = [];
      for (let j = 0; j < this.cols; j++) {
        arr.push(0);
      }
      this.data.push(arr);
    }
  }

  // Each element of the matrix will be set to a random number
  // between -1 and 1. Distribution: Uniform
  randomize() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.data[i][j] = (Math.random() * 2) - 1;
      }
    }
    return this;
  }

  // Returns a matrix given an 1D array;
  static getMatrix(arr) {
    let new_matrix = new Matrix(arr.length, 1);
    for (let i = 0; i < arr.length; i++) {
      new_matrix.data[i][0] = arr[i];
    }

    return new_matrix;
  }

  // Returns an array given a vector
  static getArray(vec) {
    let new_arr = [];
    for (let i = 0; i < vec.data.length; i++) {
      new_arr.push(vec.data[i][0]);
    }
    return new_arr;
  }

  // Takes a matrix as an argument and adds its values
  // to this.data
  add(mat) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.data[i][j] += mat.data[i][j];
      }
    }
  }

  // Takes two matrices as arguments and returns a matrix
  // with their dot product 
  static multiply(a, b) {
    if (a.cols === b.rows) {
      let newMat = new Matrix(a.rows, b.cols);
      for (let i = 0; i < a.rows; i++) {
        for (let j = 0; j < b.cols; j++) {
          for (let k = 0; k < a.cols; k++) {
            newMat.data[i][j] += a.data[i][k] * b.data[k][j];
          }
        }
      }
      return newMat;
    } else {
      console.error('Incompatible Matrices: Cannot Multiply')
    }
  }

  // Maps a function to each element of the matrix
  map(func) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let val = this.data[i][j];
        this.data[i][j] = func(val);
      }
    }
  }

  // Takes the mutation rate as an argument and creates a new 
  // mutation function that can be mapped to each element of the matrix
  mutate(rate) {
    function mutateFunc(val) {
      if (random() < rate) {
        let delta = randomGaussian() * 0.5;
        return val + delta;
      } else {
        return val;
      }
    }
    this.map(mutateFunc);
  }

  // Returns a deep copy of a matrix
  copy() {
    let copy = new Matrix(this.rows, this.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        copy.data[i][j] = this.data[i][j];
      }
    }
    return copy;
  }

  // Converts a Matrix to String
  toString() {
    let str = ``;
    for (let i = 0; i < this.rows; i++) {
      str += this.data[i].join(' ') + '\n';
    }
    return str;
  }
}

// let test1 = new Matrix(2,3);
// let test2 = new Matrix(3,2);

// test1.data[0] = [1,2,3];
// test1.data[1] = [4,5,6];

// test2.data[0] = [2, 4];
// test2.data[1] = [4, 6];
// test2.data[2] = [6, 8];