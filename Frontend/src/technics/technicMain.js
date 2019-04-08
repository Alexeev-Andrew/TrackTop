function  initialize() {
    var slider = require('../pagesScripts/slider').multiItemSlider('.slider');
}

$(function(){
    $('#logo').click(function () {
        document.location.href = "http://localhost:5050/";
    })

    require('../basket').initialiseBasket();

    $('#login').click(function() {
        require('../login_form').openForm();
    })

    $('.cancel').click(function() {
        require('../login_form').closeForm();
    })

    require('../signup_form').initializeLogin();
    require('../pagesScripts/leftPanel').initialize();

    initialize();
});