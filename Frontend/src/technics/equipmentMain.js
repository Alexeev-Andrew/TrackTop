const { openSendMessageModal} = require("../profile/signup_form");
let {initialiseBasket, initialisePhonePopup, addToCart} = require('../basketPage')

require('fancybox')($);

let {getUrlParameter, toMainPageBreadcrumb, Notify} = require("../helpers")
let {toggleLeftPanel} = require('../pagesScripts/leftPanel');


function  initialize() {
    let id =   getUrlParameter("id");

    function callback5(err,data5) {
        if (data5.error) {
            console.log(data5.error);
        }

        let equipment = data5.data[0];
        //console.log(equipment)
        localStorage.setItem("current_category_equipments", equipment.category_name);

        localStorage.setItem('currEquipment',JSON.stringify({
            id: id,
            name: equipment.name,
            main_photo_location: equipment.main_photo_location,
            price_uah: equipment.price_uah,
            price: equipment.price,
            currency: equipment.currency,
            amount: equipment.amount,
            description: equipment.description,
            mark: equipment.mark,
        }));
        initilizebreadcrumb()

        let alt;
        if (equipment.category_name != "Запчастини до комбайнів") {
            alt = "Купити " + equipment.name ;
        }
        else {
            alt = $(".one-ad-header").data("alt") || equipment.description
        }

        let dataset = [];
        //let im = JSON.parse(equipment.images);
        let im = equipment.images || [];
        if(!im || im.length == 0) {
            im = ["default_technic.jpg"];
        }
        im.forEach(function (item) {
            dataset.push("equipments/" + item)
        });
        require('../pagesScripts/slider').initialize(dataset, alt);

        $('.order_equipment').click(function () {
            Notify("Товар додано.Перейдіть в корзину, щоб оформити замовлення!!!", null, null, 'success');

            addToCart({
                id: id,
                title: equipment.name,
                price_uah: equipment.price_uah,
                price: equipment.price,
                currency: equipment.currency,
                icon: equipment.main_photo_location,
                quantity: 1,
                status: equipment.status,
                state: equipment.state,
                // vendor_code: JSON.parse(equipment.vendor_code),
                vendor_code: equipment.vendor_code,
                url: document.location.href,
                isTech: false
            });
        })

        $(".write-message-one-equipment").click(function (e){
            e.stopImmediatePropagation()
            e.stopPropagation()
            e.preventDefault();
            let one_eq = document.querySelector(".one-ad-header");

            openSendMessageModal({productId:$(one_eq).data("id") , productTitle : $(one_eq).data("title"), url : $(one_eq).data("url") })
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
        document.location.href = "https://tracktop.com.ua/";
    })

    initialiseBasket()
    initialisePhonePopup();

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

    require('../profile/login_form').login();

    require('../profile/user_form').isLogged();
    initialize();
    require('../profile/signup_form').openSubscribeModal();


    $('.edit-profile').click(function(){
        document.location.href = "https://tracktop.com.ua/profile";
    })
});


function initilizebreadcrumb(){
    let curCategory = localStorage.getItem('current_category_equipments');
    let currEquipment = JSON.parse(localStorage.getItem('currEquipment'));

    let crums = toMainPageBreadcrumb();
    crums +=
        `<li>
            <a class='seturl' href="/category_equipments">
            <span>Запчастини</span></a>
        </li>`;
    crums +=
        `<li class=''>
            <a class='seturl-last' 
                href="/category_equipments/category?name=${curCategory}">
             <span>${curCategory}</span></a>
        </li>`;
    crums +=
        ` <li class='current'>
            <a class='seturl-last' href="${document.location.href}">
            <span>${currEquipment.name}</span></a>
        </li>`;

    $("#breadcrumb").append(crums);

}
