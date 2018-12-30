/* Drawing and sorting reglettes */

var canvas = document.getElementById("reglettes");
var context = canvas.getContext("2d");

/* Draw the array of reglettes */
function draw(a, y) {
    // context.clearRect(0,0,canvas.width,canvas.height);
    for (var i=0; i < a.length; i++) {
	context.fillRect(25*i, y, 12, -a[i]*10);
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
function partial_sort(a,j) {
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

function parse(str){
    if (str.includes("(")) {
	var strarray = str.split("(");
	var f = strarray[0];
	var argts = (strarray[1].split(")")[0]).split(",");
	return [f, argts];
	}
	else {return [str]};
}



function test(){
    context.clearRect(0,0,canvas.width,canvas.height);
    var code = document.getElementById("code").value;
    var codearray = code.split('\n');
    var i = 0;
    for (var i=0;i<codearray.length;i++){
	var val = parse(codearray[i]);
	if (val[0] == "initialize"){
	    var reg = initialize(parseInt(val[1]));
	    var h = 10 * (parseInt(val[1]) + 10);
	    var l = 25 * parseInt(val[1]) + 10;
	    draw(reg, h*(i+1));
	    context.fillText(codearray[i],l+10 , h*(i+1));
	}
	else if (val[0] == "shuffle"){
	    shuffle(reg);
	    draw(reg, h*(i+1));
	    context.fillText(codearray[i],l+10 , h*(i+1));
	}
	else if (val[0] == "tripair"){
	    partial_sort(reg,0);
	    draw(reg, h*(i+1));
	    context.fillText(codearray[i],l+10 , h*(i+1));
	}
	else if (val[0] == "triimpair"){
	    partial_sort(reg,1);
	    draw(reg, h*(i+1));
	    context.fillText(codearray[i],l+10 , h*(i+1));
	}
    }
}
