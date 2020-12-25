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

if (!window.learn) {
    window.learn = (eras_amount, benchmarks) => {
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

        // массив с 3 скрытыми нейронами
        let hidden_neurons = Array.from(
            {length: 3},
            () => new Neuron(createParams()) // classes/Neuron.js
        );

        // открытый нейрон
        let opened_neuron = new Neuron(createParams());

        let hidden_neuron_results, opened_neuron_output;

        for (let i = 0; i < eras_amount; i++) {
            vars_list.forEach((vars, iterator) => {
                // массив с результатами скрытых нейронов
                hidden_neuron_results = hidden_neurons.map((neuron) => {
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
        }

        // для вычисления ответа обученным нейроном
        if (!window.neuron_count) {
            /**
             * Вычисляет значение уравнения для переданных параметров
             * @param vars {Array.<number>} значения X для уравнения
             * @return {number} ответ нейросети для переданных параметров
             */
            window.neuron_count = (vars) => {
                opened_neuron.current_vars = hidden_neurons.map(neuron => {
                    neuron.current_vars = vars;
                    return  neuron.calculateY();
                });

                return opened_neuron.calculateY();
            }
        }
    }
}


