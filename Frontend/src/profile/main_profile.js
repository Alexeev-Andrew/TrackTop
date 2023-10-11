let values = require('../values.js');
let API_URL = values.url;

$(function(){

    let phone = localStorage.getItem('phone');


    // var $surname = $('#surname_value')[0];
    // var $name = $('#name_value')[0];
    // var $phone_value = $('#phone_value')[0];
    // var $password_value = $('#password_value')[0];
    // var $password_confirm_value = $exit_btn('#password_confirm_value')[0];
    // var $location_value = $('#location_value')[0];
    // var $location_post_office_value = $('#location_post_office_value')[0];
    // var $post_office_number_value = $('#post_office_number_value')[0];



    $('#logo').click(function () {
        document.location.href = API_URL;
    })

    $('#login').click(function() {
        require('./login_form').openForm();
    })

    $('.cancel').click(function() {
        require('./login_form').closeForm();
    })

    $('.log-sign').click(function() {
        require('./login_form').userInfo();
    })

    require('../basketPage').initialiseBasket();

    // added
    $('.exit_btn').click(function() {
        logout()
    })

    let logout = function( ) {
        require('./user_form').deleteInfoFromLocalStorage();
        document.location.href = API_URL;
    }

    $('.toMainPageBtn').click(function() {
        document.location.href = API_URL;
    })

    $('#photo_input').change(function (event) {
        let image = document.getElementById('my_avatar');
        image.src = URL.createObjectURL(event.target.files[0]);
        $('#user_photo').attr("src", URL.createObjectURL(event.target.files[0]));

        let id = localStorage.getItem('id');
        let phone = localStorage.getItem('phone');


        require('../API').uploadUserPhoto(event.target.files[0], phone, function(err,data){
            if(err || data.error){}
            else {
                console.log(data)
                //localStorage.setItem('photo',event.target.files[0].name);

                // require('../API').updateClient(id,{
                //     photo_location: event.target.files[0].name,
                //     phone_number: $phone_value.value
                // },function(err){
                //     if (err) console.log(err);
                //     else {
                //         $('#user_photo').attr("src", API_URL+"/images/users_photos/"+event.target.files[0].name);
                //     }
                // })
            }
        })
    })

    // $('#update_user_info').click(function(){
    //     console.log("here")
    //     // var $surname = $('#surname_value')[0];
    //     // var $name = $('#name_value')[0];
    //     // var $phone_value = $('#phone_value')[0];
    //     // var $password_value = $('#password_value')[0];
    //     // var $password_confirm_value = $('#password_confirm_value')[0];
    //     // var $location_value = $('#location_value')[0];
    //     // var $location_post_office_value = $('#location_post_office_value')[0];
    //     // var $post_office_number_value = $('#post_office_number_value')[0];
    //
    //     var id = localStorage.getItem('id');
    //     require('../API').updateClient(id,{
    //         surname: $surname.value,
    //         name: $name.value,
    //         phone_number: $phone_value.value,
    //         settelment: $location_value.value,
    //         nova_poshta_settlment: $location_post_office_value.value,
    //         nova_poshta_number: $post_office_number_value.value
    //     },function(err){
    //         if (err) {
    //             console.log(err);
    //             require('../pagesScripts/notify').Notify("Помилка!!!",null,null,'success');
    //         }
    //         else {
    //             require('../pagesScripts/notify').Notify("Зміни збережено!!!",null,null,'success');
    //         }
    //     })
    // })

    require('./signup_form').initializeLogin();
    require('./login_form').login();
    require('./user_form').isLogged();
    require('./profile').updateClient();



    require('./profile').initializeUser();



})