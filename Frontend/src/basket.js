var Templates = require('./Templates');

var basil = require('basil.js');
basil = new basil();
const fetch = require('node-fetch');

const { TelegramClient } = require('messaging-api-telegram');

// get accessToken from telegram [@BotFather](https://telegram.me/BotFather)
const client = TelegramClient.connect('884221604:AAEVBWl5ETesASuZ0XjXZs3DBMG0YwovKZM');


var phone = "380345452323"
var text = "Покупець: Горбач Михайло\n" +
    "телефон:"+phone+"\n Замовлення\n";





// fetch.Request
// fetch('http://example.com/movies.json')
//     .then((response) => {
//         return response.json();
//     })
//     .then((data) => {
//         console.log(data);
//     });
function sendMessage(text) {
    // const options = {
    //     method: 'POST',
    //     headers: {
    //         Accept: 'application/json',
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //         chat_id :"-327577485",
    //         text: text,
    //         parse_mode: 'HTML',
    //         disable_web_page_preview: false,
    //         disable_notification: false,
    //         reply_to_message_id: null
    //     })
    // };
    //
    // fetch('https://api.telegram.org/bot884221604:AAEVBWl5ETesASuZ0XjXZs3DBMG0YwovKZM/sendMessage', options)
    // .then(response => response.json())
    // .then(response => console.log(response))
    // .catch(err => console.error(err));

    $.ajax({
        url:'https://api.telegram.org/bot884221604:AAEVBWl5ETesASuZ0XjXZs3DBMG0YwovKZM/sendMessage',
        method:'POST',
        data:{chat_id:"-327577485",
            text:text,
            parse_mode: 'HTML',
            disable_web_page_preview: false,
            disable_notification: false,
            reply_to_message_id: null},
        success:function(){
            alert('your message has been sent!');
        }
    });
}


function openNav() {
    $("#basketColumn").addClass("widthR");
    $("#main").addClass("margR");
    $(".header").addClass("margR");
    $("#myForm").addClass("margR");
    if($('#user_info').css("display")=="block")
    $("#user_info").addClass("margR");
}

function closeNav() {
    $("#basketColumn").removeClass("widthR");
    $("#main").removeClass("margR");
    $(".header").removeClass("margR");
    $("#myForm").removeClass("margR");
    if($('#user_info').css("display")=="block")
    $("#user_info").removeClass("margR");
}

exports.initialiseBasket = function(){
    $('.basketBtn').click(function () {
        $('#user_info').css("display", "none");
        $('#myForm').css("display", "none");
        openNav();
    })

    $('.basketCloseBtn').click(function () {
        closeNav();
    })

    $('#subscribeEmail').click(function () {
        let email = document.getElementById("email").value;
        if(emailIsValid(email)) {
            $("#error-msg").css("display","none");
            writeEmail(email);
            alert("Дякуємо за підписку!")
        }
        else {
            $("#error-msg").css("display","block");
        }
    })


    $(".sendNumberButton").click(function () {

         let phone = $("#tele_phone_call").val();
         let param = getUrlParameter("type");
         let text = 'Передзвоніть мені на ' + $("#tele_phone_call").val() ;
         if(param) text += "\n" + param;
         if(phone.length == 16) {
             require("./API").addPhone(phone);
             client.sendMessage("-327577485", text, {
                 disable_web_page_preview: true,
                 disable_notification: false,
             });
             document.getElementById('slibotph').style.display='none';
             document.getElementById('content1').style.width='300px';
             document.getElementById('content1').style.padding='0px';
             document.getElementById('mssgresbox').innerHTML = 'Дякую, ми Вам передзвонимо';

         }
         else {
             //document.getElementById('mssgresbox').innerHTML = 'Помилка!';
         }
        //console.log($("#tele_phone_call").val() + ", len = " + $("#tele_phone_call").val().length);
    });

    initialiseCart();
}



var allPrice = 0;
var amountOfOrders = 0;

var Cart = [];

var $cart = $(".buyList");
var flag=true;

function addToCart(tech) {

    Cart.forEach(function(cart_item){
        if(cart_item.title==tech.title) {
            cart_item.quantity += 1;
            allPrice += tech.price;
            amountOfOrders += 1;
            flag=false;
            return;
        }
    });
    if(flag){
        allPrice += tech.price;
       // tech.
        amountOfOrders += 1;
        Cart.push(tech
        //     {
        //     id: tech.id,
        //     title: tech.title,
        //     price: tech.price,
        //     currency: tech.currency,
        //     icon: tech.icon,
        //     quantity: 1,
        //     isTech: tech.isTech
        // }
        );
    }
    flag=true;
    //Оновити вміст кошика на сторінці
    updateCart();
}

function removeFromCart(cart_item) {

    if(Cart.indexOf(cart_item)!=-1) {
        allPrice -= (cart_item.price)*cart_item.quantity;
        amountOfOrders -= cart_item.quantity;
        delete Cart[Cart.indexOf(cart_item)];
    }
    Cart = Cart.filter(function(x) {
        return x !== undefined && x !== null;
    });
    //Після видалення оновити відображення
    updateCart();
}

