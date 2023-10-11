var values = require('./values.js');
var API_URL = values.url;

$(function(){

    $('#logo').click(function () {
        document.location.href = API_URL;
    })

    require('./basketPage').initialiseBasket();

    $('#login').click(function() {
        require('./profile/login_form').openForm();
    })

    $('#user_photo').click(function() {
        require('./profile/login_form').userInfo();
    })

    $('.edit-profile').click(function(){
        document.location.href = API_URL+"/profile";
    })

    // added
    $('.exit_btn').click(function() {
        require('./profile/user_form').deleteInfoFromLocalStorage();
        require('./profile/user_form').isLogged();
        $('#user_info').css("display", "none");
        // document.location.href = API_URL;
    })

    require('./profile/signup_form').initializeLogin();
    require('./pagesScripts/typesOfTechnics').initializeTypes();
    require('./pagesScripts/leftPanel').initialize();

    require('./profile/login_form').login();

    require('./profile/user_form').isLogged();

    require('./profile/profile').updateClient();

    require('./profile/signup_form').openSubscribeModal();

    require('../src/pagesScripts/sliderNew').multiItemSlider(".technic-category-list")

});
