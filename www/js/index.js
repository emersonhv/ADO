var app = {
    // Application Constructor
    initialize:function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents:function() {
        // FUNCIONES DE PROCESOS
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.getElementById('scan').addEventListener('click', this.scan, false);
        document.getElementById('enviarAsistenciaBtn').addEventListener('click', this.enviarAsistencia, false);
        document.getElementById('guardarEstudianteBtn').addEventListener('click', this.guardarEstudiante, false);
        document.getElementById('reset').addEventListener('click', this.borrarFormulario, false);
        document.getElementById('listarAsistenciaBtn').addEventListener('click', this.listarAsistencia, false);
        document.getElementById('listarEstudiantesLink').addEventListener('click', this.listarEstudiantes, false);
        document.getElementById('bimestre').addEventListener('change', this.buscarClasesPorBimestre, false);
        document.getElementById('bimestre_est').addEventListener('change', this.verNotasEstudiante, false);
        
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady:function() {
        this.receivedEvent('deviceready');        
    },
    // Update DOM on a Received Event
    receivedEvent:function(id) {
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

    buscarClasesPorBimestre:function(){
        
        var bimestre = $("#bimestre").val();
        try {
            $.ajax({
                type:'GET',
                url:'http://ado.applublish.hol.es/bimestre/clases/'+bimestre,
                cache:false,
                dataType:'json',
                success:function(result,status,jqXHR){
                    var htmlClases='';
                    $('#clases').empty();
                    for (var i = 0; i < result.length; i++) {
                        var p = result[i];
                        htmlClases = "<option value='"+p.nombre+"'>"+p.nombre+"</option>";
                        $('#clases').append(htmlClases);
                    }
                    $('#clases').selectmenu('refresh', true);
                    $('#bimestre').selectmenu('refresh', true);
                    
                    //$('#listarEstudiantes').listview('refresh');
                }
            });
        } catch (error){
            alert(error);
        }
    },

    guardarEstudiante:function(){
        //if($("#id").val()=="") {
            
            var nombre = $("#save_nombre").val();
            var apellidos = $("#save_apellidos").val();
            var lideres = $("#save_lideres").val();
            var dia = $("#save_dia").val();
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
                        //this.borrarFormulario();
                    }
                }
            });
        //} else {
        //    alert("Borre el formulario");
        //}
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
                    this.enviarAsistencia(fecha);
                } else {
                    alert("Estudiante ya tiene asistencia de hoy.");
                }
                this.borrarFormulario();
            }
        });
    },

    enviarAsistencia:function(fecha){
        if($("#id").val()!="") {
            
            var id_estudinte = $("#id").val();
            var nombre_clases = $("#clases").val();
            var carnet = $("#carnet").val();
            var bimestre = $("#bimestre").val();
            var fecha = $("#fecha").val();

            var post = "id_estudiante="+id_estudinte+"&nombre_clases="+nombre_clases
            +"&carnet="+carnet+"&fecha="+fecha+"&bimestre="+bimestre;
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
                        var htmlAsistencia='';
                        $('#listaAsistencia').empty();
                        $('#cantidad_asistencia').html("<b>Cantidad de estudiantes: "+result.length+"</b>");
                        for (var i = 0; i < result.length; i++) {
                            var p = result[i];
                            htmlAsistencia = "<li><a href='#PageNotesEstudiante' onclick='app.estudiante("+p.id+")'>"+
                            "<h2>"+p.nombre + " " + p.apellidos+"</h2>"+
                            "<p>Lideres: "+p.lideres+ "</p> <p>Subred: "+p.subred+"</p> </a> </li>";
                            $('#listaAsistencia').append(htmlAsistencia);
                        }
                        $('#listaAsistencia').listview('refresh');
                        
                    }
                });
            } catch (error){
                alert(error);
            }
        } else {
            alert("Ingrese fecha del día de asistencia.")
        }
    },
    
    estudiante:function(idE){
        try {

            $.ajax({
                type:'GET',
                url:'http://ado.applublish.hol.es/estudiante/'+idE,
                cache:false,
                dataType:'json',
                success:function(result,status,jqXHR){
                    $("#nombre_estudiante").html("<b>Nombre: </b> "+result[0].nombre+" "+result[0].apellidos);
                    $("#lideres_estudiante").html("<b>Lideres: </b> "+result[0].lideres);
                    $("#id_est_nota").val(result[0].id);
                }
            });
        } catch (error) {
            alert(error);
        }
    },
    
    verNotasEstudiante:function(){
        try {
            var idE = $("#id_est_nota").val();
            var BIMESTRE = $("#bimestre_est").val();
            
            $.ajax({
                type:'GET',
                url:'http://ado.applublish.hol.es/notas/estudiante/'+idE+'/'+BIMESTRE,
                cache:false,
                dataType:'json',
                success:function(result,status,jqXHR){
                    //$("#nombre_estudiante").html("<b>Nombre:</b> "+result[0].nombre+" "+result[0].apellidos);
                    //$("#lideres").html("<b>Apellidos:</b> "+result[0].lideres);
                    var htmlNotas='';
                    $('#NotasPorBimestre').empty();
                    for (var i = 0; i < result.length; i++) {
                        var p = result[i];
                        htmlNotas = "<h3>"+p.nombre_clases+"</h3><p><input type='text' style='width:100%; height:15px;' data-corners='false'"+
                            " id='nota"+p.id_asistencia+"' value='"+p.nota+"' data-theme='e'/></p>"+
                            "<p><button data-corners='false' class='ui-btn ui-input-btn' "+
                            " onclick='app.editNota("+p.id_asistencia+")' "+
                            "data-icon='check' data-iconpos='right'>Editar</button></p>";
                        $('#NotasPorBimestre').append(htmlNotas);
                    }
                    $('#NotasPorBimestre').refresh();
                    
                }
            });
        } catch (error) {
            alert(error);
        }
    },
    
    editNota:function(idA){
        var Nota = $("#nota"+idA).val();
        try {
            
            var put = "id_asistencia="+idA+"&nota="+Nota;
            $.ajax({
                type:'PUT',
                data:put,
                url:'http://ado.applublish.hol.es/asistencia/nota',
                cache:false,
                dataType:'json',
                success:function(result,status,jqXHR){
                    
                    alert(result.mensaje);
                }
            });
        } catch (error) {
            alert(error);
        }
    },

    verDetalleEstudiante:function(idE){
        try {
            
            $.ajax({
                type:'GET',
                url:'http://ado.applublish.hol.es/estudiante/asistencia/'+idE,
                cache:false,
                dataType:'json',
                success:function(result,status,jqXHR){
                    $("#detalle_nombre").html("<b>Nombre:</b> "+result[0].nombre);
                    $("#detalle_apellidos").html("<b>Apellidos:</b> "+result[0].apellidos);
                    $("#detalle_lideres").html("<b>Lideres:</b> "+result[0].lideres);
                    $("#numero_clases_bimetre1").html("<b>Bimestre 1:</b> "+result[0].bimestre1);
                    $("#numero_clases_bimetre2").html("<b>Bimestre 2:</b> "+result[0].bimestre2);
                    $("#numero_clases_bimetre3").html("<b>Bimestre 3:</b> "+result[0].bimestre3);
                    $("#numero_clases_bimetre4").html("<b>Bimestre 4:</b> "+result[0].bimestre4);
                    
                }
            });
        } catch (error) {
            alert(error);
        }
    },

    listarEstudiantes:function(){

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
                        htmlStudent= "<li><a href='#PageDetalleEstudiante' onclick='app.verDetalleEstudiante("+p.id+")'"+
                            " id='"+p.id+"' data-transition='slide'>"+
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
        try{
            var scanner = cordova.require("cordova/plugin/BarcodeScanner");
        }catch(error){
            alert(error);
        }

        /*cordova.plugins.barcodeScanner.scan(
          function (result) {
              alert("We got a barcode\n" +
                    "Result: " + result.text + "\n" +
                    "Format: " + result.format + "\n" +
                    "Cancelled: " + result.cancelled);
          }, 
          function (error) {
              alert("Scanning failed: " + error);
          }
       );*/
        
        
        scanner.scan( function (result) {
            /*console.log("Scanner result: \n" +
                "text: " + result.text + "\n" +
                "format: " + result.format + "\n" +
                "cancelled: " + result.cancelled + "\n");*/
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
            alert("Scanning failed: ", error);
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
    

    obtenerID:function() {
        var deviceInfo = cordova.require("cordova/plugin/DeviceInformation");
        deviceInfo.get(function(result) {
            return result.deviceID;
        }, function() {
            return 0;
        });
    }


};