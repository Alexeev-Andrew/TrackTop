require('fancybox')($);

function  initialize() {
    let id =   getUrlParameter("id");

    function callback5(err,data5) {
        if (data5.error) {
            console.log(data5.error);
        }

        let equipment = data5.data[0];
        console.log(equipment)

        localStorage.setItem('currEquipment',JSON.stringify({
            id: id,
            name: data5.data[0].name,
            main_photo_location: data5.data[0].main_photo_location,
            price_uah: data5.data[0].price_uah,
            price: data5.data[0].price,
            currency: data5.data[0].currency,
            amount: data5.data[0].amount,
            description: data5.data[0].description
        }));
        let alt;
        if (data5.data[0].description) alt = "Купити " + data5.data[0].description ;
        else alt = "Купити " + data5.data[0].name ;

        let dataset = [];
        let im = JSON.parse(equipment.images);
        if(!im) {
            im = ["default_technic.jpg"];
        }
        im.forEach(function (item) {
            dataset.push("equipments/" + item)
        });
        require('../pagesScripts/slider').initialize(dataset, alt);


        $('.order_equipment').click(function () {

            // var tech = JSON.parse(localStorage.getItem('currTechnic'));

            let equipment = JSON.parse(localStorage.getItem('currEquipment'));
            //console.log(equipment);
            // var isTech = equipment==null ? false : true;
            require('../pagesScripts/notify').Notify("Товар додано.Перейдіть в корзину, щоб оформити замовлення!!!", null, null, 'success');

            require('../basketPage').addToCart({
                id: id,
                title: equipment.name,
                price_uah: equipment.price_uah,
                price: equipment.price,
                currency: equipment.currency,
                icon: equipment.main_photo_location,
                quantity: 1,
                url: document.location.href,
                isTech: false
            });
        })
    }
    require('../API').getEquipmentsById(id,callback5);
}

$(document).ready(function() {
    //$(".slider").setLockAncors()
    $('.fancybox').fancybox({padding:0,margin:5});
    $.fancybox.defaults.hash = false;
})

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

    $('#exit_btn').click(function() {
        require('../profile/user_form').deleteInfoFromLocalStorage();
        require('../profile/user_form').isLogged();
        $('#user_info').css("display", "none");
        document.location.href = API_URL;

    })


    require('../profile/signup_form').initializeLogin();
    require('../pagesScripts/leftPanel').initialize();


    require('../profile/login_form').login();

    require('../profile/user_form').isLogged();
    initialize();
    require('../profile/signup_form').openSubscribeModal();


    $('.edit-profile').click(function(){
        document.location.href = "http://tracktop.com.ua/profile";
    })
});

getUrlParameter = function(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};