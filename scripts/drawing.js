/* Drawing and sorting reglettes */

var canvas = document.getElementById("reglettes");
var context = canvas.getContext("2d");

/* Draw the array of reglettes */
function draw(a, y) {
    context.clearRect(0,0,canvas.width,canvas.height);
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
    draw(a,100+j*10);
}

/* Initialize the sorted array */
function initialize(n) {
    var reg = [];
    for (i=1; i<=n; i++){
	reg.push(i);
    }
    shuffle(reg);
    draw(reg, 100);
    return reg
}


/* Get, Read and evaluate program */
/* Get the content of the code*/

function test(){
    var code = document.getElementById("code").value;
    var codearray = code.split('\n');
    for (var i=0;i<codearray.length;i++){
	if (codearray[i] == "initialize"){
	    var reg = initialize(10);
	}
	else if (codearray[i] == "shuffle"){
	    shuffle(reg);
	}
	else if (codearray[i] == "tripair"){
	    partial_sort(reg,0);
	}
	else if (codearray[i] == "triimpair"){
	    partial_sort(reg,1);
	}
    }
}


 
