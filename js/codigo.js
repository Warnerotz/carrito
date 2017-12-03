$(document).ready(function () {
    //variable controlar animaciones
    var controlAnimacion = false;
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

    $('#btn_clear').on('click', vaciar);
    //$("#btn_prev").on("click", desplazar);
    //$("#btn_next").on("click", desplazar);
    $("#btn_prev").on("mouseover", desplazar);
    $("#btn_prev").on("mouseout", desplazar);
    
    $("#btn_next").on("mouseover", desplazar);    
    $("#btn_next").on("mouseout", desplazar);
    
    //ocultar el navigate
    ocultarNavegacion();

    function dobleClick() {
        var stock = getStock($(this).find('.stock').text());
        //en restar stock tb se clona el elemento por problemas del fadeIn
        restarStock(parseInt(stock), $(this));
        anhadirProductos();
        anhadirPrecio($(this));
        //para que funcionara el fadeIn bien tube q meter la funcion de clonado cuando termina el fadeIn sino la opacity al clonar cogia la quer queria        
       
        clonar($(this), $(this).clone());
        aumentarTamanho();
        mostrarNavegacion();
 }
    
    //funcion que borra el elemento del carrito
    function borrar(nodo) {
        //nodo.parent().remove();
        nodo.parent().fadeOut(600,function(){
           callBackBorrado(nodo)
               
        });
          
   
        

    }
    //necesaria para poner en el callback del fadeOut de borrar
    function callBackBorrado(nodo){
         //id del padre
        var idPadre = nodo.parent().attr("id");
        console.log(idPadre);
        //sacamos el id del producto
        var id = idPadre.substring(1);
        //sacamos el stock
        var stock = getStock($("#" + id).find(".stock").text());
        //si stock 0 quitamos la clase agotado

        $("#" + id).find(".stock").removeClass("agotado");

        //le sumamos uno        
        parseInt(stock++);
        //lo añadimos al stock del producto
        $("#" + id).find(".stock").text("Stock " + stock);
        //quitamos un producto del total de productos
        quitarProductos();
        //restar el precio del producto al total
        quitarPrecio($("#" + id));
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
    //funcion para restar el stock y cambiar el texto del nodo si stock 0 añade clase agotado(añadido clonado por problemas con el fadeIn y la opacidad)
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
        }
        ponerDobleClick(nodo);

    }
    //funcion para añadir cantidad de productos comprados.
    function anhadirProductos() {
        cantProd++;
        $("#citem").attr("value", cantProd);


    }
    //funcion para quitar productos
    function quitarProductos() {
        cantProd--;
        $("#citem").attr("value", cantProd);
    }

    //funcion para añadir la suma de precios
    function anhadirPrecio(nodo) {
        var arrPrecio = nodo.find('.price').text().split(" ");
        preTot += parseInt(arrPrecio[0]);
        $("#cprice").attr("value", preTot + " €");

    }

    function quitarPrecio(nodo) {
        var arrPrecio = nodo.find('.price').text().split(" ");
        preTot -= parseInt(arrPrecio[0]);
        $("#cprice").attr("value", preTot + " €");

    }

    //funcion para clonar el item
    function clonar(nodo, nodoclone) {
        var $delete = $('<a href="" class="delete"></a>')
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
        nodoclone.prepend($delete);
        $("#cart_items").prepend(nodoclone);

        animarElCarrito(nodoclone);
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
        $(".delete").trigger("click");

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
        duracion =duracion * parseInt($("#cart_items").children().length);
        var pos = $("#cart_items").offset()
        var tamanho = $('#cart_items').css("width").split("px");
        
        tamanho = tamanho[0];
        switch ($(this).attr("id")) {
            case "btn_prev":
                {
                    
                    $('#cart_items').animate({ left: '+=60' },duracion);
//                    if (pos.left < posIni.left) {
//                        pos.left += 60;
//                        $('#cart_items').offset({
//                            top: pos.top,
//                            left: pos.left
//                        });
//                    }

                    break;
                }
            case "btn_next":
                {
                    var sumaTamInicial = parseInt(pos.left) + parseInt(tamanho);
                    var sumaTamActual = parseInt(posIni.left) + parseInt(tamanhoIni);

                    if (sumaTamInicial > sumaTamActual) {
                        pos.left -= 60;
                        $('#cart_items').offset({
                            top: pos.top,
                            left: pos.left
                        });
                        break;
                    }
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

        if (tamanho >= 0 && tamanho <= 4) {
            $('#nav_left').show();
            $('#btn_prev').hide();
            $('#btn_next').hide();

        } else {
            $('#btn_prev').show();
            $('#btn_next').show();

        }


    }

    function animarElCarrito(node) {
        node.css("opacity","");
        node.hide();
        
        node.animate({
            width: "toggle"
        });
        

    }




});
