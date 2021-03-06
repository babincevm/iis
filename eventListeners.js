// логические функции и приоритеты
let operators = {
    'and': {
        priority: 2,
        func: (x, y) => !!(x && y),
    },
    'or': {
        priority: 3,
        func: (x, y) => !!(x || y),
    },
    'xor': {
        priority: 3,
        func: (x, y) => !!(x ^ y),
    },
    'sheffer': {
        priority: 2,
        func: (x, y) => !(x && y),
    },
    'nor': {
        priority: 3,
        func: (x, y) => !(x || y),
    }
}

function startLearning(benchmarks, is_neuron_count_listener_added) {
    let $neuron_count_container = document.querySelector('#neuron-count');
    window.learn(
        parseInt(document.querySelector('#eras').value),
        benchmarks,
        parseFloat(document.querySelector('#eps').value),
        is_neuron_count_listener_added
    );
    $neuron_count_container.classList.remove('hidden');
    let $neuron_count_btn = $neuron_count_container.querySelector('#neuron-count__btn');

    if (!is_neuron_count_listener_added) {
        $neuron_count_btn.addEventListener('click', () => {
            neuronCount($neuron_count_container);
        });
    }
}

function neuronCount($neuron_count_container) {
    let vars = [...$neuron_count_container.querySelectorAll('.neuron-count__inputs input')]
        .map($input => parseInt($input.value));
    $neuron_count_container.querySelector('.neuron-count__result-answer').innerHTML = window.neuron_count(vars);
}

let is_listener_added = false;
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
        benchmarks.push(answer);
        $answer_cell.innerHTML = answer;
    });


    let $start_learning_btn = document.querySelector('#start-learning');

    if (!is_listener_added) {
        is_listener_added = true;
        $start_learning_btn.parentNode.classList.remove('hidden');

        let is_neuron_count_listener_added = false;
        $start_learning_btn.addEventListener('click', function listener() {
            startLearning(window.benchmarks, is_neuron_count_listener_added);
            is_neuron_count_listener_added = true;
        }); // functions.js
    }
});

window.addEventListener('DOMContentLoaded', () => {
    // заполняем селекты доступными операторами
    let $selects = document.querySelectorAll('select[name="equation__var"]');
    let $options = Object.keys(operators).reduce(
        (accumulator, currentVal) =>
            accumulator + `<option value="${currentVal}">${currentVal.toUpperCase()}</option>`
        , "");
    $selects.forEach($select => {
        $select.innerHTML = $options
    });
    initPlotly();
});

async function initPlotly() {
    let trace = {
        x: [],
        y: [],
        type: 'scatter'
    };
    await Plotly.newPlot('graph', [trace]);
}