var $amount = $(".amountOfBoughtPizz");
var $allPrice = $(".amountLabel");

function initialiseCart() {
    var savedOrders = basil.get('amountOfOrders');
    if(savedOrders>0){
        Cart = basil.get('orders');
        Cart = Cart.filter(function(x) {
            return x !== undefined && x !== null;
        });
        allPrice = basil.get('price');
        amountOfOrders = basil.get('amountOfOrders');
    }

    $(".orderButton").click(function () {
        if(Cart.length!=0){

            let status = localStorage.getItem("status");
            if(status) {
                var id = localStorage.getItem("id");
                gtag('event', 'click', {
                    'event_category': 'button',
                    'event_label': 'buy'
                });
                var name = localStorage.getItem("name");
                var surname = localStorage.getItem("surname");
                var phone = localStorage.getItem("phone");
                var settlement = localStorage.getItem("settlement");

                var user_info = "Покупець:  " + surname + " " + name + "\nТелефон : " + phone + "\nнас. пункт : " + settlement;

                var order = "Замовлення\n";
                for (let i = 0; i < Cart.length; i++) {
                    let currency = ""
                    //if (Cart[i].currency== "")
                    if (Cart[i].url) {
                        //console.log(Cart[i].url)
                            //order += "<strong>id:</strong> <a href=\""+ Cart[i].url + "\"> " + Cart[i].id + "</a>";
                        //order += "<a href=\"http://www.example.com/\">inline URL</a>"
                        let url2 = "id: <a href=\""+ Cart[i].url + "\"> " + Cart[i].id + "</a>" + "\n";
                        //let url = "<a href=\""+ "http://tracktop.com.ua/technic?model=975&mark=John%20Deere&type=%D0%9A%D0%BE%D0%BC%D0%B1%D0%B0%D0%B9%D0%BD%D0%B8&number_id=222" + "\"> " + Cart[i].id + "</a>" +"\n";

                        order += url2
                        //order += url

                        // order += '<a href="'+ Cart[i].url + '"> ' + Cart[i].id + '</a> \n';
                        //order += "<a href=\""+ Cart[i].url + "\"> " + Cart[i].id + "</a> \n";

                        //order += `id товару: [${Cart[i].id}](${Cart[i].url})` + "\n";
                        //order += `id : [${Cart[i].id}](http://www.example.com)` + "\n";
                        //order += `id : [dsf}](http://www.example.com)` + "\n";

                        //order += `id : [${Cart[i].id}](${Cart[i].url})` + "\n";
                        //order += "id товару: " + "<a href='" + Cart[i].url + "'>"+ Cart[i].id +"</a>" + "\n";

                    }
                    order += "назва: " + Cart[i].title + "\n";
                    order += "ціна: " + Cart[i].price + Cart[i].currency + "\n";
                    order += "кількість: " + Cart[i].quantity + " шт.\n\n";
                    //order+=Cart[i].currency+")\n";
                }
                //console.log(order);
               // removeAll();
                alert("Дякуємо за замовлення! Найближчим часом ми з вами зв'яжемось.");
                let today = getCurrentDate();
                let message = user_info + "\n" + order;
                sendMessage(message)
                // client.sendMessage("-327577485", message, {
                //     disable_web_page_preview: true,
                //     disable_notification: false,
                //     parse_mode: "HTML"
                // });

                /////////////////////////////////////////



                var id ;
                var check_id;
                var newCheck = {
                    client_id: id,
                    purchase_date: today,
                    purchase_status: 0
                };
                var check_technic;
                function callback(error,data){
                    console.log(data);
                    if(data.error) {
                        console.log(data.error);
                    }
                    else if(!(data.data[0]==null)){
                         id = data.data[0].id;
                       // console.log(id);
                        newCheck.client_id=id;
                       // console.log(newCheck);
                         addCheck(newCheck,function (check_id) {
                             console.log("return "+check_id);
                             addCheckEquipments(check_id);
                         });

                    }
                    else if(!(data==null)){
                        id = data.data.id;
                       // console.log(id);
                        newCheck.client_id=id;
                       // console.log(newCheck);
                        addCheck(newCheck,function (check_id) {
                            console.log("return "+check_id);
                            addCheckEquipments(check_id);
                        });
                    }
                }
                require("./API").getClientbyPhone(phone,callback);

                /////////////////////////////////////////


            }
            else {
                alert("Покупки можуть здійснювати лише зареєстровані користувачі");
            }
        }
    });

    $amount.html("");
    $amount.append(amountOfOrders);
    $allPrice.html("");
    $allPrice.append(allPrice);
    $(".labelOrderDelete").click(function(){
        Cart.forEach(removeFromCart);
    });
    updateCart();
}

