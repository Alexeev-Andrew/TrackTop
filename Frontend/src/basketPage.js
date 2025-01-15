let Templates = require('./Templates');
let {validatePhone, Notify} = require("./helpers")

let basil = require('basil.js');
basil = new basil();
const values = require('./values')
const API_URL = values.url;

let allPrice = 0;
let amountOfOrders = 0;

let Cart = [];

let $cart = $(".buyList");
let flag=true;

let $amount = $(".amountOfProducts");
let $allPrice = $(".amountLabel");


exports.initialiseBasket = function(){
    $('.basketBtn').click(function () {
        $('#user_info').css("display", "none");
        $('#myForm').css("display", "none");
        document.location.href = values.url + "/basket"
    })


    $('.btnSubscribeEmail').click(function () {
        let email = document.getElementById("email_subscribe_footer").value;
        checkAndSubscribeHelper(email)
    })

    $('#subscribeEmail').click(function () {
        let email = document.getElementById("email_subscribe_left_menu").value;
        checkAndSubscribeHelper(email)
    })

    $('.btnSubscribeEmailNews').click(function () {
        let email = document.getElementById("email_subscribe").value;
        checkAndSubscribeHelper(email)
    })



    function checkAndSubscribeHelper(email) {
        if(emailIsValid(email)) {
            $("#error-msg").css("display","none");
            writeEmail(email, function (err, result) {
                if(err || result.error) {
                    Notify("Ви вже підписані на новини", null, null, 'info' , 4)
                }
                else {
                    Notify("Дякуємо за підписку!", null, null, 'success' , 4)
                }
            });
        }
        else {
            Notify("Введіть вірний email", null, null, 'warning' , 4)
        }
    }



    $(".sendNumberButton").click(function () {

         let phone = $("#tele_phone_call").val();
         let text = 'Передзвоніть мені на ' + $("#tele_phone_call").val();
         if(phone.length == 16) {
             require("./API").addPhone(phone, null, () => {});
             require("./API").sendMessage({message: text }, () => {
                 $("#pop_up_bl").hide();
                 $("#minbotph").show()
                 Notify('Дякую, ми передзвонимо до Вас найближчим часом', null, null, 'success' , 4)
                 // document.getElementById('content1').style.width='300px';
                 // document.getElementById('content1').style.padding='24px';
                 // document.getElementById('mssgresbox').innerHTML = 'Дякую, ми Вам передзвонимо';
             })
         }

    });

    initialiseCart();
}

function addToCart(tech) {
    Cart = basil.get('orders');

    allPrice = basil.get('price');
    amountOfOrders = basil.get('amountOfOrders');


    Cart.forEach(function(cart_item){


        if(cart_item.id === tech.id) {

            cart_item.quantity += 1;
            allPrice += tech.price_uah;
            amountOfOrders += 1;
            flag=false;
            return;
        }
    });
    if(flag){
        allPrice += tech.price_uah;
        amountOfOrders += 1;

        Cart.push(tech);
    }
    flag=true;
    //Оновити вміст кошика на сторінці
    updateCart();
}

function removeFromCart(cart_item) {

    if(Cart.indexOf(cart_item)!=-1) {
        allPrice -= (cart_item.price_uah)*cart_item.quantity;
        amountOfOrders -= cart_item.quantity;
        delete Cart[Cart.indexOf(cart_item)];
    }
    Cart = Cart.filter(function(x) {
        return x !== undefined && x !== null;
    });
    //Після видалення оновити відображення
    updateCart();
}


