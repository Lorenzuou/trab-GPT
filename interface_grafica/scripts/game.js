// Create a canvas element
var canvas = document.createElement("canvas");
// Get the canvas context
var ctx = canvas.getContext("2d");
// Set the canvas size
canvas.width = 400;
canvas.height = 400;
// Append the canvas to the document body
document.body.appendChild(canvas);

// Define the colors for the board and the pieces
var boardColor1 = "#f0d9b5"; // light brown
var boardColor2 = "#b58863"; // dark brown
var pieceColor1 = "#ff0000"; // red
var pieceColor2 = "#0000ff"; // blue

// Define the size of each square and piece
var squareSize = 50;
var pieceSize = 20;

// Define the number of rows and columns
var rows = 8;
var cols = 8;

// Define the initial positions of the pieces
// A 0 means an empty square, a 1 means a red piece, and a 2 means a blue piece
// var board = [
//   [0, 1, 0, 1, 0, 1, 0, 1],
//   [1, 0, 1, 0, 1, 0, 1, 0],
//   [0, 1, 0, 1, 0, 1, 0, 1],
//   [0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0],
//   [2, 0, 2, 0, 2, 0, 2, 0],
//   [0, 2, 0, 2, 0, 2, 0, 2],
//   [2, 0, 2, 0, 2, 0, 2 ,0]
// ];


var board = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 3, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [2, 0, 4, 0, 2, 0, 2, 0],
  [0, 2, 0, 2, 0, 2, 0, 2],
  [2, 0, 2, 0, 2, 0, 2 ,0]
];


// Define a function that takes a board array as a parameter and returns a string
function boardToString(board) {
    // Initialize an empty string
    var result = "";

    // Loop through the rows of the board
    for (var i = 0; i < board.length; i++) {
        // Loop through the columns of the board
        for (var j = 0; j < board[i].length; j++) {
            // Get the value of the board at the current position
            var value = board[i][j];

            // Check the value and append the corresponding symbol to the result string
            if (value == 0) {
                result += ".";
            } else if (value == 1) {
                result += "x";
            } else if (value == 2) {
                result += "o";
            } else if (value == 3) {
                result += "X"; // Red queen
            } else if (value == 4) {
                result += "O"; // Blue queen
            }
        }

        // Append a newline character to the result string after each row
        result += "\n";
    }

    // Return the result string
    return result;
}


// Define a function to draw the board
function drawBoard() {
    // Loop through the rows and columns
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            // Calculate the x and y coordinates of the top-left corner of the square
            var x = j * squareSize;
            var y = i * squareSize;

            // Determine the color of the square based on its position
            var color = (i + j) % 2 == 0 ? boardColor1 : boardColor2;

            // Fill the square with the color
            ctx.fillStyle = color;
            ctx.fillRect(x, y, squareSize, squareSize);
        }
    }
}

// Define a function to draw the pieces
function drawPieces() {
    // Loop through the board array
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            // Get the value of the board at the current position
            var value = board[i][j];

            // If the value is not zero, then there is a piece
            if (value != 0) {
                // Calculate the x and y coordinates of the center of the piece
                var x = j * squareSize + squareSize / 2;
                var y = i * squareSize + squareSize / 2;

                

                // Determine the color of the piece based on its value, if mod 2 is 0, then it's red, else it's blue
                var color = value % 2 == 0 ? pieceColor2 : pieceColor1;

                // Draw a circle with the color and size of the piece
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(x, y, pieceSize, 0, Math.PI * 2);
                ctx.fill();

                if (value == 3 || value == 4) {
                    // Draw a circle with the color and size of the piece
                    ctx.fillStyle = "#ffffff";
                    ctx.beginPath();
                    ctx.arc(x, y, pieceSize * 0.5, 0, Math.PI * 2);
                    ctx.fill();
                }

                
            }
        }
    }
}

// Define a function to update the game state
function update() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the board and the pieces
    drawBoard();
    drawPieces();
}


function checkIfQueen(board, x, y){ 
    // check if the piece is a queen
    if (board[y][x] == 1 && y == 0) {
        board[y][x] = 3;
    }else if (board[y][x] == 2 && y == 7) {
        board[y][x] = 4;
    }

}

function isValidMoveForQueen(fromX, fromY, toX, toY) {
    // Get the value of the piece being moved
    var value = board[fromY][fromX];




    // Check if the move is a jump move, only for queens
    if (value == 3 || value == 4) { // Check if the piece is a queen
        // Get the difference between the from and to coordinates
        var diffX = toX - fromX;
        var diffY = toY - fromY;

        // Check if the move is diagonal
        if (Math.abs(diffX) == Math.abs(diffY)) {
            // Get the sign of the difference
            var signX = diffX > 0 ? 1 : -1;
            var signY = diffY > 0 ? 1 : -1;

            // Initialize a variable to store the number of jumps
            var jumps = 0;

            // Loop through the squares along the diagonal path
            for (var i = 1; i < Math.abs(diffX); i++) {
                // Get the position of the current square
                var currX = fromX + i * signX;
                var currY = fromY + i * signY;

                // Get the value of the current square
                var currValue = board[currY][currX];

                // Check if the current square is empty
                if (currValue == 0) {
                    // Continue the loop
                    continue;
                }

                // Check if the current square has a piece of the opposite color
                if (currValue != value) {
                    // Increment the number of jumps
                    jumps++;

                    // Check if there is already a jump
                    if (jumps > 1) {
                        // The move is invalid
                        return false;
                    }
                } else {
                    // The move is invalid
                    return false;
                }
            }

            // Check if there is at least one jump
            if (jumps == 1) {
                // The move is valid
                return true;
            }
        }
    }

    // The move is invalid
    return false;
}



