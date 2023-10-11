var Templates = require('../Templates');

var $technics =   $('.vertical-menu-technics');
var $models =   $('.vertical-menu-models');
var $equipment =   $('.vertical-menu-equipment');

var values = require('../values.js');
var API_URL = values.url;

let {hideToggleModal, showToggleModal} = require("../helpers")


function showTechnics(list) {

    $technics.html("");
    $technics.append('<a href="#" class="active active-none-link">Техніка</a>');

    function showOne(t) {
        var html_code = Templates.technicInMenu({item: t});

        var $node = $(html_code);

        var typ = $node.html();

        $node.click(function () {
            localStorage.setItem('currentTypeOfTechnics', typ);
            document.location.href = API_URL+"/technics?type="+typ;
            $( "body" ).removeClass("bodyOverflowHidden");
        })

        $technics.append($node);
    }

    list.forEach(showOne);
}

function showMarks(list) {

    $models.html("");
    $models.append('<a href="#" class="active active-none-link">Марки</a>');

    function showOne(t) {
        var html_code = Templates.technicInMenu({item: t});

        var $node = $(html_code);

        var mark = $node.html();
        $node.click(function () {
            localStorage.setItem('currentMarkOfTechnics', mark);
            localStorage.setItem('currentTypeOfTechnics', "");
            document.location.href = API_URL+"/technics?mark="+mark;
            $( "body" ).removeClass("bodyOverflowHidden");
        })

        $models.append($node);
    }

    list.forEach(showOne);
}

exports.initialize = function(){
    let drop_drown_show = false;
    let resp =  require("../API").isLogIn();


    // var tp = localStorage.getItem('currentTypeOfTechnics');
    //
    // function callback(err,data) {
    //     if(data.error) console.log(data.error);
    //     var l=[];
    //     data.data.forEach(function(item){
    //         item.url=  API_URL+"/technics?type="+item.name;
    //         l.push(item);
    //     });
    //     showTechnics(l);
    // }
    // function callback2(err,data) {
    //     if(data.error) console.log(data.error);
    //     var l=[];
    //     data.data.forEach(function(item){
    //         item.url=API_URL+"/technics?mark="+ item.name;
    //         l.push(item)
    //     });
    //     showMarks(l);
    // }
    //
    // require("../API").getTypes(callback);
    // require("../API").getMarks(callback2);
    //
    // $equipment.click(function(){
    //     document.location.href = API_URL+"/category_equipments";
    //     $( "body" ).removeClass("bodyOverflowHidden");
    // })
}


toggleLeftPanel = function () {
    let isLogin = false;
    function callback(err, value) {
        if(value) {
            isLogin = true;
            $(".is-login").show();
        } else {
            $(".is-login").hide();
        }

        if($("#menuToggle .menu-wrapper-background" ).hasClass("toggleMenuLeftOpen")){
            hideToggleModal()
        }
        else {
            showToggleModal()
        }

    }
    require("../API").isLogIn(callback)



    // if(opened) $( "body" ).addClass("bodyOverflowHidden");
    // else  $( "body" ).removeClass("bodyOverflowHidden");
}

