const fs = require('fs');
const process = require('process');
const readline = require('readline-sync');

var par = new Array();
var val = new Array;
var column_number = -1;
var PVMatrix = new Array();
var finalConfig = new Array();


class SequenceDiagramParser {
    
    constructor() {
        // initialise the variables
    }
    
    createPVMatrix = () => {
        for(var i=0;i<finalConfig.length;i++) {
            PVMatrix[i] = new Array();
        }
    }

    fillPVMatrix = (finalConfig) => {
        // console.log(finalConfig);

        let n = readline.questionInt('enter ways of test cases : ');

        if(n === 2) {
            // 2 way test case generation
            let par1 = readline.question('enter par 1 : ');
            let par2 = readline.question('enter par 2 : ');
            let arr1 = new Array();
            let arr2 = new Array();
            
            // searching par1 and par2 in final config
            for(var i=0;i<finalConfig.length;i++) {
                if(finalConfig[i].parameter === par1) {
                    // extract values into arr1
                    arr1 = finalConfig[i].value.split(" or ");
                }

                if(finalConfig[i].parameter === par2) {
                    // exract the values into arr2
                    arr2 = finalConfig[i].value.split(" or ");
                }
            }

            for(var i=0;i<arr1.length;i++) {
                for(var j=0;j<arr2.length;j++) {
                    console.log(par1+" : "+arr1[i]+" "+par2+" : "+arr2[j]);
                }
            }
        }

        if(n === 3) {
            // 3 way test case generation
            let par1 = readline.question('enter par 1 : ');
            let par2 = readline.question('enter par 2 : ');
            let par3 = readline.question('enter par 3 : ');
            let arr1 = new Array();
            let arr2 = new Array();
            let arr3 = new Array();
            
            // searching par1 and par2 in final config
            for(var i=0;i<finalConfig.length;i++) {
                if(finalConfig[i].parameter === par1) {
                    // extract values into arr1
                    arr1 = finalConfig[i].value.split(" or ");
                }

                if(finalConfig[i].parameter === par2) {
                    // exract the values into arr2
                    arr2 = finalConfig[i].value.split(" or ");
                }

                if(finalConfig[i].parameter === par3) {
                    // extract the values into arr3
                    arr3 = finalConfig[i].value.split(" or ");
                }
            }

            for(var i=0;i<arr1.length;i++) {
                for(var j=0;j<arr2.length;j++) {
                    for(var k=0;k<arr3.length;k++) {
                        console.log(par1+" : "+arr1[i]+" "+par2+" : "+arr2[j]+par3+" : "+arr3[k]);
                    }   
                }
            }
        }

        /*
        for(var i=0;i<finalConfig.length;i++) {
            var parameter = finalConfig[i].parameter;
            var values = finalConfig[i].value.split(" or ");
            PVMatrix[0][i] = String(parameter);
            for(var j=1;j<=values.length;j++) {
                PVMatrix[j][i] = String(values[j-1]);
            }
        }

        // print JSON
        //console.table(finalConfig);

        for(var i=0;i<PVMatrix.length;i++) {
            for(var j=0;j<PVMatrix[0].length;j++) {
                if(PVMatrix[i][j] != undefined) {
                    process.stdout.write(PVMatrix[i][j]+" ");
                }
            }
            console.log();
        }
        
        /*
        for(var i=0;i<PVMatrix.length;i++) {
            for(var j=0;j<PVMatrix[0].length;j++) {
                if(PVMatrix[j][i] != undefined) {
                    if(j == 0) 
                    console.log(PVMatrix[j][i]+": ");
                    else
                        console.log(PVMatrix[j][i]+" ");
                }
            }
            console.log();
        }

        for(var i=0;i<PVMatrix.length;i++) {
            for(var j=0;j<PVMatrix[0].length;j++) {
                if(PVMatrix[j][i] != undefined) {
                    if(j == 0) 
                        process.stdout.write(PVMatrix[j][i]+": ");
                    else
                        process.stdout.write(PVMatrix[j][i]+" ");
                }
            }
            console.log();
        }
        console.log("\n\n");
        */
    }

