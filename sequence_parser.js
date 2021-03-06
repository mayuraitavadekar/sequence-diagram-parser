const fs = require('fs');

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

        var par = new Array();
        var val = new Array();

        for(var i=0;i<messages.length;i++) {
            if(messages[i]._messageSort==="synchCall") {
                //console.log("Parameter : "+messages[i]._name);
                par.push(messages[i]._name);
            }
            if(messages[i]._messageSort==="reply") {
                // console.log("Value : "+messages[i]._name);
                val.push(messages[i]._name);
            }

        }

        // main logic
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
                                            console.log("PARAMETER : "+my_para+" VALUE : "+my_val+"\n");
                                            break;
                                        }
                                        else if(m == messages.length-1)
                                          console.log("PARAMETER : "+my_para+" VALUE : NULL"+"\n")
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

        // check if the diagram has guard conditions in it;

        var flag = 0;

        for(var i=0;i<fragments.length;i++) {

            if(fragments[i].hasOwnProperty('operand')) {
                flag = 1;
            }

        }

        if(flag === 1) {

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
            
            console.log('guard conditions');
            console.log(guard_condition_array);

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

            console.log('json array');
            console.log(guard_condition_data);
            console.table(guard_condition_data);


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
            
            // generating final tables
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

            console.log("**************TWO WAY TEST CASES*****************");
            console.log();
            for(var i=0;i<guard_condition_data.length;i++) {
                for(var j=i+1;j<guard_condition_data.length;j++) {
                    if(guard_condition_data[i].parameter!=guard_condition_data[j].parameter) {
                        console.log(guard_condition_data[i].parameter+guard_condition_data[i].operator+guard_condition_data[i].value+" AND "+guard_condition_data[j].parameter+guard_condition_data[j].operator+guard_condition_data[j].value)
                    }
                }
            }

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
    catch(err) {
        console.log(err);
    }
});
