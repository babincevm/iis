class Neuron {
    /**
     * Конструктор нейтрона, задает рандомное значение W при инициализации
     */
    constructor(params) {
        if (!params) {
            throw new Error('Параметры не заполнены');
        }

        this._current_vars = params.vars;
        this._current_omegas = params.omegas;
        this._current_benchmark = params.benchmark;
        this._trigger_function = params.trigger_function;
        this.name = params.name;
    }


    set current_benchmark(value) {
        this._current_benchmark = value;
    }

    set current_vars(value) {
        this._current_vars = value;
    }

    set current_omegas(value) {
        this._current_omegas = value;
    }

    get current_benchmark() {
        return this._current_benchmark;
    }

    get current_vars() {
        return this._current_vars;
    }

    get current_omegas() {
        return this._current_omegas;
    }

    calculate() {
        // Сумма X*W

        let S = this._current_vars.reduce(
            (accumulator, currentVal, iterator) => accumulator + (currentVal * this._current_omegas[iterator])
        );
        // Функция
        this._S = this._trigger_function(S);
        console.log(this.name + this._S);
        return this._S;
    }
}