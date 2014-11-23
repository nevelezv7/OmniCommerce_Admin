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
        document.getElementById('scan').addEventListener('click', this.scan, false);
        //document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
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

    takePicture: function() {

        navigator.camera.getPicture(onSuccess, onFail, { 
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI 
        });

        function onSuccess(imageURI) {
            var image = document.getElementById('MyImg');
            image.src = imageURI;
            image.style.visibility= "visible";
            var btn = document.getElementById('btnBuscarXFoto');
            btn.style.visibility= "visible";
        }

        function onFail(message) {
            console.log('Failed because: ' + message);
        }
    },

    fromGallery: function() {

         navigator.camera.getPicture(onSuccess, onFail, { 
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        });

        function onSuccess(dataUrl) {
            var image = document.getElementById('MyImg');
            image.src = 'data:image/jpeg;base64,'+ dataUrl;
            image.style.visibility= "visible";
            var btn = document.getElementById('btnBuscarXFoto');
            btn.style.visibility= "visible";
        }

        function onFail(message) {
            console.log('Failed because: ' + message);
        }
    },
    scan: function() {
        console.log('scanning');
        
        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

        scanner.scan( function (result) { 

            console.log("We got a barcode\n" + 
            "Result: " + result.text + "\n" + 
            "Format: " + result.format + "\n" + 
            "Cancelled: " + result.cancelled);  

            var send = {"Result": result.text, "Format": result.format, "Cancelled": result.cancelled}

            $.ajax({
                dataType: 'jsonp',
                data: send,
                url:   'http://www.mocky.io/v2/5471ff80db32049807feda0c',
                type:  'post',
                success:  function (result) {
                    var panel = document.getElementById('pantallaBienvenida');
                    panel.style.display= "none";
                    var panelResults = document.getElementById('resultadoBusqueda');
                    panelResults.style.display= "block";
                    $( result.products ).each(function() {
                        var newDiv = '<div class="searchResult">';
                        newDiv += '   <div class="imgResult">';
                        newDiv += '      <img src="'+$( this )[0].img+'" alt="img/logo.png" class="imResult2"/>';
                        newDiv += '    </div>';
                        newDiv += '    <div class="infoResult">';
                        newDiv += '        <b>'+$( this )[0].name+'</b> <br />';
                        newDiv +=         $( this )[0].precio+'<br />';
                        newDiv += '        <button onclick="buscarTiendas('+$( this )[0].id+')"> Ver en '+$( this )[0].tiendas+' Tiendas </button>';
                        newDiv += '    </div>';
                        newDiv += '</div>';
                        $('#resultadosPanel').append(newDiv);
                        
                    });
                }, 
            });

            console.log(result);


        }, function (error) { 
            console.log("Scanning failed: ", error); 
        } );
    },
};

function mostrarOpcionesCamara(){
    var panel = document.getElementById('pantallaBienvenida');
    panel.style.display= "none";

    var panel2 = document.getElementById('opcionesCamara');
    panel2.style.display= "block";

}

function BuscarXFoto(){
    var img = document.getElementById('MyImg');

    $.ajax({
            dataType: 'jsonp',
            url:   'http://www.mocky.io/v2/5470baf35f06d5fb0c6687e8',
            type:  'post',
            success:  function (result) {
                var panel2 = document.getElementById('opcionesCamara');
                panel2.style.display= "none";
                var panelResults = document.getElementById('resultadoBusqueda');
                panelResults.style.display= "block";
                $( result.products ).each(function() {
                    var newDiv = '<div class="searchResult">';
                    newDiv += '   <div class="imgResult">';
                    newDiv += '      <img src="'+$( this )[0].img+'" alt="img/logo.png" class="imResult2"/>';
                    newDiv += '    </div>';
                    newDiv += '    <div class="infoResult">';
                    newDiv += '        <b>'+$( this )[0].name+'</b> <br />';
                    newDiv +=         $( this )[0].precio+'<br />';
                    newDiv += '        <button onclick="buscarTiendas('+$( this )[0].id+')"> Ver en '+$( this )[0].tiendas+' Tiendas </button>';
                    newDiv += '    </div>';
                    newDiv += '</div>';
                    $('#resultadosPanel').append(newDiv);
                    
                });
            }, 
    });
}

function buscarTiendas(idProducto){

    var send = {
        "image": idProducto
    };
    $.ajax({
            data:  send,
            dataType: 'jsonp',
            url:   'http://www.mocky.io/v2/5470c73c5f06d5730e6687ee',
            type:  'post',
            success:  function (result) {
                var panelResults = document.getElementById('resultadoBusqueda');
                panelResults.style.display= "block";
                $('#resultadosPanel').html('');
                $( result.stores ).each(function() {
                    var newDiv = '<div class="searchResult">';
                    newDiv += '   <div class="imgResult">';
                    newDiv += '      <img src="'+$( this )[0].img+'" alt="img/logo.png" class="imResult2"/>';
                    newDiv += '    </div>';
                    newDiv += '    <div class="infoResult">';
                    newDiv += '        <b>'+$( this )[0].name+'</b> <br />';
                    newDiv +=         $( this )[0].direccion+'<br />';
                    newDiv +=         $( this )[0].unidadesDisp+' Unidades disponibles<br />';
                    newDiv += '    </div>';
                    newDiv += '</div>';
                    $('#resultadosPanel').append(newDiv);
                });
            }, 
    });
}

