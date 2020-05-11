var Templates = require('./Templates');

var basil = require('basil.js');
basil = new basil();

const { TelegramClient } = require('messaging-api-telegram');

// get accessToken from telegram [@BotFather](https://telegram.me/BotFather)
const client = TelegramClient.connect('884221604:AAEVBWl5ETesASuZ0XjXZs3DBMG0YwovKZM');


var phone = "380345452323"
var text = "Покупець: Горбач Михайло\n" +
    "телефон:"+phone+"\n Замовлення\n";


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

    $(".sendNumberButton").click(function () {
        let text = 'Передзвоніть мені, будь ласка, на ' + $("#tele_phone_call").val();
        client.sendMessage("-327577485", text, {
            disable_web_page_preview: true,
            disable_notification: false
        });
        document.getElementById('mssgresbox').innerHTML = 'Дякую, ми Вам передзвонимо';
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
        Cart.push({
            id: tech.id,
            title: tech.title,
            price: tech.price,
            currency: tech.currency,
            icon: tech.icon,
            quantity: 1,
            isTech: tech.isTech
        });
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
                    order += "назва: " + Cart[i].title + "\n";
                    order += "ціна: " + Cart[i].price + "\n";
                    order += "кількість: " + Cart[i].quantity + " шт.\n\n";
                    //order+=Cart[i].currency+")\n";
                }
                //console.log(order);
               // removeAll();
                alert("Дякуємо за замовлення! Найближчим часом ми з вами зв'яжемось.");
                var today = getCurrentDate();
                var message = user_info + "\n" + order;
                client.sendMessage("-327577485", message, {
                    disable_web_page_preview: true,
                    disable_notification: false,
                });

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

exports.initialiseCart = initialiseCart;
exports.addToCart = addToCart;
exports.removeFromCart = removeFromCart;
exports.getTechnicsInCart = getTechnicsInCart;