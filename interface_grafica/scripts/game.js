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
var pathColor = "#00a800"; // dark green
var jumpColor =   "#00f800"; // green
var pieceColor1 = "#ff0000"; // red
var pieceColor2 = "#0000ff"; // blue

// Define the size of each square and piece
var squareSize = 50;
var pieceSize = 20;

// Define the number of rows and columns
var rows = 8;
var cols = 8;

var turn = 0; //0 for blue, 1 for red




// Define the initial positions of the pieces
// A 0 means an empty square, a 1 means a red piece, and a 2 means a blue piece
var board = [
  [0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [2, 0, 2, 0, 2, 0, 2, 0],
  [0, 2, 0, 2, 0, 2, 0, 2],
  [2, 0, 2, 0, 2, 0, 2 ,0]
];


// var board = [
//   [0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 1, 0, 1, 0],
//   [0, 0, 0, 0, 0, 2, 0, 0],
//   [1, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 1, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0 ,0]
// ];


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

function stringToBoard(str) {
    // Split the string into an array of rows
    var rows = str.trim().split("\n");

    // Initialize the board array
    var board = [];

    // Loop through the rows
    for (var i = 0; i < rows.length; i++) {
        // Initialize an array for the current row
        var row = [];

        // Loop through the characters in the current row
        for (var j = 0; j < rows[i].length; j++) {
            // Get the character at the current position
            var char = rows[i][j];

            // Check the character and push the corresponding value to the row array
            if (char === ".") {
                row.push(0);
            } else if (char === "x") {
                row.push(1);
            } else if (char === "o") {
                row.push(2);
            } else if (char === "X") {
                row.push(3);
            } else if (char === "O") {
                row.push(4);
            }
        }

        // Push the row array to the board array
        board.push(row);
    }

    // Return the resulting board array
    return board;
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

function getJmpSquares(x, y, rows, cols) {
    value = board[y][x];

    var jmp_squares = [];

    // check if queen
    if (value == 3 || value == 4 ){
        checkFunc = isValidMoveForQueen;

    }else{
        checkFunc = isValidMove;
    }

    // Loop through the rows and columns
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++){

            var options = checkFunc(x, y, j, i);

            if (options[1]) {
                jmp_squares.push([j, i]);
            }
        }
    }

    return jmp_squares;
}

function getPossibleActions(selectedPiece){
    var moves = [];
    if (selectedPiece != null) {
        checkFunc = selectedPiece.value == 3 || selectedPiece.value == 4 ? isValidMoveForQueen : isValidMove;

        // check if for any move, there is a jump 
        var has_jump = false;
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++){

                var options = checkFunc(selectedPiece.x, selectedPiece.y, j, i);

                if (options[1]) {
                    has_jump = true;
                }
            }
        }

        // if has jump, only show jump moves
        if (has_jump) {
            jump_squares = getJmpSquares(selectedPiece.x, selectedPiece.y, rows, cols);

            for (var i = 0; i < jump_squares.length; i++) {
                moves.push([jump_squares[i][1], jump_squares[i][0]]);
            }
            
        }else{ // if not, show all possible moves

            // Loop through the rows and columns
            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < cols; j++){

                    var options = checkFunc(selectedPiece.x, selectedPiece.y, j, i);

                // check if it would be a valid move
                    if (options[0]) {
                        moves.push([i,j]);
                    }
        
                }
            }
        }
    }
    return moves
}