// Define a function to handle mouse clicks
function handleClick(event) {



    // Get the mouse position relative to the canvas
    var mouseX = event.clientX - canvas.offsetLeft;
    var mouseY = event.clientY - canvas.offsetTop;

    // Convert the mouse position to board coordinates
    var boardX = Math.floor(mouseX / squareSize);
    var boardY = Math.floor(mouseY / squareSize);

    console.log("turn: " + turn);
    console.log("boardX: " + boardX + " boardY: " + boardY);

    // if (turn == 2) {
    //     update();
    // }

    // Check if the board coordinates are valid
    if (boardX >= 0 && boardX < cols && boardY >= 0 && boardY < rows) {

        // Get the value of the board at the clicked position
        var value = board[boardY][boardX];

        

        // // If there is no selected piece, then try to select one
        // if (!selectedPiece) {
            // Check if there is a piece at the clicked position
        if (value != 0) {
            // Set the selected piece to be the clicked position and value
            selectedPiece = {x: boardX, y: boardY, value: value};
        }

        // } else {
            // If there is a selected piece, then try to move it
            // Check if the clicked position is empty
        if (value == 0 && selectedPiece) { 

                

                // Check if the move is valid based on the rules of checkers
                if (isValidMove(selectedPiece.x, selectedPiece.y, boardX, boardY)) {
                    // Move the selected piece to the clicked position
                    board[boardY][boardX] = selectedPiece.value;
                    board[selectedPiece.y][selectedPiece.x] = 0;

                    // Check if there is a jump move involved
                    if (Math.abs(boardX - selectedPiece.x) == 2) {
                        // Remove the jumped piece from the board
                        var jumpedX = (boardX + selectedPiece.x) / 2;
                        var jumpedY = (boardY + selectedPiece.y) / 2;
                        board[jumpedY][jumpedX] = 0;
                    }
                    
                    // Deselect the piece
                    selectedPiece = null;
                    // check if the piece is a queen
                    checkIfQueen(board, boardX, boardY);
                    // Switch turns between red and blue players
                    turn = turn == 1 ? 2 : 1;
                    // get play from api, send board
                    gptPlays(board);

                }
            }
        // }

        // Update the game state
        update();
    }
}





// Define a function to check if a move is valid based on the rules of checkers
function isValidMove(fromX, fromY, toX, toY) {
    // Get the value of the piece being moved
    var value = board[fromY][fromX];

    // Get the direction of movement based on the value of the piece
    var direction = value == 1 ? 1 : -1;

    // Check if the move is diagonal and forward
    if (toX - fromX == direction && toY - fromY == direction || toX - fromX == -direction && toY - fromY == direction) {
        // The move is valid
        return true;
    }

    // Check if the move is a jump move
    if (toX - fromX == 2 * direction && toY - fromY == 2 * direction || toX - fromX == -2 * direction && toY - fromY == 2 * direction) {
        // Get the position of the jumped piece
        var jumpedX = (toX + fromX) / 2;
        var jumpedY = (toY + fromY) / 2;

        // Get the value of the jumped piece
        var jumpedValue = board[jumpedY][jumpedX];

        // Check if the jumped piece is of the opposite color
        if (jumpedValue != 0 && jumpedValue != value) {
            // The move is valid
            return true;
        }
    }


    // The move is invalid
    return false;
}



function gptUpdateBoard() {

    // fromX = data.fromX;
    // fromY = data.fromY;
    // toX = data.toX;
    // toY = data.toY;

    // mock values
    fromX = 5;
    fromY = 2;
    toX = 4;
    toY = 3;

    // check if movie is valid (from top to bottom)
    if (isValidMove(fromX, fromY, toX, toY)) {
        // Move the selected piece to the clicked position
        board[toY][toX] = board[fromY][fromX];
        board[fromY][fromX] = 0;

        // Check if there is a jump move involved
        if (Math.abs(toX - fromX) == 2) {
            // Remove the jumped piece from the board
            var jumpedX = (toX + fromX) / 2;
            var jumpedY = (toY + fromY) / 2;
            board[jumpedY][jumpedX] = 0;
        }

        // Switch turns between red and blue players
        turn = turn == 1 ? 2 : 1;
        return true;
    }else{ 
        return false;
    }
}

// mock api call
function gptPlays(board) {

    gptUpdateBoard();
    // get the board as a string
    var boardString = boardToString(board);
    console.log(boardString)

    // // send the board to the api
    // fetch('http://localhost:5000/play', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({board: boardString}),
    // })
    // .then(response => response.json())
    // .then(data => {
    //     console.log('Success:', data);
    //     // if movie is not valid, ask for another one
    //     if (gptUpdateBoard(data)){ 
    //         gptPlays(board);
    //     }
    //     ;
    // })
    // .catch((error) => {
    //     console.error('Error:', error);
    // });
}


// Define a variable to store the selected piece
var selectedPiece = null;

// Define a variable to store the current turn
var turn = 1; // red goes first

// Add an event listener for mouse clicks on the canvas
canvas.addEventListener("click", handleClick);




// Update the game state for the first time
update();