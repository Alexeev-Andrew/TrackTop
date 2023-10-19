let values = require('../values.js');
let API_URL = values.url;

$(function(){

    $('#logo').click(function () {
        document.location.href = API_URL;
    })

    $('#login').click(function() {
        require('./login_form').openForm();
    })

    // added
    $('.exit_btn').click(function() {
        require('./user_form').deleteInfoFromLocalStorage();
        require('./user_form').isLogged();
        $('#user_info').css("display", "none");
    })

    require('./signup_form').initializeLogin();
    require('./login_form').login();
    require('./user_form').isLogged();
    require('./profile').updateClient();

    require('../pagesScripts/leftPanel').initialize();


    require('./profile').initializeUser();

    require('../basketPage').initialiseBasket();



    $('#photo_input').change(function (event) {
        let image = document.getElementById('my_avatar');
        image.src = URL.createObjectURL(event.target.files[0]);

        let id = localStorage.getItem('id');
        let phone = localStorage.getItem('phone');


        require('../API').uploadUserPhoto(event.target.files[0], phone, function(err,data){
            if(err || data.error){}
            else {
                console.log(data)
                //localStorage.setItem('photo',event.target.files[0].name);
            }
        })
    })

    $('.delete-user-photo').click(function() {
        require("../API").deleteUserPhoto(() => {
            $('#my_avatar').attr("src", "/images/users_photos/avatar.png")
        })
    })

})