// function that creates a arrow to show the possible moves if selected Piece is on
function drawArrow() {
    moves = getPossibleActions(selectedPiece)
    ctx.fillStyle = jumpColor
    for(var i = 0; i < moves.length; i++){
        var x = moves[i][1] * squareSize
        var y = moves[i][0] * squareSize
        ctx.fillRect(x, y, squareSize, squareSize)
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
        //draw a underline under the selected piece
        if (selectedPiece) {
            // Calculate the x and y coordinates of the center of the piece
            var x = selectedPiece.x * squareSize + squareSize / 2;
            var y = selectedPiece.y * squareSize + squareSize / 2;

            // Draw a circle with the color and size of the piece
            ctx.strokeStyle = "#00ff00";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(x, y, pieceSize, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
}

// Define a function to update the game state
function update() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the board and the pieces
    drawBoard();
    drawArrow();

    drawPieces();
}



function checkJumpMove(board, fromX, fromY, toX, toY) {

    // get the diagonal direction from to 
    var directionX = toX - fromX > 0 ? 1 : -1;
    var directionY = toY - fromY > 0 ? 1 : -1;

    // iterate through the diagonal path, mark every piece as 0
    for (var i = 0; i < Math.abs(toX - fromX) - 1; i++) {
        // Get the coordinates of the current square
        var x = fromX + directionX * (i + 1);
        var y = fromY + directionY * (i + 1);

        // mark the piece as 0
        board[y][x] = 0;
    }
}

// turn a piece into a queen if it reaches the end of the board
function checkIfQueen(board, x, y) {
    // get the value of the piece
    var value = board[y][x];


    

    // check if the piece is a red piece
    if (value == 1 && y == rows - 1) {
        // turn the piece into a queen
        console.log("red queen")
        board[y][x] = 3;
    }

    // check if the piece is a blue piece
    if (value == 2 && y == 0) {
        // turn the piece into a queen
        console.log("blue queen")
        board[y][x] = 4;
    }
}



// Define a function to handle mouse clicks
function handleClick(event) {

    // Get the mouse position relative to the canvas
    var mouseX = event.clientX - canvas.offsetLeft;
    var mouseY = event.clientY - canvas.offsetTop;

    // Convert the mouse position to board coordinates
    var boardX = Math.floor(mouseX / squareSize);
    var boardY = Math.floor(mouseY / squareSize);

   

    if (turn == 1) {
        console.log("not your turn")
        return
    }

    // Check if the board coordinates are valid
    if (boardX >= 0 && boardX < cols && boardY >= 0 && boardY < rows) {

        // Get the value of the board at the clicked position
        var value = board[boardY][boardX];

            // Check if there is a piece at the clicked position
        if (value != 0) {
            // Set the selected piece to be the clicked position and value
            selectedPiece = {x: boardX, y: boardY, value: value};

        }

        if (value == 0 && selectedPiece) { 


                // check if queen
                if (selectedPiece.value == 3 || selectedPiece.value == 4 ){
                    checkFunc = isValidMoveForQueen;

                }else{
                    checkFunc = isValidMove;
                }
                // Check if the move is valid based on the rules of checkers
                var options = checkFunc(selectedPiece.x, selectedPiece.y, boardX, boardY);


               
                // Check if the move is a jump move
                var jumpMoves = getJmpSquares(selectedPiece.x, selectedPiece.y, rows, cols);

                var didJump = false;

                for (var i = 0; i < jumpMoves.length; i++) {
                    if (jumpMoves[i][0] == boardX && jumpMoves[i][1] == boardY) {
                        // Remove the jumped piece from the board
                        var jumpedX = (boardX + selectedPiece.x) / 2;
                        var jumpedY = (boardY + selectedPiece.y) / 2;
                        board[jumpedY][jumpedX] = 0;
                        didJump = true;
                    }
                }
         
                
                if (options[0] &&  !(jumpMoves.length > 0 ^ didJump)){
                    // Move the selected piece to the clicked position
                    board[boardY][boardX] = selectedPiece.value;
                    board[selectedPiece.y][selectedPiece.x] = 0;



                    checkIfQueen(board, boardX, boardY);

                    // Deselect the piece
                    selectedPiece = null;
                    // Switch turns between red and blue players
                    turn = turn == 1 ? 2 : 1;
                    // get play from api, send board
                    update();
                    gptPlays(board);

                }
            

        }
        // }

        // Update the game state
        update();
    }
}





// Define a function to check if a move is valid based on the rules of checkers
// first value is if the move is valid, second is if it's a jump move
function isValidMove(fromX, fromY, toX, toY) {
    // Get the value of the piece being moved
    var value = board[fromY][fromX];
    var team = value % 2


    // Get the direction of movement based on the value of the piece
    var direction = value == 1 ? 1 : -1;

    // Check if the move is diagonal and forward
    if (toX - fromX == direction && toY - fromY == direction || toX - fromX == -direction && toY - fromY == direction) {
        // check if there is a piece in the destination
        if (board[toY][toX] != 0) {
            // The move is invalid
            return [false, false];
        }
        // The move is valid
        return [true, false];
    }

    // Check if the move is a jump move
    if (toX - fromX == 2 * direction && toY - fromY == 2 * direction || toX - fromX == -2 * direction && toY - fromY == 2 * direction) {
        // Get the position of the jumped piece
        var jumpedX = (toX + fromX) / 2;
        var jumpedY = (toY + fromY) / 2;

        // Get the value of the jumped piece
        var jumpedValue = board[jumpedY][jumpedX];

        // Check if the jumped piece is of the opposite color
        if (jumpedValue % 2 != team && jumpedValue != 0) {
            // check if there is a piece in the destination
            if (board[toY][toX] != 0) {
                // The move is invalid
                return [false, false];
            }

            // The move is valid
            return [true, true];
        } else {
            // The move is invalid
            return [false, false];
        }
      
    }


    // The move is invalid
    return [false, false];
}

// first value is if the move is valid, second is if it's a jump move
function isValidMoveForQueen(fromX, fromY, toX, toY) {
    // Get the value of the piece being moved
    var value = board[fromY][fromX];

    var has_jump = false;



    // Check if the move is a jump move, only for queens
    if (value == 3 || value == 4) { // Check if the piece is a queen
        var team = value % 2 

        // if there is a piece in the destination, return false
        if (board[toY][toX] != 0) {
            // The move is invalid
            return [false, false];
        }


        // Get the difference between the from and to coordinates
        var diffX = toX - fromX;
        var diffY = toY - fromY;

        // Check if the move is diagonal
        if (Math.abs(diffX) == Math.abs(diffY)) {
            // Get the sign of the difference
            var signX = diffX > 0 ? 1 : -1;
            var signY = diffY > 0 ? 1 : -1;

            

          // Loop through the squares along the diagonal path
        for (var i = 0; i < Math.abs(diffX); i++) {
            // Get the coordinates of the current square
            var x = fromX + signX * (i + 1);
            var y = fromY + signY * (i + 1);


            // Check if there is a piece on the square
            if (board[y][x] != 0) {
                // Check if the piece is an enemy piece
                if (board[y][x] % 2 != team) {
                    if (board[y + signY][x + signX] == 0) {
                        // if the destination is the next square, return true
                        if (x + signX == toX && y + signY == toY) {
                            return [true, true];
                        }else{ 
                            return [false, false];
                        }
                    } else {
                        // The move is invalid
                        return [false, false];
                    }
                   
                } else {
                    // The move is invalid
                    return [false, false];
                }
            }
        }

        // The move is valid
        return [true, false];
    } else {
        // The move is not diagonal
        return [false, false];
    }
} else {
    // The piece is not a queen
    return [false, false];
}
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

function getAllGPTActions(){
    var allGptMoves = []
    for(i = 0; i<board.length; i++){
        for(j=0; j<board.length; j++){
            piece = {x: j, y: i, value: board[i][j]};
            if (piece.value == 0){ 
                continue;
            }
            if (piece.value == 1 || piece.value == 3){
                moves = getPossibleActions(piece)
                print(moves)
                if(moves.length)
                    allGptMoves.push({piece: piece, moves: moves})
            }
        }
    }

    // for(var i = 0; i<allGptMoves.length; i++){
    //     console.log(allGptMoves[i])
    // }
    return allGptMoves
}

async function requestPlay(data){
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        // mode: 'no-cors',
        body: JSON.stringify(data),
    };

    try {
        const response = await fetch('http://127.0.0.1:8080/gptMove', options);
        console.log('Request sent successfully.');

        if (response.ok) {
            const data = await response.json();
            console.log('Response data:', data);
            
            return data
        } else {
            console.error('Error:', response.status, response.statusText);
            // Trate erros relacionados à resposta aqui
        }
    } catch (error) {
        console.error('Error:', error);
        // Trate outros erros aqui
    }
}

function makeGptMoviment(gptPlay){
    console.log(gptPlay)
    const fromX = parseInt(gptPlay[1])
    const fromY = parseInt(gptPlay[3])
    const toX = parseInt(gptPlay[7])
    const toY = parseInt(gptPlay[9])

    // check if movie is valid (from top to bottom)
    if (isValidMove(fromX, fromY, toX, toY)) {
        // Move the selected piece to the clicked position
        board[toX][toY] = board[fromX][fromY];
        board[fromX][fromY] = 0;

        // Check if there is a jump move involved
        if (Math.abs(toY - fromY) == 2) {
            // Remove the jumped piece from the board
            var jumpedY = (toY + fromY) / 2;
            var jumpedX = (toX + fromX) / 2;
            board[jumpedX][jumpedY] = 0;
        }

        // Switch turns between red and blue players
        turn = turn == 1 ? 2 : 1;
    }else{ 

    }

    update()
}

// mock api call
async function gptPlays(board) {

    // gptUpdateBoard();
    // get the board as a string
    var boardString = boardToString(board);
    var moviments = getAllGPTActions()
    var stringMoves = ''
    print(moviments)

    var cont = 0
    for(i=0; i<moviments.length; i++){
        var piece = moviments[i].piece
        for(j=0; j<moviments[i].moves.length; j++){
            cont++
            stringMoves += '(' + String(piece.y) + ',' + String(piece.x) + ')/(' + String(moviments[i].moves[j][0]) + ',' + String(moviments[i].moves[j][1]) + ')\n'
        }
    }
    
    const data = {
        board: boardString,
        plays: stringMoves
    };
    
    const gpt_play = await requestPlay(data)
    try{
        play =  gpt_play['gpt_play']
        makeGptMoviment(play)
    }
    catch(error){
        console.error('Error:', error);
    }
    

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

// Add an event listener for mouse clicks on the canvas
canvas.addEventListener("click", handleClick);




// Update the game state for the first time
update();