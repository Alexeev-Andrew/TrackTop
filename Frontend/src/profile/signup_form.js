const modal = document.getElementById('register-modal');

const Templates = require('../Templates');

let $reviews =   $('#reviews');
let values = require('../values.js');
const API_URL = values.url;
let {clearMessageModal , Notify, validatePhone, passwordValidation, hideToggleModal} = require("../helpers")


exports.initializeLogin = function(){
    $('#signup_btn').click(function() {
        let [isValid, error] = checkValidation();
        //console.log(isValid, error)
        let name = $('#register-modal input[name=name]')[0].value;
        let surname = $('#register-modal input[name=surname]')[0].value;
        let phone = $('#register-modal input[name=phone]')[0].value;
        let password = $('#register-modal input[name=psw]')[0].value;
        let address = $('#register-modal input[name=location]')[0].value;
        let email = $('#register-modal input[name=email]')[0].value;

        if (isValid) {
            function callback(error,data){
                if(data.error) {
                    console.log(data.error)
                    console.log(error)
                    alert( "Виникла помилка" );
                }
                else if(!(data.data[0]==null)){
                    Notify("Вже існує користувач з таким телефоном")
                }
                else {
                    let newT = {
                        surname: surname,
                        name: name,
                        phone_number: phone,
                        settelment: address,
                        email: email,
                        hash: password
                    }
                    // console.log(newT);
                    require("../API").addClient(newT, function (err, data) {
                        console.log(err , data)
                        if (data.error) {
                            Notify("Виникла помилка, перевірте дані або спробуйте пізніше")
                        }
                        else {
                            $("#register-modal").modal("toggle");
                            document.getElementById("reg-form").reset();
                            hideToggleModal()
                            Notify("Вітаю! Профіль створено, тепер вам потрібно увійти")
                        }
                    });
                }
            }
            require("../API").getClientbyPhone(phone,callback);
        }
        else {
                Notify(error)
            }

    });
}

checkValidation = function(){
    let $name = $('#register-modal input[name=name]')[0];
    let $surname = $('#register-modal input[name=surname]')[0];
    let $phone = $('#register-modal input[name=phone]')[0];
    let $password = $('#register-modal input[name=psw]')[0];
    let $address = $('#register-modal input[name=location]')[0];
    let $email = $('#register-modal input[name=email]')[0];


    let phone = $phone.value;
    let password = $password.value;

    if(!validatePhone(phone)) {
        $phone.focus();
        return [false, "Перевірте введений телефон"];
    }

    if(passwordValidation(password).length >= 1) {
        $password.focus();
        return [false, passwordValidation(password)[0]];
    }

    // let phoneno = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
    // if(!phoneno.test(phone)) {
    //     alert("Введіть дісний номер\n" +
    //         "Приклад 093-345-3456");
    //     return false;
    // }

    return [true, null];
}

checkMessageForm = function () {
    let $name = $('#messageModal input[name=name]')[0];
    let $phone = $('#messageModal input[name=phone]')[0];
    let $message = $('#messageModal textarea[name=message]')[0];
   // var $address = $('#messageModal input[name=location]')[0];

    let name = $name.value;
    let phone = $phone.value;
    let message = $message.value;
       // var address = $address.value;

        if (name == "")
        {
            window.alert("Введіть ім'я");
           // name.focus();
            return false;
        }

        if (message == "")
        {
            window.alert("Введіть повідомлення");
           // message.focus();
            return false;
        }

    if (phone == "")
    {
        window.alert("Введіть телефон");
       // phone.focus();
        return false;
    }

    var phoneno = ///^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
    /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
    if(!phoneno.test(phone)) {
        alert("Введіть дісний номер\n" +
            "Приклад 093-345-3456");
        return false;
    }

    return true;
}


exports.sendMessageCardHandler = function () {
    $(".write-message-card").click(function (e) {
        e.stopPropagation()
        e.preventDefault();
    })
}

