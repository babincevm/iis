// логические функции и приоритеты
let operators = {
    'and': {
        priority: 2,
        func: (x, y) => x && y,
    },
    'or': {
        priority: 3,
        func: (x, y) => x || y,
    },
    'xor': {
        priority: 3,
        func: (x, y) => x ^ y,
    },
}

let $count_btn = document.querySelector('#count_btn');
$count_btn.addEventListener('click', () => {
    window.benchmarks = []; // эталонные ответы

    let $first_operator = document.querySelector('#equation__first-var');
    let $second_operator = document.querySelector('#equation__second-var');
    let $table_rows = document.querySelectorAll('.table__row:not(.table__header)');

    // вычисляем приоритет операции
    let first_var, second_var, first_operator, second_operator;
    if (operators[$first_operator.value].priority <= operators[$second_operator.value].priority) {
        first_operator = $first_operator.value;
        second_operator = $second_operator.value;
        first_var = 0;
        second_var = 2;
    } else {
        first_operator = $second_operator.value;
        second_operator = $first_operator.value;
        first_var = 1;
        second_var = 0;
    }

    // решаем полученное уравнение
    $table_rows.forEach($row => {
        let values = [...$row.querySelectorAll('.table__column:not(.table__column-answer)')]
            .map($var_cell => parseInt($var_cell.innerHTML));
        let $answer_cell = $row.querySelector('.table__column-answer');
        let tmp_answer = operators[first_operator].func(values[first_var], values[first_var + 1]);
        let answer = operators[second_operator].func(values[second_var], tmp_answer);
        window.benchmarks.push(answer);
        $answer_cell.innerHTML = answer;
    });

    let $start_learning_btn = document.querySelector('#start-learning').parentNode;
    $start_learning_btn.classList.remove('hidden');
    $start_learning_btn.addEventListener('click', window.learn); // functions.js
});

window.addEventListener('DOMContentLoaded', () => {
    // заполняем селекты доступными операторами
    let $selects = document.querySelectorAll('select[name="equation__var"]');
    let $options;
    Object.keys(operators).forEach(operator => {
        $options += `<option value="${operator}">${operator.toUpperCase()}</option>`;
    });
    $selects.forEach($select => {
        $select.innerHTML = $options
    });
})




