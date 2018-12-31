/* Drawing and sorting reglettes */

var canvas = document.getElementById("reglettes");
var context = canvas.getContext("2d");

/* Draw the array of reglettes */
function draw(a, x, y) {
    // context.clearRect(0,0,canvas.width,canvas.height);
    for (var i=0; i < a.length; i++) {
	context.fillRect(25*i+x, y, 12, -a[i]*10);
    }
}

/* Swaps elements indexed i and j of an array*/
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

/* 1-step Comb sort of length 1 starting from j */
function partial_sort(a, j) {
    var i = j;
    while (i <= a.length - 2)
    {
	if (a[i] > a[i+1])
	{
	    swap(a, i, i+1);
	}
	i = i + 2;
    }
}

/* Initialize the sorted array */
function initialize(n) {
    var reg = [];
    for (i=1; i<=n; i++){
	reg.push(n-i+1);
    }
    return reg
}


/* Get, Read and evaluate program */
/* Get the content of the code*/

var functions = "initialize"
var instructions = /shuffle|sort_even|sort_odd/;

function codetoinstructions(code){
    /* Take the code and returns the number of instructions
       loops extended and the sequence of instructions */
    /* Les { et } sont sur une ligne unique */
    code = code.replace("{","\n{\n");
    code = code.replace("}","\n}\n");
    /* Suppression des lignes vides */
    code = code.replace(/\n{2,}/,"\n");
    /* Séparation des lignes */
    codearray = code.split("\n");
    /* Liste d instructions */
    var listeinstr = [];
    var i = 0; var cpt = 0;
    while (i < codearray.length){
	var str = codearray[i];
	/* Fonctions avec argument */
	if (str.includes("(")) {
	    var strarray = str.split("(");
	    var f = strarray[0];
	    var argts = (strarray[1].split(")")[0]).split(",");
	    listeinstr.push(["f", f, argts]);
	    cpt++;
	}
	// Instruction
	else if (str.match(instructions) != null){
	    listeinstr.push(["i", str]);
	    cpt++;
	}
	/* Loop */
	else if (str.includes("Repeat")) {
	    var num = str.split(" ")[1];
	    var j = i + 1;
	    if (codearray[j] == "{") {
		while (codearray[j] != "}") {
		    j++;
		}
	    }
	    var codeloop = ((codearray.slice(i+2,j-1)).toString()).replace(/,/g,"\n");
	    instrloop = codetoinstructions(codeloop)[1]
	    listeinstr.push(["r", num, instrloop]);
	    var i = j;
	    cpt = cpt + instrloop.length*num;
	}
	/* Faute de frappe : Exception */
	i++
    }
    return [cpt, listeinstr];
}

function eval_simple(todo, a) {
	if (todo[0] == "i") {
	    if (todo[1]=="shuffle") {
		shuffle(a);}
	    else if (todo[1]=="sort_even") {partial_sort(a, 0);}
	    else if (todo[1]=="sort_odd") {partial_sort(a, 1);}
	    /* Exception */
	}
	else if (todo[0] == "f") {
	    if (todo[1] == "initialize") {
		var number = parseInt(todo[2][0]);
		var reg = initialize(number);
	    }
	}
}

function eval(code,reg){
    var [l, listinstr] = codetoinstructions(code);
    var cpt = 0;
    for (var i=0; i<listinstr.length;i++) {
	var todo = listinstr[i]
	if (todo[0] == "i") {
	    if (todo[1]=="shuffle")
	    {shuffle(reg);
	     draw(reg,100,h*(cpt+0.6));
	     context.fillText(todo[1],0,h*(cpt+0.6));
	     cpt++;}
	    else if (todo[1]=="sort_even")
	    {partial_sort(reg, 0);
	     draw(reg,100,h*(cpt+0.6));
	     context.fillText(todo[1],0,h*(cpt+0.6));
	     cpt++;}
	    else if (todo[1]=="sort_odd")
	    {partial_sort(reg, 1);
	     draw(reg,100,h*(cpt+0.6));
	     context.fillText(todo[1],0,h*(cpt+0.6));
	     cpt++;}
	    /* Exception */
	}
	else if (todo[0] == "f") {
	    if (todo[1] == "initialize") {
		var number = parseInt(todo[2][0]);
		var h = 10 * (number + 10);
		var l = 100;
		context.canvas.width = number * 30 + 100;
		context.canvas.height = 10 * (number + 10) * l;
		var reg = initialize(number);
		context.fillText("initialize",0,h*(cpt+0.6));
		draw(reg, 100, h*(cpt+0.6));
		cpt++;
	    }
	}
	else if (todo[0] == "r") {
	    for (j=0; j<todo[1];j++) {
		for (var k=0; k<todo[2].length;k++) {
		    eval_simple(todo[2][k], reg);
		    context.fillText(todo[2][k],0,h*(cpt+0.6));
		    draw(reg, 100, h*(cpt+0.6));
		    cpt++;
		}
	    }
	}
    }
}

function execute(){
    context.clearRect(0,0,canvas.width,canvas.height);
    var code = document.getElementById("code").value;
    eval(code,[]);
}
