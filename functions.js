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
let i = 0;

function createParams() {
    return {
        vars: [...vars_list[0], 1],
        name: i++,
        omegas: Array.from(
            {length: 4},
            () => Math.random() * 2 - 1,
        ),
        benchmark: window.benchmarks[0],
        trigger_function: window.trigger_function, // constants.js
        derivative_of_trigger_func: window.derivative_of_trigger_func // constants.js
    }
}
if (!window.learn) {
    window.learn = () => {

        function runBackPropagation(hidden_neurons, opened_neuron) {
            let output_delta = opened_neuron
        }

        // массив с 3 скрытыми нейронами
        let hidden_neurons = Array.from(
            {length: 3},
            () => new Neuron(createParams()) // classes/Neuron.js
        );

        // открытый нейрон
        let opened_neutron_params = createParams();
        delete opened_neutron_params.vars;
        let opened_neuron = new Neuron(opened_neutron_params);

        let eras_amount = parseInt(document.querySelector('#eras').innerHTML);
        let hidden_neuron_results, opened_neuron_output;

        for (let i; i < eras_amount; i++) {
            // массив с результатами нейрона
            hidden_neuron_results = hidden_neurons.map(neuron => neuron.calculate());

            // значения открытого нейрона из ответов скрытых нейронов
            opened_neuron.current_vars = [...hidden_neuron_results, 1];
            opened_neuron_output = opened_neuron.calculate();
            runBackPropagation(hidden_neurons, opened_neuron);
        }
    }
}
