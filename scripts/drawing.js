/* Drawing and sorting reglettes */

var canvas = document.getElementById("reglettes");
var context = canvas.getContext("2d");

/* Alert messages */
function e_undefined () {alert("La commande n'existe pas");}
function e_intialize () {alert("La création des réglettes doit intervenir à la première ligne de code, et uniquement à cette ligne");}

/* Draw the array of reglettes */
function draw(a, x, y) {
    for (var i=0; i < a.length; i++) {
	context.fillRect(25*i+x, y, 12, -a[i]*10);
	context.fillText(i, 25*i+x+4, y+10);
    }
}

/* Draw the array of reglettes and the instruction */
function draw_instruction(a, todo, x, y) {
    draw(a, x+100, y),
    context.fillText(todo,x,y);
}

/* Swaps elements indexed i and j of an array */
function swap(a, i, j) {
    var tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
    }
    
/* Shuffles array in place */
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
	swap(a, i, j);
    }
}

/* Initialize the array in decrescent order */
function initialize(n) {
    var reg = [];
    for (i=1; i<=n; i++){
	reg.push(n-i+1);
    }
    return reg
}

/* 1-step parallel Comb sort of length 1 starting from j */
/* Returns the number of exchanges done */
function partial_sort(a, j) {
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
    return exch
}


/* Get, Read and evaluate program */
/* Get the content of the code*/


/* List of functions and instructions */
var mfunctions = new Map ([
    ["initialize", initialize]])

function sort_even(reg) {partial_sort(reg, 0)}
function sort_odd(reg) {partial_sort(reg, 1)}

var minstructions = new Map([
    ["shuffle", shuffle],
    ["sort_even", sort_even],
    ["sort_odd", sort_odd]])

var functions = "initialize"
var instructions = /shuffle|sort_even|sort_odd/;

/* Read the code, Parse it an returns a list of lists where each element is either
/* ["f", fct, [argts]]
/* ["i", instruction]
/* ["r", int, [list]] to repeat n times the instructions contained in the list
*/

function codetoinstructions(code){
    /* Take the code and returns the number of instructions
       loops extended and the sequence of instructions */
    /* Puts { and } alone a line code */
    code = code.replace("{","\n{\n");
    code = code.replace("}","\n}\n");
    /* Suppress empty lines */
    code = code.replace(/\n{2,}/,"\n");
    /* Splits the code wrt line breaks */
    codearray = code.split("\n");
    /* Instructions list */
    var listeinstr = [];
    var i = 0; var cpt = 0;
    while (i < codearray.length){
	/* str : contents of the code line */
	var str = codearray[i];
	/* Detects and parse functions with arguments */
	if (str.includes("(")) {
	    var strarray = str.split("(");
	    var f = strarray[0];
	    var argts = (strarray[1].split(")")[0]).split(",");
	    listeinstr.push(["f", f, argts]);
	    cpt++;
	}
	/* Detects and parse instructions */
	else if (str.match(instructions) != null){
	    listeinstr.push(["i", str]);
	    cpt++;
	}
	/* Detects and build loops */
	else if (str.includes("Repeat")) {
	    var num = str.split(" ")[1];
	    /* Detects the number of lines in the loop */
	    var j = i + 1;
	    if (codearray[j] == "{") {
		while (codearray[j] != "}") {
		    j++;
		}
	    }
	    /* Creates the corresponding code string */
	    var codeloop = ((codearray.slice(i+2,j-1)).toString()).replace(/,/g,"\n");
	    /* Recursive code to build the instructions list */
	    instrloop = codetoinstructions(codeloop)[1]
	    listeinstr.push(["r", num, instrloop]);
	    var i = j;
	    cpt = cpt + instrloop.length*num;
	}
	/* If undefined command opens a popup alert */
	else {e_undefined();}
	/* Next line of code */
	i++
    }
    return [cpt, listeinstr];
}

/* Evaluates simple functions and instructions to be contained in loops */
/* Second argument is the array to be modified */
function eval_simple(todo, a) {
    /* The instructions cases */
    if (todo[0] == "i") {
	if (todo[1]=="shuffle") {
	    shuffle(a);}
	else if (todo[1]=="sort_even") {partial_sort(a, 0);}
	else if (todo[1]=="sort_odd") {partial_sort(a, 1);}
    }
    /* The functions cases */
    else if (todo[0] == "f") {
	if (todo[1] == "initialize") {e_initialize()}
    }
}

/* Evaluates the code, given the total code and the array */
function eval(code,reg){
    /* Gets the parsed code and the number of instructions */
    var [lcode, listinstr] = codetoinstructions(code);
    var cpt = 0;
    if (listinstr[0][1] != "initialize") {e_intialize() }
    else {
	for (var i=0; i<listinstr.length;i++) {
	    var todo = listinstr[i]
	    if (todo[0] == "i") {
		minstructions.get(todo[1])(reg);
		draw_instruction(reg,todo[1],0,h*(cpt+0.6));
		cpt++;
	    }
	    else if (todo[0] == "f") {
		if (todo[1] == "initialize") {
		    var number = parseInt(todo[2][0]);
		    var h = 10 * (number + 10);
		    var l = 100;
		    /* Modify canvas size */
		    context.canvas.width = number * 30 + 100;
		    context.canvas.height = 10 * (number + 10) * lcode;
		    /* Creates the array */
		    var reg = initialize(number);
		    draw_instruction(reg, "initialize", 0, h*(cpt+0.6));
		    cpt++;
		}
	    }
	    else if (todo[0] == "r") {
		for (j=0; j<todo[1];j++) {
		for (var k=0; k<todo[2].length;k++) {
		    eval_simple(todo[2][k], reg);
		    draw_instruction(reg, todo[2][k][1], 0, h*(cpt+0.6));
		    cpt++;
}}}}}}

/* Button function to execute the code */
function execute(){
    /* Empty the canvas for further drawings */
    context.clearRect(0,0,canvas.width,canvas.height);
    /* Get the code string */
    var code = document.getElementById("code").value;
    /* Evaluates */
    eval(code,[]);
}
