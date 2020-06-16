var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io').listen(http);

app.use('/cliente',express.static(__dirname + '/cliente'));

app.set('views',__dirname + '/views');
app.set('view engine','jade');

//Socket io
var contador = 0;
var dibujos = new Array(); //usado para guardar el histórico de dibujos.
var index = 0;

io.on('connection',function(socket){
    contador++;
    io.emit('ingreso', contador);

    if(index != 0){
        for(var i = 0; i < index; i++){
            io.emit('actualiza',dibujos[i])
        };
    };

    socket.on('dibujo',function(movimientos){
        dibujos[index] = movimientos;
        index++;
        io.emit('actualiza', movimientos);
    });
    socket.on('borrarDibujo',function(){
        index = 0;
        dibujos = new Array();
        io.emit('limpiandoCanvas');
    })

    socket.on('disconnect',function(socket){
        contador--;
        io.emit('ingreso', contador);
    });
});

app.get('/', function (req, res) {
    res.render('home',{message: 'Bienvenid@ a la pizarra para pintar'});
});

http.listen(3000,function(){
    console.log('Servidor escuchando por el puerto :3000')
});