    extractData = (lifelines,messages,fragments) => {
        for(var i=0;i<messages.length;i++) {
            if(messages[i]._messageSort==="synchCall") {
                //console.log("Parameter : "+messages[i]._name);
                messages[i]._name = messages[i]._name.replace(/%20/g," ");
                par.push(messages[i]._name);
            }
            if(messages[i]._messageSort==="reply") {
                // console.log("Value : "+messages[i]._name);
                messages[i]._name = messages[i]._name.replace(/%20/g," ");
                val.push(messages[i]._name);
            }
        }
    }

    paramterValuesMapping = (messages,fragments) => {
        // main logic
        var k = 0;

        for(var i=0;i<par.length;i++) {
            var my_para = par[i]; // take the first parameter

            for(var j=0;j<messages.length;j++) {
                // check to which message name it matches
                if(my_para===messages[j]._name) {
                    // take send event of that message
                    var send_event = messages[j]._sendEvent;
                    //check to which fragment xmi_id that matches
                    for(var k=0;k<fragments.length;k++) {
                        if(send_event===fragments[k]['_xmi:id']) {
                            // take covered of that fragment
                            var covered = fragments[k]._covered;
                            // now search in fragments that where the same covered can be found
                            for(var l=k+1;l<fragments.length;l++) {
                                if(covered===fragments[l]._covered) {
                                    // if the covered is found. then take xmi_id of that covered
                                    var xmi_id = fragments[l]['_xmi:id'];
                                    // match this xmi id to the messages recieve event
                                    for(var m=0;m<messages.length;m++) {
                                        if(xmi_id===messages[m]._receiveEvent) {
                                            // this is value of our parameter
                                            var my_val = messages[m]._name;
                                            // console.log("PARAMETER : "+my_para+" VALUE : "+my_val+"\n");
                                            finalConfig.push({
                                                'parameter' : my_para,
                                                'value' : my_val
                                            });
                                            break;
                                        }
                                        else if(m == messages.length-1) {
                                            //console.log("PARAMETER : "+my_para+" VALUE : NULL"+"\n");
                                            finalConfig.push({
                                                'parameter' : my_para,
                                                'value' : my_val
                                            });
                                        }
                                    }
                                    break;
                                }
                            }
                            break;
                        }
                    }
                }
            }
        }
    }

    checkGuardCondition = (fragments) => {
        // this function checks if the guard conditions are available in the code
        var flag = 0;

        for(var i=0;i<fragments.length;i++) {

            if(fragments[i].hasOwnProperty('operand')) {
                flag = 1;
            }

        }
        return flag;
    }

