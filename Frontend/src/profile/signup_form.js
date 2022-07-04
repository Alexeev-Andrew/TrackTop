var modal = document.getElementById('id01');
var model_message = document.getElementById('messageModal');

function openSignUpForm() {
    modal.style.display='block';
}
var Templates = require('../Templates');

var $reviews =   $('#reviews');
var values = require('../values.js');
var API_URL = values.url;


exports.initializeLogin = function(){
    $('#signup').click(function() {
        $('#myForm').css("display", "none");
        openSignUpForm();
        addClient();
    });

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {

        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

var $name = $('#id01 input[name=name]')[0];
var $surname = $('#id01 input[name=surname]')[0];
var $phone = $('#id01 input[name=phone]')[0];
var $password = $('#id01 input[name=psw]')[0];
var $address = $('#id01 input[name=location]')[0];
var $email = $('#id01 input[name=email]')[0];

checkValidation = function(){
    var name = $name.value;
    var surname = $surname.value;
    var phone = $phone.value;
    var password = $password.value;
    var address = $address.value;

    if (name.value == "")
    {
        name.focus();
        return false;
    }

    if (address.value == "")
    {
        address.focus();
        return false;
    }

  /*  /^(\([0-9]{3}\)\s*|[0-9]{3}\-)[0-9]{3}-[0-9]{4}$/

        '123-345-3456';
    '(078)789-8908';
    '(078) 789-8908';
    */
    var phoneno = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
    if(!phoneno.test(phone)) {
        alert("Введіть дісний номер\n" +
            "Приклад 093-345-3456");
        return false;
    }

    var regularExpression  = /^[a-zA-Z0-9!@#$%^&*]{4,16}$/;

    if (password.length < 4 )
    {
        window.alert("Слабкий пароль");

        password.focus();
        return false
    }

    if(!regularExpression.test(password)) {
        alert("Пароль повинен містити як мінімум 1 цифру та 1 спеціальний символ");
        return false;
    }

    return true;
}

checkMessageForm = function () {
    var $name = $('#messageModal input[name=name]')[0];
    var $phone = $('#messageModal input[name=phone]')[0];
    var $message = $('#messageModal textarea[name=message]')[0];
   // var $address = $('#messageModal input[name=location]')[0];

        var name = $name.value;
        var phone = $phone.value;
        var message = $message.value;
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

function addClient(){
    $('#signup_btn').click(function() {
        document.getElementById('id01').style.display='none'
       // if (checkValidation()) {
        var name = $name.value;
        var surname = $surname.value;
        var phone = $phone.value;
        var password = $password.value;
        var address = $address.value;
        var email = $email.value;

        var newT = {
            surname: surname,
            name: name,
            phone_number: phone,
            settelment: address,
            email: email,
            hash: password
        }
       // console.log(newT);
        require("../API").addClient(newT, function (err, data) {
            if (data.error) console.log(data.error);
            else {
                //TODO: сделать вызов авторизации
                localStorage.setItem('status',true);
                localStorage.setItem('name',name);
                localStorage.setItem('surname',surname);
                localStorage.setItem('phone',phone);
                localStorage.setItem('settlement',address);
                require('./user_form').isLogged();
            }
        });
       // }

    });
}

sendMessage_My = function (i) {
    if(checkMessageForm()) {


        // document.getElementById("phone").mask('+380 (99) 999-99-99');
        // e.preventDefault();
        const {TelegramClient} = require('messaging-api-telegram');

// get accessToken from telegram [@BotFather](https://telegram.me/BotFather)
        const client = TelegramClient.connect('884221604:AAEVBWl5ETesASuZ0XjXZs3DBMG0YwovKZM');
//event.preventDefault();
        var name = $('#messageModal input[name=name]')[0].value;

        var phone = $('#messageModal input[name=phone]')[0].value;
        var text = $('#messageModal textarea[name=message]')[0].value;


        // model_message.style.display = "none";
        $('#messageModal').modal('toggle');
        let message = "Від " + name + "\n тел: " + phone + "\n";
        // let curr =  localStorage.getItem('currTechnic');
        if (document.getElementsByClassName("type_header").length!=0) message += "Стосовно: " + document.getElementsByClassName("type_header")[0].innerText + "\n";
        message += text;
        console.log(message);
        require("../API").addPhone(phone, name);
        client.sendMessage("-327577485", message, {
            disable_web_page_preview: true,
            disable_notification: false,
        });
        Notify("Повідомлення відправлено!!!",null,null,'success');
        // console.log("fsdf");
         }
}

openMessageModal = function () {

    $('#messageModal').modal('show');
   // $('#messageModal').on('shown.bs.modal', function(e) {
    $('#user_info').css("display", "none");
    $('#myForm').css("display", "none");
        var status = localStorage.getItem('status');
        //console.log("");
        var $modal = $(this);
        // esseyId = e.relatedTarget.id;

//            $.ajax({
//                cache: false,
//                type: 'POST',
//                url: 'backend.php',
//                data: 'EID='+essay_id,
//                success: function(data)
//                {

        if(status) {
            console.log("status is true");

            let name = localStorage.getItem("name");
            let surname = localStorage.getItem("surname");
            $("#username_messageForm").val(name+" "+ surname);
            $("#username_messageForm").attr("disabled", true);
            $("#phone_messageForm").val(localStorage.getItem("phone"));
            $("#phone_messageForm").attr("disabled", true);
            $("#message").val("");
        }
        else {
           // $("#username_messageForm").val("");
           // $("#phone_messageForm").val("");
            $("#message").val("");
        }

//                }
//            });

    //})
}

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
        createCookie('visited', 'yes', 30);
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

//
// showAllReviews = function () {
//     function callback(err,data) {
//         data.data.forEach(function(item){
//             if(item.show)
//
//         });
//
//     }
//     require("../API").getReviews(callback);
// }

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

    var l=[];

    require("../API").getReviews(function (err,data) {
        if(data.error) console.log(data.error);
        data.data.forEach(function(item){
            l.push(item)
        });
        showReviews(l);
    });

}


openSignUpFormBasket = function() {
    $('#myForm').css("display", "none");
    openSignUpForm();
    addClient();
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {

        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

exports.openSignUpFormBasket = openSignUpFormBasket
