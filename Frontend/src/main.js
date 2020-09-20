var values = require('./values.js');
var API_URL = values.url;

$(function(){

    $('#logo').click(function () {
        document.location.href = API_URL;
    })

    require('./basket').initialiseBasket();

    $('#login').click(function() {
        require('./profile/login_form').openForm();
    })

    $('.cancel').click(function() {
        require('./profile/login_form').closeForm();
    })

    $('#user_photo').click(function() {
        require('./profile/login_form').userInfo();
    })

    $('.edit-profile').click(function(){
        document.location.href = API_URL+"/profile";
    })

    // added
    $('#exit_btn').click(function() {
        require('./profile/user_form').deleteInfoFromLocalStorage();
        require('./profile/user_form').isLogged();
        $('#user_info').css("display", "none");
    })

    require('./profile/signup_form').initializeLogin();
    require('./pagesScripts/typesOfTechnics').initializeTypes();
    require('./pagesScripts/leftPanel').initialize();

    require('./profile/login_form').login();

    require('./profile/user_form').isLogged();

    require('./profile/profile').updateClient();

    require('./profile/signup_form').openSubscribeModal();
});