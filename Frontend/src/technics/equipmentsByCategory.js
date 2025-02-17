let {initialiseBasket, initialisePhonePopup} = require('../basketPage')
let {toggleLeftPanel} = require('../pagesScripts/leftPanel');


function  initialize() {
    require('../pagesScripts/addTechnics').initializeEquipments();
}

function  initializeModels() {
    // try to fix
    require('../pagesScripts/addTechnics').initializeModels();
}


$(function(){
    $('#logo').click(function () {
        document.location.href = "/";
    })

    require('../pagesScripts/addTechnics').initializeMarks();

    initialiseBasket()
    initialisePhonePopup()

    $('#login').click(function() {
        require('../profile/login_form').openForm();
    })


    $('#user_photo').click(function() {
        require('../profile/login_form').userInfo();
    })

    $('.exit_btn').click(function() {
        require('../profile/user_form').deleteInfoFromLocalStorage();
        require('../profile/user_form').isLogged();
        $('#user_info').css("display", "none");
    })

    require('../profile/signup_form').initializeLogin();

    require('../profile/login_form').login();

    require('../profile/user_form').isLogged();
    require('../profile/signup_form').openSubscribeModal();


    initialize();
    initializeModels();
});