// функция Y(S)
if (!window.trigger_function) {
    // альфа для степени в экспоненте
    if (!window.alpha) {
        window.alpha = 1
    }
    window.trigger_function = S => 1 / (1 + Math.exp(-(window.alpha) * S));

    if (!window.derivative_of_trigger_func) {
        window.derivative_of_trigger_func = S => {
            let func_value = window.trigger_function(S);
            return func_value * (1 - func_value);
        };
    }
}

// значение эта
if (!window.eta_value) {
    window.eta_value = 0.55;
}


