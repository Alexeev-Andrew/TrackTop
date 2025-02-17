let {hideToggleModal} = require("../helpers")
let {isLogged} = require('./user_form')
let user_info_dispalyed = false;

exports.openForm = function() {

    document.addEventListener("click", function (event) {
        if (!$(event.target).closest('#user_info').length) {
            if (user_info_dispalyed) {
                $('#user_info').hide();
                user_info_dispalyed = false;
            }
        }
    });


    let isLogin = false;
    function callback(err, data) {
        if(data.auth) {
            isLogin = true;
            userInfo();
        } else {
            toggleModal("#login-modal");
        }

    }
    require("../API").isLogIn(callback)
}

toggleModal = function(selector) {
    $(document.querySelector(selector)).modal('toggle');
}


userInfo = function() {
    if(user_info_dispalyed) {
    document.getElementById("user_info").style.display = "none";
        user_info_dispalyed = false;
    }
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
            if (data.error) {
                console.log(data.error);
                alert("Помилка. Перевірте введені дані");
            }
            else {

                let loc = document.location.href;
                if (loc.includes("/basket")) {
                    document.querySelector(".row-col-anonim-wrapper").style.display = "none"
                }

                //console.log(data);

                if (!(data == null)) {
                    localStorage.setItem('status', true);
                    localStorage.setItem('id', data.data.id);
                    localStorage.setItem('name', data.data.name);
                    localStorage.setItem('surname', data.data.surname);
                    localStorage.setItem('phone', data.data.phone_number);
                    localStorage.setItem('settlement', data.data.settelment);
                    localStorage.setItem('photo', data.data.photo_location);

                    
                    toggleModal("#login-modal");
                    hideToggleModal()
                    isLogged();
                }
            }
        })
    });
}


