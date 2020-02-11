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
            document.location.href = API_URL+"/equipments";
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

    var l=[];

    require("../API").getTypes(function (err,data) {
        if(data.error) console.log(data.error);

        l.push( {
            photo_location: 'equipment.jpg',//'http://localhost:5050/images/photo1.jpg'
            name: 'Запчастини'
        });
        data.data.forEach(function(item){
            l.push(item)
        });
        showTypes(l);
    });

}