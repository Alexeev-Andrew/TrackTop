var values = require('../values.js');
var API_URL = values.url;
require('fancybox')($);

$( window ).on( "orientationchange", function( event ) {
   // $.when($("#breadcrumb").empty()).then( initilizebreadcrumb());
    $("#breadcrumb").empty();
    setTimeout(function() {   //calls click event after a certain time
        initilizebreadcrumb();
    }, 500);
});

$(document).ready(function() {
    //$(".slider").setLockAncors()
    $('.fancybox').fancybox({padding:0,margin:5});
    $.fancybox.defaults.hash = false;
})


function initilizebreadcrumb(){
    let cur_type_mark;
    let curType = localStorage.getItem('currentTypeOfTechnics');
    let curMark = localStorage.getItem('currentMarkOfTechnics');
    let curTech = JSON.parse(localStorage.getItem('currTechnic'));

    if ( (curType == null && curMark == null) ) {}
    else if( $(window).width()<500 && (document.referrer!="" && document.referrer!=document.location.href)) {
        $("#breadcrumb").addClass("breadcrumb-mobile");

        let crums = " <li class='back_breadcrumb'>\n" +
            "        <a class='seturl'>\n" +
            "            <span >Назад</span></a>\n" +
            "    </li>\n";
        $("#breadcrumb").append(crums);

        $(".seturl").attr("href", document.referrer);
    }
    else if ($(window).width()<500) {
        $("#breadcrumb").empty();
    }
    else {
        let crums = " <li>\n" +
            "        <a href=\"http://tracktop.com.ua\"><i class=\"glyphicon glyphicon-home\"></i>\n" +
            "            <span class=\"sr-only\">Головна</span></a>\n" +
            "    </li>\n";
        if (curType) {
            cur_type_mark = curType;
            crums +=
                " <li>\n" +
                "        <a class='seturl' href=\"http://tracktop.com.ua\">\n" +
                "            <span>" + curType + "</span></a>\n" +
                "    </li>\n";
        } else {
            crums +=
                " <li >\n" +
                "        <a class='seturl' href=\"http://tracktop.com.ua\">\n" +
                "            <span>" + curMark + "</span></a>\n" +
                "    </li>\n";
            cur_type_mark = curMark;
        }
        crums +=
            " <li class='current'>\n" +
            "        <a class='seturl-last' href=\"http://tracktop.com.ua\">\n" +
            "            <span>" + $(".type_header").text() + "</span></a>\n" +
            "    </li>\n";

        $("#breadcrumb").append(crums);
        let a = ($(".seturl").length - 1);
        let h = $(".seturl")[(a - 1)];
        $(".seturl").attr("href", API_URL + "/technics?type=" + cur_type_mark);
        $(".seturl-last").attr("href", API_URL + "/technic?model=" + curTech.model + "&mark=" + curTech.mark + "&type="+ curType +"&number_id="+curTech.id);
    }
}

function  initialize() {
    let param = getUrlParameter("number_id");
    function callback5(err,data5) {
        if(data5.error) console.log(data5.error);
        else {
            console.log(data5.data[0]);
            let type = data5.data[0];
            localStorage.setItem('currTechnic',JSON.stringify({
                id: type.id,
                model: type.model,
                mark: type.marks_of_technics_name,
                main_photo_location: type.main_photo_location,
                price: type.price,
                currency: type.currency,
                amount: type.amount,
                description: type.description
            }));
            $(".type_header").text(type.marks_of_technics_name + " " + type.model);
            var tech = JSON.parse(localStorage.getItem('currTechnic'));
            localStorage.setItem("currentTypeOfTechnics" , type.types_of_technics_name);
            initilizebreadcrumb();

            let alt = "Купити " ;
            if(type.types_of_technics_name==="Преси-підбирачі") alt+="прес-підбирач";
            else if(type.types_of_technics_name==="Сівалки") alt+="сівалку"
            else alt +=type.types_of_technics_name.toString().substring(0,type.types_of_technics_name.length-1).toLowerCase();
            alt += " " + type.marks_of_technics_name + " " + type.model + ". ";


            var dataset = [];
            function callback(err,data) {
                if(data.error) console.log(data.error);
                data.data.forEach(function(item){
                    dataset.push("technics/"+item.file_name)
                });
                require('../pagesScripts/slider').initialize(dataset,alt);
            }
            require('../API').getTechnicsImagesById(tech.id,callback);

            $('.order_technic').click(function(){

                // var equipment = localStorage.getItem('currEquipment');
                // console.log(equipment);
                // var isTech = equipment==null ? false : true;

                require('../pagesScripts/notify').Notify("Товар додано.Перейдіть в корзину, щоб оформити замовлення!!!",null,null,'success');

                require('../basket').addToCart({
                    id : tech.id,
                    title: tech.mark+' '+tech.model,
                    price: tech.price,
                    currency: tech.currency,
                    icon: "technics/"+tech.main_photo_location,
                    quantity: tech.amount,
                    isTech : true
                });

                // Notify("Товар додано.Перейдіть в корзину, щоб оформити замовлення!!!")
            })
        }
    }
    require('../API').getTechnicsById(param,callback5);


}

$(function(){
    $('#logo').click(function () {
        document.location.href = API_URL;
    })

    require('../basket').initialiseBasket();

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
    })


    require('../profile/signup_form').initializeLogin();
    require('../pagesScripts/leftPanel').initialize();


    require('../profile/login_form').login();

    require('../profile/user_form').isLogged();
    initialize();

    $('.edit-profile').click(function(){
        document.location.href = API_URL+"/profile";
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