var values = require('../values.js');
var API_URL = values.url;

$( window ).on( "orientationchange", function( event ) {
   // $.when($("#breadcrumb").empty()).then( initilizebreadcrumb());
    $("#breadcrumb").empty()
    setTimeout(function() {   //calls click event after a certain time
        initilizebreadcrumb();
    }, 500);
});

function initilizebreadcrumb(){
    let cur_type_mark;
    let curType = localStorage.getItem('currentTypeOfTechnics');
    let curMark = localStorage.getItem('currentMarkOfTechnics');

    if ( (curType == null && curMark == null) ) {}
    else if( $(window).width()<500 && document.referrer!="") {
        $("#breadcrumb").addClass("breadcrumb-mobile");

        let crums = " <li class='back_breadcrumb'>\n" +
            "        <a class='seturl'>\n" +
            "            <span >Назад</span></a>\n" +
            "    </li>\n";
        $("#breadcrumb").append(crums);

        $(".seturl").attr("href", document.referrer);
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
        $(".seturl-last").attr("href", document.location.href);
    }
}

function  initialize() {
    var tech = JSON.parse(localStorage.getItem('currTechnic'));
    initilizebreadcrumb();


    var dataset = [];
    function callback(err,data) {
        if(data.error) console.log(data.error);
        data.data.forEach(function(item){
            dataset.push("technics/"+item.file_name)
        });
        require('../pagesScripts/slider').initialize(dataset);
    }
    require('../API').getTechnicsImagesById(tech.id,callback);

    $('.order_technic').click(function(){

        // var equipment = localStorage.getItem('currEquipment');
        // console.log(equipment);
        // var isTech = equipment==null ? false : true;

        var tech = JSON.parse(localStorage.getItem('currTechnic'));
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