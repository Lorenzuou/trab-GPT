// Create a canvas element
var canvas = document.createElement("canvas");
// Get the canvas context
var ctx = canvas.getContext("2d");
// Set the canvas size
canvas.width = 400;
canvas.height = 400;

// create a div, which will receive the GPT reason to its play, so it will receive a text, make it a chat, add scroll and make the text fit
var div = document.createElement("div");
div.style.width = "400px";
div.style.height = "200px";
div.style.overflow = "auto";
div.style.border = "1px solid #000000";
div.style.backgroundColor = "#ffffff";  
div.style.color = "#000000";
div.style.fontFamily = "Arial";
// text margin 
div.style.margin = "10px";
// text padding
div.style.padding = "10px";
div.style.fontSize = "18px";
div.style.lineHeight = "16px";


// Set the margin and padding of the div to zero
div.style.margin = "0px";
div.style.padding = "0px";
// Set the overflow auto
div.style.overflow = "scroll";

//restar button <button id="restartButton" onclick="restartGame()">Restart Game</button>
var restartButton = document.createElement("button");
restartButton.innerHTML = "Restart Game";
restartButton.style.margin = "10px";
restartButton.style.padding = "10px";
restartButton.style.fontSize = "18px";
restartButton.style.lineHeight = "16px";
restartButton.style.backgroundColor = "#ffffff";
restartButton.style.color = "#000000";
restartButton.style.fontFamily = "Arial";
restartButton.style.border = "1px solid #000000";
restartButton.style.borderRadius = "5px";
restartButton.style.cursor = "pointer";
//set onhover color
restartButton.onmouseover = function() {
    restartButton.style.backgroundColor = "#000000";
    restartButton.style.color = "#ffffff";
};
restartButton.onmouseleave = function() {
    restartButton.style.backgroundColor = "#ffffff";
    restartButton.style.color = "#000000";
}

restartButton.onclick = function() {
    // blue color 
    restartButton.style.backgroundColor = "#0000ff";
    restartButton.style.color = "#ffffff";
    
    restartGame();
};      




var container = document.getElementById("game");

// center container 
container.style.display = "flex";
container.style.justifyContent = "center";
container.style.alignItems = "center";
// flex direction column
container.style.flexDirection = "column";
container.appendChild(div);
container.appendChild(canvas);
container.appendChild(restartButton);



//append div 
var current_message = 'Let\'s play!';


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


var gptHasPlayed = true;



// Define the initial positions of the pieces
// A 0 means an empty square, a 1 means a red piece, and a 2 means a blue piece

// normal board
// var board = [
//     [0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 1, 0, 0, 0, 0], 
//     [0, 0, 2, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0]
// ];
    


// var board = [
//   [0, 1, 0, 1, 0, 1, 0, 1],
//   [1, 0, 1, 0, 1, 0, 1, 0],
//   [0, 0, 0, 0, 0, 0, 0, 1],
//   [1, 0, 2, 0, 0, 0, 1, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 2, 0, 2, 0],
//   [0, 2, 0, 2, 0, 2, 0, 2],
//   [2, 0, 2, 0, 2, 0, 2 ,0]
// ];


var board = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 3, 0, 3, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 3, 0, 0, 0, 0, 0, 0],
  [2, 0, 0, 0, 3, 0, 0 ,0]
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

function writeEndGameMessage(){
    var p = document.createElement("p");
    p.style.margin = "10px";
    p.style.padding = "10px";
    p.innerHTML = "Game Over!"
    div.scrollTop = div.scrollHeight;
    div.appendChild(p);
    // let scroll to the bottom
}

function writeMessageFromGPT(){ 
    // add <p> to div
    if (gptHasPlayed && current_message!=undefined){
    
        var p = document.createElement("p");

        p.style.margin = "10px";
        p.style.padding = "10px";
        p.innerHTML = current_message;
        // add a line 
        var hr = document.createElement("hr");
        // set color of line red 
        hr.style.color = "#ff0000";
        div.appendChild(hr);
        div.appendChild(p);
        gptHasPlayed = false;
        div.scrollTop = div.scrollHeight;
    }   

}

