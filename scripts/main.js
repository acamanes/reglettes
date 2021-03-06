/* Reglettes: creates, shuffle */
/* code : parse, interpret */

/* Global variables */
/* "_canvas" : name of the canvas */
/* "_context" : context of the canvas */
/* "_reg" : name of the tabular */
/* "_gexch" : total number of swaps */
/* "_lexch" : local number of swaps */


/** Reglettes **/

/* Initialize the array in decrescent order */
function initialize(n, variables) {
    /* n : int 
       variables : dictionnary with key "_reg" : array */
    var reg = [];
    for (var i=1; i<=n; i++){
	reg.push(n-i+1);
    }
    variables.set("_reg", reg);
}

/* Shuffles array in place */
function shuffle(variables) {
    /* variables : dictionnary with key "_reg" : array */
    var a = variables.get("_reg");
    for (var i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
	swap(a, i, j);
    }
    variables.set("_lcomp",0);
    variables.set("_lexch",0);
}

/* Swaps elements indexed i and j of an array */
function swap(a, i, j) {
    /* a : array
       i : int, j : int */
    var tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
    }

/** Managing code **/
function codetoarray(code){
    /* Take the code and returns 
       loops extended and the sequence of instructions */
    /* Puts { and } alone a line code */
    var code = code.replace(/\{/g,"\n{\n");
    var code = code.replace("}","\n}\n");
    /* Suppress empty lines */
    var code = code.replace(/\n{2,}/g,"\n");
    /* Suppress case sensitivity */
    var code = code.toLowerCase();
    /* Splits the code wrt line breaks */
    var codearray = code.split("\n");
    return codearray
}
    

/* Read the code, Parse it an returns a list of lists where each element is either
/* ["f", fct, [argts]]
/* ["i", instruction]
/* ["r", int, [list]] to repeat n times the instructions contained in the list
*/
function codetoinstructions(codearray){
    /* Instructions list */
    var listeinstr = [];
    var i = 0;
    while (i < codearray.length) {
	/* str : contents of the code line */
	var str = codearray[i];
	/* Detects and parse functions with arguments */
	if (str.includes("(")) {
	    var strarray = str.split("(");
	    var f = strarray[0];
	    var argts = (strarray[1].split(")")[0]).split(",");
	    listeinstr.push(["f", f, argts]);}
	/* Detects and parse instructions */
	else if (str.match(instructions) != null){
	    listeinstr.push(["i", str]);}
	/* Detects and build loops */
	else if (str.includes("do")) {
	    var num = str.split(" ")[1];
	    /* Detects the number of lines in the loop */
	    var j = i + 2;
	    var stack = 1;
	    while (stack != 0) {
		if (codearray[j].includes("{"))
		{var stack = stack + 1;}
		else {if (codearray[j].includes("}"))
		      {var stack = stack - 1;}}
		j++;}
	    /* Recursive code to build the instructions list */
	    var instrloop = codetoinstructions(codearray.slice(i+2,j-1));
	    listeinstr.push(["r", num, instrloop]);
	    var i = j-1;}
	/* Detects and build conditional loops */
	else if (str.includes("while")) {
	    /* Detects the number of lines in the loop */
	    var j = i + 2;
	    var stack = 1;
	    while (stack != 0) {
		if (codearray[j].includes("{")) {stack++;}
		else if (codearray[j].includes("}")) {stack--;}
		j++;}
	    /* Recursive code to build the instructions list */
	    var instrloop = codetoinstructions(codearray.slice(i+2,j-1));
	    var cond = str.split(" ")[1];
	    console.log(cond);
	    listeinstr.push(["w", cond, instrloop]);
	    var i = j-1;}
	/* If undefined command opens a popup alert */
	else if (str == "" || str == " ") {}
	else {e_undefined();};
	/* Next line of code */
	i++;}
    return listeinstr;
}

/* Evaluates simple functions and instructions to be contained in loops */
// /* Second argument is the array to be modified */
function eval_simple(todo,variables) {
    var a = variables.get("_reg");
    /* The instructions cases */
    if (todo[0] == "i") {
	minstructions.get(todo[1].trim())(variables);
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
    var code_line = 0;
    var codearray = codetoarray(code);
    var listinstr = codetoinstructions(codearray);
    if (listinstr[0][1] != "initialize") {e_intialize()}
    else if (listinstr[0][2] > 100) {e_toolarge();}
    else {
	for (var i=0; i<listinstr.length;i++) {
	    var todo = listinstr[i]
	    /* Only argument of instructions is context */
	    if (todo[0] == "i") {
		minstructions.get(todo[1].trim())(variables);
		var reg = variables.get("_reg");
		drawings.push({"instr":todo[1].trim(),"line":code_line,"reg":reg.slice(),"exch":variables.get("_lexch"),"comp":variables.get("_lcomp"),"split":variables.get("_indices")});
		code_line ++;
	    }
	    /* Functions take arguments and context */
	    else if (todo[0] == "f") {
		mfunctions.get(todo[1].trim())(todo[2],variables);
		    var reg = variables.get("_reg");
		drawings.push({"instr":todo[1].trim(),"line":code_line,"reg":reg.slice(),"exch":variables.get("_lexch"),"comp":variables.get("_lcomp"),"split":variables.get("_indices")});
		code_line++;
	    }
	    /* Loops use previous functions */
	    else if (todo[0] == "r") {
		var code_line = code_line + 2;
		for (var j=0; j<todo[1];j++) {
		    for (var k=0; k<todo[2].length;k++) {
			// eval(todo, variables);
			eval_simple(todo[2][k], variables);
			var reg = variables.get("_reg");
			drawings.push({"instr":todo[2][k][1],"line":code_line,"reg":reg.slice(),"exch":variables.get("_lexch"),"comp":variables.get("_lcomp"),"split":variables.get("_indices")});
			var code_line = code_line+1;
		    }
		    var code_line = code_line - todo[2].length;
		}
		var code_line = code_line + todo[2].length + 1;
	    }
	    /* Conditional loops use previous functions */
	    else if (todo[0] == "w") {
		var code_line = code_line + 2;
		var exch = 1;
		var cpt = 0;
		while (exch != 0) {
		    cpt++;
		    if (cpt == 50) {e_loop();break;}
		    else{
			if (todo[1] == "exists_swap") {var exch = variables.get("_gexch");}
			else {var exch = variables.get("_indices").length;}
		    for (var k=0; k<todo[2].length;k++) {
			// eval(todo, variables);
			eval_simple(todo[2][k], variables);
			var reg = variables.get("_reg");
			drawings.push({"instr":todo[2][k][1],"line":code_line,"reg":reg.slice(),"exch":variables.get("_lexch"),"comp":variables.get("_lcomp"),"split":variables.get("_indices")});
		    	var code_line = code_line+1;
		    }
			var code_line = code_line - todo[2].length;
			if (todo[1] == "exists_swap") {
			    var exch = exch - variables.get("_gexch");}
			else {var exch = exch - variables.get("_indices").length;}
		    }
		}
		var code_line = code_line + todo[2].length + 1;
	    }}}
    return drawings
}

/** Drawing **/
function triangle(x, y, length, context) {
    context.beginPath();
    var height = length * Math.sqrt(3)/2;
    context.moveTo(x, y);
    context.lineTo(x+length, y);
    context.lineTo(x+length/2, y-height);
    context.lineTo(x, y);
    context.closePath();
    context.fill();
}

/* Draw the array of reglettes */
function draw(a, ind, context, x, y) {
    /* a : array
       context : context canvas to draw inside
       x : xshift
       y : yshift */
    var larg = context.canvas.width;
    var larg_reg = larg/(5*a.length);
    var pas = 1/a.length;
    for (var i=0; i < a.length; i++) {
	context.fillStyle="hsl("+Math.round(300*a[i]*pas)+",100%,50%)";
	context.fillRect(2*larg_reg*i+x, y, larg_reg, -a[i]*10);
	context.fillStyle="black";
	/* draw vertical lines if needed */
	if (ind.includes(i)) {context.fillRect(2*larg_reg*(i-0.3)+x, y, 0.1 * larg_reg, -a.length*10);}
	/* Draw triangles and squares */
	if (i % 2 != 0) {
	    context.fillRect(2*larg_reg*i+x,y+10,larg_reg,larg_reg);}
	else {
	    triangle(2*larg_reg*i+x, y+10, larg_reg, context);}
	    // context.fillRect(2*larg_reg*i+x,y+5,larg_reg,larg_reg);}
	// context.fillText(i, 2*larg_reg*(i-0.25)+x+4, y+10);
    }
}

function draw_sep(a, indices, context, x, y) {
    /* a : array
       context : context canvas to draw inside
       x : xshift
       y : yshift */
    var larg = context.canvas.width;
    var larg_reg = larg/(5*a.length);
    var pas = 1/a.length;
    for (var i=0; i < a.length; i++) {
	context.fillStyle="hsl("+Math.round(300*a[i]*pas)+",100%,50%)";
	context.fillRect(2*larg_reg*i+x, y, larg_reg, -a[i]*10);
	context.fillStyle="black";
	if (i % 2 != 0) {
	    context.fillRect(2*larg_reg*i+x,y+10,larg_reg,larg_reg);}
	else {
	    triangle(2*larg_reg*i+x, y+10, larg_reg, context);}
	    // context.fillRect(2*larg_reg*i+x,y+5,larg_reg,larg_reg);}
	// context.fillText(i, 2*larg_reg*(i-0.25)+x+4, y+10);
    }
}


/* Draw the array of reglettes and the instruction */
function draw_instruction(drawings, x, y, context) {
    a = drawings.reg;
    todo = drawings.instr;
    comp = drawings.comp;
    ind = drawings.split;
    /* a : array
       todo : instruction
       exch : number of swaps
       x : xshif, y : yshift, context : canvas to draw inside */
    draw(a, ind, context, x+100, y);
    context.fillText(todo,x,y);
    context.fillText(comp,x,y-10);
}

function print_code (codearray, lines, acontext, xshift=0, yshift=0) {
    for (var j=0;j<codearray.length;j++) {
	if (lines.includes(j)) {acontext.fillStyle="red";}
	acontext.fillText(codearray[j],xshift,yshift+10*j);
	if (lines.includes(j)) {acontext.fillStyle="black";}
    }
}

/** Alert messages **/
function e_undefined () {alert("Je dois pouvoir comprendre toutes les commandes que tu utilises.");}
function e_intialize () {alert("Tu dois commencer ton code en me donnant le nombre de réglettes que tu veux que j'utilise.");}
function e_toolarge () {alert("Tu prévois un peu trop de réglettes. Personnellement, cela ne me pose aucun problème de calcul. Cependant, en tant qu'être humain, tu ne pourras pas bien visualiser ce que je fais.");}
function e_loop () {alert("Visiblement, la boucle while que tu as écrite ne termine pas. Tu dois avoir oublié des instructions nécessaires au tri de la liste.");}

/** Commandes elementaires **/
/* List of functions and instructions */
var mfunctions = new Map ([
    ["initialize", initialize],
]);

var minstructions = new Map([
    ["shuffle", shuffle],
]);

var instructions = /shuffle|/;
