var Templates = require('../Templates');

var $technics   =   $('.technics');
var $equipments =   $('.equipments');
var $categories =   $('.categories');

var values = require('../values.js');
var API_URL = values.url;

var equipments_showed = 0;

function showTechnics(list) {

    let curType = localStorage.getItem('currentTypeOfTechnics');
    let curMark = localStorage.getItem('currentMarkOfTechnics');

    if (curType == null && curMark == null) {} else {

        let crums = " <li>\n" +
            "        <a href=\"http://tracktop.com.ua\"><i class=\"glyphicon glyphicon-home\"></i>\n" +
            "            <span class=\"sr-only\">Головна</span></a>\n" +
            "    </li>\n";
        if (curType) crums +=
            " <li class='current'>\n" +
            "        <a class='seturl' href=\"http://tracktop.com.ua\">\n" +
            "            <span>" + curType + "</span></a>\n" +
            "    </li>\n";
        else {
            crums +=
                " <li class='current'>\n" +
                "        <a class='seturl' href=\"http://tracktop.com.ua\">\n" +
                "            <span>" + curMark + "</span></a>\n" +
                "    </li>\n";
        }
        $("#breadcrumb").append(crums);
        let a = ($(".seturl").length - 1);
        $(".seturl").attr("href", document.location.href);
    }



    $technics.html("");
    if(list.length===0) {
       // $technics.append("Нічого не знайдено");
        $(".nothing_found").css("display","block");
        return;
    }
    function showOne(type) {
        console.log(type);
        type.url = API_URL+"/technic?model="+type.model+"&mark="+type.name+'&type='+type.type_name+ '&number_id='+type.id;
        var html_code = Templates.technicInList({technic: type});
        var $node = $(html_code);

        var model = $node.find('.model_').html();
        var mark = $node.find('.mark_technic').html();
        var typ = localStorage.getItem('currentTypeOfTechnics');

        var s = type.type_name;

        //console.log("s = "+ s );
       // var typ = $node.find('.type_h2').html();
//console.log(typ);
        //console.log("model:" + model+ " mark = "+ mark + "type  = " + typ);

        $node.click(function () {
            console.log("type"+ type);
            //
            localStorage.setItem('currentTypeOfTechnics', type.type_name);
            ///
            localStorage.setItem('currTechnic',JSON.stringify({
                id: type.id,
                model: type.model,
                mark: type.name,
                main_photo_location: type.main_photo_location,
                price: type.price,
                currency: type.currency,
                amount: type.amount,
                description: type.description
            }));
            document.location.href = API_URL+"/technic?model="+model+"&mark="+mark+'&type='+type.type_name + '&number_id='+type.id;;
        });

        $technics.append($node);
    }

    list.forEach(showOne);
}

exports.initializeTechnics = function(){

    var l=[];
    let tp1 = $(".type_header").text().trim();
    let tp = localStorage.getItem('currentTypeOfTechnics');
    let mrk = localStorage.getItem('currentMarkOfTechnics');


    function callback(err,data) {
        if(data.error) console.log(data.error);
        data.data.forEach(function(item){
            l.push(item)
        });
        showTechnics(l);
    }


        if (/type=([^&]+)/.exec(document.location.href)) {
            require("../API").getTechnicsByType({type: tp1}, callback);
            localStorage.setItem('currentTypeOfTechnics',tp1);
            //console.log("type");
        }
        else if(tp1){
            tp1 = tp1.substr(tp1.indexOf('и')+2);
            //console.log(tp1);
            require("../API").getTechnicsByType({mark: tp1}, callback);
            localStorage.setItem('currentMarkOfTechnics',tp1);
            //console.log("mark");
        }
        else {
            require("../API").getTechnics(callback);
        }
}



function showEquipments(list) {

    $equipments.html("");
    if(list.length===0) {
       // $equipments.append("Нічого не знайдено");
        //TODO: templ for empty result
        $(".nothing_found").css("display","block");
        return;
    }

    for(let i =0 ; i< 10;i ++) {
        if(list.length> i) {
            equipments_showed = i;
            showOneEquipment(list[i]);
        }
    }
    let k = equipments_showed;
    $(window).scroll(function() {
        let next = equipments_showed+10 ;
        if($(window).scrollTop() > $(document).height() - $(window).height() - $(".footer").height() - 300) {
            // ajax call get data from server and append to the div
            //console.log("ida");
            for(let i =equipments_showed+1 ; i<next;i ++) {
                if(list.length> i) {
                    equipments_showed = i;
                    showOneEquipment(list[i]);
                }
            }
        }
    });
}

function showOneEquipment(type) {
    var html_code = Templates.equipmentInList({equipment: type});
    var $node = $(html_code);

    var typ = localStorage.getItem('currentTypeOfTechnics');

    $node.click(function () {
        document.location.href = API_URL+"/equipment?name="+type.name+"&id="+type.id;
        localStorage.setItem('currEquipment',JSON.stringify({
            id: type.id,
            name: type.name,
            main_photo_location: type.main_photo_location,
            price: type.price,
            currency: type.currency,
            amount: type.amount,
            description: type.description
        }));
    });

    $equipments.append($node);
}

exports.initializeEquipments = function(){
    var l=[];

    let currCategory = localStorage.getItem("current_category_equipments");
    function callback1(err,data) {
        if(data.error) console.log(data.error);
        else {
           data.data.forEach(function (item) {
               if(item.category_name == currCategory) {
                   function callback(err,data) {
                       if(data.error) console.log(data.error);
                       data.data.forEach(function(item){
                           l.push(item)
                       });
                       showEquipments(l);
                   }

                   require("../API").getEquipmentsByCategoryId(item.id,callback);
               }
           })
        }
    }
    require("../API").get_equipments_categories(callback1);


}

function showCategories(list) {

    $categories.html("");
    if(list.length===0) {
        // $equipments.append("Нічого не знайдено");
        //TODO: templ for empty result
        $(".nothing_found").css("display","block");
        return;
    }
    function showOne(type) {
        var html_code = Templates.equipmentCategory({category: type});
        var $node = $(html_code);


        $node.click(function () {
            // document.location.href = API_URL+"/category_equipments/category?name="+ type.category_name ;
            // localStorage.setItem("current_category_equipments", type.category_name);
        });

        $categories.append($node);
    }

    list.forEach(showOne);
}

exports.initializeCategories = function(){
    var l=[];

    function callback(err,data) {
        if(data.error) console.log(data.error);
        data.data.forEach(function(item){
            l.push(item)
        });
        showCategories(l);
    }

    require("../API").get_equipments_categories(callback);
}