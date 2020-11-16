$(document).ready(() => {
    $('#stepBack, #stepForward, .srcInput, .stage, .interstageRegisters, .controlSignals').hide();

    $('#instruction').change(() => {
        stageOne(); 
        resetButtons(false);
        updateSignalControls();
        updateRegisters();
        updateDrawing();
    });
    
    $('#startBtn').on('click', () => {
        if (hasThree) operand_f = $('#firstOperand').val(), operand_s = $('#secondOperand').val();
        else operand_f = $('#firstOperand').val().split('(')[0], operand_s = $('#firstOperand').val().split('(')[1].slice(0, -1);

        if (checkInputValues()) {
            setOperands();
            resetButtons(true);
            ++t;
            updateRegisters();
            updateSignalControls();
            updateDrawing();
        }
    });
    
    $('#stepBack').on('click', () => {
        t -= t > 1 ? 1 : 0; 
        updateRegisters();
        updateSignalControls();
        updateDrawing();
    });
    $('#stepForward').on('click', () => {
        t += t < 5 ? 1 : 0; 
        updateRegisters();
        updateSignalControls();
        updateDrawing();
    });
    
    $('input[type=radio][name="regEncoding"]').change(() => {
        encoding = $('input[type=radio][name="regEncoding"]:checked').val();
        convertRegisters();
    });
});
