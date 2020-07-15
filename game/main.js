var board = new Array();
var has_conflicted = new Array();
var score = 0;
var startx = 0, starty = 0, endx = 0, endy = 0;
var success_string = 'Success';
var gameover_string = 'Gameover';

$(document).ready(function() {
    prepare_for_mobile();
    new_game();
});

function new_game () {
    init();
    generate_one_number();
    generate_one_number();
}

function init () {
    for (var i = 0; i < 4; i++) {
        board[i] = new Array();
        has_conflicted[i] = new Array();
        for (var j = 0; j < 4; j++) {
            board[i][j] = 0;
            has_conflicted[i][j] = false;
            var gridCell = $(`#grid_cell_${i}_${j}`);
            gridCell.css({
                left: get_pos_left(i, j),
                top: get_pos_top(i, j)
            })
        }
    }
    update_board_view();
    score = 0;
    update_score(score);
}

function generate_one_number () {
    if (no_space(board)) {
        return false;
    }
    var time = 0;
    var randx = parseInt(Math.floor(Math.random() * 4)),
        randy = parseInt(Math.floor(Math.random() * 4));
    while (time < 50) {
        if (board[randx][randy] === 0) {
            break;
        }
        randx = parseInt(Math.floor(Math.random() * 4));
        randy = parseInt(Math.floor(Math.random() * 4));
        time++;
    }
    if (time >= 50) {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (board[i][j] === 0) {
                    randx = i;
                    randy = j;
                }
            }
        }
    }
    var rand_number = Math.random() < 0.6 ? 2 : 4;
    board[randx][randy] = rand_number;
    show_number_with_animation(randx, randy, rand_number);
    return true;
}

function update_board_view () {
    $('.number_cell').remove();
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            $('#grid_container').append(`<div class="number_cell" id="number_cell_${i}_${j}"></div>`);
            var numberCell = $(`#number_cell_${i}_${j}`);
            if (board[i][j] === 0) {
                numberCell.css({
                    width: 0,
                    height: 0,
                    left: get_pos_left(i, j) + cell_side_length / 2,
                    top: get_pos_top(i, j) + cell_side_length / 2
                })
            } else {
                numberCell.css({
                    width: cell_side_length,
                    height: cell_side_length,
                    left: get_pos_left(i, j),
                    top: get_pos_top(i, j),
                    backgroundColor: get_number_background_color(board[i][j]),
                    color: get_number_color(board[i][j])
                });
                numberCell.text(board[i][j]);
            }
            has_conflicted[i][j] = false;
        }
    }
    $('.number_cell').css('line-height', cell_side_length + 'px');
    $('.number_cell').css('font-size', 0.6 * cell_side_length + 'px');
}

$(document).keydown(event => {
    switch (event.keyCode) {
        case 37: // left
            event.preventDefault();
            if (move_left()) {
                setTimeout('generate_one_number()', 200);
                setTimeout('is_gameover()', 300);
                // generate_one_number();
                // is_gameover();
            }
            break;
        case 38: // up
            event.preventDefault();
            if (move_up()) {
                setTimeout('generate_one_number()', 200);
                setTimeout('is_gameover()', 300);
            }
            break;
        case 39: // right
            event.preventDefault();
            if (move_right()) {
                setTimeout('generate_one_number()', 200);
                setTimeout('is_gameover()', 300);
            }
            break;
        case 40: // down
            event.preventDefault();
            if (move_down()) {
                setTimeout('generate_one_number()', 200);
                setTimeout('is_gameover()', 300);
            }
            break;
    }
});

document.addEventListener('touchstart', event => {
    startx = event.touches[0].pageX;
    starty = event.touches[0].pageY;
});
document.addEventListener('touchmove', event => {
    event.preventDefault();
});
document.addEventListener('touchend', event => {
    endx = event.touches[0].pageX;
    endy = event.touches[0].pageY;

    var deltaX = endx - startx;
    var deltaY = endy - starty;
    if (Math.abs(deltaX) < 0.3 * document_width && Math.abs(deltaY) < 0.3 * document_width) {
        return;
    }
    if ($('#score').text() === gameover_string) {
        new_game();
        return;
    }
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
            if (move_right()) {
                setTimeout('generate_one_number()', 200);
                setTimeout('is_gameover()', 300);
            }
        } else {
            if (move_left()) {
                setTimeout('generate_one_number()', 200);
                setTimeout('is_gameover()', 300);
            }
        }
    } else {
        if (deltaY > 0) {
            if (move_down()) {
                setTimeout('generate_one_number()', 200);
                setTimeout('is_gameover()', 300);
            }
        } else {
            if (move_up()) {
                setTimeout('generate_one_number()', 200);
                setTimeout('is_gameover()', 300);
            }
        }
    }
});

