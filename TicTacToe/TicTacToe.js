const ai_player = 'X';
const hu_player = 'O';
let player = 'X';
let no_of_moves = 0;
let empty_squares = [];
let container = document.getElementById('container');
let message = document.getElementById('message');
let box = document.getElementsByClassName('box');
let btn = document.getElementById('button');
let orig_board = [];
const win_cond = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];


let best_move = 0;

function get_symbol(player) {
    if (player == hu_player){
        return (ai_player);
    }
    else {
        return (hu_player);
    }
}

function check_win(orig_board, player) {
    for (j = 0; j < 8; j++) {
        let x = win_cond[j][0];
        let y = win_cond[j][1];
        let z = win_cond[j][2];
        if (orig_board[x] && orig_board[y] && orig_board[z] !== '') {
            if (orig_board[x] === orig_board[y] && orig_board[z] === orig_board[x]) {
                message.innerHTML = 'Player ' + player + ' won!';
                console.log (orig_board[x]);
                console.log (win_cond[j]);
                container.onclick = null;
                return true;
            }
        }
    }
}

function put_move (board_index, player) {
    if (typeof orig_board[board_index] == 'number'){
    orig_board[board_index] = player;
    document.getElementById(board_index).innerHTML = player;
    return (orig_board[board_index]);
    }
}

// function algorithm(event) {
//     let box_clicked = event.target;
//     no_of_moves++;
//     if (box_clicked.innerHTML == '') {
//         player = get_symbol(player);
//         box_clicked.innerHTML = player;
//         let grid_index = parseInt(event.target.id);
//         orig_board[grid_index] = player;
//         check_win(orig_board, player);
//         check_tie();
//     }
// }

function check_tie() {
    if (check_empty_squares().length == 0 && !check_win(orig_board, player)) {
        message.innerHTML = "It's a draw"
        return true;
    }
    else {
        return false;
    }
}

function check_empty_squares() {
    empty_squares = orig_board.filter(s => typeof s == 'number');
    return empty_squares;
}

function best_spot() {
    return minimax(orig_board, ai_player).index;
}

function minimax(new_board, player) {
    let avail_spots = check_empty_squares();

    if (check_win(new_board, hu_player)) {
        return ({ score: -10 });
    }
    else if (check_win(new_board, ai_player)) {
        return ({ score: 10 });
    }
    else if (avail_spots == 0) {
        return ({ score: 0 })
    }

    let moves_array = [];
    for (let i = 0; i < avail_spots.length; i++) {
        let moves_obj = {}

        moves_obj.index = avail_spots[i];
        new_board[avail_spots[i]] = player;

        if (player == ai_player) {
            let state_score = minimax(new_board, hu_player);
            moves_obj.score = state_score;
        }
        else if (player == hu_player) {
            let state_score = minimax(new_board, ai_player);
            moves_obj.score = state_score;
        }
        new_board[avail_spots[i]] = moves_obj.index;

        moves_array.push(moves_obj);
    }

    if (player === ai_player) {
        let best_score = -12345;
        for (let i; i < moves_array.length; i++) {
            if (moves_array[i].score > best_score) {
                best_score = moves_array[i].score;
                best_move = i;
            }
        }
    }
    else {
        best_score = 12345;
        for (let i = 0; i < moves_array.length; i++) {
            if (moves_array[i].score < best_score) {
                best_score = moves_array[i].score;
                best_move = i;
            }
        }
    }

    return moves_array[best_move];
}

function reset_game() {
    for (i = 0; i < box.length; i++) {
        box[i].innerHTML = '';
    }
    message.innerHTML = '';
    orig_board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    no_of_moves = 0;
    start_player = 'X';
    container.onclick = function (event) {
        put_move (event.target.id , hu_player);
        if (!check_win(orig_board, hu_player)&& !check_tie()){
            put_move(best_spot (), ai_player);
        } 
        let u = check_empty_squares();
        console.log(u);
    }
}
let start_player = 'X';


container.onclick = function (event) {
    let player = get_symbol (start_player);
    orig_board = put_move (event.target.id , hu_player);
    if (!check_win(orig_board, hu_player)&& !check_tie()){
       orig_board = put_move(best_spot (), ai_player);
    }
    check_win (orig_board, player); 
}

btn.onclick = function () {
    reset_game();
}