function addCheck(check,callback) {
    require("./API").addCheck(check, function (err, data) {
        if (data.error) console.log(data.error);
        else {
            console.log("data = "+data.insertId);
            console.log("data.data = "+data.data.insertId);
             callback(data.data.insertId);
        }
    });
}

function addCheckEquipments(check_id) {
    let carts = getTechnicsInCart();

    for(let i =0;i<carts.length;i++) {

        if(carts[i].isTech) {
            var check_technic = {
                check_id : check_id,
                technic_id: carts[i].id,
                amount : carts[i].quantity
            };
            require("./API").addCheck_technic(check_technic, function (err, data) {
                if (data.error) console.log(data.error);
                else {
                    //  console.log(data.insertId);
                    console.log("Успіх техніка");
                    //  return data.data.insertId
                }
            });
        }
        else {
            var check_technic = {
                check_id : check_id,
                equipment_id: carts[i].id,
                amount : carts[i].quantity
            };
            require("./API").addCheck_equipment(check_technic, function (err, data) {
                if (data.error) console.log(data.error);
                else {
                    //  console.log(data.insertId);
                    console.log("Успіх запчастина");
                    //  return data.data.insertId
                }
            });
        }
    }
    removeAll();
}

function getTechnicsInCart() {
    return Cart;
}

function updateCart() {
    //Функція викликається при зміні вмісту кошика
    console.log(Cart);
    $cart.html("");
    $amount.html("");
    $amount.append(amountOfOrders);
    $allPrice.html("");
    $allPrice.append(allPrice);

    if(Cart.length>0) {
        $('.circle-basket').text(Cart.length)
        $('.circle-basket').css("display", "block");
    }
    else {
        $('.circle-basket').text("0")
        $('.circle-basket').css("display", "none");
    }

    function showOne(cart_item) {
        if(cart_item.isTech)
        var html_code = Templates.technicInOrder({technic:cart_item});
        else var html_code = Templates.equipmentInOrder({equipment:cart_item});

        var $node = $(html_code);

        $node.find(".plus").click(function(){
            //Збільшуємо кількість замовлених піц
            cart_item.quantity += 1;
            allPrice += cart_item.price;
            amountOfOrders += 1;
            //Оновлюємо відображення
            updateCart();
        });

        $node.find(".minus").click(function(){
            //Збільшуємо кількість замовлених піц
            if(cart_item.quantity>1){
                cart_item.quantity -= 1;
                allPrice -= cart_item.price;
                amountOfOrders -= 1;
            }
            else removeFromCart(cart_item);
            //Оновлюємо відображення
            updateCart();
        });

        $node.find(".removeButton").click(function(){
            removeFromCart(cart_item);
        });
        $cart.append($node);
    }

    Cart.forEach(showOne);
    basil.set("orders",Cart);
    basil.set("price",allPrice);
    basil.set("amountOfOrders",amountOfOrders);
}

function removeAll(){
    Cart.forEach(function(el){
        removeFromCart(el);
    });
}

function getCurrentDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + "/" + mm + '/' + dd ;
    return today;
}


function emailIsValid (email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function writeEmail(email) {
    document.getElementById("email-ajax").value = email;
    sendAjaxForm('result_form', 'ajax_form', 'action_ajax_form.php');
}




function sendAjaxForm(result_form, ajax_form, url) {
    $.ajax({
        url:     'addUserFormSubmit', //url страницы (action_ajax_form.php)
        type:     "POST", //метод отправки
        dataType: "html", //формат данных
        data: $("#"+ajax_form).serialize(),  // Сеарилизуем объект
        success: function(response) { //Данные отправлены успешно
            result = $.parseJSON(response);
            // alert("Thank you for subscribing!")
            //$('#result_form').html('Thank you!');
        },
        error: function(response) { // Данные не отправлены
            $('#result_form').html('Ошибка. Данные не отправлены.');
        }
    });
}

getUrlParameter = function(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};




jQuery(document).ready(function ($) {
    $("#setсookieph").click(function () {
        $.cookie("pop_up_bl", "", {expires: 0});
        $("#pop_up_bl").hide()
    });
    if ($.cookie("pop_up_bl") == null) {
        setTimeout(function () {
            $("#pop_up_bl").show();
            $("#minbotph").hide()
        }, 1)
    } else {
        $("#pop_up_bl").hide();
        $("#minbotph").show()
    }
});
jQuery(document).ready(function ($) {
    $('a#stbotph').click(function (e) {
        $(this).toggleClass('active');
        $('#content1').toggle();
        e.stopPropagation()
    });

    $('a#slibotph').click(function (e) {
        $(this).toggleClass('active');
        $('#content1').toggle();
        e.stopPropagation()
    })
});

jQuery(function($){
    $("#tele_phone_call").mask("+38(999)999-9999");
});

exports.initialiseCart = initialiseCart;
exports.addToCart = addToCart;
exports.removeFromCart = removeFromCart;
exports.getTechnicsInCart = getTechnicsInCart;