function move_left() {
    if (!can_move_left(board)) {
        return false;
    }
    // move left
    for (var i = 0; i < 4; i++) {
        for (var j = 1; j < 4; j++) {
            if (board[i][j] !== 0) {
                for (var k = 0; k < j; k++) {
                    if (board[i][k] === 0 && no_block_horizontal(i, k, j, board)) {
                        move_with_animation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        break;
                    } else if (board[i][k] === board[i][j] && no_block_horizontal(i, k, j, board) && !has_conflicted[i][k]) {
                        move_with_animation(i, j, i, k);
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        score += board[i][k];
                        update_score(score);
                        has_conflicted[i][k] = true;
                        break;
                    }
                }
            }
        }
    }
    setTimeout('update_board_view()', 200);
    return true;
}

function move_right() {
    if (!can_move_right(board)) {
        return false;
    }
    for (var i = 0; i < 4; i++) {
        for (var j = 2; j >= 0; j--) {
            if (board[i][j] !== 0) {
                for (let k = 3; k > j; k--) {
                    if (board[i][k] === 0 && no_block_horizontal(i, j, k, board)) {
                        move_with_animation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        break;
                    } else if (board[i][k] === board[i][j] && no_block_horizontal(i, j, k, board) && !has_conflicted[i][k]) {
                        move_with_animation(i, j, i, k);
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        score += board[i][k];
                        update_score(score);
                        has_conflicted[i][k] = true;
                        break;
                    }
                }
            }
        }
    }
    setTimeout('update_board_view()', 200);
    return true;
}

function move_up () {
    if (!can_move_up(board)) {
        return false;
    }
    for (var j = 0; j < 4; j++) {
        for (var i = 1; i < 4; i++) {
            if (board[i][j] !== 0) {
                for (var k = 0; k < i; k++) {
                    if (board[k][j] === 0 && no_block_vertical(j, k, i, board)) {
                        move_with_animation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        break;
                    } else if (board[k][j] === board[i][j] && no_block_vertical(j, k, i, board) && !has_conflicted[k][j]) {
                        move_with_animation(i, j, k, j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        score += board[k][j];
                        update_score(score);
                        has_conflicted[k][j] = true;
                        break;
                    }
                }
            }
        }
    }
    setTimeout('update_board_view()', 200);
    return true;
}

function move_down () {
    if (!can_move_down(board)) {
        return false;
    }
    for (var j = 0; j < 4; j++) {
        for (var i = 2; i >= 0; i--) {
            if (board[i][j] !== 0) {
                for (var k = 3; k > i; k--) {
                    if (board[k][j] === 0 && no_block_vertical(j, i, k, board)) {
                        move_with_animation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        break;
                    } else if (board[k][j] === board[i][j] && no_block_vertical(j, i, k, board) && !has_conflicted[k][j]) {
                        move_with_animation(i, j, k, j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        score += board[k][j];
                        update_score(score);
                        has_conflicted[k][j] = true;
                        break;
                    }
                }
            }
        }
    }
    setTimeout('update_board_view()', 200);
    return true;
}

function is_gameover () {
    if (no_space(board) && no_move(board)) {
        gameover();
    }
}

function gameover () {
    update_score(gameover_string);
}

function prepare_for_mobile () {
    if (document_width > 500) {
        grid_container_width = 500;
        cell_side_length = 100;
        cell_space = 20;
    }
    $('#grid_container').css({
        width: grid_container_width - 2 * cell_space,
        height: grid_container_width - 2 * cell_space,
        padding: cell_space,
        borderRadius: 0.02 * grid_container_width
    });
    $('#grid_cell').css({
        width: cell_side_length,
        height: cell_side_length,
        borderRadius: 0.02 * grid_container_width
    })
}
