var Templates = require('../Templates');

var $technics =   $('.technics');


function showTechnics(list) {

    $technics.html("");

    function showOne(type) {
        var html_code = Templates.technicInList({technic: type});

        var $node = $(html_code);

        $technics.append($node);
    }

    list.forEach(showOne);
}

exports.initializeTechnics = function(){

    var l=[];

    var tp = localStorage.getItem('currentTypeOfTechnics');

    function callback(err,data) {
        if(data.error) console.log(data.error);
        data.data.forEach(function(item){
            l.push(item)
        });
        showTechnics(l);
    }

    if(tp==null)
        require("../API").getTechnics(callback);
    else
        require("../API").getTechnicsByType({type: tp},callback);
}