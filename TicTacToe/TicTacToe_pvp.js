const ai_player = 'X';
const hu_player = 'O';
let player = 'X';
let no_of_moves = 0;
let container = document.getElementById('container');
let message = document.getElementById('message');
let box = document.getElementsByClassName('box');
let btn = document.getElementById('button');
let orig_board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const win_cond = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
let grid_index = 0;
let empty_squares = [];


function get_symbol(player) {
    return (player == hu_player ? ai_player : hu_player);
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
function check_win_sim(orig_board) {
    for (j = 0; j < 8; j++) {
        let x = win_cond[j][0];
        let y = win_cond[j][1];
        let z = win_cond[j][2];
        if (orig_board[x] && orig_board[y] && orig_board[z] != '') {
            if (orig_board[x] === orig_board[y] && orig_board[z] === orig_board[x]) {
                return true;
            }
        }
    }
}


function check_tie() {
    if (check_empty_squares().length == 0 && !check_win(orig_board, player)) {
        message.innerHTML = "It's a draw"
        return true;
    }
    else {
        return false;
    }
}

function algorithm_player(event) {
    let box_clicked = event.target;
    if (box_clicked.innerHTML == '') {
        player = get_symbol(player);
        box_clicked.innerHTML = player;
        grid_index = parseInt(event.target.id);
        orig_board[grid_index] = player;
        check_win(orig_board, player);
        check_tie();
    }
}


function algorithm_ai() {
    // console.log(orig_board)
    player = get_symbol(player);

    grid_index = minimax(orig_board, ai_player).index;
    orig_board[grid_index] = player;

    if (!check_tie()) {
        box[grid_index].innerHTML = player;
    }

    check_win(orig_board, player);
    check_tie();
}

function check_empty_squares() {
    empty_squares = orig_board.filter(s => typeof s === 'number');
    return empty_squares;
}

function minimax(new_board, current_player) {
    let avail_spots = check_empty_squares();

    if (check_win_sim(new_board) && current_player == hu_player) {
        // debugger;
        return { score: 10 };
    }
    else if (check_win_sim(new_board) && current_player == ai_player) {
        // debugger;
        return { score: -10 };
    }
    else if (avail_spots.length === 0) {
        // debugger;
        return { score: 0 };
    }

    let moves_array = []
    for (let i = 0; i < avail_spots.length; i++) {
        let moves_obj = {}

        moves_obj.index = new_board[avail_spots[i]];
        new_board[avail_spots[i]] = current_player;

        if (current_player == hu_player) {
            // debugger;
            let state = minimax(new_board, ai_player);

            // avail_spots = check_empty_squares();
            moves_obj.score = state.score;
        }
        else {
            // debugger;
            let state = minimax(new_board, hu_player);
            // avail_spots = check_empty_squares();
            moves_obj.score = state.score;
        }

        new_board[avail_spots[i]] = moves_obj.index;
        moves_array.push(moves_obj);
    }

    let best_move = 0;
    if (current_player === ai_player) {
        let best_score = -10000;
        for (let i = 0; i < moves_array.length; i++) {
            if (moves_array[i].score > best_score) {
                best_score = moves_array[i].score;
                best_move = i;
            }
        }
    }
    else {
        best_score = 10000;
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
    player = 'X';
    no_of_moves = 0;
    container.onclick = function (event) {
        let box_clicked = event.target;
        if (box_clicked.innerHTML == '') {
            algorithm_player(event);
            algorithm_ai();
        }
    }
}

container.onclick = function (event) {
    let box_clicked = event.target;
    if (box_clicked.innerHTML == '') {
        algorithm_player(event);
        algorithm_ai();
    }
    // let u = check_empty_squares();
    // console.log(u);
}

btn.onclick = function () {
    reset_game();
}

