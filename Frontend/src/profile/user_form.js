let values = require('../values.js');
let API_URL = values.url;

exports.isLogged = function () {
    var name = localStorage.getItem('name');
    var surname = localStorage.getItem('surname');
    var status = localStorage.getItem('status');
    var phone = localStorage.getItem('phone');
    var photo_location = localStorage.getItem("photo");
    if(status) {
        console.log('status true');
        // add info to panel
        $('#full_name').html('<b>' +surname + " " + name + '</b>');
        $('#user_phone').html('<b>' + phone + '</b>');
        $('#user_photo').css("display","block");
        if(photo_location==null) {
            $('#user_photo').attr("src", "assets/images/avatar.png");
        }
       else  $('#user_photo').attr("src", API_URL + "/images/users_photos/"+photo_location);
        $('#login').css("display", "none");
        $('#signup').css("display", "none");

        // hide error non login user
        $("#logged-user-err").css("display","none")
    }
    else {
        $('#user_photo').css("display","none");
        $('#login').css("display","block");
        $('#signup').css("display","block");
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
    localStorage.removeItem("status");
    localStorage.removeItem("phone");
    localStorage.removeItem("name");
    localStorage.removeItem("settlement");
    localStorage.removeItem("surname");
    localStorage.removeItem("photo");
    localStorage.clear();
    require("./user_form").isLogged();
}

exports.openUserEditPage = function () {
    
}
