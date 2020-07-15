
function show_number_with_animation (i, j, number) {
    var number_cell = $(`#number_cell_${i}_${j}`);
    number_cell.css({
        backgroundColor: get_number_background_color(number),
        color: get_number_color(number)
    });
    number_cell.text(number);
    number_cell.animate({
        width: cell_side_length,
        height: cell_side_length,
        left: get_pos_left(i, j),
        top: get_pos_top(i, j)
    }, 50)
}

function move_with_animation (fromX, fromY, toX, toY) {
    var number_cell = $(`#number_cell_${fromX}_${fromY}`);
    number_cell.animate({
        left: get_pos_left(toX, toY),
        top: get_pos_top(toX, toY)
    }, 200);
}

function update_score (score) {
    $('#score').text(score);
}
