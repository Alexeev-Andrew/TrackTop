let values = require('./values.js');
let API_URL = values.url;
let {initialiseBasket, initialisePhonePopup} = require('./basketPage')

$(function(){

    $('#logo').click(function () {
        document.location.href = API_URL;
    })

    initialiseBasket()
    initialisePhonePopup()
    
    $('#login').click(function() {
        require('./profile/login_form').openForm();
    })

    $('#user_photo').click(function() {
        require('./profile/login_form').userInfo();
    })

    // added
    $('.exit_btn').click(function() {
        require('./profile/user_form').deleteInfoFromLocalStorage();
        require('./profile/user_form').isLogged();
        $('#user_info').css("display", "none");
    })

    require('./profile/signup_form').initializeLogin();
    require('./pagesScripts/typesOfTechnics').initializeTypes();
    require('./pagesScripts/leftPanel').initialize();

    require('./profile/login_form').login();

    require('./profile/user_form').isLogged();

    // require('./profile/profile').updateClient();

    require('./profile/signup_form').openSubscribeModal();

    require('../src/pagesScripts/sliderNew').multiItemSlider(".technic-category-list")

    $('.btn-send-contact-form').click(function() {
        let contact_form = document.querySelector("#contact-form");
        let form_data = new FormData(contact_form)
        let message = {
            name : form_data.get("name"),
            phone : form_data.get("phone"),
            theme : form_data.get("theme"),
            message : form_data.get("message"),
        }
        for (let prop in message) {
            if (!message[prop]) return alert("Заповніть форму")
        }
        let text_message = `Від: ${message.name}\n Телефон: ${message.phone}\nТема: ${message.theme}\nПовідомлення: ${message.name}`
        require("./API").sendMessage({message: text_message}, (err, data) => {
            contact_form.reset()
            alert("Повідомлення відправлено")
        })
    })


});
