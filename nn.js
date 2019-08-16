class NeuralNetwork {
  // Takes the number of neurons required for input, hidden and output layers
  constructor(inp,hid,out) {
    this.inputs = inp;
    this.hiddenNodes = hid;
    this.outputs = out;
    this.generateWeights();
  }
  
  // Initializes the weight matrix of each layer
  // and uses the matrix.randomize() function to create 
  // random weights between -1 and 1
  generateWeights() {
    this.weights_ih = new Matrix(this.hiddenNodes, this.inputs);
    this.weights_ho = new Matrix(this.outputs, this.hiddenNodes);
    this.bias_h = new Matrix(this.hiddenNodes, 1);
    this.bias_o = new Matrix(this.outputs, 1);
    this.weights_ih.randomize();
    this.weights_ho.randomize();
    this.bias_h.randomize();
    this.bias_o.randomize();
  }

  predict(inputs) {
    let i_matrix = Matrix.getMatrix(inputs);

    // this.col_i, this.col_h, this.col_o are arrays
    // that will store the inputs, inputs for the hidden layer and 
    // the outputs respectively. These arrays will be later used 
    // to show the neural network.
    this.col_i = inputs;

    let output_ih = Matrix.multiply(this.weights_ih, i_matrix);
    output_ih.add(this.bias_h);
    output_ih.map(this.sigmoid);
    this.col_h = Matrix.getArray(output_ih);

    let output_ho = Matrix.multiply(this.weights_ho, output_ih);
    output_ho.add(this.bias_o);
    output_ho.map(this.sigmoid)
    let output = Matrix.getArray(output_ho);
    this.col_o = output;

    return output;
  }

  sigmoid(val) {
    return 1/ (1 + Math.exp(-val));
  }

  // Mutates all the weights of the neural network
  // with the given probability (Mutation rate)
  mutate(rate) {
    this.weights_ih.mutate(rate);
    this.weights_ho.mutate(rate);
    this.bias_h.mutate(rate);
    this.bias_o.mutate(rate);
  }

  // Returns a deep copy of the Neural Network
  copy() {
    let copy = new NeuralNetwork(this.inputs, this.hiddenNodes, this.outputs);
    copy.weights_ih = this.weights_ih.copy();
    copy.weights_ho = this.weights_ho.copy();
    copy.bias_h = this.bias_h.copy();
    copy.bias_o = this.bias_o.copy();
    return copy;
  }

  // Uses the arrays saved in the predict function to show the Neural Network
  // Each array elements have a value between 0 and 1, this value can then be mapped
  // to hsl() color scale where 0 is red and 120 is green.

  // Side note: Could only fit 6 out of the 8 inputs for the hidden layer.
  // Plus, I would love some help refactoring this code since all the positioning
  // is done manually.

  // This function takes the starting xPos of the neural network nodes.
  show(x) {
    // Initializing starting yPos of the nodes
    let iY = 558;
    let hY = 550;
    let oY = 573
    drawLines(x, x + 30, x + 60);
    
    // This loop draws the input nodes
    for (let i = 0; i < this.col_i.length; i++) {
      let hue = Math.floor(map(this.col_i[i], 0, 1, 0, 120));
      let col = `hsl(${hue}, 100%, 50%)`;
      fill(col);
      strokeWeight(0);
      circle(x, iY, 10);
      iY += 15;
    }

    // This loop draws the hidden nodes
    for (let i = 0; i < 6; i++) {
      let hue = Math.floor(map(this.col_h[i], 0, 1, 0, 120));
      let col = `hsl(${hue}, 100%, 50%)`;
      fill(col);
      strokeWeight(0);
      circle(x + 30, hY, 10);
      hY += 15;
    }

    // This code block draws the output nodes
    if (this.col_o[0] > this.col_o[1]) {
      fill('hsl(10, 100%, 50%)');
      strokeWeight(0);
      circle(x + 60, oY, 10);
      fill('hsl(110, 100%, 50%)');
      circle(x + 60, oY + 30, 10);
    } else {
      fill('hsl(110, 100%, 50%)');
      strokeWeight(0);
      circle(x + 60, oY, 10);
      fill('hsl(10, 100%, 50%)');      
      circle(x + 60, oY + 30, 10);
    }

    // Function to draw the Lines between neurons
    function drawLines(ix, hx, ox) {
      let hyl = hY;
      let iyl = iY
      let oyl = oY;
      push();
      stroke('rgba(255, 255, 255, 0.4)');
      strokeWeight(1)
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 6; j++) {
          line(ix, iyl, hx, hyl);
          hyl += 15;
        }
        hyl = hY;
        iyl += 15;
      }

      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 2; j++) {
          line(hx, hyl, ox, oyl);
          oyl += 30;
        }
        oyl = 573;
        hyl += 15;
      }
      pop();
    }


  }
}


// Test Case
// let nn = new NeuralNetwork(4, 8, 1);
// nn.predict([0.5, 0.2, 0.3, 0.1]);
