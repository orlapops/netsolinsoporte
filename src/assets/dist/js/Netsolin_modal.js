/*Abre popup's*/
function abrir_popup(url, nombre, opciones) {
    var lpopup = window.open(url, nombre, opciones);
    lpopup.focus();
    /*opener.window.location.reload();*/
}


/*Abre dialogo solo consulta sin actualizar pagina*/
function show_dialogo_con(cont_dialogo, titulo, pheight, pwidth, precarga) {
    var busq_div = document.getElementById('dialogo');
    //Busca div con id dialogo, si no lo encuentra crea el div.

    $("#NetsolinModal").modal({ backdrop: "static" }
        /*{		autoOpen: true,
        		modal: true,
        		width: "auto",
        		position: [400,70],
        		show: {
               		 //effect: "blind",
                	 duration: 420
               		},
            		hide: {
               		 //effect: "explode",
               		 duration: 420,
              		}
        }*/
    );
    cont_dialogo = cont_dialogo.replace("?VRC", "?VRMODAL=S&VRC");
    $("#Netmodalhtml").html('<iframe id="frame_dialogo" src="' + cont_dialogo + '" height="' + pheight + '"  width="' + pwidth + '" frameborder="0"></iframe>');

    $(".close").click(
        function() {
            if (typeof(precarga) == 'undefined') {} else {
                if (precarga) {
                    location.reload();
                }
            }
        }
    )
}

function show_Nethtmlpanel(cont_dialogo, titulo, pheight, pwidth, precarga) {
    var busq_div = document.getElementById('dialogo');
    //Busca div con id dialogo, si no lo encuentra crea el div.

    $("#Netsolinhtmlpanel").modal({ backdrop: "static" }
        /*{		autoOpen: true,
        		modal: true,
        		width: "auto",
        		position: [400,70],
        		show: {
               		 //effect: "blind",
                	 duration: 420
               		},
            		hide: {
               		 //effect: "explode",
               		 duration: 420,
              		}
        }*/
    );
    cont_dialogo = cont_dialogo.replace("?VRC", "?VRMODAL=S&VRC");
    $("#Nethtmlpanel").html('<iframe id="frame_dialogo" src="' + cont_dialogo + '" height="' + pheight + '"  width="' + pwidth + '" frameborder="0"></iframe>');

    $(".close").click(
        function() {
            if (typeof(precarga) == 'undefined') {} else {
                if (precarga) {
                    location.reload();
                }
            }
        }
    )
}

function show_dialogo_concopiant(cont_dialogo, titulo) {
    $("#Netmodalhtml").html("<iframe id='frame_dialogo' src='" + cont_dialogo + "' height='500px'  width='600px' frameborder='0'></iframe>");

    var busq_div = document.getElementById('dialogo');
    //Busca div con id dialogo, si no lo encuentra crea el div.
    if (busq_div == null) {
        /*Se crea div que contendra el dialogo*/
        var d = document.createElement('div');
        var atr = document.createAttribute("id");
        atr.value = "dialogo";
        var atrc = document.createAttribute("class");
        atrc.value = "modal fade";
        var atrr = document.createAttribute("role");
        atrr.value = "dialog";

        d.setAttributeNode(atr);

        d.setAttributeNode(atrc);
        d.setAttributeNode(atrr);

        //document.body.appendChild(d);
        var atrti = document.createAttribute("title");
        atrti.value = titulo;
        d.setAttributeNode(atrti);
        document.body.appendChild(d);
    }

    $("#dialogo").modal(
        /*{		autoOpen: true,
        		modal: true,
        		width: "auto",
        		position: [400,70],
        		show: {
               		 //effect: "blind",
                	 duration: 420
               		},
            		hide: {
               		 //effect: "explode",
               		 duration: 420,
              		}
        }*/
    );
    $("#dialogo").html("<iframe id='frame_dialogo' src='" + cont_dialogo + "' height='500px'  width='600px' frameborder='0'></iframe>");

}