function initialiseCart() {
    let savedOrders = basil.get('amountOfOrders');
    //if(!savedOrders) savedOrders = 0;
    if(savedOrders>0){
        Cart = basil.get('orders');
        //console.log(Cart)
       // if(!Cart) Cart = []

        Cart = Cart.filter(function(x) {
            return x !== undefined && x !== null;
        });
        allPrice = basil.get('price');
        //console.log(allPrice)
        amountOfOrders = basil.get('amountOfOrders');
        //console.log(amountOfOrders)
    }

    $(".orderButton").click(function () {
        if(Cart.length!=0){
            let form_anonim = document.querySelector("#buy-anonim-form")


            let order_details = $("#description").val().trim()
            let today = getCurrentDate();

            let newCheck = {
                total: allPrice,
                purchase_date: today,
                order_array: Cart
            }

            function callback(err, data) {
                let user_info = "";
                if(data.auth || window.getComputedStyle(document.querySelector(".row-col-anonim-wrapper"), null).display == "flex") {
                    if (data.auth) {
                        let user = data.user;

                        newCheck["client_id"] = user.id;

                        if (user.surname || user.name) {
                            user_info += "Покупець:  " + user.surname + " " + user.name + "\n"
                        }

                        user_info += "Телефон : " + user.phone_number;
                        if (user.settlement && user.nova_poshta_number) {
                            user_info += "\nнас. пункт : " + user.settlement + ` № ${user.nova_poshta_number}`
                        }
                    } else {
                        let data_form = new FormData(form_anonim);
                        let user_name = data_form.get("name");
                        let phone = data_form.get("phone_anonim");
                        let location = data_form.get("location");
                        let post_number = data_form.get("post_number")


                        if (!validatePhone(phone)) {
                            return alert("Перевірте введений номер телефону")
                        }

                        if (data_form.get("name")) user_info += "Покупець:  " + user_name + "\n"

                        user_info += "Телефон : " + phone.trim();

                        if (location.length >= 3 && Number.isInteger(Number(post_number))) {
                            user_info += "\nнас. пункт : " + location + ` № ${post_number}`
                        } else {
                            return alert("Перевірте дані для доставки")
                        }

                        newCheck["anonim_user"] = JSON.stringify({name: user_name, phone, location, post_number })
                    }

                    let order = "Замовлення\n";
                    for (let i = 0; i < Cart.length; i++) {
                        if (Cart[i].url) {
                            //console.log(Cart[i].url)

                            function encodeRFC3986URI(str) {
                                return encodeURI(str)
                                    .replace(/%5B/g, "[")
                                    .replace(/%5D/g, "]")
                                    .replace(
                                        /[!'()*]/g,
                                        (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`,
                                    );
                            }
                            //console.log(decodeURI(Cart[i].url))

                            let url = Cart[i].url;//Cart[i].url.replaceAll("%", '\\'); //'=?UTF-8?B?'+new Buffer(subject).toString('base64')+'?='
                            url = decodeURI(Cart[i].url);
                            url = encodeRFC3986URI(url)
                            let url2 = `id: <a href="${url}">${Cart[i].id}</a>\n`;
                            order += url2
                        }
                        order += "назва: " + Cart[i].title + "\n";
                        order += "ціна: " + Cart[i].price_uah + "грн" + "\n";
                        order += "кількість: " + Cart[i].quantity + " шт.\n\n";
                    }
                    //console.log(order);

                    let message = user_info + "\n" + order;
                    if (order_details) {
                        message += `\n Деталі замовлення: ${order_details}`
                        newCheck["comment"] = order_details 
                    }

                    require("./API").sendMessage({message: message }, () => {
                        // notify
                        Notify('Дякуємо, замовлення отримано!', null, null, 'success' , 4)
                    })


                    addCheck(newCheck,function () {
                        removeAll();
                        //document.location.href = API_URL + "/thank-you";
                    });

                }
                else {
                    console.log("here")
                    document.querySelector(".row-col-anonim-wrapper").style.display = "flex"
                }
            }
            require("./API").isLogIn(callback)
        }
    });

    $amount.html("");
    $amount.append(amountOfOrders);
    $allPrice.html("");
    $allPrice.append(allPrice + " грн");
    // $(".labelOrderDelete").click(function(){
    //     Cart.forEach(removeFromCart);
    // });
    updateCart();
}

function addCheck(check,callback) {
    require("./API").addOrder(check, function (err, data) {
        if (data.error || err) {
            callback(data.error)
            console.log(data.error);
        }
        else {
             callback(data.data.insertId);
        }
    });
}



function getTechnicsInCart() {
    return Cart;
}

function updateCart() {
    //Функція викликається при зміні вмісту кошика
    $cart.html("");
    $amount.html("");
    $amount.append(amountOfOrders);
    $allPrice.html("");
    $allPrice.append(allPrice + " грн");
    $('.label_main_count').text(Cart.length)


    if(Cart.length>0) {
        $('.circle-basket').text(Cart.length)
        $('#basket-not-empty').css("display", "block");
        $('#basket-empty').css("display", "none");
        $('.circle-basket').css("display", "block");
    }
    else {
        $('#basket-empty').css("display", "flex");
        $('#basket-not-empty').css("display", "none");
        $('.circle-basket').text("")
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
            allPrice += cart_item.price_uah;
            amountOfOrders += 1;
            //Оновлюємо відображення
            updateCart();
        });

        $node.find(".minus").click(function(){
            //Збільшуємо кількість замовлених піц
            if(cart_item.quantity>1){
                cart_item.quantity -= 1;
                allPrice -= cart_item.price_uah;
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

    // console.log(Cart)

    // console.log(allPrice)
    // console.log(amountOfOrders);

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

function writeEmail(email,callback) {
    document.getElementById("email-ajax").value = email;
    sendAjaxForm('result_form', 'ajax_form', callback);
}


function sendAjaxForm(result_form, ajax_form, callback) {
    // console.log($("#"+ajax_form).serialize())
    $.ajax({
        url:     '/addUserFormSubmit', //url страницы (action_ajax_form.php)
        type:     "POST", //метод отправки
        dataType: "html", //формат данных
        data: $("#"+ajax_form).serialize(),  // Сеарилизуем объект
        success: function(response) { //Данные отправлены успешно
            callback(null, JSON.parse(response))
            // alert("Thank you for subscribing!")
            //$('#result_form').html('Thank you!');
        },
        error: function(response) { // Данные не отправлены
            callback(JSON.parse(response), null)
            // $('#result_form').html('Ошибка. Данные не отправлены.');
        }
    });
}


exports.initialisePhonePopup = function() {
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
}




fillStar = function(count) {
    let container = $('.feedbackStarContainer')[0].childNodes;
    for(let i =0 ; i <count;i++) {
        let item = container[i];
        item.firstChild.innerHTML = fullStar
    }
    for(let i =count ; i <5;i++) {
        let item = container[i];
        item.firstChild.innerHTML = emptyStar
    }
    $('#overall-rating').val(count);

}

submitReview = function() {
    let correct = checkReview();
    let overall_rating = $('#overall-rating').val();
    let name = $('#reviewerName').val();
    let comment = $('#comment').val();
    let location = $('#reviewerLocation').val();
    let recommed_friend = $('input:radio[name=isRecommended]:checked').val();
    let review = {
        name: name,
        stars: overall_rating,
        location:location,
        recommend: recommed_friend,
        text_review: comment
    }
    if(correct) {
        hideAllErrorMsg();

        require("./API").addReview(review, function (err, data) {
            if (data.error) console.log(data.error);
            else {
                clearForm()
                alert("Дякуємо! Відгук відправлено на перевірку.")
            }
        });
    }
}

checkReview = function() {
    let overall_rating = $('#overall-rating').val();
    let name = $('#reviewerName').val();
    let comment = $('#comment').val();
    let location = $('#reviewerLocation').val();
    let recommed_friend = $('input:radio[name=isRecommended]:checked').val();
    let correct = true;
    if(overall_rating == undefined || overall_rating.trim().length == 0) {
        $('.error-msg-stars').css("height" , 'auto');
        correct = false;
    }
    else {
        $('.error-msg-stars').css("height" , 0);
    }
    if(name == undefined || name.trim().length<=1) {
        // show
        $('.error-msg-name').css("height" , 'auto');
        correct = false;
    }
    else {
        $('.error-msg-name').css("height" , 0);
    }
    if(comment == undefined || comment.trim().length<=1) {
        // show
        $('.error-msg-comment').css("height" , 'auto');
        correct = false;
    }
    else {
        $('.error-msg-comment').css("height" , 0);
    }
    if(location == undefined || location.trim().length<=1) {
        // show
        $('.error-msg-location').css("height" , 'auto');
        correct = false;
    }
    else {
        $('.error-msg-location').css("height" , 0);
    }
    if(recommed_friend == undefined || recommed_friend.trim().length<=1) {
        $('.error-msg-radio').css("height" , 'auto');
        correct = false;
    }
    else {
        $('.error-msg-radio').css("height" , 0);
    }
    return correct;
}

hideAllErrorMsg = function() {
    $('.error-msg').css("height" , 0);
}

clearForm = function() {
    hideAllErrorMsg();
    fillStar(0);
    $('#overall-rating').val("");
    $('#reviewerName').val("");
    $('#comment').val("");
    $('#reviewerLocation').val("");
    $('input:radio[name=isRecommended]').prop('checked', false);
}



let fullStar = '<path d="M16 25.19l-8.24 4.65a.9.9 0 0 1-1.33-1l1.8-9-6.86-6.26A.9.9 0 0 1 1.88 12l9.32-1.08 4-8.39a.9.9 0 0 1 1.63 0l4 8.39L30.12 12a.9.9 0 0 1 .5 1.56l-6.88 6.29 1.74 9a.9.9 0 0 1-1.33 1z" fill="#fecf0a" fill-rule="evenodd"></path>';
let emptyStar = '<path d="M16 23.21l7.13 4.13-1.5-7.62a.9.9 0 0 1 .27-.83l5.64-5.29-7.64-.93a.9.9 0 0 1-.71-.52L16 5.1l-3.22 7a.9.9 0 0 1-.71.52l-7.6.93 5.63 5.29a.9.9 0 0 1 .27.83l-1.51 7.67zm0 2l-7.9 4.58a.9.9 0 0 1-1.34-.95l1.73-9-6.65-6.3A.9.9 0 0 1 2.36 12l9-1.08 3.81-8.32a.9.9 0 0 1 1.64 0l3.81 8.32 9 1.08a.9.9 0 0 1 .51 1.55l-6.66 6.3 1.68 9a.9.9 0 0 1-1.34.94z" fill="#c5cad4" fill-rule="evenodd"></path>'
exports.initialiseCart = initialiseCart;
exports.addToCart = addToCart;
exports.removeFromCart = removeFromCart;
exports.getTechnicsInCart = getTechnicsInCart;