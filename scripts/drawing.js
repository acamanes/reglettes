/* Drawing and sorting reglettes */

/* Global variables */
/* "_canvas" : name of the canvas */
/* "_context" : context of the canvas */
/* "_reg" : name of the tabular */
/* "_gexch" : total number of exchanges */
/* "_lexch" : local number of exchanges */

/* Alert messages */
function e_undefined () {alert("La commande n'existe pas");}
function e_intialize () {alert("La création des réglettes doit intervenir à la première ligne de code, et uniquement à cette ligne");}

/* Draw the array of reglettes */
function draw(a, variables, x, y) {
    var context = variables.get("_context");
    for (var i=0; i < a.length; i++) {
	context.fillRect(25*i+x, y, 12, -a[i]*10);
	context.fillText(i, 25*i+x+4, y+10);
    }
}

/* Draw the array of reglettes and the instruction */
function draw_instruction(a, todo, x, y, variables) {
    var context = variables.get("_context");
    draw(a, variables, x+100, y),
    context.fillText(todo,x,y);
}

/* Swaps elements indexed i and j of an array */
function swap(a, i, j) {
    var tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
    }
    
/* Shuffles array in place */
function shuffle(variables) {
    var a = variables.get("_reg");
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
	swap(a, i, j);
    }
}

/* Initialize the array in decrescent order */
function initialize(n, variables) {
    var reg = [];
    for (i=1; i<=n; i++){
	reg.push(n-i+1);
    }
    variables.set("_reg", reg);
}

/* 1-step parallel Comb sort of length 1 starting from j */
/* Returns the number of exchanges done */
function partial_sort(variables, j) {
    var a = variables.get("_reg");
    variables.set("_lexch", "0");
    var exch = 0;
    var i = j;
    while (i <= a.length - 2)
    {
	if (a[i] > a[i+1])
	{
	    exch++; swap(a, i, i+1);
	}
	i = i + 2;
    }
    var gexch = variables.get("_gexch");
    variables.set("_gexch",gexch+exch);
    variables.set("_lexch",exch);
}


/* Get, Read and evaluate program */
/* Get the content of the code*/


/* List of functions and instructions */
var mfunctions = new Map ([
    ["initialize", initialize]])

function sort_even(variables) {partial_sort(variables, 0)}
function sort_odd(variables) {partial_sort(variables, 1)}

var minstructions = new Map([
    ["shuffle", shuffle],
    ["sort_even", sort_even],
    ["sort_odd", sort_odd]])

// var functions = "initialize"
var instructions = /shuffle|sort_even|sort_odd/;

/* Read the code, Parse it an returns a list of lists where each element is either
/* ["f", fct, [argts]]
/* ["i", instruction]
/* ["r", int, [list]] to repeat n times the instructions contained in the list
*/

function codetoinstructions(code){
    /* Take the code and returns 
       loops extended and the sequence of instructions */
    /* Puts { and } alone a line code */
    code = code.replace("{","\n{\n");
    code = code.replace("}","\n}\n");
    /* Suppress empty lines */
    code = code.replace(/\n{2,}/g,"\n");
    /* Splits the code wrt line breaks */
    codearray = code.split("\n");
    /* Instructions list */
    var listeinstr = [];
    var i = 0;
    while (i < codearray.length){
	/* str : contents of the code line */
	var str = codearray[i];
	/* Detects and parse functions with arguments */
	if (str.includes("(")) {
	    var strarray = str.split("(");
	    var f = strarray[0];
	    var argts = (strarray[1].split(")")[0]).split(",");
	    listeinstr.push(["f", f, argts]);
	}
	/* Detects and parse instructions */
	else if (str.match(instructions) != null){
	    listeinstr.push(["i", str]);
	}
	/* Detects and build loops */
	else if (str.includes("repeat")) {
	    var num = str.split(" ")[1];
	    /* Detects the number of lines in the loop */
	    var j = i + 1;
	    if (codearray[j] == "{") {
		while (codearray[j] != "}") {
		    j++;
		}
	    }
	    /* Creates the corresponding code string */
	    var codeloop = ((codearray.slice(i+2,j)).toString()).replace(/,/g,"\n");
	    /* Recursive code to build the instructions list */
	    instrloop = codetoinstructions(codeloop)
	    listeinstr.push(["r", num, instrloop]);
	    var i = j;
	}
	/* Detects and build conditional loops */
	else if (str.includes("while")) {
	    /* Detects the number of lines in the loop */
	    var j = i + 1;
	    if (codearray[j] == "{") {
		while (codearray[j] != "}") {
		    j++;
		}
	    }
	    /* Creates the corresponding code string */
	    var codeloop = ((codearray.slice(i+2,j)).toString()).replace(/,/g,"\n");
	    /* Recursive code to build the instructions list */
	    instrloop = codetoinstructions(codeloop)
	    listeinstr.push(["w", instrloop]);
	    var i = j;
	}
	/* If undefined command opens a popup alert */
	else if (str == "") {} else {e_undefined();}
	/* Next line of code */
	i++
    }
    return listeinstr;
}

