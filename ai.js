class Board {
    constructor() {
        this.board = Board.createBoard();
        this.round = 0;
        this.block = false;
        this.player = "X";
        this.ai = "O";
        this.turn = this.player;
    }

    // creates new board
    static createBoard() {
        // 2D Array to represent board
        let board = new Array(3);
        for (let i = 0; i < 3; i++) {
            board[i] = new Array(3)
            for (let j = 0; j < 3; j++) {
                board[i][j] = "-";
            }
        }
        return board;
    }

    // copies board
    static copyBoard(board) {
        // 2D Array to represent board
        let newBoard = new Array(3);
        for (let i = 0; i < 3; i++) {
            newBoard[i] = new Array(3)
            for (let j = 0; j < 3; j++) {
                newBoard[i][j] = board[i][j];
            }
        }
        return newBoard;
    }

    static compareBoards(board1, board2) {
        for (let i = 0; i < 3; i++) {
            for ( let j = 0; j < 3; j++) {
                if (board1[i][j] !== board2[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }

    // starts the game
    startGame() {
        // displays board
        document.getElementById("board").style.display = "grid";
        document.getElementById("start").style.display = "none";
        document.getElementById("turn").style.display = "block";
        document.getElementById("restart").style.display = "block";

        // chooses a random player to start
        let random = Math.floor(Math.random()*2);
        // let random = 1;
        if (random === 0) {
            this.turn = this.player;
            document.getElementById("turn").innerHTML = "Your Turn";
        }
        else if (random === 1) {
            this.turn = this.ai;
            document.getElementById("turn").innerHTML = "AI'S Turn";
            let tmp = this.minMax(this.board, this.round, this.ai); 

            // display ai's move
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (tmp.board[i][j] !== this.board[i][j]){
                        document.getElementById("" + (i+1) + (j+1)).src = "circle.png";
                        this.board = tmp.board;
                    }
                }
            }
            this.round++;
            this.turn = this.player;
            document.getElementById("turn").innerHTML = "Your Turn";
        }
    }

    // gets user input and calls ai
    position(y, x) {
        // checks if it is players turn
        if (this.turn === this.player && !this.block) {
            // checks if given position is valid
            if (this.board[y-1][x-1] === "-") {
                // player's turn
                this.board[y-1][x-1] = this.player;
                document.getElementById("" + y + x).src = "cross.png";

                // check if won
                let tmp = this.checkForWin(this.board);
                if (tmp.win) {
                    this.block = true;
                    this.show_win(this.board, this.turn);
                    if (tmp.winner === this.player) {

                        
                        document.getElementById("turn").innerHTML = "Your Won!";

                    }
                    else {

                        document.getElementById("turn").innerHTML = "Draw";

                    }
                }
                else {
                    this.round++;
                    this.turn = this.ai;
                    document.getElementById("turn").innerHTML = "AI'S Turn";
                }

                // ai's turn
                if (!this.block) {
                    let tmp = this.minMax(this.board, this.round, this.ai);
                    //let tmpBoard = this.aiCall(this.board);
                    // display ai's move
                    for (let i = 0; i < 3; i++) {
                        for (let j = 0; j < 3; j++) {
                            if (tmp.board[i][j] !== this.board[i][j]){
                                document.getElementById("" + (i+1) + (j+1)).src = "circle.png";
                                this.board = tmp.board;
                            }
                        }
                    }
                    tmp = this.checkForWin(this.board);
                    if (tmp.win) {
                        this.block = true;
                        this.show_win(this.board, this.turn);
                        if (tmp.winner === this.ai) {

                            document.getElementById("turn").innerHTML = "AI Won!";

                        }
                        else {

                            document.getElementById("turn").innerHTML = "Draw";

                        }
                    }
                    else {
                        this.round++;
                        this.turn = this.player;
                        document.getElementById("turn").innerHTML = "Your Turn";
                    }
                }
            }
        }
    }

    // checks if ai can win / block on this move
    aiCall(board) {
        let boardCopy = Board.copyBoard(board);

        if (this.round === 1) {
            if (boardCopy[0][0] === "X" || boardCopy[2][2] === "X" || boardCopy[0][2] === "X" || boardCopy[2][0] === "X") {
                boardCopy[1][1] = "O";
                return boardCopy;
            }
        }

        // checks if ai can win
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (boardCopy[i][j] === "-") {
                    boardCopy[i][j] = this.ai;
                    let tmp = this.checkForWin(boardCopy)
                    if (tmp.win && tmp.winner === this.ai) {
                        return boardCopy;
                    }
                    boardCopy[i][j] = "-";
                }
            }
        }

        // checks if ai can block player from winning
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (boardCopy[i][j] === "-") {
                    boardCopy[i][j] = this.player;
                    let tmp = this.checkForWin(boardCopy)
                    if (tmp.win && tmp.winner === this.player) {
                        boardCopy[i][j] = this.ai;
                        return boardCopy;
                    }
                    boardCopy[i][j] = "-";
                }
            }
        }
        let tmp = this.minMax(boardCopy, this.round, this.ai);
        return tmp.board;
    }

    minMax(board, round, turn) {

        if (round === 3) {
            console.log();
        }

        // creates an array to store all possible moves
        let boards = new Array(9-round);
        for (let i = 0; i < (9-round); i++) {
            boards[i] = {
                board: Board.copyBoard(board),
                score: 0
            }
        }

        // creates each possible move
        let counter = 0;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (counter < (9 - round)) {
                    if (boards[counter].board[i][j] === "-") {
                        boards[counter].board[i][j] = turn;
                        counter++;
                    }
                }
            }
        }

        // evaluates each possible move
        for (let tmpBoard of boards) {
            // checks if won
            const tmp = this.checkForWin(tmpBoard.board);
            if (tmp.win) {
                if (tmp.winner === this.ai) {
                    tmpBoard.score = 100;
                }
                else if (tmp.winner === this.player) {
                    tmpBoard.score = -100;
                }
                else {
                    tmpBoard.score = 10;
                }
            }
            else {
                let storage = null;
                if (turn === this.ai && (round + 1) < 9) {
                    storage = this.minMax(tmpBoard.board, (round + 1), this.player);
                    tmpBoard.score = storage.score;
                }
                else if (turn === this.player && (round + 1) < 9) {
                    storage = this.minMax(tmpBoard.board, (round + 1), this.ai);
                    tmpBoard.score = storage.score;
                }
            }
        }

        // TODO: change for minmax (if player or ai)
        // returns (one of) the best move(-s)
        let heighest = 0;
        for (let i = 1; i < boards.length; i++) {
            if (turn === this.player) {
                if (boards[heighest].score > boards[i].score) {
                    heighest = i;
                }
            }
            else if (turn === this.ai) {
                if (boards[heighest].score < boards[i].score) {
                    heighest = i;
                }
            }
        }
        // selects all boards with equal score
        let best = new Array(1);
        counter = 0;
        for (let j = 0; j < boards.length; j++) {
            if (boards[heighest].score === boards[j].score) {
                best[counter] = j;
                counter++;
            }
        }

        // returns one of the best arrays randomly
        let random = Math.floor(Math.random()*best.length);
        let tmp = {
            board: boards[best[random]].board,
            score: boards[best[random]].score
        }
        if (round === 8) {
            console.log();
        }
        return tmp;
    }
    
    // checks if someone has won
    checkForWin(board) {
        // goes through all rows / columns
        let rowWin = 0;
        let columnWin = 0;
        for (let l = 0; l < 3; l++) {
            rowWin = 0;
            columnWin = 0;
            // compares each item in row / column with each other
            for (let i = 0; i < 2; i++) {
                for (let j = i + 1; j < 3; j++) {
                    // rows
                    if (board[l][i] !== "-" && board[l][i] === board[l][j]) {
                        rowWin++;
                    }
                    // columns
                    if (board[i][l] !== "-" && board[i][l] === board[j][l]){
                        columnWin++;
                    }
                }
            }

            // returns won and who won if winner in row
            if (rowWin === 3) {
                let winning = {
                    win: true,
                    winner: board[l][0]
                }
                return winning;
            }

            // returns won and who won if winner in column
            if (columnWin === 3) {
                // dont know yet
                let winning = {
                    win: true,
                    winner: board[0][l]
                }
                return winning;
            }
        }

        // goes through diagonals
        let forwardWin = 0;
        let backwardWin = 0;
        for (let i = 0; i < 2; i++) {
            for (let j = 1; j < 3-i; j++) {
                if (board[1][1] !== "-") {
                    if (board[i][i] === board[i+j][i+j]) {
                        backwardWin++;
                    }
                    // nono good
                    if (board[2-i][i] === board[2-(i+j)][i+j]) {
                        forwardWin++;
                    }
                }
            }
        }

        // returns won and who won if winner in diagonal
        if (forwardWin === 3 || backwardWin === 3) {
            let winning = {
                win: true,
                winner: board[1][1]
            }
            return winning;
        }

        // cecks for draw
        let draw = 0;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === "-") {
                    draw++;
                }
            }
        }

        // returns draw
        if (draw === 0) {
            let winning = {
                win: true,
                winner: ""
            }
            return winning;
        }

        // returns false if no one has won yet
        let winning = {
            win: false,
            winner: ""
        }
        return winning;
    }

    // display where won and banner

    // restart function
    restart() {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                document.getElementById("" + (i + 1) + (j + 1)).src = "";
                document.getElementById("0" + (i + 1) + (j + 1)).style.backgroundColor = "";
                this.board[i][j] = "-";
            }
        }
        this.block = false;
        this.round = 0;
        this.startGame();
    }

    show_win(board, turn) {
        let won = false;
        // goes through all rows / columns
        let row_win = 0;
        let column_win = 0;
        for (let l = 0; l < 3; l++) {
            row_win = 0;
            column_win = 0;
            // compares each item in row / column with each other
            for (let i = 0; i < 2; i++) {
                for (let j = i + 1; j < 3; j++) {
                    // rows
                    if (board[l][i] !== "-" && board[l][i] === board[l][j]) {
                        row_win++;
                    }
                    // columns
                    if (board[i][l] !== "-" && board[i][l] === board[j][l]){
                        column_win++;
                    }
                }
            }
            if (row_win === 3) {
                for (let i = 1; i < 4; i++) {
                    if (turn === this.player) {
                        document.getElementById("0" + (l + 1) + i).style.backgroundColor = "#009600";
                        won = true;
                    }
                    else if (turn === this.ai) {
                        document.getElementById("0" + (l + 1) + i).style.backgroundColor = "#960000";
                        won = true;
                    }
                }
            }
            if (column_win === 3) {
                for (let i = 1; i < 4; i++) {
                    if (turn === this.player) {
                        document.getElementById("0" + i + (l + 1)).style.backgroundColor = "#009600";
                        won = true;
                    }
                    else if (turn === this.ai) {
                        document.getElementById("0" + i + (l + 1)).style.backgroundColor = "#960000";
                        won = true;
                    }
                }
            }
        }

        // goes through diagonals
        let forward_win = 0;
        let backward_win = 0;
        for (let i = 0; i < 2; i++) {
            for (let j = 1; j < 3-i; j++) {
                if (board[1][1] !== "-") {
                    if (board[i][i] === board[i+j][i+j]) {
                        backward_win++;
                    }
                    // nono good
                    if (board[2-i][i] === board[2-(i+j)][i+j]) {
                        forward_win++;
                    }
                }
            }
        }
        if (forward_win === 3) {
            for (let i = 1; i < 4; i++) {
                if (this.turn === this.player) {
                    document.getElementById("0" + (4 - i) + i).style.backgroundColor = "#009600";
                    won = true;
                }
                else if (this.turn === this.ai) {
                    document.getElementById("0" + (4 - i) + i).style.backgroundColor = "#960000";
                    won = true;
                }
            }
        }
        if (backward_win === 3) {
            for (let i = 1; i < 4; i++) {
                if (turn === this.player) {
                    document.getElementById("0" + i + i).style.backgroundColor = "#009600";
                    won = true;
                }
                else if (turn === this.ai) {
                    document.getElementById("0" + i + i).style.backgroundColor = "#960000";
                    won = true;
                }
            }
        }
        // cecks for draw
        let draw = 0;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === "-") {
                    draw++;
                }
            }
        }
        if (draw === 0 && !won) {
            for (let i = 1; i < 4; i++) {
                for (let j = 1; j < 4; j++) {
                    document.getElementById("0" + i + j).style.backgroundColor = "#967600";
                }
            }
        }

    }
}

let board = new Board();
// adds event listeners
document.getElementById("start").addEventListener("click", function () { board.startGame(); });
document.getElementById("011").addEventListener("click", function () { board.position(1, 1); });
document.getElementById("012").addEventListener("click", function () { board.position(1, 2); });
document.getElementById("013").addEventListener("click", function () { board.position(1, 3); });
document.getElementById("021").addEventListener("click", function () { board.position(2, 1); });
document.getElementById("022").addEventListener("click", function () { board.position(2, 2); });
document.getElementById("023").addEventListener("click", function () { board.position(2, 3); });
document.getElementById("031").addEventListener("click", function () { board.position(3, 1); });
document.getElementById("032").addEventListener("click", function () { board.position(3, 2); });
document.getElementById("033").addEventListener("click", function () { board.position(3, 3); });
document.getElementById("restart").addEventListener("click", function () { board.restart(); }); 