sendMessage_My = function (i) {
    if(checkMessageForm()) {

        let name = $('#messageModal input[name=name]')[0].value;
        let phone = $('#messageModal input[name=phone]')[0].value;
        let text = $('#messageModal textarea[name=message]')[0].value;
        let productId = $('#messageModal').attr("data-productid");
        let productTitle = $('#messageModal').attr("data-producttitle")
        let productUrl = $('#messageModal').attr("data-url")


        // model_message.style.display = "none";
        $('#messageModal').modal('toggle');
        let message = "Від " + name + "\n тел: " + phone + "\n";
        // let curr =  localStorage.getItem('currTechnic');

        if (productId || productTitle) {
            message += `Стосовно: <a href="${productUrl}">${productTitle} </a>\n`
        } else if (document.getElementsByClassName("type_header").length!=0) {
            message += "Стосовно: " + document.getElementsByClassName("type_header")[0].innerText + "\n";
        }
        message += "Повідомлення: " + text;
        //console.log(message);
        require("../API").addPhone(phone, name, () => {});

        require("../API").sendMessage({message}, () => {
            Notify("Повідомлення відправлено!!!",null,null,'success');
            clearMessageModal(".message-form")
        })
    }
}


openSendMessageModal = function ({productId, productTitle, url } = {}) {

    $('#messageModal').modal('show');
   // $('#messageModal').on('shown.bs.modal', function(e) {
    $('#user_info').css("display", "none");
    $('#messageModal').attr("data-productId", productId)
    $('#messageModal').attr("data-productTitle", productTitle)
    $('#messageModal').attr("data-url", url)

    let status = localStorage.getItem('status');

    if(status) {
        let name = localStorage.getItem("name");
        let surname = localStorage.getItem("surname");
        if (name || surname) {
            $("#username_messageForm").val(name+" "+ surname);
        }
        $("#phone_messageForm").val(localStorage.getItem("phone"));
        $("#phone_messageForm").attr("disabled", true);
        $("#message").val("");
        }
        else {
            clearMessageModal(".message-form")
        }
}

exports.openSendMessageModal = openSendMessageModal;

function createCookie(name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    else {
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}

const getDeviceType = () => {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return "tablet";
    }
    if (
        /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
            ua
        )
    ) {
        return "mobile";
    }
    return "desktop";
};

exports.openSubscribeModal = function(){

    $('.one-social-item-modal').on('click', function() {
        createCookie('visited', 'yes', 7);
    });

    let device = getDeviceType();
    if(device == "mobile" || device == "tablet") {

            $(window).scroll(function() {

                let offset = 700;

                if($(".technics") && $(".technics").children().length <= 4) offset = 500;
                //console.log(offset)

                if($(window).scrollTop() > $(document).height() - $(window).height() - $(".footer").height() - $(".descr_bottom").height() -  $("#hide_desc").height() -$(".footer-sub").height()  - offset) {
                    let cookie = getCookie('visited');
                    let href = document.location.href.toString();
                    while (href.endsWith("#") || href.endsWith("/")) {
                        href = href.substring(0, href.length-1);
                    }
                    //console.log(document.location.href + "  \n" + API_URL)
                    if ('' == cookie && href!= API_URL) {
                        $('#subscribeModal').modal('show');
                        // $('#messageModal').on('shown.bs.modal', function(e) {
                        $('#user_info').css("display", "none");
                        $('#myForm').css("display", "none");
                        createCookie('visited', 'yes', 7);
                    }
                }
            });
    }
    $('body').on('mouseleave', function() {
        let cookie = getCookie('visited');
        if ('' == cookie) {
            $('#subscribeModal').modal('show');
            // $('#messageModal').on('shown.bs.modal', function(e) {
            $('#user_info').css("display", "none");
            $('#myForm').css("display", "none");
            createCookie('visited', 'yes', 7);
        }
    });
}

