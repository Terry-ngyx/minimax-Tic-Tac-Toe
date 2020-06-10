const sym_x = 'X';
const sym_o = 'O';
let player = 'X';
let no_of_moves = 0;
let container = document.getElementById('container');
let message = document.getElementById('message');
let box = document.getElementsByClassName('box');
let btn = document.getElementById('button');
let orig_board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const win_cond = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

function get_symbol(player) {
    return (player == sym_o ? sym_x : sym_o);
}

function reset_game() {
    for (i = 0; i < box.length; i++) {
        box[i].innerHTML = '';
    }
    message.innerHTML = '';
    orig_board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    no_of_moves = 0;
    container.onclick = function (event) {
        algorithm(event);
    }
}

function check_win(orig_board, player) {
    for (j = 0; j < 8; j++) {
        let x = win_cond[j][0];
        let y = win_cond[j][1];
        let z = win_cond[j][2];
        if (orig_board[x] && orig_board[y] && orig_board[z] != '') {
            if (orig_board[x] === orig_board[y] && orig_board[z] === orig_board[x]) {
                message.innerHTML = 'Player ' + player + ' won!';
                container.onclick = null;
                return true;
            }
        }
    }
}

function algorithm(event) {
    let box_clicked = event.target;
    no_of_moves++;
    if (box_clicked.innerHTML == '') {
        player = get_symbol(player);
        box_clicked.innerHTML = player;
        let grid_index = parseInt(event.target.id);
        orig_board[grid_index] = player;
        check_win(orig_board, player);
        check_tie();
    }
}

function check_tie() {
    if (empty_squares().length == 0 && !check_win(orig_board, player)) {
        message.innerHTML = "It's a draw"
        return true;
    }
    else {
        return false;
    }
}

function empty_squares() {
    return orig_board.filter(s => typeof s == 'number');
}

function best_spot() {
    return empty_squares()[0];
}

container.onclick = function (event) {
    algorithm(event);
    // let u = empty_squares();
    // console.log(u);
}

btn.onclick = function () {
    reset_game();
}