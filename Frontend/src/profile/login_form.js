let {hideToggleModal} = require("../helpers")

let user_info_dispalyed = false;

exports.openForm = function() {
    let isLogin = false;
    function callback(err, value) {
        if(value) {
            isLogin = true;
            userInfo();
        } else {
            toggleModal("#login-modal");
        }

    }
    require("../API").isLogIn(callback)

    // document.getElementById("myForm").style.display = "block";

}

toggleModal = function(selector) {
    $(document.querySelector(selector)).modal('toggle');
}


userInfo = function() {
    if(user_info_dispalyed) {
    document.getElementById("user_info").style.display = "none";
        user_info_dispalyed = false;}
    else {
        document.getElementById("user_info").style.display = "block";
        user_info_dispalyed = true;
    }
}

exports.userInfo = userInfo;


exports.login = function(){
    $('#log_in_btn').click(function() {
        let form = new FormData(document.querySelector("#login-form"))
        let phone = form.get("phone")
        let password = form.get("password")

        require("../API").sign_in({
            phone_number: phone,
            password: password
        }, function (err,data) {
                    if(data.error) {
                        console.log(data.error);
                        alert( "Невірний пароль" );
                    }
                    else if(!(data.data[0]==null)){
                        // console.log(data.data[0].token)
                        localStorage.setItem('status',true);
                        localStorage.setItem('id',data.data[0].id);
                        localStorage.setItem('name',data.data[0].name);
                        localStorage.setItem('surname',data.data[0].surname);
                        localStorage.setItem('phone',data.data[0].phone_number);
                        localStorage.setItem('settlement',data.data[0].settelment);
                        localStorage.setItem('photo',data.data[0].photo_location);
                        toggleModal("#login-modal");
                        hideToggleModal()
                        require('./user_form').isLogged();
                    }
                    else if(!(data==null)){
                        console.log(data.data.token)
                        localStorage.access_token = data.data.token;
                        localStorage.setItem('status',true);
                        localStorage.setItem('id',data.data.id);
                        localStorage.setItem('name',data.data.name);
                        localStorage.setItem('surname',data.data.surname);
                        localStorage.setItem('phone',data.data.phone_number);
                        localStorage.setItem('settlement',data.data.settelment);
                        localStorage.setItem('photo',data.data.photo_location);
                        toggleModal("#login-modal");
                        hideToggleModal()
                        require('./user_form').isLogged();
                    }
        });

    });
}


