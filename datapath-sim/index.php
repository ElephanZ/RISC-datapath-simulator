<!DOCTYPE html>
<html lang="it">
	<head>
		<meta charset="utf-8"/>
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
		<meta name="author" content="Antonio Scardace">
        
        <link rel="stylesheet" href="../font-awesome/css/all.css">
        <link rel="stylesheet" href="../css/bootstrap.min.css">
        <link rel="stylesheet" href="css/dp.css?v=<?php echo time(); ?>">

		<link rel="icon" type="image/png" sizes="32x32" href="../imgs/logo.png">
    	<link rel="icon" type="image/png" sizes="16x16" href="../imgs/logo.png">
		<title>Datapath Simulator</title>
    </head>
    <body>
        <div class="intro">
            <h1>DataPath Simulator - Antonio Scardace</h1>
            <h5>University of Catania, Department of Maths and Computer Science</h5>
        </div>
        <div class="container-fluid">
            <div class="row">
                <!-- SX side || datapath drawing -->
                <div class="col-12 col-md-6 cvs">
                    <img src="imgs/default.png" id="dataPathImg"/>
                </div>

                <!-- DX side || input data and log data -->
                <div class="col-12 col-md-6 info">

                    <select id="instruction" class="form-control">
                        <option selected>Choose an instruction</option>
                        <option>ADD</option>
                        <option>SUB</option>
                        <option>AND</option>
                        <option>ORR</option>
                        <option>LDR</option>
                        <option>STR</option>
                    </select><br/>
                    <input type="text" class="form-control srcInput" id="destination" value="R0" readonly>
                    <input type="text" class="form-control srcInput" id="firstOperand" placeholder="...">
                    <input type="text" class="form-control srcInput" id="secondOperand" placeholder="..."><br/>
                    <button class="btn btn-primary" id="startBtn">Let's Start</button>
                    <button class="btn btn-primary" id="stepBack"><i class="fas fa-arrow-left"></i> Step Back</button>
                    <button class="btn btn-primary" id="stepForward">Step Forward <i class="fas fa-arrow-right"></i></button>

                    <h2 class="stage" id="stagePrint">Stage: 1</h2>

                    <div class="interstageRegisters">
                        <p>Interstage Registers values</p>
                        <label class="radio-inline">
                            <input type="radio" name="regEncoding" id="binEnc" value="bin"> Binary
                        </label>
                        <label class="radio-inline">
                            <input type="radio" name="regEncoding" id="hexEnc" value="hex"> Hex
                        </label>
                        <label class="radio-inline">
                            <input type="radio" name="regEncoding" id="decEnc" value="dec" checked> Decimal
                        </label>
                        <table class="table">
                            <tr>
                                <th>RA</th>
                                <th>RB</th>
                                <th>RZ</th>
                                <th>RM</th>
                                <th>RY</th>
                            </tr>
                            <tr id="values">
                                <td>*</td>
                                <td>*</td>
                                <td>*</td>
                                <td>*</td>
                                <td>*</td>
                            </tr>
                        </table>
                    </div>

                    <div class="controlSignals">
                        <p>Control Signals values</p>
                        <table class="table">
                            <tr>
                                <th>C_select</th>
                                <th>B_select</th>
                                <th>RF_write</th>
                                <th>ALU_op</th>
                                <th>Y_select</th>
                            </tr>
                            <tr id="values">
                                <td>(1, 0)</td>
                                <td>*</td>
                                <td>*</td>
                                <td>*</td>
                                <td>*</td>
                            </tr>
                        </table>
                    </div>
            
                </div>
            </div>
        </div>

        <script src="../js/jquery.min.js"></script>
        <script src="../js/bootstrap.min.js"></script>
        <script src="js/dp.js?v=<?php echo time(); ?>"></script>
        <script type="text/javascript">
            
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

        </script>
    </body>
</html>