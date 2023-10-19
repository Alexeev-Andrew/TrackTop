var Templates = require('../Templates');

var $types =   $('.typesOfTechnic');
var values = require('../values.js');
var API_URL = values.url;

function showTypes(list) {

    $types.html("");

    function showOne(type) {
        var html_code = Templates.typeOfTechnic({type: type});

        var $node = $(html_code);
        var typ = $node.find('.type_h2').html();
        console.log(typ);

        $node.click(function () {
            if(type.name=="Запчастини")
            document.location.href = API_URL+"/category_equipments";
            else {
                localStorage.setItem('currentMarkOfTechnics', "");
                localStorage.setItem('currentTypeOfTechnics', typ);
                document.location.href = API_URL+"/technics?type=" + typ;
            }
        });

        $types.append($node);
    }

    list.forEach(showOne);
}

exports.initializeTypes = function(){

    $(".technic-category-card").click(function () {
        let next = $(this).find(".title")[0].innerText;

        if(next =="Запчастини")
            document.location.href = API_URL+"/category_equipments";
        else if(next == "Інша техніка") {
            document.location.href = API_URL+ '/technics-without-category';
        }
        else {
            localStorage.setItem('currentMarkOfTechnics', "");
            localStorage.setItem('currentTypeOfTechnics', next);
            document.location.href = API_URL+"/technics?type=" + next;
        }
    });
}