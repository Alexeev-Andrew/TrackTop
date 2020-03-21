exports.initializeUser = function () {
    var phone = localStorage.getItem('phone');

    console.log(phone);

    function callback(error,data){
        console.log(data);
        if(data.error) {
            console.log(data.error);
            alert( "Не вірний пароль" );
        }
        else if(!(data.data[0]==null)){
            localStorage.setItem('status',true);
            //
            console.log(data.data[0].photo_location);
            $('#my_avatar').attr("src", "http://tracktop.com.ua/images/users_photos/"+data.data[0].photo_location);

            $('#surname_value').val(data.data[0].surname);
            $('#name_value').val(data.data[0].name);
            $('#phone_value').val(data.data[0].phone_number);
            $('#location_value').val(data.data[0].settelment);
            $('#location_post_office_value').val(data.data[0].nova_poshta_settlment);
            $('#post_office_number_value').val(data.data[0].nova_poshta_number);
           // $('#password_value').set(data.data[0].password);
           // $('#password_confirm_value').set(data.data[0].password);

            localStorage.setItem('name',data.data[0].name);
            localStorage.setItem('surname',data.data[0].surname);

            //closeForm();
            require('./user_form').isLogged();
        }
        else if(!(data==null)){
            localStorage.setItem('status',true);
            localStorage.setItem('name',data.data.name);
            localStorage.setItem('surname',data.data.surname);

            console.log(data.data);
            console.log(data.name);
            console.log(data.data[0].photo_location);
            $('#my_avatar').attr("src","http://tracktop.com.ua/images/users_photos/"+  data.data.photo_location);
            $('#surname_value').val(data.data.surname);
            $('#name_value').val(data.data.name);
            $('#phone_value').val(data.data.phone_number);
            $('#location_value').val(data.data.settelment);
            $('#location_post_office_value').val(data.data.nova_poshta_settlment);
            $('#post_office_number_value').val(data.data.nova_poshta_number);
           // closeForm();
            require('./user_form').isLogged();
        }
    }

    require("../API").getClientbyPhone(phone,callback);

}

exports.updateClient = function () {
    var prev_phone_number = localStorage.getItem('phone');

    function callback(error,data) {
        console.log(data);
        if (data.error) {
            console.log(data.error);
            alert("Не вірний пароль");
        }
        else if (!(data.data[0]==null)){

        }
        else if(!(data==null)) {

        }
    }

    $('#update_user_info').click(function() {

        var surname = $('#surname_value').val();
        var name = $('#name_value').val();
        var phone_number = $('#phone_value').val();
        var location = $('#location_value').val();
        var location_post_office_value = $('#location_post_office_value').val();
        var post_office_number_value = $('#post_office_number_value').val();
        var pas =  $('#password_value').val();
        var conf_pas =  $('#password_confirm_value').val();

        if(pas!== conf_pas) alert("Паролі не збігаються");
        var cl = {
            surname: surname,
            name: name,
            phone_number: phone_number,
            settelment: location,
            nova_poshta_settlement:location_post_office_value,
            nova_poshta_number :post_office_number_value,
            hash: pas
        }
       // var db = require("./");
    });

    require("../API").getClientbyPhone(prev_phone_number,callback);
}