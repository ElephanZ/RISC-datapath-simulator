// simulator attributes
var t = 1;
var hasThree = false, validInstruction = false;
var operation = '', operand_f = '', operand_s = '', encoding = 'dec';
var interstage = ['*', '*', '*', '*', '*'], controls = ['*', '*', '*', '*', '*'];


// check if registers are empty
const checkInputValues = () => {
    if (!validInstruction) {
        alert('Invalid instruction selected');
        return false;
    }
    else if (operand_f.trim() === '' || operand_s.trim() === '') {
        alert('Invalid operands: empty value(s)');
        return false;
    }

    if (operand_f.substring(0, 2) === '0x' && operand_s.substring(0, 2) === '0x' && hasThree) {
        if (isHex(operand_f) && isHex(operand_s)) return true;
        alert('Invalid hexadecimal value(s)');
        return false;
    }
    else if (operand_f[0] === '%' && operand_s[0] === '%' && hasThree) {
        if (isBin(operand_f.substring(1)) && isBin(operand_s.substring(1))) return true;
        alert('Invalid binary value(s)');
        return false;
    }
    else {
        if (isDec(operand_f) && isDec(operand_s)) return true;
        alert('Invalid value(s)');
        return false;
    }
};


// numbers encoding methods
const isBin = (value) => {
    return value.search(/^[10]+$/) !== -1;
};
const isDec = (value) => {
    return Number.isInteger(parseInt(value.trim()));
}
const isHex = (value) => {
    return value.search(/^0x[0-9a-fA-F]+$/i) !== -1;
};
const convertRegisters = () => {
    makeNewRow('.interstageRegisters', false);
};
const getDec = (value) => {
    if (value[0] === '%') return parseInt(value.substring(1), 2);
    else if (isHex(value)) return parseInt(value, 16);
    return value;
};


// make new row for each table
const makeNewRow = (_id, flag) => {
    let newRow = '<tr id="values">';
    for (let i = 0; i < 5; i++)
        newRow += '<td>' + (flag ? controls[i] : parseEncoding(interstage[i])) + '</td>';

    $('.container-fluid .row .info ' + _id + ' .table #values').remove();
    $('.container-fluid .row .info ' + _id + ' .table').append(newRow + '</tr>');
};


// interstage registers conversion methods
const parseEncoding = (value) => {
    if (Number.isInteger(parseInt(value)) === false) return value; 
    value = parseInt(value);

    if (encoding === 'dec') return value;
    else if (encoding === 'hex') return '0x' + value.toString(16).toUpperCase();
    else if (value >= 0) return (value >>> 0).toString(2);
    return (Math.pow(2, 8) + value).toString(2);
};


// manage buttons graphics
const resetButtons = (state) => {
    if (state) {
        $('#startBtn').fadeOut();
        $('#stepBack, #stepForward').delay(400).fadeIn();
    }
    else {
        $('#stepBack, #stepForward').fadeOut();
        $('#startBtn').delay(400).fadeIn();
        $('#firstOperand, #secondOperand').val('');
    }

    t = 1;
};


// set operands values
const setOperands = () => {
    if (hasThree) {
        operand_f = getDec($('#firstOperand').val());
        operand_s = getDec($('#secondOperand').val());
    }
    else {
        operand_f = getDec($('#firstOperand').val().split('(')[0]);
        operand_s = getDec($('#firstOperand').val().split('(')[1].slice(0, -1));
    }
};


// instruction select
const stageOne = () => {
    operation = $('#instruction option:selected').text(), validInstruction = false;

    if (operation === 'ADD' || operation === 'SUB' || operation === 'AND' || operation === 'ORR') {
        hasThree = true, validInstruction = true;

        $('#firstOperand').attr('placeholder', 'R1');
        $('#secondOperand').attr('placeholder', 'R2');
        $('.srcInput').css('width', '32.75%');
        $('.srcInput, .stage, .interstageRegisters, .controlSignals').fadeIn();
    }
    else if (operation === 'LDR' || operation === 'STR') {
        hasThree = false, validInstruction = true;

        $('#secondOperand').fadeOut();
        $('#firstOperand').attr('placeholder', 'X(R1)');
        $('.srcInput:not(#secondOperand)').delay(400).animate({'width': '49.5%'}, 'slow');
        $('.stage, .interstageRegisters, .controlSignals').fadeIn();
    }
};


