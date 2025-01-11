

exports.hideToggleModal = function () {
    $( "#menuToggle .menu-wrapper-background" ).removeClass("toggleMenuLeftOpen");
    $( "#menuToggle  .menuToggleSpans" ).removeClass("menuToggleSpanOpen");
    $( "#menuToggle  .menuToggleSpans:nth-last-child(3)" ).removeClass("child-3");
    $( "#menuToggle  .menuToggleSpans:nth-last-child(2)" ).removeClass("child-2");
    $( "body" ).removeClass("bodyOverflowHidden");
}

exports.showToggleModal = function () {
    $( "body" ).addClass("bodyOverflowHidden");
    $( "#menuToggle .menu-wrapper-background" ).addClass("toggleMenuLeftOpen");
    $( "#menuToggle  .menuToggleSpans" ).addClass("menuToggleSpanOpen");
    $( "#menuToggle  .menuToggleSpans:nth-last-child(3)" ).addClass("child-3");
    $( "#menuToggle  .menuToggleSpans:nth-last-child(2)" ).addClass("child-2");
}


exports.onSendMessageClick = function () {
    $(".send-message-one-ad").click( function (e) {
        let ask_question_one_ad_form = document.querySelector("#ask-question-one-ad")
        let form = new FormData(ask_question_one_ad_form)
        let phone = form.get("phone")
        let message = form.get("message");
        let name = localStorage.getItem("name") || "";
        if(!validatePhone(phone)) {
            Notify("Перевірте введений телефон")
            return
        }
        if (message.trim().length < 5) {
            Notify("Повідомлення надто коротке")
            return
        }
        let text_message = `Від: ${name}\n` + phone + "\nСтосовно: " + $(".one-ad-header").text() + "\nПовідомлення: " + message;

        require("./API").sendMessage({message: text_message }, () => {
            ask_question_one_ad_form.reset();
            Notify('Повідомлення відправлено!', null, null, 'success' , 4)
        })
    })
}

exports.clearMessageModal = function (selectorForm) {
    $(selectorForm).reset()
}

validatePhone = function(phone) {
    let reg = /^\+?3?8?(0[5-9][0-9]\d{7})$/
    let phoneno = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
    if(phone.match(reg)) {
        return true;
    }
    else {
        return false;
    }
}

exports.validatePhone = validatePhone

exports.validateEmail = function(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

exports.passwordValidation = function(password) {
    let arrError = [];
    let re = /^\w+$/;
    if(!re.test(password)) {
        arrError.push("Пароль повинен містити тільки літери, цифри та нижнє підкреслення")
        return arrError;
    }

    if(password != "") {
        if (password.length < 5) {
            arrError.push("Короткий пароль. Введіть довший пароль")
            return arrError;
        }
    }

    re = /[0-9]/;
    if(!re.test(password)) {
        arrError.push("Пароль повинен містити як мінімум одну цифру, літеру нижньго та верхнього регістру")
        return arrError;
    }

    re = /[a-z]/;
    if(!re.test(password)) {
        arrError.push("Пароль повинен містити як мінімум одну цифру, літеру нижньго та верхнього регістру")
        //arrError.push("Пароль повинен містити як мінімум одну літеру нижнього регістру")
        return arrError;
    }

    re = /[A-Z]/;
    if(!re.test(password)) {
        arrError.push("Пароль повинен містити як мінімум одну цифру, літеру нижньго та верхнього регістру")
        return arrError;
    }
    return arrError;
}

function Notify(text, callback, close_callback, style, seconds) {
    // 4 types  :  danger, warning, info, success (default is warning)
    let time = "2000";
    if(seconds) time = seconds * 1000;

    var $container = $('#notifications');
    var icon = '<i class="fa fa-info-circle " aria-hidden="true"></i>';

    if (typeof style == 'undefined' ) style = 'warning'

    var html = $('<div class="alert alert-' + style + '  hide">' + icon +  " " + text + '</div>');

    $('<a>',{
        text: '×',
        class: 'button close',
        style: 'margin-left: 10px;',
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

exports.Notify = Notify

exports.getUrlParameter = function(sParam) {
    let sPageURL = window.location.search.substring(1),
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

exports.toMainPageBreadcrumb = function () {
    return `<li>
        <a href="/">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
                <g clip-path="url(#clip0_147_2554)">
                    <path
                        d="M19.2858 9.91387C19.2872 9.71557 19.2473 9.51915 19.1686 9.33713C19.0899 9.15512 18.9741 8.9915 18.8287 8.85672L10.0001 0.713867L1.17153 8.85672C1.02614 8.99156 0.910406 9.15518 0.831703 9.33718C0.752999 9.51919 0.713046 9.71558 0.714388 9.91387V17.8567C0.714388 18.2356 0.864898 18.599 1.13281 18.8669C1.40072 19.1348 1.76408 19.2853 2.14296 19.2853H17.8572C18.2361 19.2853 18.5995 19.1348 18.8674 18.8669C19.1353 18.599 19.2858 18.2356 19.2858 17.8567V9.91387Z"
                        stroke="#2F9321" stroke-width="1.71429" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M10 19.2856V13.5713" stroke="#2F9321" stroke-width="1.71429" stroke-linecap="round"
                          stroke-linejoin="round"/>
                </g>
                <defs>
                    <clipPath id="clip0_147_2554">
                        <rect width="20" height="20" fill="white"/>
                    </clipPath>
                </defs>
            </svg>
    </li>`
}