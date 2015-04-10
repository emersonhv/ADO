var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.getElementById('scan').addEventListener('click', this.scan, false);
        document.getElementById('enviarAsistenciaBtn').addEventListener('click', this.enviarAsistencia, false);
        document.getElementById('guardarEstudianteBtn').addEventListener('click', this.guardarEstudiante, false);
        document.getElementById('reset').addEventListener('click', this.borrarFormulario, false);
        document.getElementById('listarAsistenciaBtn').addEventListener('click', this.asistenciahoy, false);
        document.getElementById('listarEstudiantesLink').addEventListener('click', this.listarEstudiantes, false);
        document.getElementById('botonInfo').addEventListener('click', this.verinfo, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    
    borrarFormulario:function(){
        $("#id").val("");
        $("#nombre").val("");
        $("#apellidos").val("");
        $("#lideres").val("");
        $("#dia").val("");
    },

    guardarEstudiante:function(){
        if($("#id").val()=="") {
            var nombre = $("#nombre").val();
            var apellidos = $("#apellidos").val();
            var lideres = $("#lideres").val();
            var dia = $("#dia").val();
            var post = "nombre="+nombre+"&apellidos="+apellidos+"&dia="+dia+"&lideres="+lideres;
            $.ajax({
                type:'POST',
                url:'http://ado.applublish.hol.es/estudiante',
                data:post,
                cache:false,
                dataType:'json',
                success:function(result,status,jqXHR){
                    alert(result.mensaje);
                    if(result.estado == true) {
                        borrarFormulario();
                    }
                }
            });
        } else {
            alert("Borre el formulario");
        }
    },

    asistenciahoy:function(){
        var fecha = $("#fecha").val();
        $.ajax({
            type:'GET',
            url:'http://ado.applublish.hol.es/asistencia/'+$("#id").val()+"/"+fecha,
            cache:false,
            dataType:'json',
            success:function(result,status,jqXHR){
                if(result.length == 0) {
                    enviarAsistencia(fecha);
                } else {
                    alert("Estudiante ya tiene asistencia de hoy.");
                }
                borrarFormulario();
            }
        });
    },

    enviarAsistencia:function(fecha){
        if($("#id").val()!="") {
            var id_estudinte = $("#id").val();
            var nombre_clases = $("#clases").val();
            var carnet = $("#carnet").val();
            var bimestre = $("#bimestre").val();
            var fecha = $("#fecha_asistencia").val();
            var post = "id_estudiante="+id_estudinte+"&nombre_clases="+nombre_clases+"&carnet="+carnet+"&fecha="+fecha+"&bimestre="+bimestre;
            $.ajax({
                type:'POST',
                url:'http://ado.applublish.hol.es/asistencia',
                data:post,
                cache:false,
                dataType:'json',
                success:function(result,status,jqXHR){
                    alert(result.mensaje);
                }
            });
        } else {
            alert("Consulte un estudiante!");
        }
    },

    listarAsistencia:function(){
        var fecha = $("#fecha_asistencia").val();//fecha_asistencia
        if(fecha != ""){
            try {
                $.ajax({
                    type:'GET',
                    url:'http://ado.applublish.hol.es/asistencia/'+fecha,
                    cache:false,
                    dataType:'json',
                    success:function(result,status,jqXHR){
                        var htmlStudent='';
                        $('#listaEstudiantes').empty();
                        for (var i = 0; i < result.length; i++) {
                            var p = result[i];
                            htmlStudent= "<li><a href='#' id='"+p.id+"'>"+
                            "<h2>"+p.nombre + " " + p.apellidos+"</h2>"+
                            "<p>Fecha: "+p.fecha+ "</p> <p>Clases: "+p.nombre_clases+"</p> </a> </li>";
                            $('#listaEstudiantes').append(htmlStudent);
                        }
                        $('#listaEstudiantes').listview('refresh');
                    }
                });
            } catch (error){
                alert(error);
            }
        } else {
            alert("Ingrese fecha del día de asistencia.")
        }
    },

    listarEstudiantes:function(){
        //var f = new Date();
        //var fecha = f.getDate() + "-" + (f.getMonth() +1) + "-" + f.getFullYear();
        try {
            $.ajax({
                type:'GET',
                url:'http://ado.applublish.hol.es/estudiantes',
                cache:false,
                dataType:'json',
                success:function(result,status,jqXHR){
                    var htmlStudent='';
                    $('#listaEstudiantes').empty();
                    for (var i = 0; i < result.length; i++) {
                        var p = result[i];
                        htmlStudent= "<li><a href='#' id='"+p.id+"'>"+
                        "<h2>"+p.nombre + " " + p.apellidos+"</h2>"+
                        "<p>Día: "+p.dia+"</p> <p>Lideres: "+p.lideres+"</p></a> </li>";
                        $('#listarEstudiantes').append(htmlStudent);
                    }
                    $('#listarEstudiantes').listview('refresh');
                }
            });
        } catch (error){
            alert(error);
        }
    },

    scan:function() {
        console.log('scanning');

        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

        scanner.scan( function (result) {

            console.log("Scanner result: \n" +
                "text: " + result.text + "\n" +
                "format: " + result.format + "\n" +
                "cancelled: " + result.cancelled + "\n");
            try {
                var str = result.text.toString();
                var est = str.split(":");
                $.ajax({
                    type:'GET',
                    url:'http://ado.applublish.hol.es/estudiante/'+est[0],
                    cache:false,
                    dataType:'json',
                    success:function(result,status,jqXHR){
                        $("#id").val(result[0].id);
                        $("#nombre").val(result[0].nombre);
                        $("#apellidos").val(result[0].apellidos);
                        $("#lideres").val(result[0].lideres);
                        $("#dia").val(result[0].dia);
                        //$("#dia").val(result[0].dia);
                    }
                });
            } catch (error) {
                alert(error);
            }
            //document.getElementById("info").innerHTML = result.text;
            //console.log(result);
            /*
            if (args.format == "QR_CODE") {
                window.plugins.childBrowser.showWebPage(args.text, { showLocationBar: false });
            }
            */

        }, function (error) {
            console.log("Scanning failed: ", error);
        } );
    },

    encode:function() {
        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

        scanner.encode(scanner.Encode.TEXT_TYPE, "http://www.nhl.com", function(success) {
            alert("encode success: " + success);
          }, function(fail) {
            alert("encoding failed: " + fail);
          }
        );
    },
    
    verinfo:function() {
        var deviceInfo = cordova.require("cordova/plugin/DeviceInformation");
        deviceInfo.get(function(result) {
            alert("result = " + result);
            $("#texto-lon").text(result);
        }, function() {
            alert("error");
        });
    }
    
    
};