// update datapath drawing
const updateDrawing = () => {
    if (t === 1) $('#dataPathImg').attr('src', 'imgs/default.png');
    else if (operation !== 'LDR' && operation !== 'STR') $('#dataPathImg').attr('src', 'imgs/ADD' + t + '.png');
    else $('#dataPathImg').attr('src', 'imgs/' + operation + t + '.png');
};


// update interstage registers table
const updateRegisters = () => {
    $('.stage').text('Stage: ' + t);

    switch (t) {
        case 0:
        case 1:
        case 2:
            interstage = ['*', '*', '*', '*', '*'];
            break;

        case 3:
            if (hasThree) interstage = [operand_f, operand_s, '*', '*', '*'];
            else interstage = [operand_s, 'R0', '*', '*', '*'];
            break;

        case 4:
            if (operation === 'ADD') interstage = [operand_f, operand_s, parseInt(operand_f) + parseInt(operand_s), operand_s, '*'];
            else if (operation === 'SUB') interstage = [operand_f, operand_s, parseInt(operand_f) - parseInt(operand_s), operand_s, '*'];
            else if (operation === 'AND') interstage = [operand_f, operand_s, parseInt(operand_f) & parseInt(operand_s), operand_s, '*'];
            else if (operation === 'ORR') interstage = [operand_f, operand_s, parseInt(operand_f) | parseInt(operand_s), operand_s, '*'];
            else interstage = [operand_s, 'R0', parseInt(operand_f) + parseInt(operand_s), 'R0', '*'];
            break;

        case 5:
            if (operation === 'ADD') interstage = [operand_f, operand_s, parseInt(operand_f) + parseInt(operand_s), operand_s, parseInt(operand_f) + parseInt(operand_s)];
            else if (operation === 'SUB') interstage = [operand_f, operand_s, parseInt(operand_f) - parseInt(operand_s), operand_s, parseInt(operand_f) - parseInt(operand_s)];
            else if (operation === 'AND') interstage = [operand_f, operand_s, parseInt(operand_f) & parseInt(operand_s), operand_s, parseInt(operand_f) & parseInt(operand_s)];
            else if (operation === 'ORR') interstage = [operand_f, operand_s, parseInt(operand_f) | parseInt(operand_s), operand_s, parseInt(operand_f) | parseInt(operand_s)];
            else if (operation === 'LDR') interstage = [operand_s, 'R0', parseInt(operand_f) + parseInt(operand_s), 'R0', 'MEM_VALUE'];
            else interstage = [operand_s, 'R0', parseInt(operand_f) + parseInt(operand_s), 'R0', '*'];
            break;

        default:
            break;
    }

    convertRegisters();
};


// update control signals table
const updateSignalControls = () => {
    if (operation === 'ADD') controls = ['(0, 1)', '0', '*', '(0, 1, 1)', '(0, 0)'];
    else if (operation === 'SUB') controls = ['(0, 1)', '0', '*', '(1, 0, 0)', '(0, 0)'];
    else if (operation === 'AND') controls = ['(0, 1)', '0', '*', '(1, 1, 0)', '(0, 0)'];
    else if (operation === 'ORR') controls = ['(0, 1)', '0', '*', '(1, 0, 1)', '(0, 0)'];
    else if (operation === 'LDR') controls = ['(0, 1)', '1', '*', '(0, 0, 0)', '(0, 1)'];
    else controls = ['(0, 1)', '1', '*', '(0, 0, 1)', '*'];
    
    controls[2] = (t === 5 && operation !== 'STR' ? '1' : '0'); 

    makeNewRow('.controlSignals', true);
};