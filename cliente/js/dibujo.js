//socket io
var socket = io();

socket.on('ingreso', function(counter){
    $(".contador").text(counter);
});

//Variables
var movimientos = new Array();
var presionado;
var context;
var color = "blue";

var crearLienzo = function(){
    var canvasDiv = document.getElementById('tablero');
    canvas = document.createElement('canvas');
    canvas.setAttribute('width',800);
    canvas.setAttribute('height',600);

    canvasDiv.appendChild(canvas);

    context = canvas.getContext("2d");

    $("canvas").mousedown(function(e){
        presionado = true;
        socket.emit('dibujo',[ e.pageX - this.offsetLeft, e.pageY - this.offsetTop, false, getColor()]);
    });

    $("canvas").mousemove(function(e){
        if(presionado){
            socket.emit('dibujo',[e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true, getColor()])
        }
    });

    $("canvas").mouseup(function(e){
        presionado = false;
    });

    $("canvas").mouseleave(function(e){
        presionado = false;
    });
};

var pintar = function(mov){
    movimientos.push(mov);
    context.lineJoin = "round";
    context.lineWidth = 5;
    for(var i = 0; i < movimientos.length; i++){
        context.beginPath();
        context.strokeStyle = movimientos[i][3];
        //si estamos pintando
        if(movimientos[i][2] && i){
            context.moveTo(movimientos[i-1][0], movimientos[i-1][1]);
        }
        else{
            context.moveTo(movimientos[i][0], movimientos[i][1]);
        }
        context.lineTo(movimientos[i][0], movimientos[i][1]);
        context.closePath();
        context.stroke();
    }
}

socket.on('actualiza',function(movimiento){
    pintar(movimiento);
});

function setColor(colorear){
    this.color = colorear;
}

function getColor(){
    return this.color;
}

function descarga(){
    var filename = prompt("Guardar como...","Nombre del archivo");
    link = document.getElementById("download");
    link.href = canvas.toDataURL("image/png");// Extensión .png ("image/png") --- Extension .jpg ("image/jpeg")
    link.download = filename;
};

function clearCanvas() {
	//elimina todo lo del canvas --->
    context.clearRect(0, 0, canvas.width, canvas.height);
    movimientos = new Array();
    socket.emit('borrarDibujo');
};

socket.on('limpiandoCanvas',function(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    movimientos = new Array();
});