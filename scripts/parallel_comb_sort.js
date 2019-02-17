/* 1-step parallel 1-Comb sort starting from j */
/* Returns the number of exchanges done */
function parallel_comb_sort(variables, j) {
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

function sort_even(variables) {parallel_comb_sort(variables, 0)}
function sort_odd(variables) {parallel_comb_sort(variables, 1)}

var minstructions = new Map([
    ["shuffle", shuffle],
    ["sort_even", sort_even],
    ["sort_odd", sort_odd]])

var instructions = /shuffle|sort_even|sort_odd/;
