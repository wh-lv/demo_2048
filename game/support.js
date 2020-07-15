document_width = window.screen.width;
grid_container_width = 0.92 * document_width;
cell_side_length = 0.18 * document_width;
cell_space = 0.02 * document_width;

function get_pos_left (i, j) {
    return cell_space + j * (cell_side_length + cell_space);
}

function get_pos_top (i, j) {
    return cell_space + i * (cell_side_length + cell_space);
}

function get_number_background_color (number) {
    switch (number) {
        case 2: return '#EEE4DA'; break;
        case 4: return '#EDE0C8'; break;
        case 8: return '#F2B179'; break;
        case 16: return '#F59563'; break;
        case 32: return '#F67C5F'; break;
        case 64: return '#F65E3B'; break;
        case 128: return '#EDCF72'; break;
        case 256: return '#EDCC62'; break;
        case 512: return '#99CC00'; break;
        case 1024: return '#33b5e5'; break;
        case 2048: return '#0099CC'; break;
        case 4096: return '#AA66CC'; break;
        case 8192: return '#9933CC'; break;
    }
}

function get_number_color (number) {
    if (number <= 4) {
        return '#776e65';
    }
    return 'white';
}

function no_space (board) {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (board[i][i] === 0) {
                return false;
            }
        }
    }
    return true;
}

function no_move (board) {
    if (can_move_left(board) || can_move_right(board)) {
        return false;
    }
    return true;
}

function can_move_left (board) {
    for (var i = 0; i < 4; i++) {
        for (var j = 1; j < 4; j++) {
            if (board[i][j] !== 0) {
                if (board[i][j - 1] === 0 || board[i][j - 1] === board[i][j]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function can_move_right (board) {
    for (var i = 0; i < 4; i++) {
        for (var j = 2; j >= 0; j--) {
            if (board[i][j] !== 0) {
                if (board[i][j + 1] === 0 || board[i][j + 1] === board[i][j]){
                    return true;
                }
            }
        }
    }
    return false;
}

function can_move_up (board) {
    for (var j = 0; j < 4; j++) {
        for (var i = 1; i < 4; i++) {
            if (board[i][j] !== 0) {
                if (board[i - 1][j] === 0 || board[i - 1][j] === board[i][j]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function can_move_down(board) {
    for (var j = 0; j < 4; j++) {
        for (var i = 2; i >= 0; i--) {
            if (board[i][j] !== 0) {
                if (board[i + 1][j] === 0 || board[i + 1][j] === board[i][j]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function no_block_horizontal (row, col1, col2, board) {
    for (var i = col1 + 1; i < col2; i++) {
        if (board[row][i] !== 0) {
            return false;
        }
    }
    return true;
}

function no_block_vertical (col, row1, row2, board) {
    for (var i = row1 + 1; i < row2; i++) {
        if (board[i][col] !== 0) {
            return false;
        }
    }
    return true;
}


