/* Given the arrays modification history, modifies the canvas and print on it */
function history(drawings, variables) {
    var context = variables.get("_context");
    var acontext = variables.get("_contextanimation");
    var reg = variables.get("_reg");
    /* Number of elements */
    var number = (drawings[0].reg).length;
    /* Number of instructions */
    var lcode = drawings.length;
    /* Height of 1 drawing instruction */
    var h = 10 * number + 20;
    for (i=0;i<drawings.length;i++){
	draw_instruction(drawings[i].reg,drawings[i].instr,drawings[i].exch,0,h*(i+1), context);
    }
    context.fillText("Nombre total d'échanges : "+variables.get("_gexch"),0,10);
}

function print (code, variables) {
    var acanvas = document.getElementById("animation");
    var acontext = acanvas.getContext("2d");
    var context = variables.get("_context");
    drawings = eval(code,variables);
    var number = (drawings[0].reg).length;
    var h = 10 * number + 20;
    var lcode = drawings.length;
    /* Modify canvas size */
    acontext.canvas.width = number * 30 + 100;
    acontext.canvas.height = number * 10+60 + 500;
    context.canvas.width = number * 30 + 100;
    context.canvas.height = (h+100) * lcode;
    /* Global variables */
    window.drawings = drawings;
    window.position = 0;
    var a = drawings[0];
    // acontext.clearRect(0,0,acanvas.width,acanvas.height);
    draw_instruction(a.reg,a.instr,a.exch,0,10*number+50, acontext);
        /* Get the code string */
    var code = document.getElementById("code").value;
    var codearray = codetoarray(code);
    for (var j=0;j<codearray.length;j++) {
	acontext.fillText(codearray[j],0,10*number+100+10*j);
    }
    // draw(a,acontext,100,10*number);
    history(drawings, variables);
    var acanvas = document.getElementById("animation");
    var acontext = acanvas.getContext("2d");
}

/* Button function to execute the code */
function execute (){
    var canvas = document.getElementById("reglettes");
    var context = canvas.getContext("2d");
    var canvas_animation = document.getElementById("animation");
    var context_animation = canvas_animation.getContext("2d");
    var variables = new Map ();
    variables.set("_canvas", canvas);
    variables.set("_context",context);
    variables.set("_canvasanimation", animation);
    variables.set("_contextanimation",context_animation);
    variables.set("_reg",[]);
    variables.set("_gexch",0);
    variables.set("_lexch",0);
    /* Empty the canvas for further drawings */
    context.clearRect(0,0,canvas.width,canvas.height);
    context_animation.clearRect(0,0,canvas_animation.width,canvas_animation.height);
    /* Get the code string */
    var code = document.getElementById("code").value;
    /* Evaluates */
    print(code, variables);
}

/** Animation **/
/* one step back animation */
function back () {
    var acanvas = document.getElementById("animation");
    var acontext = acanvas.getContext("2d");
    var number = (drawings[0].reg).length;
    if (position == 0) {alert("Début atteint")}
    else
    {var a = drawings[position-1];
     acontext.clearRect(0,0,acanvas.width,acanvas.height);
    draw_instruction(a.reg,a.instr,a.exch,0,10*number+50, acontext);
     window.position = window.position-1;}
}

function fwd () {
    var acanvas = document.getElementById("animation");
    var acontext = acanvas.getContext("2d");
    var number = (drawings[0].reg).length;
    if (position == drawings.length-1) {alert("Fin atteinte")}
    else
    {var a = drawings[position+1];
     acontext.clearRect(0,0,acanvas.width,acanvas.height);
     draw_instruction(a.reg,a.instr,a.exch,0,10*number+50, acontext);
     window.position = window.position+1;}
}


function animation () {
    var acanvas = document.getElementById("animation");
    var acontext = acanvas.getContext("2d");
    reganimate(drawings, acanvas, acontext);
    window.position = drawings.length-1;
}

function reganimate (drawings, acanvas, acontext){
    /* */
    var i = 0;
    var max = drawings.length;
    var id = setInterval(frame,1000);
    var number = (drawings[0].reg).length;
    var pas = 1/number;
    /* Get the code string */
    var code = document.getElementById("code").value;
    var codearray = codetoarray(code);
    for (var j=0;j<codearray.length;j++) {
	if (j == 0) {acontext.fillStyle="red";}
	acontext.fillText(codearray[j],0,10*number+100+10*j);
	acontext.fillStyle="black";
    }
    function frame () {
	if (i==max-1) {clearInterval(id)}
	else {i++;
	      acontext.clearRect(0,0,acanvas.width,acanvas.height);
	      var a = drawings[i];
	      for (var j=0;j<codearray.length;j++) {
		  if (j == a.line) {acontext.fillStyle="red";}
		  acontext.fillText(codearray[j],0,10*number+100+10*j);
		  acontext.fillStyle="black";
		  
	      }
	      draw_instruction(a.reg,a.instr,a.exch,0,10*number+50, acontext);
	     }
    }
}
