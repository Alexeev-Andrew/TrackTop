let values = require('../values.js');
let API_URL = values.url;

let {validatePhone , validateEmail, passwordValidation} = require("../helpers")

exports.initializeUser = function () {
    let phone = localStorage.getItem('phone');
    function callback(error,data){
        console.log(data);
        if(data.error) {
            alert( "Виникла помилка" );
        }
        else if(!(data.data[0]==null)){
            localStorage.setItem('status',true);
            console.log(data.data.photo_location);
            $('#my_avatar').attr("src", API_URL + "/images/users_photos/"+data.data[0].photo_location);
            $('#surname_value').val(data.data[0].surname);
            $('#name_value').val(data.data[0].name);
            $('#phone_value').val(data.data[0].phone_number);
            $('#email_value').val(data.data[0].email);
            $('#location_value').val(data.data[0].settelment);
            $('#location_post_office_value').val(data.data[0].nova_poshta_settlment);
            $('#post_office_number_value').val(data.data[0].nova_poshta_number);
            localStorage.setItem('status',true);
            localStorage.setItem('name',data.data[0].name);
            localStorage.setItem('surname',data.data[0].surname);
            localStorage.setItem('photo',data.data[0].photo_location);

            //closeForm();
            require('./user_form').isLogged();
        }
    }
    require("../API").getClientbyPhone(phone,callback);
}

exports.updateClient = function () {
    let prev_phone_number = localStorage.getItem('phone');

    $('#update_user_info').click(function() {
        let surname = $('#surname_value').val();
        let name = $('#name_value').val();
        let phone_number = $('#phone_value').val();
        let email_val = $('#email_value').val();
        let location = $('#location_value').val() || null;
        let post_office_number_value = $('#post_office_number_value').val() || null;

        if (email_val.trim().length != 0 && !validateEmail(email_val)) {
            return alert("Введіть вірний email");
        }
        if (!validatePhone(phone_number) ) {
            return alert("Перевірте введений номер телефону");
        }

        let cl = {
            surname: surname,
            name: name,
            email: email_val,
            phone_number: phone_number,
            settelment: location,
            nova_poshta_number :post_office_number_value,
        }
        require('../API').updateClient(cl,function(err){
            if (err) {
                console.log(err);
                require('../pagesScripts/notify').Notify("Помилка!!!",null,null,'success');
            }
            else {
                require('../pagesScripts/notify').Notify("Зміни збережено!!!",null,null,'success');
            }
        })
    });
    $('#update_user_password').click(function() {
        let change_pwd_form = document.querySelector("#change_password_form");

        let form = new FormData(change_pwd_form)

        let old_pas = $('#password_old').val();
        let pas =  $('#password_value').val();
        let conf_pas =  $('#password_confirm_value').val();

        if (pas!== conf_pas) {
            return alert("Паролі не збігаються");
        }
        let pas_check = passwordValidation(pas)
        if(pas_check.length > 0) {
            return alert(pas_check[0])
        }

        require('../API').updateClientPassword({ old_pas: old_pas, pas},
            function(err, data){
            if (data.error) {
                require('../pagesScripts/notify').Notify(data.error,null,null,'success');
            }
            else {
                change_pwd_form.reset();
                require('../pagesScripts/notify').Notify("Пароль змінено!",null,null,'success');
            }
        })
    });

}