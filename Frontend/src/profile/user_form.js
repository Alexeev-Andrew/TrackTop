let values = require('../values.js');
let API_URL = values.url;
let { hideToggleModal} = require("../helpers")

exports.isLogged = function () {
    let name = localStorage.getItem('name');
    let surname = localStorage.getItem('surname');
    let status = localStorage.getItem('status');
    let phone = localStorage.getItem('phone');
    let photo_location = localStorage.getItem("photo");

    if(status) {
        // add info to panel
        $('.menu-user-name').html(surname + " " + name);
        $('.menu-user-phone').html(phone);
        $('.menu-item-auth').hide()
        // hide error non login user
        $("#logged-user-err").css("display","none")
    }
    else {
        $('.menu-user-name').html("");
        $('.menu-user-phone').html("");
        $('.menu-item-auth').show()
    }
}

exports.openLogin = function(){
    $('#full_name').html('<b>' +surname + " " + name + '</b>');
    $('#user_phone').html('<b>' + phone + '</b>');
    $('#user_photo').css("display","block");
    $('#login').css("display", "none");
    $('#signup').css("display", "none");
}

exports.deleteInfoFromLocalStorage = function() {
    require("../API").logOut( function (err, data) {
        if(!err) {
            localStorage.removeItem("status");
            localStorage.removeItem("phone");
            localStorage.removeItem("name");
            localStorage.removeItem("settlement");
            localStorage.removeItem("surname");
            localStorage.removeItem("photo");
            localStorage.clear();

            $('#user_info').css("display", "none");
            hideToggleModal();
            require("./user_form").isLogged();
            document.location.href = '/'
        }

    });

}