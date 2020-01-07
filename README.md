# Basic Documentation
This is basic documentation related to this repository.


## What is Sequence Diagram Parser?
Sequence Diagram Parser is used to extract the necessary information such as parameters & values, guard conditions, two-way and three-way test cases, etc. from the UML sequence diagram.

## Usage

To use this repository : 

1. Clone/download the folder into your computer by clicking on button [click/download].

2. Open the terminal and type following commands. 

```node.js
~$ cd sequence-diagram-parser
~$ node sequence_parser.js
```

## Software Dependencies

* [node.js](https://nodejs.org/en/) : [ version 12.14.0 LTS ]
* [npm](https://www.npmjs.com/) : [ version 6.13.4 ]  
* [XMI-to-JSON Conversion](https://codebeautify.org/xmltojson/295f85) : Currently using this web app to convert XMI into JSON. But in future, I will try use [xmi2json library](https://www.npmjs.com/package/xml2json) to convert XMI into JSON dynamically through code. 
* [starUML](http://staruml.io/) : [ version 3.2.1 latest ] To draw UML diagrams and generate XMIs of diagrams 🤗
 
