// let {technicInMenu} = require('../Templates');

// var $technics =   $('.vertical-menu-technics');
// var $models =   $('.vertical-menu-models');
// var $equipment =   $('.vertical-menu-equipment');

let values = require('../values.js');
let API_URL = values.url;

let {hideToggleModal, showToggleModal} = require("../helpers")


toggleLeftPanel = function () {
    let isLogin = false;
    function callback(err, data) {
        if(data.auth) {
            isLogin = true;
            $(".is-login").show();
        } else {
            $(".is-login").hide();
        }

        if($("#menuToggle .menu-wrapper-background" ).hasClass("toggleMenuLeftOpen")){
            console.log("here")
            hideToggleModal()
        }
        else {
            showToggleModal()
        }

    }
    require("../API").isLogIn(callback)

    $(".menu-wrapper-background").click(function (e) {
        if (!$(event.target).closest('#menu').length) {
            hideToggleModal()
        }
    })
}

exports.toggleLeftPanel = toggleLeftPanel;


// function showTechnics(list) {

//     $technics.html("");
//     $technics.append('<a href="#" class="active active-none-link">Техніка</a>');

//     function showOne(t) {
//         var html_code = technicInMenu({item: t});

//         var $node = $(html_code);

//         var typ = $node.html();

//         $node.click(function () {
//             localStorage.setItem('currentTypeOfTechnics', typ);
//             document.location.href = API_URL+"/technics?type="+typ;
//             $( "body" ).removeClass("bodyOverflowHidden");
//         })

//         $technics.append($node);
//     }

//     list.forEach(showOne);
// }

// function showMarks(list) {

//     $models.html("");
//     $models.append('<a href="#" class="active active-none-link">Марки</a>');

//     function showOne(t) {
//         var html_code = technicInMenu({item: t});

//         var $node = $(html_code);

//         var mark = $node.html();
//         $node.click(function () {
//             localStorage.setItem('currentMarkOfTechnics', mark);
//             localStorage.setItem('currentTypeOfTechnics', "");
//             document.location.href = API_URL+"/technics?mark="+mark;
//             $( "body" ).removeClass("bodyOverflowHidden");
//         })

//         $models.append($node);
//     }

//     list.forEach(showOne);
// }
