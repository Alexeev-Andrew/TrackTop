function  initialize() {
    require('../pagesScripts/addTechnics').initializeEquipments();
}

function  initializeModels() {
    require('../pagesScripts/addTechnics').initializeModels();
}


///
$(function(){
    $('#logo').click(function () {
        document.location.href = "http://tracktop.com.ua/";
    })

    require('../basketPage').initialiseBasket();

    $('#login').click(function() {
        require('../profile/login_form').openForm();
    })

    $('.cancel').click(function() {
        require('../profile/login_form').closeForm();
    })

    $('#user_photo').click(function() {
        require('../profile/login_form').userInfo();
    })

    $('.exit_btn').click(function() {
        require('../profile/user_form').deleteInfoFromLocalStorage();
        require('../profile/user_form').isLogged();
        $('#user_info').css("display", "none");
        document.location.href = API_URL;

    })

    require('../profile/signup_form').initializeLogin();
    require('../pagesScripts/leftPanel').initialize();

   // initialize();
    require('../profile/login_form').login();

    require('../profile/user_form').isLogged();
    require('../profile/signup_form').openSubscribeModal();


    $('.edit-profile').click(function(){
        document.location.href = "http://tracktop.com.ua/profile";
    })

    initialize();
    initializeModels();
});