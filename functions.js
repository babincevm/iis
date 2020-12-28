let vars_list = [
    [0, 0, 0],
    [0, 0, 1],
    [0, 1, 0],
    [0, 1, 1],
    [1, 0, 0],
    [1, 0, 1],
    [1, 1, 0],
    [1, 1, 1],
];

/**
 * Очистка графика
 * @returns {Promise<void>}
 */
async function reloadPlotty() {
    Plotly.deleteTraces('graph', 0);
    let trace = {
        x: [],
        y: [],
        type: 'scatter'
    };
    await Plotly.addTraces('graph', [trace]);
}

/**
 * Начальные параметры для инициализации нейронов
 * @returns {{trigger_function: (function(*): *), eta_value: number, derivative_of_trigger_func: (function(*=): *), omegas: unknown[]}}
 */
function createParams() {
    return {
        omegas: Array.from(
            {length: 4},
            () => Math.random() * 2 - 1,
        ),
        trigger_function: window.trigger_function, // constants.js
        derivative_of_trigger_func: window.derivative_of_trigger_func, // constants.js
        eta_value: window.eta_value, // constants.js
    }
}

/**
 * Функция обратного хода нейронов
 * @param hidden_neurons
 * @param opened_neuron
 */
function runBackPropagation(hidden_neurons, opened_neuron) {
    let output_sigma = opened_neuron.getOutputSigma(); // вычисляем сигму от выходного сигнала

    // берем значение омеги из открытого нейрона
    let open_neuron_omegas = opened_neuron.omegas;

    // сигма для открытого нейрона
    opened_neuron.setSelfSigma(output_sigma, 1);

    // вычисляем сигму для каждого скрытого нейрона и обновляем значение омега
    hidden_neurons.forEach((neuron, iterator) => {
        neuron.setSelfSigma(output_sigma, open_neuron_omegas[iterator]);
        neuron.updateOmegas();
    });

    // обновляем значения омега для открытого нейрона
    opened_neuron.updateOmegas();
}

/**
 * Отрисовка графика + вычисление ошибки
 * @param hidden_neurons
 * @param opened_neuron
 * @param benchmarks
 * @param step_number
 */
function afterEra(hidden_neurons, opened_neuron, benchmarks, step_number) {
    E = vars_list.reduce((accumulator, vars, iterator) => {
        opened_neuron.current_vars = hidden_neurons.map(neuron => {
            neuron.current_vars = vars;
            return neuron.calculateY();
        });
        opened_neuron.current_benchmark = benchmarks[iterator];
        return accumulator + opened_neuron.getSquaredError();
    }, 0);

    addGraphPoint(step_number, E * 100);
    return E;

}

/**
 * Прорисовка графика. Вставляется в стек вызовов для плавного отрисовывания
 * @param x
 * @param y
 */
function addGraphPoint(x, y) {
    setTimeout(() => {
        Plotly.extendTraces('graph', {
            x: [[x]],
            y: [[y]]
        }, [0]);
    }, 0);
}


if (!window.learn) {
    /**
     * Обучение нейросети
     * @param eras_amount Количество эпох
     * @param benchmarks Эталонные значения
     * @param eps Значение EPS для ошибок
     * @param is_repeat при повторном нажатии очистить график
     */
    window.learn = (eras_amount, benchmarks, eps, is_repeat) => {
        // при повторном нажатии на кнопку начать обучение зануляем нейроны
        if (is_repeat) {
            reloadPlotty()
        }

        // массив с 3 скрытыми нейронами
        let hidden_neurons = Array.from(
            {length: 3},
            () => new Neuron(createParams()) // classes/Neuron.js
        );

        // открытый нейрон
        let opened_neuron = new Neuron(createParams());

        let hidden_neuron_results, opened_neuron_output;
        let E = Number.MAX_VALUE;
        for (let i = 0; i < eras_amount && E > eps; i++) {
            vars_list.forEach((vars, iterator) => {
                // массив с результатами скрытых нейронов
                hidden_neuron_results = hidden_neurons.map(neuron => {
                    neuron.current_vars = vars;
                    neuron.current_benchmark = benchmarks[iterator];
                    return neuron.calculateY();
                });

                // значения открытого нейрона из ответов скрытых нейронов
                opened_neuron.current_vars = hidden_neuron_results;
                opened_neuron.current_benchmark = benchmarks[iterator];
                opened_neuron_output = opened_neuron.calculateY();
                runBackPropagation(hidden_neurons, opened_neuron);
            });
            E = afterEra(hidden_neurons, opened_neuron, benchmarks, i);
        }

        /**
         * Вычисляет значение уравнения для переданных параметров
         * @param vars {Array.<number>} значения X для уравнения
         * @return {number} ответ нейросети для переданных параметров
         */
        window.neuron_count = (vars) => {
            opened_neuron.current_vars = hidden_neurons.map(neuron => {
                neuron.current_vars = vars;
                return neuron.calculateY();
            });

            return opened_neuron.calculateY();
        }

    }
}