function getJmpSquares(x, y, rows, cols) {
    var value = board[y][x];
    // console.log("value jmp squares", value)
    if (value == 0) {
        return [];
    }


    var checkFunc = null;

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

function getPossibleActions(piece){
    var moves = [];
    var has_jump = false;

    var checkFunc = isValidMove;


    if (piece != null) {

        if (piece.value == 3 || piece.value == 4 ){
            checkFunc = isValidMoveForQueen;
            // console.log("queen")

        }else{
            checkFunc = isValidMove;
            // console.log("not queen")
        }
        // check if for any move, there is a jump 
        var jumpMovesForAll = checkAllJumpMoves(board, turn);
        // console.log("jump for all", jumpMovesForAll)

        if (jumpMovesForAll.length > 0) {
            // console.log("jump moves")
            has_jump = true;
        }

        // if has jump, only show jump moves
        if (has_jump) {
            jump_squares = getJmpSquares(piece.x, piece.y, rows, cols);

            for (var i = 0; i < jump_squares.length; i++) {
                moves.push([jump_squares[i][1], jump_squares[i][0]]);
            }
            
        }else{ // if not, show all possible moves

            // Loop through the rows and columns
            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < cols; j++){

                    var options = checkFunc(piece.x, piece.y, j, i);

                    // console.log(piece.x, piece.y, j, i, options);

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

function gameDidEnd(){
    var findRed = false
    var findBlue = false
    for(i=0; i<rows; i++){
        for(j=0; j<rows; j++){
            if(board[i][j] == 1 || board[i][j] == 3){
                findRed = true
            }else if(board[i][j] == 2 || board[i][j] == 4){
                findBlue = true
            }
        }
    }

    return !(findBlue && findRed)
}

// Define a function to update the game state
function update() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the board and the pieces
    drawBoard();
    drawArrow();
    writeMessageFromGPT();

    drawPieces();
}



// Check if, for a team, there is any jump move, return the movements if there is
function checkAllJumpMoves(board, team) {
    // Initialize an empty array to store the jump moves
    var moves = [];

    // Loop through the rows and columns
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++){
            // Get the value of the piece at the current position
            var value = board[i][j];

            // Check if the piece is of the current team
            if (value % 2 == team) {
                // Get the jump moves for the piece
                var jumpMoves = getJmpSquares(j, i, rows, cols);
                if (jumpMoves.length > 0) {
                    // console.log("jump moves")
                    // console.log(jumpMoves)
                }
                

                // Add the jump moves to the array
                moves = moves.concat(jumpMoves);
            }
        }
    }

    // Return the array of jump moves
    return moves;
}


function checkJumpMove(board, fromX, fromY, toX, toY) {
    // console.log("check jump move")
    // console.log(board, fromX, fromY, toX, toY)
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

    // console.log(value, y, rows - 1)
    

    // check if the piece is a red piece
    if (value == 1 && y == rows - 1) {
        // turn the piece into a queen
        // console.log("red queen")
        board[y][x] = 3;
    }

    // check if the piece is a blue piece
    if (value == 2 && y == 0) {
        // turn the piece into a queen
        // console.log("blue queen")
        board[y][x] = 4;
    }
}

function eatPiece(jumpMoves, toX, toY, fromX, fromY, board){
    var didJump = false;
    // console.log("eat piece", toX, toY, fromX, fromY)
    // console.log(jumpMoves)


    for (var i = 0; i < jumpMoves.length; i++) {
        if (jumpMoves[i][0] == toX && jumpMoves[i][1] == toY) {
            didJump = true;
            // Remove the jumped piece from the board
            checkJumpMove(board, fromX, fromY, toX, toY);
        }
    }
    return didJump
}



// Define a function to handle mouse clicks
function handleClick(event) {

    // Get the mouse position relative to the canvas
    var mouseX = event.clientX - canvas.offsetLeft;
    var mouseY = event.clientY - canvas.offsetTop;

    // Convert the mouse position to board coordinates
    var boardX = Math.floor(mouseX / squareSize);
    var boardY = Math.floor(mouseY / squareSize);

    var checkFunc = null;

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

        var jumpMovesForAll = checkAllJumpMoves(board, turn);

        if (value == 0 && selectedPiece) { 


               if(jumpMovesForAll.length > 0){ 
                // if the move is one of the possible moves
                var didJump = false;
                for(i = 0; i<jumpMovesForAll.length; i++){
                    if(jumpMovesForAll[i][0] == boardX && jumpMovesForAll[i][1] == boardY){
                        didJump = true;
                    }
                }

                if(!didJump){ 
                    console.log("invalid move")
                    return
                }
               }


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


                didJump = eatPiece(jumpMoves, boardX, boardY, selectedPiece.x, selectedPiece.y, board)
         
                
                if (options[0] &&  !(jumpMoves.length > 0 ^ didJump)){
                    // Move the selected piece to the clicked position
                    board[boardY][boardX] = selectedPiece.value;
                    board[selectedPiece.y][selectedPiece.x] = 0;


                    checkIfQueen(board, boardX, boardY);

                    // Deselect the piece
                    selectedPiece = null;
                    // Switch turns between red and blue players (0 for blue, 1 for red)

                    // get play from api, send board
                    update();
                    
                    if(!getJmpSquares(boardX, boardY, rows, cols).length || !didJump){
                        turn  = turn == 1 ? 0 : 1;
                        if(!gameDidEnd()){
                            gptPlays(board);
                        }
                        else{
                            writeEndGameMessage()
                        }
                    }
                }
            

        }
        // }
        console.log("turn " + turn)
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

    if (value == 0) {
        return [false, false];
    }


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
    if (Math.abs(toX - fromX) == 2  && Math.abs(toY - fromY) == 2  ) {
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
    if (value == 0) {
        return [false, false];
    }


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
        turn = turn == 0 ? 1 : 0;
        return true;
    }else{ 
        return false;
    }
}

function getAllGPTActions(){
    var allGptMoves = []
    for(i = 0; i<board.length; i++){
        for(j=0; j<board.length; j++){
            let piece = {x: j, y: i, value: board[i][j]};
            if (piece.value == 0){ 
                continue;
            }
            if (piece.value == 1 || piece.value == 3){
                moves = getPossibleActions(piece)
                // print(moves)
                if(moves.length)
                    allGptMoves.push({piece: piece, moves: moves})
            }
        }
    }


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
        return false
    }
}

