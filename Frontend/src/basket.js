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
}

function closeNav() {
    $("#basketColumn").removeClass("widthR");
    $("#main").removeClass("margR");
    $(".header").removeClass("margR");
    $("#myForm").removeClass("margR");
}

exports.initialiseBasket = function(){
    $('.basketBtn').click(function () {
        openNav();
    })

    $('.basketCloseBtn').click(function () {
        closeNav();
    })

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
        amountOfOrders += 1;
        Cart.push({
            title: tech.title,
            price: tech.price,
            currency: tech.currency,
            icon: tech.icon,
            quantity: 1
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

            var status = localStorage.getItem("status");
            if(status) {
                var name = localStorage.getItem("name");
                var surname = localStorage.getItem("surname");
                var phone = localStorage.getItem("phone");
                var settlement = localStorage.getItem("settlement");

                var user_info = "Покупець:" + surname + " " + name + "\nТелефон : " + phone + "нас. пункт : " + settlement;

                var order = "Замовлення\n";
                for (let i = 0; i < Cart.length; i++) {
                    order += "назва: " + Cart[i].title + "\n";
                    order += "ціна: " + Cart[i].price + "\n";
                    order += "кількість: " + Cart[i].quantity + " шт.\n";
                    //order+=Cart[i].currency+")\n";
                }
                //console.log(order);
                var message = user_info + "\n" + order;
                client.sendMessage("-327577485", message, {
                    disable_web_page_preview: true,
                    disable_notification: false,
                });
                removeAll();
                alert("Дякуємо за замовлення! Найближчим часом ми з вами зв'яжемось.");
                var today = getCurrentDate();
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
        var html_code = Templates.technicInOrder({technic:cart_item});

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

    today = mm + '/' + dd + '/' + yyyy;
    return today;
}

exports.initialiseCart = initialiseCart;
exports.addToCart = addToCart;
exports.removeFromCart = removeFromCart;
exports.getTechnicsInCart = getTechnicsInCart;










