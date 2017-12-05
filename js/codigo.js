$(document).ready(function () {
    $(document).tooltip();
    
    //cantida productos carro
    var cantProd = 0;
    //precio total carro
    var preTot = 0;
    //variables para la posicion del contenedor del carrito
    var posIni = $('#cart_items').offset();
    var tamanhoIni = $('#cart_items').css("width").split("px");
    tamanhoIni = tamanhoIni[0];
    //$('.item').dblclick(dobleClick); 
    ponerDobleClick($(".item"));
    //$('.item').bind("dblclick", dobleClick);
    $(document).on("click", ".delete", function (event) {
        event.preventDefault();
        borrar($(this));
    });

    $(document).on("click", ".add", function (e) {
        e.preventDefault();
        var id = $(this).parent().attr("id").substring(1);


        $("#" + id).trigger("dblclick");


    });

    $(document).on("click", ".minus", function (e) {
        e.preventDefault();
        var padre = $(this).parent();
        padre.find(".add").show();
        var cantidad = padre.find(".cantidad").attr("value");
        if (cantidad > 1) {
            cantidad--;

            padre.find(".cantidad").attr("value", cantidad);
            var id = padre.attr("id");

            //sacamos el stock
            var stock = parseInt(getStock($("#" + id).find(".stock").text()));
            //si stock 0 quitamos la clase agotado
            $("#" + id).find(".stock").removeClass("agotado");
            //lo añadimos al stock del producto
            $("#" + id).find(".stock").text("Stock " + stock);
            //quitamos un producto del total de productos
            quitarProductos(1);
            //restar el precio del producto al total
            quitarPrecio($("#" + id), 1);


        } else {
            $(".delete").trigger("click");

        }

    });

    $('#btn_clear').on('click', vaciar);
    //$("#btn_prev").on("click", desplazar);
    //$("#btn_next").on("click", desplazar);
    $("#btn_prev").on("mouseover", desplazar).mouseout(function () {
        $('#cart_items').stop();

    });
    $("#btn_next").on("mouseover", desplazar).mouseout(function () {
        $('#cart_items').stop();


    });
    
    //drag and drop
    $(".item").draggable(
    {
    revert : "true"
    });
    
    $('#cart_items').droppable({
        over: function( event, ui ) {
            
            $('#cart_items').addClass('drop-hover');
        }
        
        
        
        
        
    });
    
    //---------------------------------------
    


    //ocultar el navigate
    ocultarNavegacion();
    transBotonesNav();

    function dobleClick() {
        var stock = getStock($(this).find('.stock').text());

        
        anhadirProductos();
        anhadirPrecio($(this));
        if (!$("#cart_items").children().is("#c" + $(this).attr("id"))) {
            clonar($(this), $(this).clone());
            aumentarTamanho();
            mostrarNavegacion();
            restarStock(parseInt(stock), $(this));
        } else {
            var cantidad = 1;
            var nodoCant = $("#c" + $(this).attr("id"));
            cantidad += parseInt(nodoCant.find(".cantidad").attr("value"));
            nodoCant.find(".cantidad").attr("value", cantidad);
            restarStock(parseInt(stock), $(this));

        }

    }

    //funcion que borra el elemento del carrito
    function borrar(nodo) {

        //        nodo.parent().fadeOut(600,function(){
        //           callBackBorrado(nodo)
        //               
        //        });
        nodo.parent().effect("explode", 600, function () {
            callBackBorrado(nodo);

        });





    }
    //necesaria para poner en el callback del fadeOut de borrar
    function callBackBorrado(nodo) {


        var nodoPadre = nodo.parent();
        //id del padre
        var idPadre = nodoPadre.attr("id");
        //cantidad ha quitar
        var cantQuitar = nodoPadre.find(".cantidad").attr("value");
        //sacamos el id del producto
        var id = idPadre.substring(1);
        //sacamos el stock
        var stock = parseInt(getStock($("#" + id).find(".stock").text())) + parseInt(cantQuitar);
        //si stock 0 quitamos la clase agotado
        $("#" + id).find(".stock").removeClass("agotado");
        //lo añadimos al stock del producto
        $("#" + id).find(".stock").text("Stock " + stock);
        //quitamos un producto del total de productos
        quitarProductos(cantQuitar);
        //restar el precio del producto al total
        quitarPrecio($("#" + id), cantQuitar);
        nodo.parent().remove();

        ponerDobleClick($("#" + id));
        comprobarTamanho();
        mostrarNavegacion();

    }

    //funcion que coge el stock
    function getStock(cant) {
        var arrayStock = cant.split(" ");
        var cantidad = arrayStock[1];
        return cantidad;

    }
    //funcion para restar el stock y cambiar el texto del nodo si stock 0 añade clase agotado
    function restarStock(cant, nodo) {

        if (cant < 0) {
            cant = 0
        };
        cant--;

        if (cant > 0) {
            nodo.find('.stock').text("Stock " + cant);
            nodo.hide();
            nodo.fadeIn(600);

        } else {
            nodo.find('.stock').text("Stock " + cant);
            nodo.find('.stock').addClass("agotado");
            var id = nodo.attr("id");
            $("#c" + id).find(".add").hide();
        }
        ponerDobleClick(nodo);

    }
    //funcion para añadir cantidad de productos comprados.
    function anhadirProductos() {
        cantProd++;
        $("#citem").attr("value", cantProd);
        $("#citem").hide();
        $("#citem").fadeIn(600);

    }
    //funcion para quitar productos
    function quitarProductos(numero) {
        cantProd -= numero;
        $("#citem").attr("value", cantProd);
        $("#citem").hide();
        $("#citem").fadeIn(600);
    }

    //funcion para añadir la suma de precios
    function anhadirPrecio(nodo) {
        var arrPrecio = nodo.find('.price').text().split(" ");
        preTot += parseInt(arrPrecio[0]);
        $("#cprice").attr("value", preTot + " €");
        $("#cprice").hide();
        $("#cprice").fadeIn(600);

    }

    function quitarPrecio(nodo, numero) {
        var arrPrecio = nodo.find('.price').text().split(" ");
        preTot -= (parseInt(arrPrecio[0]) * numero);
        $("#cprice").attr("value", preTot + " €");
        $("#cprice").hide();
        $("#cprice").fadeIn(600);

    }

    //funcion para clonar el item
    function clonar(nodo, nodoclone) {
        var $delete = $('<a href="" class="delete"></a>');
        var $minus = $('<a href="" class="minus"></a>');
        var $add = $('<a href="" class="add"></a>');
        var $cantidad = $('<input class="cantidad" type="text" value="1" readonly="true"/>');


        //ocultamos stock
        nodoclone.find(".stock").hide();
        // añadimos clase q ue toca
        nodoclone.addClass("icart");
        //añadimos c al id
        nodoclone.attr("id", "c" + nodo.attr("id"));
        //cursor default
        nodoclone.css("cursor", "default");
        nodoclone.children().css("cursor", "default");
        //añadir enlace al principio crear manejador
        //$delete.click(borrar);
        nodoclone.prepend($minus, $add, $delete, $cantidad);
        convBoton($minus);
        convBoton($add);
        convBoton($delete);
        $("#cart_items").prepend(nodoclone);

        animarElCarrito(nodoclone);
    }

    function convBoton(node) {
        var texto = "";
        if (node.hasClass('delete')) {
            texto = "ui-icon-circle-close";

        } else if (node.hasClass('minus')) {
            texto = "ui-icon-circle-minus";

        } else {
            texto = "ui-icon-circle-plus";

        }


        node.button({
            text: false,
            icons: {

                primary: texto
            }


        });
    }



    //funcion para poner dobleclick preguntar ana
    function ponerDobleClick(node) {
        node.unbind().on("dblclick", dobleClick);
        var stock = getStock(node.find(".stock").text());
        if (stock == 0) {
            node.unbind();
        }
    }
    //funcion que vacia el carrito
    function vaciar() {
        var $contenido = $('<div id="dialog" title="Confirmar vaciado">¿Seguro que desea vaciar el carrito?"</div>');
        $("body").append($contenido);
        $("#dialog").dialog({
                modal: true,
                open: function(event, ui) { 
                //hide close button.
                $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
                },
                show: {
                    effect: "bounce",
                    duration: 600
                },
                hide: {
                    effect: "explode",
                    duration: 600
                },
                title: "Confirmar vaciado",
                closeOnEscape: false,
                buttons: {
                    "Sí": function () {
                        $(".delete").trigger("click");
                        $contenido.remove();
                    },
                    "No": function () {
                        $contenido.remove();
                    }
                },
                
            


        });

    //$(".delete").trigger("click");

}

//funcion para comprobar si el carrito tiene mas de 4 elementos
function comprobarCarrito() {
    if ($('#cart_items').children().length > 4) {
        return true;
    } else {

        return false;
    }

}
//funcion para aumentar en 120px si hay mas de 4 elementos
function aumentarTamanho() {
    if (comprobarCarrito()) {
        var ancho = $("#cart_items").width();
        var ancho = parseInt(ancho) + 120;
        $("#cart_items").width(ancho);

    }

}
//funcion para realizar el desplazamiento
function desplazar() {
    var duracion = 500;
    duracion = duracion * parseInt($("#cart_items").children().length);
    var pos = $("#cart_items").offset()
    var tamanho = $('#cart_items').css("width").split("px");

    tamanho = tamanho[0];
    switch ($(this).attr("id")) {
        case "btn_prev":
            {
                if (pos.left < posIni.left) {

                    $('#cart_items').animate({
                        left: '0'
                    }, duracion);

                }

                break;
            }
        case "btn_next":
            {
                var sumaTamInicial = parseInt(pos.left) + parseInt(tamanho);
                var sumaTamActual = parseInt(posIni.left) + parseInt(tamanhoIni);
                var resta = -(tamanho - tamanhoIni)


                console.log(resta);
                $('#cart_items').animate({
                    left: resta
                }, duracion);



                break;
            }

    }


}



//funcion que comprueba el numero de articulos y si es <=4 vuelve al tamaño inicial
function comprobarTamanho() {
    var tamanho = $('#cart_items').children().length;
    var contador = 0;
    if (parseInt(tamanho) >= 4) {
        var ancho = $('#cart_items').width() - 120;
        console.log($('#cart_items').offset());
        $('#cart_items').width(ancho);
        while (contador < 3) {
            $("#btn_prev").trigger("click");
            contador++;
        }





    }

}
//funcion para ocultar la barra de navegación
function ocultarNavegacion() {
    $('#nav_left').hide();

}

function mostrarNavegacion() {
    var tamanho = parseInt($('#cart_items').children().length);

    if (tamanho > 0 && tamanho <= 4) {
        $('#nav_left').show();
        $('#btn_prev').hide();
        $('#btn_next').hide();

    } else {
        $('#btn_prev').show();
        $('#btn_next').show();

    }
    if (tamanho == 0) {
        $('#nav_left').hide();

    }


}

function animarElCarrito(node) {
    node.css("opacity", "");
    node.hide();

    node.animate({
        width: "toggle"
    });


}

//funcion convertir botones del nav
function transBotonesNav() {
    $('#btn_clear').button({
        text: false,
        icons: {

            primary: 'ui-icon-trash'
        }

    });

    $('#btn_comprar').button({
        text: false,
        icons: {

            primary: 'ui-icon-cart'
        }

    });
    $('#btn_prev').button({
        text: false,
        icons: {

            primary: 'ui-icon-circle-triangle-w'
        }

    });

    $('#btn_next').button({
        text: false,
        icons: {

            primary: ' ui-icon-circle-triangle-e'
        }

    });
}


});
