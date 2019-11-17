const fs = require('fs');

fs.readFile('sample.json','utf8',function(err,my_file){
    if(err) {
        console.log("error in opening file.");
    }
    try {
        const parser = JSON.parse(my_file);
        
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
                // check to which message name it maches
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
        
        /*console.log("\t\t LIFELINES");
        console.log(lifelines);
        console.log("\n\n");
        console.log("\t\t MESSAGES");
        console.log(messages);
        console.log("\n\n");
        console.log("\t\t FRAGMENTS");
        console.log(fragments);
        */

       /*for(var i=0;i<fragments.length;i++) {
        console.log("xmi_id : "+messages[i]._sendEvent);
        console.log("covered : "+fragments[i]['_covered']);
    }*/
        /*var i=0;
        while(i<13) {
            
           console.log(messages[i]._receiveEvent+" "+fragments[i]["_xmi:id"]);
            if(fragments[i]['_xmi:id']===messages[i]._receiveEvent) {
                console.log("value : "+messages[i]._name);
            }
            i++;
        }
        */

        /*for(var i=0;i<fragments.length;i++) {
            var c1 = fragments[i]._covered;
            var xmi_id = fragments[i]['_xmi:id'];
            for(var j=0;j<messages.length;j++) {
                if()
            }
            if(fragments[i]['_xmi:id']===messages[i]._sendEvent) {
                console.log("Parameter : "+messages[i]._name);
                for(var j=i+1;j<fragments.length;j++) {
                    if(c1===fragments[j]._covered) {
                        id = fragments[j]['_xmi:id'];
                        for(var k=0;k<messages.length;k++) {
                            if(id===messages[k]._receiveEvent) {
                                console.log("Value : "+messages[k]._name);
                                break;
                            }
                        }
                        break;
            
                    }
                }
            }
            
            
        }
        */
        /*
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

        for(var i=0;i<par.length;i++) {
            console.log("Parameters : "+(i+1)+"."+par[i]);
        }
        console.log("\n");
        for(var i=0;i<val.length;i++) {
            console.log("Values : "+(i+1)+"."+val[i]);
        }
        */
        //console.log(parser['XMI']['Model']['packagedElement'][1]['ownedMember']);



    }
    catch(err) {
        console.log(err);
    }
});
