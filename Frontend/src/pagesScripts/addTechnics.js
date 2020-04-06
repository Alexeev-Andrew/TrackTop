var Templates = require('../Templates');

var $technics   =   $('.technics');
var $equipments =   $('.equipments');
var $categories =   $('.categories');
var $marks =   $('.marks');
var $models =   $('.models');

var equipmentsByCategory = [];

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
            //console.log("type"+ type);
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



function showEquipments(list , className , filter) {
    if(className == "equipments")
    $equipments.html("");
    else if(className == "searchedEquipments")
        $searchedEquipments.html("");
    if(list.length===0  && filter.toString().trim()=="") {
        //TODO: templ for empty result
        $("#nothing_found").text("Категорія поки не запонена. Напишіть нам або подзвоніть, щоб зробити замовлення");
        $("#description_technic_equipment").css("display","block");
        return;
    }
    else if(list.length===0 ) {
        //TODO: templ for empty result
        
        $("#description_technic_equipment").css("display","block");
        return;
    }

    for(let i =0 ; i< 10;i ++) {
        if(list.length> i) {
            equipments_showed = i;
            showOneEquipment(list[i] , className);
        }
    }
    let k = equipments_showed;
    $(window).scroll(function() {
        let next = equipments_showed+10 ;
        //if(list.length> equipments_showed && )
        if($(window).scrollTop() > $(document).height() - $(window).height() - $(".footer").height() - 300 && filter==document.getElementById("searchEquipments").value.toLowerCase()) {
            // ajax call get data from server and append to the div
            //console.log("ida");
            for(let i =equipments_showed+1 ; i<next;i ++) {
                if(list.length> i ) {
                    equipments_showed = i;
                    showOneEquipment(list[i] , className);
                }
            }
        }
    });
}

function showOneEquipment(type , className) {
    type.url = API_URL+"/equipment?name="+type.name+"&id="+type.id;
    var html_code = Templates.equipmentInList({equipment: type});
    var $node = $(html_code);


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
    if(className=="equipments")
    $equipments.append($node);

}

exports.initializeEquipments = function(){
    let l=[];
    let paramCategory = getUrlParameter("name");
    let currCategory = paramCategory;
    localStorage.setItem("current_category_equipments", currCategory);
    function callback1(err,data) {
        if(data.error) console.log(data.error);
        else {
           data.data.forEach(function (item) {
               if(item.category_name == currCategory && currCategory!="Запчастини до комбайнів" ) {
                   function callback(err,data) {
                       if(data.error) console.log(data.error);
                       equipmentsByCategory = data.data;

                       filterSelectionEquipments();
                   }

                   require("../API").getEquipmentsByCategoryId(item.id,callback);
               }
               else if(currCategory=="Запчастини до комбайнів" && !document.location.href.toString().includes("combine_details")) {
                    let marks = [];
                   function callback3(err,data) {
                       if(err) console.log(err);
                       else {
                           //console.log(data);
                           data.data.forEach(function (item) {
                               if (!marks.includes(item.technic_mark))
                                   marks.push(item.technic_mark);
                           });

                           function callback2(err,data2) {
                               if(err) console.log(err);
                               else {
                                   for( let i =0; i < marks.length;i++) {
                                       data2.data.forEach(function (item) {
                                           if(marks[i] == item.name)
                                               marks[i] = {name : marks[i], logo_file : item.logo_file};
                                       })
                                   }
                                   //console.log(marks);
                                   showMarks(marks);
                               }
                           }
                           require("../API").getMarks(callback2);
                           //console.log(marks)

                       }
                   }
                   require("../API").getModelsbyTypeMark("Комбайни",null,callback3);
               }
           })
        if(document.location.href.toString().includes("combine_details")) {
            let param = document.location.href.toString().split("/");
            let model = (param[param.length-1].replace("%20"," "));
            while (model.includes("%20")) model = model.replace("%20"," ");
                //console.log(model);
                require("../API").getEquipmentsByModal(model, callback2);


                //require('./db').get_technic_by_type_model_mark(type,mark,model,
                function callback2(error, data) {

                    if (error) {
                        //console.log("Error! ", error.sqlMessage);
                    } else {
                        //console.log(data.data);
                        equipmentsByCategory = data.data;
                        filterSelectionEquipments();
                    }

                }
            }
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
        type.url = API_URL+"/category_equipments/category?name="+ type.category_name ;
        var html_code = Templates.equipmentCategory({category: type});
        var $node = $(html_code);

        $node.click(function () {
           document.location.href = API_URL+"/category_equipments/category?name="+ type.category_name ;
           localStorage.setItem("current_category_equipments", type.category_name);
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

function showMarks(list) {

    $marks.html("");
    if(list.length===0) {
        // $equipments.append("Нічого не знайдено");
        //TODO: templ for empty result
        $(".nothing_found").css("display","block");
        return;
    }
    function showOneMark(mark) {
        mark.url = API_URL+"/category_equipments/category/combine_details/" + mark.name ;
        var html_code = Templates.oneMark({mark: mark});
        var $node = $(html_code);


        $node.click(function () {
            document.location.href = API_URL+"/category_equipments/category/combine_details/" + mark.name ;
            localStorage.setItem("current_category_equipments", type.category_name);
        });

        $marks.append($node);
    }

    list.forEach(showOneMark);
}
exports.initializeModels = function () {

    let l = [];
    let str = "<ul>"
    let param = document.location.href.toString().split("/");
    let mark = (param[param.length-1].replace("%20"," "));
    while (mark.includes("%20")) mark = mark.replace("%20"," ");
    if(mark) {
        function callback(err, data) {
            if (data.error) console.log(data.error);
            data.data.forEach(function (item) {
                l.push({model: item.model, mark: mark});
                str+="<li> Запчастини до комбайна " + mark + " " + item.model + "</li>"
            })
            showModels(l);

            $('#text_models').append("Ми пропонуємо: " + str + "</ul>");

        }

        require("../API").getModelsbyTypeMark("Комбайни", mark, callback);
    }
}

function showModels(list) {

    $models.html("");

    function showOneMark(model) {
        model.url = document.location.href +"/"+ model.model ;
        var html_code = Templates.oneModel({model: model});
        var $node = $(html_code);


        $node.click(function () {
            document.location.href = document.location.href +"/"+ model.model ;
            //localStorage.setItem("current_category_equipments", type.category_name);
        });

        $models.append($node);
    }

    list.forEach(showOneMark);
}

filterSelectionEquipments = function() {
    let input = document.getElementById("searchEquipments");
    if(input) {
        let filter = input.value.toLowerCase();
        let list = [];
        let count = 0;
        // console.log(filter);
        for (let i = 0; i < equipmentsByCategory.length; i++) {
            let txtValue;
            txtValue = equipmentsByCategory[i].name + " " + equipmentsByCategory[i].description + " " + equipmentsByCategory[i].vendor_code;

            if (txtValue.toLowerCase().indexOf(filter) > -1) {
                //list[i].style.display = "";
                //console.log(txtValue);
                list.push(equipmentsByCategory[i]);
            }
        }
        showEquipments(list, "equipments", filter);
    }
}

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