/* Evaluates simple functions and instructions to be contained in loops */
/* Second argument is the array to be modified */
function eval_simple(todo,variables) {
    var a = variables.get("_reg");
    /* The instructions cases */
    if (todo[0] == "i") {
	minstructions.get(todo[1])(variables);
    }
    /* The functions cases */
    else if (todo[0] == "f") {
	if (todo[1] == "initialize") {e_initialize()}
    }
}

/* Evaluates the code, given the total code and the array */
/* Returns the list of modified arrays */
function eval(code, variables){
    /* Gets the parsed code and the number of instructions */
    var drawings = []
    var listinstr = codetoinstructions(code);
    if (listinstr[0][1] != "initialize") {e_intialize() }
    else {
	for (var i=0; i<listinstr.length;i++) {
	    var todo = listinstr[i]
	    /* Only argument of instructions is context */
	    if (todo[0] == "i") {
		minstructions.get(todo[1])(variables);
		var reg = variables.get("_reg");
		drawings.push({"instr":todo[1],"reg":reg.slice()});
	    }
	    /* Functions take arguments and context */
	    else if (todo[0] == "f") {
		mfunctions.get(todo[1])(todo[2],variables);
		    var reg = variables.get("_reg");
		    drawings.push({"instr":todo[1],"reg":reg.slice()});
	    }
	    /* Loops use previous functions */
	    else if (todo[0] == "r") {
		for (j=0; j<todo[1];j++) {
		    for (var k=0; k<todo[2].length;k++) {
			eval_simple(todo[2][k], variables);
			var reg = variables.get("_reg");
			drawings.push({"instr":todo[2][k][1],"reg":reg.slice(),"exch":variables.get("_lexch")});
		    }}}
	    /* Conditional loops use previous functions */
	    else if (todo[0] == "w") {
		var j = 0;
		var exch = 1;
		while (exch != 0) {
		    exch = variables.get("_gexch");
		    for (var k=0; k<todo[1].length;k++) {
			eval_simple(todo[1][k], variables);
			var reg = variables.get("_reg");
			drawings.push({"instr":todo[1][k][1],"reg":reg.slice(),"exch":variables.get("_lexch")});
		    }
		    exch = exch - variables.get("_gexch");
		}
	    }

	}}
    return drawings
}

/* Given the arrays modification history, modifies the canvas and print on it */
function history(drawings, variables) {
    var context = variables.get("_context");
    var reg = variables.get("_reg");
    /* Number of elements */
    var number = (drawings[0].reg).length;
    /* Number of instructions */
    var lcode = drawings.length;
    /* Height of 1 drawing instruction */
    var h = 10 * number + 20;
    /* Modify canvas size */
    context.canvas.width = number * 30 + 100;
    context.canvas.height = (h+100) * lcode;
    for (i=0;i<drawings.length;i++){
	draw_instruction(drawings[i].reg,drawings[i].instr,0,h*(i+1), variables);
	context.fillText(drawings[i].exch,0,h*(i+1)-10);
    }
    context.fillText("Nombre total d'échanges : "+variables.get("_gexch"),0,10);
}

function print (code, variables) {
    drawings = eval(code,variables);
    history(drawings, variables);
}

/* Button function to execute the code */
function execute(){
    var canvas = document.getElementById("reglettes");
    var context = canvas.getContext("2d");
    var variables = new Map ();
    variables.set("_canvas", canvas);
    variables.set("_context",context);
    variables.set("_reg",[]);
    variables.set("_gexch",0);
    variables.set("_lexch",0);
    // var variables = {"_canvast":canvas, "_context":context, "_reg":[], "_gexch":0};
    /* Empty the canvas for further drawings */
    context.clearRect(0,0,canvas.width,canvas.height);
    /* Get the code string */
    var code = document.getElementById("code").value;
    /* Evaluates */
    print(code, variables);
}