function makeGptMoviment(gptPlay){
    console.log(gptPlay)
    var fromX = parseInt(gptPlay[1])
    var fromY = parseInt(gptPlay[3])
    const toX = parseInt(gptPlay[7])
    const toY = parseInt(gptPlay[9])

    board[toX][toY] = board[fromX][fromY];

    var sumX = false
    var sumY = false
    if(fromX < toX){
        sumX = true
    }
    if(fromY < toY){
        sumY = true
    }


    var didEat = false
    while(fromX != toX && fromY != toY){
        if (board[fromX][fromY] == 2 || board[fromX][fromY] == 4){
            didEat = true
        }
        board[fromX][fromY] = 0
        if(sumX){
            fromX ++
        }else{
            fromX --
        }
        if(sumY){
            fromY ++
        }else{
            fromY--
        }
    }

    if(didEat){
        console.log(getJmpSquares(toY, toX, rows, cols))
        if(getJmpSquares(toY, toX, rows, cols).length){
            gptPlays(board)
            return
        }
    }

    turn = turn == 0 ? 1 : 0;
}

// mock api call
async function gptPlays(board) {

    // gptUpdateBoard();
    // get the board as a string
    var boardString = boardToString(board);
    var moviments = getAllGPTActions()
    var stringMoves = ''


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
        //append current message
        current_message = gpt_play['message']
        makeGptMoviment(play)
    }
    catch(error){
        console.error('Error:', error);
        // play again
        gptPlays(board);
    }
    gptHasPlayed = true;
    update()

    if(gameDidEnd()){
        writeEndGameMessage()
    }
}

function restartGame() {
    board = [
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [2, 0, 2, 0, 2, 0, 2, 0],
        [0, 2, 0, 2, 0, 2, 0, 2],
        [2, 0, 2, 0, 2, 0, 2 ,0]
    ];
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }

    current_message = 'Let\'s play!';
    gptHasPlayed = true;
    selectedPiece = null;
    turn = 0
    update()
}


// Define a variable to store the selected piece
var selectedPiece = null;

// Define a variable to store the current turn

// Add an event listener for mouse clicks on the canvas
canvas.addEventListener("click", handleClick);




// Update the game state for the first time
update();