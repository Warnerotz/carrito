$(document).ready(function () {
    //cantida productos carro
    var cantProd = 0;
    //precio total carro
    var preTot = 0;
    
    $('.item').dblclick(dobleClick);    


    function dobleClick() {
        var stock = getStock($(this).find('.stock').text());
        if (stock > 0) {
            restarStock(stock, $(this));
            anhadirProductos();
            anhadirPrecio($(this));
            clonar($(this), $(this).clone());

        }

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
        } else {
            nodo.find('.stock').text("Stock " + cant);
            nodo.find('.stock').addClass("agotado");
        }

    }
    //funcion para añadir cantidad de productos comprados.
    function anhadirProductos() {
        cantProd++;
        $("#citem").attr("value", cantProd);


    }
    //funcion para quitar productos
    function quitarProductos(){
       cantProd--; 
       $("#citem").attr("value", cantProd);
    }

    //funcion para añadir la suma de precios
    function anhadirPrecio(nodo) {
        var arrPrecio = nodo.find('.price').text().split(" ");
        preTot += parseInt(arrPrecio[0]);
        $("#cprice").attr("value", preTot + " €");

    }
    
    function quitarPrecio(nodo){
        var arrPrecio = nodo.find('.price').text().split(" ");
        preTot -= parseInt(arrPrecio[0]);
        $("#cprice").attr("value", preTot + " €");
        
    }

    //funcion para clonar el item
    function clonar(nodo, nodoclone) {
        var $delete = $('<a href="" class="delete"></a>');
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
        $delete.click(borrar);
        nodoclone.prepend($delete);
        $("#cart_items").prepend(nodoclone);

    }

    function borrar(Event) {
        //id del padre
        var idPadre = $(this).parent().attr("id");
        //sacamos el id del producto
        var id = idPadre.substring(1);
        //sacamos el stock
        var stock = getStock($("#"+id).find(".stock").text());
        //si stock 0 quitamos la clase agotado
        
        $("#"+id).find(".stock").removeClass("agotado");    
       
        //le sumamos uno        
        parseInt(stock++);
        //lo añadimos al stock del producto
        $("#"+id).find(".stock").text("Stock "+stock);
        //quitamos un producto del total de productos
        quitarProductos();
        //restar el precio del producto al total
        quitarPrecio($("#"+id));
        
        $(this).parent().remove();
        
        
        return false;
    }



});
