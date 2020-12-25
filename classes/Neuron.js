class Neuron {
    /**
     * Конструктор нейрона
     * @param params параметры для инициализации
     * @throws {Error} если объект с параметрами не передан
     */
    constructor(params) {
        if (!params) {
            throw new Error('Параметры не заполнены');
        }

        this._omegas = params.omegas;
        this._trigger_function = params.trigger_function;
        this._derivative_func = params.derivative_of_trigger_func;
        this._eta_value = params.eta_value;
    }


    set current_benchmark(value) {
        this._current_benchmark = value;
    }

    set current_vars(value) {
        this._current_vars = [...value, 1];
    }

    set omegas(value) {
        this._omegas = value;
    }

    get current_benchmark() {
        return this._current_benchmark;
    }

    get current_vars() {
        return this._current_vars;
    }

    get Y_calculated() {
        return this._Y_calculated;
    }

    get omegas() {
        return this._omegas;
    }


    /**
     * Вычисляет значение Y из текущих значений омега и значения переменной X
     * @return {number} значение Y
     */
    calculateY() {
        // Сумма X*W
        this._S = this._current_vars.reduce(
            (accumulator, currentVal, iterator) => accumulator + (currentVal * this._omegas[iterator]),
            0
        );
        // Функция
        this._Y_calculated = this._trigger_function(this._S);
        return this._Y_calculated;
    }

    /**
     * Вычисляет значение сигма выходное для открытого нейрона
     * @return {number}
     */
    getOutputSigma() {
        return this.current_benchmark - this._Y_calculated;
    }

    /**
     * Вычисляет значение сигма
     * @param {number} output_sigma значение сигма выходное
     * @param {number} omega значение омега
     */
    setSelfSigma(output_sigma, omega) {
        this._self_sigma = this._derivative_func(this._S) * output_sigma * omega;
    }

    /**
     * Обновляет значение омега для текущего нейрона
     */
    updateOmegas() {
        this._omegas = this._omegas.map(
            (omega, iterator) => omega + (this._eta_value * this._self_sigma * this._current_vars[iterator])
        );
    }
}