    extractGuardConditions = (fragments) => {

        // getting gaurd conditions
        var guard_condition_array = new Array();

        for(var i=0;i<fragments.length;i++) {
            if(fragments[i].hasOwnProperty('operand')) {
                // then select that fragment
                var f = fragments[i];
                // take operand array in that fragment
                var operand_array = f['operand'];
                // traverse the operand array
                for(var j=0;j<operand_array.length;j++) {
                    // take each element one by one
                    var condition = operand_array[j]['guard']._specification
                    // save this condition to guard condition array
                    guard_condition_array.push(condition);
                } 
            }
        }
        
        //console.log('guard conditions');
        //console.log(guard_condition_array);

        // creating json array
        var guard_condition_data = [];

        for(var i=0;i<guard_condition_array.length;i++) {
            var condition = guard_condition_array[i];
            if(condition.includes('%3C=')) {
                var split_condition = condition.split('%3C=');
                guard_condition_data.push({
                    'parameter' : split_condition[0],
                    'operator' : '<=',
                    'value' : split_condition[1]
                });
            }

            else if(condition.includes('%3E=')) {
                var split_condition = condition.split('%3E=');
                guard_condition_data.push({
                    'parameter' : split_condition[0],
                    'operator' : '>=',
                    'value' : split_condition[1]
                });
            }

            else if(condition.includes('%3C')) {
                var split_condition = condition.split('%3C');
                guard_condition_data.push({
                    'parameter' : split_condition[0],
                    'operator' : '<',
                    'value' : split_condition[1]
                });
            }

            else if(condition.includes('%3E')) {
                var split_condition = condition.split('%3E');
                guard_condition_data.push({
                    'parameter' : split_condition[0],
                    'operator' : '>',
                    'value' : split_condition[1]
                });
            }

            else if(condition.includes('=')) {
                var split_condition = condition.split('=');
                guard_condition_data.push({
                    'parameter' : split_condition[0],
                    'operator' : '=',
                    'value' : split_condition[1]
                });
            }
        }

        //console.log('json array');
        //console.log(guard_condition_data);
        //console.table(guard_condition_data);


        // now processing created json array to find matrix rows and columns
        
        // finding unique parameter values for columns
        var par_arr = new Array(); 
        var unique_parameters = new Array();

        for(var i=0;i<guard_condition_data.length;i++) {
            par_arr.push(guard_condition_data[i].parameter);
        }

        for(var i=0;i<par_arr.length;i++) {
            if(!unique_parameters.includes(par_arr[i])) {
                unique_parameters.push(par_arr[i]);
            }
        }
        
        // generating final tables of guard condition
        /*
        var table = [];
        console.log('paramters\t\tvalue-1\t\tvalue2');
        for(var i=0;i<unique_parameters.length;i++) {
            process.stdout.write(unique_parameters[i]);
            for(var j=0;j<guard_condition_data.length;j++) {
                if(unique_parameters[i]===guard_condition_data[j].parameter) {
                    process.stdout.write('\t\t'+guard_condition_data[j].operator+guard_condition_data[j].value);
                }
            }
            console.log();
        }
        */

        console.log("**************TWO WAY TEST CASES*****************");
        console.log();
        for(var i=0;i<guard_condition_data.length;i++) {
            for(var j=i+1;j<guard_condition_data.length;j++) {
                if(guard_condition_data[i].parameter!=guard_condition_data[j].parameter) {
                    console.log(guard_condition_data[i].parameter+guard_condition_data[i].operator+guard_condition_data[i].value+" AND "+guard_condition_data[j].parameter+guard_condition_data[j].operator+guard_condition_data[j].value)
                }
            }
        }

        console.log("\n\n")

        console.log("**************THREE WAY TEST CASES*****************");
        console.log();
        for(var i=0;i<guard_condition_data.length;i++) {
            for(var j=i+1;j<guard_condition_data.length;j++) {
                for(var k=j+1;k<guard_condition_data.length;k++) {
                    if(guard_condition_data[i].parameter!=guard_condition_data[j].parameter && guard_condition_data[j].parameter!=guard_condition_data[k].parameter && guard_condition_data[i].parameter!=guard_condition_data[k].parameter) {
                        console.log(guard_condition_data[i].parameter+guard_condition_data[i].operator+guard_condition_data[i].value+" AND "+guard_condition_data[j].parameter+guard_condition_data[j].operator+guard_condition_data[j].value+" AND "+guard_condition_data[k].parameter+guard_condition_data[k].operator+guard_condition_data[k].value);
                    }
                }
            }
        }
    }
}

    // DRIVER CODE

function main() {

    var result;

    fs.readFile('t.json','utf8',function(err,my_file){
        if(err) {
            console.log("error in opening file.");
        }
        try {
            const parser = JSON.parse(my_file);

            //var lifelines = parser['XMI']['Model']['packagedElement']['ownedMember']['lifeline'];
            //var messages = parser['XMI']['Model']['packagedElement']['ownedMember']['message'];
            //var fragments = parser['XMI']['Model']['packagedElement']['ownedMember']['fragment'];

            var lifelines = parser['XMI']['Model']['packagedElement'][1]['ownedMember']['lifeline'];
            var messages = parser['XMI']['Model']['packagedElement'][1]['ownedMember']['message'];
            var fragments = parser['XMI']['Model']['packagedElement'][1]['ownedMember']['fragment'];

            // create object of class
            var obj = new SequenceDiagramParser();

            obj.extractData(lifelines,messages,fragments);

            obj.paramterValuesMapping(messages,fragments);
            
            var flag = obj.checkGuardCondition(fragments);

            if(flag === 1) {
                let choice = readline.question('do you want to see guard conditions : ');
                if(choice === 'y') obj.extractGuardConditions(fragments);
                else console.log('invalid choice');
            }

            else console.log("guard conditions are not available.");

            obj.createPVMatrix();

            obj.fillPVMatrix(finalConfig);
        }
        catch(err) {
            console.log(err);
        }
    });
}

main();
