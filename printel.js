
var datareceipt = '{ 
    "money" : "EUR",
    "company" : "CompanyExample",
    "url" : "www.companyexample.com"
}';

var PrintReceipt = {

    getCleanedString : function (cadena){
        if(typeof cadena != 'undefined' && cadena != null && cadena.length > 0) {
            var specialChars = "!#$^&%{}|:<>?ºª·";

            for (var i = 0; i < specialChars.length; i++) {
                cadena = cadena.replace(new RegExp("\\" + specialChars[i], 'gi'), ' ');
            }

            cadena = cadena.replace(/á/gi, "a");
            cadena = cadena.replace(/é/gi, "e");
            cadena = cadena.replace(/í/gi, "i");
            cadena = cadena.replace(/ó/gi, "o");
            cadena = cadena.replace(/ú/gi, "u");
            cadena = cadena.replace(/Á/gi, "A");
            cadena = cadena.replace(/É/gi, "E");
            cadena = cadena.replace(/Í/gi, "I");
            cadena = cadena.replace(/Ó/gi, "O");
            cadena = cadena.replace(/Ú/gi, "U");
            cadena = cadena.replace(/à/gi, "a");
            cadena = cadena.replace(/è/gi, "e");
            cadena = cadena.replace(/ì/gi, "i");
            cadena = cadena.replace(/ò/gi, "o");
            cadena = cadena.replace(/ù/gi, "u");
            cadena = cadena.replace(/À/gi, "A");
            cadena = cadena.replace(/È/gi, "E");
            cadena = cadena.replace(/Ì/gi, "I");
            cadena = cadena.replace(/Ò/gi, "O");
            cadena = cadena.replace(/Ù/gi, "U");
            cadena = cadena.replace(/ñ/gi, "n");
            cadena = cadena.replace(/ç/gi, "c");
            cadena = cadena.replace(/Ñ/gi, "N");
            cadena = cadena.replace(/Ç/gi, "C");
            cadena = cadena.replace(/ï/gi, "i");
            cadena = cadena.replace(/Ï/gi, "I");
            cadena = cadena.replace(/ü/gi, "u");
            cadena = cadena.replace(/Ü/gi, "u");
            cadena = cadena.replace(/ä/gi, "a");
            cadena = cadena.replace(/Ä/gi, "A");
            cadena = cadena.replace(/ë/gi, "e");
            cadena = cadena.replace(/Ë/gi, "E");
            cadena = cadena.replace(/ö/gi, "o");
            cadena = cadena.replace(/Ö/gi, "O");
            cadena = cadena.replace(/€/gi, "eur");
        }

        return cadena;
    },

    getWhiteLines : function($ElementToRight,$lineLenght){
        var totalWhiteLines = $lineLenght - $ElementToRight.length;
        var whileLines = "";
        var i=0;
        while(i<totalWhiteLines){
            whileLines += " ";
            i++;
        }
        return whileLines;
    },

    getLineWithTwoElement : function($Element1,$Element2){
        var lineLenght = 32;
        var typeOfMoney = datareceipt.money;

        var e1 = $Element1;
        var e2 = typeOfMoney + " " + $Element2;
        var totalLineFull = e1.length + e2.length;

        if(totalLineFull <= 32){
            return e1+PrintReceipt.getWhiteLines(e1+e2,lineLenght)+e2;
        }else{
            var concatLinesResult = "";
            concatLinesResult += e1 + "\n";
            concatLinesResult += PrintReceipt.getWhiteLines(e2,lineLenght) + e2;
            return concatLinesResult;
        }
    },

    Print : function($OrderUUID){
        View.showPrinting();

        $.ajax({
            url: RemoteRoutes.ROUTE_GET_ORDER_RECEIPT+$OrderUUID,
            type: 'POST',
            dataType: 'json',
            data: { email: Storage.getStorageData('Email'), apitoken: Storage.getStorageData('ApiKey') },
            success: function ($Order) {
                var Divider1 =          "--------------------------------\n";
                var Divider2 =          "================================\n";
                var Divider3 =          "................................\n";
                var Divider4 =          "________________________________\n";

                var OrderPrintContent = "\n";

                /**
                 * HEADER FOR RESTAURANT
                 */

                if($Order.OrderDelivery.Type == "delivery") {
                    OrderPrintContent     += "PEDIDO PARA ENTREGA\n\n";
                    OrderPrintContent     += "ENTREGAR A LAS "+ $Order.OrderDelivery.DeliveryAtHome.DeliveryAtHomeDateTime.split(" ")[1].substring(0,5) +"\n";
                    OrderPrintContent     += "DEL DIA "+ $Order.OrderDelivery.DeliveryAtHome.DeliveryAtHomeDateTime.split(" ")[0] +"\n";
                }else{
                    OrderPrintContent     += "PEDIDO PARA RECOGIDA\n\n";
                    OrderPrintContent     += "RECOGIDA A LAS "+ $Order.OrderDelivery.PickupAtRestaurant.PickupAtRestaurantDateTime.split(" ")[1].substring(0,5) +"\n";
                    OrderPrintContent     += "DEL DIA "+ $Order.OrderDelivery.PickupAtRestaurant.PickupAtRestaurantDateTime.split(" ")[0] +"\n";
                }
                OrderPrintContent     += "INFO CLIENTE: \n";
                OrderPrintContent     += PrintReceipt.getCleanedString($Order.OrderClient.ClientPhone) + "(" + PrintReceipt.getCleanedString($Order.OrderClient.ClientName.split(' ')[0]) + ")" + "\n";
                if($Order.OrderDelivery.Type == "delivery") {
                    OrderPrintContent     += PrintReceipt.getCleanedString($Order.OrderDelivery.DeliveryAtHome.DeliveryAtHomeAddress.Address)+" "+PrintReceipt.getCleanedString($Order.OrderDelivery.DeliveryAtHome.DeliveryAtHomeAddress.Town)+"\n";
                }
                if($Order.OrderPaid){
                    OrderPrintContent += "\nPEDIDO PAGADO\n";
                }else{
                    OrderPrintContent += "\nPEDIDO NO PAGADO\n";
                }
                OrderPrintContent     += "\n\n\n\n\n\n\n";

                /**
                 * BODY RECEIPT
                 */

                OrderPrintContent     += "       " + datareceipt.company + "     \n";
                OrderPrintContent     += "       " + datareceipt.url + "   \n\n";
                OrderPrintContent += Divider4;
                OrderPrintContent += "PEDIDO UUID: "+$Order.OrderInfo.UUID+"\n";
                OrderPrintContent += "Creado a las "+$Order.OrderInfo.CreatedTime.substring(0,5)+"\n";
                OrderPrintContent += "Del dia "+$Order.OrderInfo.CreatedDate+"\n";
                OrderPrintContent += Divider2;
                $Order.OrderProducts.forEach(function(Product){
                    if(typeof Product.OrderProduct.ProductExtraName != 'undefined' && Product.OrderProduct.ProductExtraName != null && Product.OrderProduct.ProductExtraName.length > 2){
                        var productFullName = Product.OrderProductQuantity+"x "+PrintReceipt.getCleanedString(Product.OrderProduct.ProductName) + " ("+PrintReceipt.getCleanedString(Product.OrderProduct.ProductExtraName)+")";
                        OrderPrintContent += PrintReceipt.getLineWithTwoElement(productFullName,Product.OrderProduct.ProductExtraPrice)+"\n";
                    }else{
                        var productFullName = Product.OrderProductQuantity+"x "+PrintReceipt.getCleanedString(Product.OrderProduct.ProductName);
                        OrderPrintContent += PrintReceipt.getLineWithTwoElement(productFullName,Product.OrderProduct.ProductPrice)+"\n";
                    }
                });
                OrderPrintContent += Divider3;
                OrderPrintContent += PrintReceipt.getLineWithTwoElement("Subtotal: ",$Order.OrderPayment.SubtotalAmount)+"\n";
                OrderPrintContent += PrintReceipt.getLineWithTwoElement("IVA(10%): ",$Order.OrderPayment.TaxAmount)+"\n";
                OrderPrintContent += PrintReceipt.getLineWithTwoElement("Total: ",$Order.OrderPayment.TotalAmount)+"\n";
                OrderPrintContent += Divider2;
                if($Order.OrderDelivery.Type == "delivery") {
                    OrderPrintContent += "      Comentario Cliente      \n\n";
                    OrderPrintContent += PrintReceipt.getCleanedString($Order.OrderDelivery.DeliveryAtHome.DeliveryAtHomeComments) + "\n";
                }else{
                    OrderPrintContent += "      Comentario Cliente      \n\n";
                    OrderPrintContent += PrintReceipt.getCleanedString($Order.OrderDelivery.PickupAtRestaurant.PickupAtRestaurantComments) + "\n";
                }
                OrderPrintContent += Divider3;
                OrderPrintContent += "        Info. Cliente           \n\n";
                OrderPrintContent += "Nombre: "+PrintReceipt.getCleanedString($Order.OrderClient.ClientName)+"\n";
                OrderPrintContent += "Email: "+PrintReceipt.getCleanedString($Order.OrderClient.ClientEmail)+"\n";
                OrderPrintContent += "Telf: "+PrintReceipt.getCleanedString($Order.OrderClient.ClientPhone)+"\n\n";
                OrderPrintContent += Divider3;
                if($Order.OrderDelivery.Type == "delivery") {
                    OrderPrintContent += "        Info. Entrega         \n\n";
                    OrderPrintContent += "Entregar a las "+ $Order.OrderDelivery.DeliveryAtHome.DeliveryAtHomeDateTime.split(" ")[1].substring(0,5) +"\n";
                    OrderPrintContent += "Del dia "+ $Order.OrderDelivery.DeliveryAtHome.DeliveryAtHomeDateTime.split(" ")[0] +"\n\n";
                    OrderPrintContent += "Direccion: "+PrintReceipt.getCleanedString($Order.OrderDelivery.DeliveryAtHome.DeliveryAtHomeAddress.Address)+" "+PrintReceipt.getCleanedString($Order.OrderDelivery.DeliveryAtHome.DeliveryAtHomeAddress.Town)+"\n";
                }else{
                    OrderPrintContent += "       Info. Recogida         \n\n";
                    OrderPrintContent += "Recogida a las "+ $Order.OrderDelivery.PickupAtRestaurant.PickupAtRestaurantDateTime.split(" ")[1].substring(0,5) +"\n";
                    OrderPrintContent += "Del dia "+ $Order.OrderDelivery.PickupAtRestaurant.PickupAtRestaurantDateTime.split(" ")[0] +"\n";
                }
                OrderPrintContent += Divider2;
                if($Order.OrderPaid){
                    OrderPrintContent += "Estado: PAGADO";
                }else{
                    OrderPrintContent += "Estado: NO PAGADO";
                }
                if($Order.OrderChecked){
                    OrderPrintContent += "(COPIA)";
                }
                OrderPrintContent += "\n";
                OrderPrintContent += Divider4;
                OrderPrintContent     += "           Powered by          \n";
                OrderPrintContent     += "            Venditec           \n";
                OrderPrintContent     += "          venditec.com         \n";

                //console.log(OrderPrintContent);
                BTPrinter.connect(function(data){
                    //console.log("Printer connected..." + data);
                    BTPrinter.printText(function(data){
                        //console.log('Printer printing text...'+data);
                        setTimeout(function(){
                            BTPrinter.disconnect(function(data){
                                //console.log("Printer disconnected ..." + data);
                                Orders.setCheckedOrder($OrderUUID);
                            },function(err){
                                //console.log("Printer error disconnecting! " + err);
                                //alert("Error de desconexión de impresora. " + err);
                                Orders.setCheckedOrder($OrderUUID);
                            }, "S85");
                        }, 3000);
                    },function(err){
                        //console.log("Printer error Printing text! " + err);
                        //alert("Error en la impresión del pedido. " + err);
                        Orders.setNoCheckedOrder($OrderUUID);
                    }, OrderPrintContent + "\n \n \n \n");
                },function(err){
                    //console.log("Printer error Connecting! " + err);
                    if(parseInt(Storage.getStorageData('PrintingErrorTimes')) < 3){
                        var printingtimes = parseInt(Storage.getStorageData('PrintingErrorTimes')) + 1;
                        Storage.setStorageData('PrintingErrorTimes', printingtimes.toString());
                        PrintReceipt.Print($OrderUUID);
                    }else {
                        //alert("Error de conexión con la impresora. " + err);
                        Orders.setNoCheckedOrder($OrderUUID);
                    }
                }, "S85");

            },
            error: function(xhr, status, error){
                //alert("No se ha podido obtener el contenido del pedido");
                Orders.setNoCheckedOrder($OrderUUID);
            }
        });

    }

}
