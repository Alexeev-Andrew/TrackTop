let values = require('../values.js');
let API_URL = values.url;
require('fancybox')($);
let {initialiseBasket, initialisePhonePopup} = require('../basketPage')
let {toMainPageBreadcrumb, getUrlParameter, onSendMessageClick } = require("../helpers")
let default_photo = "default_technic.jpg"


// $( window ).on( "orientationchange", function( event ) {
//     $("#breadcrumb").empty();
//     setTimeout(function() {   //calls click event after a certain time
//         initilizebreadcrumb();
//     }, 500);
// });

$(document).ready(function() {
    //$(".slider").setLockAncors()
    $('.fancybox').fancybox({padding:0,margin:5});
    $.fancybox.defaults.hash = false;
})


function  initialize() {
    let param = getUrlParameter("number_id");
    if (param) {
        function callback5(err, data5) {
            if (data5.error) console.log(data5.error);
            else {
                console.log(data5.data[0]);
                let type = data5.data[0];
                localStorage.setItem('currTechnic', JSON.stringify({
                    id: type.id,
                    model: type.model,
                    mark: type.marks_of_technics_name,
                    main_photo_location: type.main_photo_location,
                    price: type.price,
                    currency: type.currency,
                    amount: type.amount,
                    description: type.description
                }));

                var tech = JSON.parse(localStorage.getItem('currTechnic'));
                localStorage.setItem("currentTypeOfTechnics", type.types_of_technics_name);
                initilizebreadcrumb();
                let type_tech;
                let alt = "Купити ";
                if (type.types_of_technics_name === "Преси-підбирачі") {
                    alt += "прес-підбирач";
                    type_tech = "Прес-підбирач"
                } else if (type.types_of_technics_name === "Сівалки") {
                    alt += "сівалку";
                    type_tech = "Сівалка"
                } else if (type.types_of_technics_name === "Жатки") {
                    alt += "жатку";
                    type_tech = "Жатка"
                } else if (type.types_of_technics_name === "Фронтальні навантажувачі") {
                    if (type.model.includes("гак") || type.model.includes("вила"))
                        type_tech = ""
                    else {
                        type_tech = "Фронтальний навантажувач";
                        alt += "фронтальний навантажувач";
                    }
                } else {
                    let h = type.types_of_technics_name.toString().substring(0, type.types_of_technics_name.length - 1)
                    alt += h.toLowerCase()
                    type_tech = h
                }
                alt += " " + type.marks_of_technics_name + " " + type.model + ". ";
                $(".type_header").text(type_tech + " " + type.marks_of_technics_name + " " + type.model);

                let dataset = [];
                // let im = JSON.parse(type.images) || ["default_technic.jpg"];
                let im = type.images || ["default_technic.jpg"];
                im.forEach(function (item) {
                    dataset.push("technics/" + item)
                });
                require('../pagesScripts/slider').initialize(dataset, alt);

                $('.order_technic').click(function () {
                    require('../pagesScripts/notify').Notify("Товар додано. Перейдіть в корзину, щоб оформити замовлення!!!", null, null, 'success');

                    let href = document.location.href;
                    require('../basketPage').addToCart({
                        id: tech.id,
                        title: tech.mark + ' ' + tech.model,
                        price: tech.price,
                        currency: tech.currency,
                        icon: "technics/" + tech.main_photo_location,
                        quantity: 1,
                        url: href,
                        url1:"sd",
                        isTech: true
                    });
                })
            }
        }
        require('../API').getTechnicsById(param, callback5);
    }

    else {
        let id = getID();
        function callback4(err,data5) {
            if(data5.error) console.log(data5.error);
            else {
                let loader = data5.data[0];
                localStorage.setItem("currentTypeOfTechnics", 'Інша техніка');

                localStorage.setItem('currTechnic', JSON.stringify({
                    id: loader.id,
                    name: loader.name,
                    price: loader.price,
                    currency: loader.currency,
                    amount: loader.amount,
                    description: loader.description
                }));

                let alt = "Купити " + loader.name;
                initilizebreadcrumb(true);

                var dataset = [];
                // let photos = JSON.parse(loader.photos) || [];
                let photos = loader.photos || [];

                photos.forEach(function(item) {
                    dataset.push("technics/"+item)
                });
                if(dataset.length === 0) {
                    dataset.push("technics/"+default_photo)
                }
                require('../pagesScripts/slider').initialize(dataset,alt);
            }
        }
        require('../API').getTechnicsWithoutCategoryById(id,callback4);
    }


}

$(function(){
    $('#logo').click(function () {
        document.location.href = API_URL;
    })

    initialisePhonePopup()

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
    require('../profile/signup_form').openSubscribeModal();

    require('../profile/login_form').login();

    require('../profile/user_form').isLogged();
    initialize();

    initialiseBasket()
    onSendMessageClick()

});


function initilizebreadcrumb(no_category = false){
    let curType = localStorage.getItem('currentTypeOfTechnics');
    let curMark = localStorage.getItem('currentMarkOfTechnics');
    let curTech = JSON.parse(localStorage.getItem('currTechnic'));

    let crums = toMainPageBreadcrumb();
    if(no_category) {
        crums +=
            `<li>
                <a class='seturl' href="/technics-without-category">
                <span>${curType}</span></a>
            </li>`;
    crums +=
        ` <li class='current'>
            <a class='seturl-last' href="/technics-without-category/${curTech.id}">
            <span>${curTech.name}</span></a>
        </li>`;

        $("#breadcrumb").append(crums);

    }
    else if ( (curType != null && curMark != null) ) {
        if (curType) {
            crums +=
                " <li>\n" +
                "        <a class='seturl' href=\"https://tracktop.com.ua\">\n" +
                "            <span>" + curType + "</span></a>\n" +
                "    </li>\n";
        }
        crums +=
            " <li class='current'>\n" +
            "        <a class='seturl-last' href=\"https://tracktop.com.ua\">\n" +
            "            <span>" + curTech.mark + " "  + curTech.model + "</span></a>\n" +
            "    </li>\n";

        $("#breadcrumb").append(crums);
        let a = ($(".seturl").length - 1);
        let h = $(".seturl")[(a - 1)];
        $(".seturl").attr("href", API_URL + "/technics?type=" + curType);
        $(".seturl-last").attr("href", API_URL + "/technic?model=" + curTech.model + "&mark=" + curTech.mark + "&type="+ curType +"&number_id="+curTech.id);
    }
}

getID = function() {
    let url = document.location.href;
    let split = [];
    if(url.endsWith("/")) url = url.substring(0,url.length-1);
    split = url.split('/');

    let id = split[split.length-1];
    return id;
};