Notify = function(text, callback, close_callback, style) {

    var time = '20000';
    var $container = $('#notifications');
    var icon = '<i class="fa fa-info-circle "></i>';

    if (typeof style == 'undefined' ) style = 'warning'

    var html = $('<div class="alert alert-' + style + '  hide">' + icon +  " " + text + '</div>');

    $('<a>',{
        text: '×',
        class: 'button close',
        style: 'padding-left: 10px;',
        href: '#',
        click: function(e){
            e.preventDefault()
            close_callback && close_callback()
            remove_notice()
        }
    }).prependTo(html)

    $container.prepend(html)
    html.removeClass('hide').hide().fadeIn('slow')

    function remove_notice() {
        html.stop().fadeOut('slow').remove()
    }

    var timer =  setInterval(remove_notice, time);

    $(html).hover(function(){
        clearInterval(timer);
    }, function(){
        timer = setInterval(remove_notice, time);
    });

    html.on('click', function () {
        clearInterval(timer)
        callback && callback()
        remove_notice()
    });


}

sendReview = function (i) {

    let status = localStorage.getItem("status");

    if(status) {

        let id;
        var phone = localStorage.getItem("phone");
        var name = $('#reviewModal input[name=name]')[0].value;

        var text = $('#reviewModal textarea[name=message]')[0].value;

        var recommend = $('#reviewModal input[name=Like]:checked').val();
        let review = {
            text_review : text,
            show:true,
            client_id:id,
            recommend:recommend
        }

        function callback(error,data){
            console.log(data);
            if(data.error) {
                console.log(data.error);
            }
            else if(!(data.data[0]==null)){
                review.client_id = data.data[0].id;
                require("../API").addReview(review, function (err, data) {
                    if (data.error) console.log(data.error);
                    else {
                        console.log("success");
                        // console.log("data.data = "+data.data.insertId);
                    }
                });
            }
            else if(!(data==null)){
                review.client_id = data.data.id;
                require("../API").addReview(review, function (err, data) {
                    if (data.error) console.log(data.error);
                    else {
                        console.log("success");
                        // console.log("data.data = "+data.data.insertId);
                    }
                });
            }
        }

        require("../API").getClientbyPhone(phone,callback);

        // document.getElementById("phone").mask('+380 (99) 999-99-99');
        // e.preventDefault();
        const {TelegramClient} = require('messaging-api-telegram');

// get accessToken from telegram [@BotFather](https://telegram.me/BotFather)
        const client = TelegramClient.connect('884221604:AAEVBWl5ETesASuZ0XjXZs3DBMG0YwovKZM');
//event.preventDefault();


        // model_message.style.display = "none";
        $('#reviewModal').modal('toggle');
        let message = "Користувач " + name + " залишив відгук :\n" + text ;
        // let curr =  localStorage.getItem('currTechnic');


        client.sendMessage("-327577485", message, {
            disable_web_page_preview: true,
            disable_notification: false,
        });
        Notify("Дякуємо за відгук!!!",null,null,'success');
        // console.log("fsdf");
    }
    else {
        alert("Зареєструйтесь, щоб залишити відгук");
    }
}

openReviewModal = function () {
    $('#reviewModal').modal('show');
    let status = localStorage.getItem("status");
    if(status) {
        let name = localStorage.getItem("name");
        let surname = localStorage.getItem("surname");
        $("#username_reviewForm").val(name+" "+ surname);
        $("#username_reviewForm").attr("disabled", true);
    }
}

$(function(){
    if(document.location.href == "tracktop.com.ua/reviews")
        initializeReviews();
});


function showReviews(list) {

    $reviews.html("");

    function showOne(type) {
        var html_code = Templates.oneReview({item: type});

        var $node = $(html_code);
        $reviews.append($node);
    }

    list.forEach(showOne);
}

initializeReviews = function(){

    let l=[];

    require("../API").getReviews(function (err,data) {
        if(data.error) console.log(data.error);
        data.data.forEach(function(item){
            l.push(item)
        });
        showReviews(l);
    });

}
