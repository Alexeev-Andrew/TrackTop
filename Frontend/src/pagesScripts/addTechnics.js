var Templates = require('../Templates');

var $technics   =   $('.technics');
var $equipments =   $('.equipments');
var $categories =   $('.categories');
var $marks =   $('.marks');
var $models =   $('.models');
var $technicsWithoutCategory   =   $('.technics-without-category');
let openMessageModal = require("../profile/signup_form").openSendMessageModal;

var equipmentsByCategory = [];

var values = require('../values.js');
var API_URL = values.url;

let equipments_per_page = 12;
var equipments_showed = 0;

function initilizebreadcrumbEquipmentCategory(){
    if(!document.location.href.includes("combine_details")) {
        $("#breadcrumb").empty();
        let curCategory = localStorage.getItem('current_category_equipments');
        let curType = eq[curCategory] ? eq[curCategory] : curCategory;
        //console.log(eq[curCategory]);

        if ($(window).width() < 500 && (document.referrer != "" && document.referrer != document.location.href)) {
            $("#breadcrumb").addClass("breadcrumb-mobile");

            let crums = " <li class='back_breadcrumb'>\n" +
                "        <a class='seturl' href='http://tracktop.com.ua/category_equipments'>\n" +
                "            <span >Назад</span></a>\n" +
                "    </li>\n";
            $("#breadcrumb").append(crums);

        } else if ($(window).width() < 500) {
            $("#breadcrumb").empty();
        } else {
            let crums = " <li>\n" +
                "        <a href=\"http://tracktop.com.ua\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" fill=\"none\">\n" +
                "  <g clip-path=\"url(#clip0_147_2554)\">\n" +
                "    <path d=\"M19.2858 9.91387C19.2872 9.71557 19.2473 9.51915 19.1686 9.33713C19.0899 9.15512 18.9741 8.9915 18.8287 8.85672L10.0001 0.713867L1.17153 8.85672C1.02614 8.99156 0.910406 9.15518 0.831703 9.33718C0.752999 9.51919 0.713046 9.71558 0.714388 9.91387V17.8567C0.714388 18.2356 0.864898 18.599 1.13281 18.8669C1.40072 19.1348 1.76408 19.2853 2.14296 19.2853H17.8572C18.2361 19.2853 18.5995 19.1348 18.8674 18.8669C19.1353 18.599 19.2858 18.2356 19.2858 17.8567V9.91387Z\" stroke=\"#2F9321\" stroke-width=\"1.71429\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n" +
                "    <path d=\"M10 19.2856V13.5713\" stroke=\"#2F9321\" stroke-width=\"1.71429\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n" +
                "  </g>\n" +
                "  <defs>\n" +
                "    <clipPath id=\"clip0_147_2554\">\n" +
                "      <rect width=\"20\" height=\"20\" fill=\"white\"/>\n" +
                "    </clipPath>\n" +
                "  </defs>\n" +
                "</svg>\n" +
                "            <span class=\"sr-only\">Головна</span></a>\n" +
                "    </li>\n";
            crums +=
                " <li>\n" +
                "        <a class='seturl' href=\"http://tracktop.com.ua/category_equipments\">\n" +
                "            <span>Запчастини</span></a>\n" +
                "    </li>\n";
            crums +=
                " <li class='current'>\n" +
                "        <a class='seturl-last' href=\"http://tracktop.com.ua/category_equipments/category?name=" + curCategory +
                "\">\n" +
                "            <span>" + curType + "</span></a>\n" +
                "    </li>\n";

            $("#breadcrumb").append(crums);
        }
    }
}

function initializeBreadcrumbMarks(mark) {
    let curCategory = localStorage.getItem('current_category_equipments');
    if(document.location.href.toString().includes("combine_details")) {
        if($(window).width() > 768) {
            initilizebreadcrumbEquipmentCategory();
            let h = $(".current");
            h.addClass("seturl").removeClass("current");
            let crums =
                " <li class='current'>\n" +
                "        <a class='seturl-last' href=\"http://tracktop.com.ua\">\n" +
                "            <span>" + mark + "</span></a>\n" +
                "    </li>\n";
            //let curCategory = localStorage.getItem('current_category_equipments');
            $("#breadcrumb").append(crums);
            $(".seturl-last").attr("href", API_URL + "/category_equipments/category/combine_details/" + mark);
        }
        else {
            $(".seturl").attr("href", API_URL + "/category_equipments/category?name=" + curCategory);
        }
    }


}

function showTechnicsWithoutCategory(list) {

        let crums = " <li>\n" +
            "        <a href=\"http://tracktop.com.ua\"><i class=\"fa fa-home\"></i>\n" +
            "            <span class=\"sr-only\">Головна</span></a>\n" +
            "    </li>\n";
            crums +=
                " <li class='current'>\n" +
                "        <a class='seturl' href=\"http://tracktop.com.ua\">\n" +
                "            <span>" + 'Техніка' + "</span></a>\n" +
                "    </li>\n";
        $("#breadcrumb").append(crums);
        let a = ($(".seturl").length - 1);
        $(".seturl").attr("href", document.location.href);

    $technicsWithoutCategory.html("");
    if(list.length === 0) {
        // $technics.append("Нічого не знайдено");
        $(".nothing_found").css("display","block");
        return;
    }
    function showOne(type) {
        //console.log(type);
        type.url = API_URL+"/technics-without-category/"+type.id;
        let main_photo_location = JSON.parse(type.photos)[0].val;
        type.main_photo_location = main_photo_location ? main_photo_location : "default_technic.jpg"

        var html_code = Templates.technicWithoutCategory({technic: type});
        var $node = $(html_code);

        $node.click(function () {

            localStorage.setItem('currentTypeOfTechnics', "Без категорії");

            localStorage.setItem('currTechnic',JSON.stringify({
                id: type.id,
                main_photo_location: type.main_photo_location,
                price: type.price,
                currency: type.currency,
                amount: type.amount,
                description: type.description
            }));
            document.location.href = API_URL+"/technics-without-category/"+type.id
        });

        $technicsWithoutCategory.append($node);
    }

    list.forEach(showOne);
}


function showTechnics(list) {

    let curType = localStorage.getItem('currentTypeOfTechnics');
    let curMark = localStorage.getItem('currentMarkOfTechnics');

    if (curType == null && curMark == null) {} else {

        let crums = " <li>\n" +
            "        <a href=\"http://tracktop.com.ua\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" fill=\"none\">\n" +
            "  <g clip-path=\"url(#clip0_147_2554)\">\n" +
            "    <path d=\"M19.2858 9.91387C19.2872 9.71557 19.2473 9.51915 19.1686 9.33713C19.0899 9.15512 18.9741 8.9915 18.8287 8.85672L10.0001 0.713867L1.17153 8.85672C1.02614 8.99156 0.910406 9.15518 0.831703 9.33718C0.752999 9.51919 0.713046 9.71558 0.714388 9.91387V17.8567C0.714388 18.2356 0.864898 18.599 1.13281 18.8669C1.40072 19.1348 1.76408 19.2853 2.14296 19.2853H17.8572C18.2361 19.2853 18.5995 19.1348 18.8674 18.8669C19.1353 18.599 19.2858 18.2356 19.2858 17.8567V9.91387Z\" stroke=\"#2F9321\" stroke-width=\"1.71429\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n" +
            "    <path d=\"M10 19.2856V13.5713\" stroke=\"#2F9321\" stroke-width=\"1.71429\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n" +
            "  </g>\n" +
            "  <defs>\n" +
            "    <clipPath id=\"clip0_147_2554\">\n" +
            "      <rect width=\"20\" height=\"20\" fill=\"white\"/>\n" +
            "    </clipPath>\n" +
            "  </defs>\n" +
            "</svg>\n" +
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
        //console.log(type);
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

        $node.click(function (e) {
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

    $(".write-message-card").click(function (e){
         console.log("here")
        e.stopImmediatePropagation()
        e.stopPropagation()
        e.preventDefault();
        let card =  e.target.closest(".oneTechnic");
        console.log(card)
        let productId = card;
        console.log($(card).data("id"))
        openMessageModal({productId:$(card).data("id") , productTitle : $(card).data("title"), url : $(card).data("url") })
    })
}

exports.initializeTechnics = function(){

    var l=[];
    let tp1 = $(".type_header").text().trim();
    let tp = localStorage.getItem('currentTypeOfTechnics');
    let mrk = localStorage.getItem('currentMarkOfTechnics');
    let sold_technics = [];

    function callback(err,data) {
        if(data.error) console.log(data.error);

        data.data.forEach(function(item){
            if(item.sold) {
                sold_technics.push(item)
            }
            else {
                l.push(item)
            }
        });


        showTechnics(l.concat(sold_technics));
        let images = document.querySelectorAll(".lazy");
        lazyload(images);
    }

    function callback2(err,data) {
        if(data.error) console.log(data.error);
        data.data.forEach(function(item){
            l.push(item)
        });
        showTechnicsWithoutCategory(l);
        let images = document.querySelectorAll(".lazy");
        lazyload(images);
    }


        if (/type=([^&]+)/.exec(document.location.href)) {
            require("../API").getTechnicsByType({type: tp1}, callback);
            localStorage.setItem('currentTypeOfTechnics',tp1);
            //console.log("type");
        }
        else if(tp1 != "Інша техніка"){
            tp1 = tp1.substr(tp1.indexOf('и')+2);
            //console.log(tp1);
            require("../API").getTechnicsByType({mark: tp1}, callback);
            localStorage.setItem('currentMarkOfTechnics',tp1);
            //console.log("mark");
        }
        else if(tp1 === "Інша техніка") {
            require("../API").getTechnicsWithoutCategory(callback2);
        }
        else {
            require("../API").getTechnics(callback);
        }


        let category_slider = $(".tab-technic-menu")
        category_slider.html("");
        require("../API").getTypes( function (err5, data5) {
            data5.data.forEach(function (item) {
                let one_technicCard = `<a class="tab-technic-menu-item ${tp1 == item.name ? "active" : ""}" href="/technics?type=${item.name}" >${item.name}</a>`
                category_slider.append(one_technicCard)
            })
        })
}



function showEquipments(list , className , per_page, filter) {
    $(".search").css("display", "none");
    if (className == "equipments")
        $equipments.html("");
    else if (className == "searchedEquipments")
        $searchedEquipments.html("");
    if (list.length === 0 && filter.toString().trim() == "") {
        //TODO: templ for empty result
        $("#nothing_found").text("Категорія поки не запонена. Напишіть нам або подзвоніть, щоб зробити замовлення");
        $("#description_technic_equipment").css("display", "block");
        return;
    } else if (list.length === 0) {
        //TODO: templ for empty result

        $("#description_technic_equipment").css("display", "block");
        return;
    }
    let paginataion = $("#pagination");
    paginataion.empty();
    let pagination_pages = "";
    let cur_page = "";
    cur_page = getUrlParameter("page");
    if (!cur_page) cur_page = 1;
    let max_pages = Math.ceil(list.length / per_page);
    // console.log(max_pages)
    //let model = getModelEquipments()
    let url = document.location.href.toString();
    if (url.includes("?page")) url = url.substring(0, url.indexOf("?page"));
    if (max_pages > 1) {
        pagination_pages += '<li class="page-item ';
        if (cur_page == 1) pagination_pages += ' disabled';
        pagination_pages += ' arrow-pagination"><a class="page-link" href="';
        if(cur_page == 2) pagination_pages += url
        else if (cur_page > 2) pagination_pages += (url + '?page=' + (cur_page - 1))
        else pagination_pages += "#"
        pagination_pages += '" aria-label="Previous" ><i class="fa fa-arrow-left"></i></a></li>'


    for (let i = 1; i <= max_pages; i++) {
        let cur_url = url;
        if (i != 1) cur_url += '?page=' + i;
        pagination_pages += '<li class="page-item';
        if (cur_page == i)
            pagination_pages += ' active';
        pagination_pages += '"><a class="page-link" href="' + cur_url + '">' + i + '</a></li>';
    }
    pagination_pages += '<li class="page-item'

    if (cur_page == max_pages) pagination_pages += ' disabled';
    pagination_pages += ' arrow-pagination"><a class="page-link" href="';
    let next_page = parseInt(cur_page) + 1;
    if (cur_page != max_pages) pagination_pages += (url + '?page=' + next_page)
    else pagination_pages += "#"
    pagination_pages += '" aria-label="Next"><i class="fa fa-arrow-right"></i></a></li>'

    paginataion.append(pagination_pages)

}

    for(let i = (cur_page-1)*per_page ; i< cur_page*per_page;i ++) {
        if(list.length> i) {
            equipments_showed = i;
            showOneEquipment(list[i] , className);
        }
    }

    $(".write-message-card").click(function (e){
        e.stopImmediatePropagation()
        e.stopPropagation()
        e.preventDefault();
        let card =  e.target.closest(".oneTechnic");
        console.log(card)
        let productId = card;
        console.log($(card).data("id"))
        openMessageModal({productId:$(card).data("id") , productTitle : $(card).data("title"), url : $(card).data("url") })
    })

    $(".btn-add-to-cart").click(function (e){
        e.stopImmediatePropagation()
        e.stopPropagation()
        e.preventDefault();
        let card =  e.target.closest(".oneTechnic");
        console.log(card)
        let equipment = $(card).data("json");
        require('../basketPage').addToCart({
            id: equipment.id,
            title: equipment.name,
            price_uah: equipment.price_uah,
            price: equipment.price,
            currency: equipment.currency,
            icon: equipment.main_photo_location,
            quantity: 1,
            url: equipment.url,
            isTech: false
        });

        require('../pagesScripts/notify').Notify("Товар додано.Перейдіть в корзину, щоб оформити замовлення!!!", null, null, 'success');

    })


    let k = equipments_showed;
    // $(window).scroll(function() {
    //     let next = equipments_showed+10 ;
    //     //if(list.length> equipments_showed && )
    //     if($(window).scrollTop() > $(document).height() - $(window).height() - $(".footer").height() - $("#hide_desc").height() -$(".footer-sub").height()  - 500 && filter==document.getElementById("searchEquipments").value.toLowerCase()) {
    //         // ajax call get data from server and append to the div
    //         //console.log("ida");
    //         for(let i =equipments_showed+1 ; i<next;i ++) {
    //             if(list.length> i ) {
    //                 equipments_showed = i;
    //                 showOneEquipment(list[i] , className);
    //             }
    //         }
    //         lazyLoad();
    //     }
    // });
}

function showOneEquipment(type , className) {
    type.url = API_URL+"/equipment?name="+type.name+"&id="+type.id;
    var html_code = Templates.equipmentInList({equipment: type});
    var $node = $(html_code);


    $node.click(function () {
        localStorage.setItem('currEquipment',JSON.stringify({
            id: type.id,
            name: type.name,
            main_photo_location: type.main_photo_location,
            price: type.price,
            currency: type.currency,
            amount: type.amount,
            description: type.description
        }));
        document.location.href = API_URL+"/equipment?name="+type.name+"&id="+type.id;

    });
    if(className=="equipments")
    $equipments.append($node);

}

exports.initializeEquipments = function(){
    let l=[];
    let paramCategory = getUrlParameter("name");
    let currCategory = paramCategory;
    localStorage.setItem("current_category_equipments", currCategory);
    initilizebreadcrumbEquipmentCategory();
    function callback1(err,data) {
        if(data.error) console.log(data.error);
        else {
           data.data.forEach(function (item) {
               if(item.category_name == currCategory && currCategory!="Запчастини до комбайнів" ) {
                   function callback(err,data) {
                       if(data.error) console.log(data.error);
                       equipmentsByCategory = data.data;

                       filterSelectionEquipments(data.data.length);
                       lazyLoad();
                   }

                   require("../API").getEquipmentsByCategoryId(item.id,callback);
               }
               else if(currCategory=="Запчастини до комбайнів" && !document.location.href.toString().includes("combine_details")) {
                   // uncomment if marks change

                   //  let marks = [];
                   // function callback3(err,data) {
                   //     if(err) console.log(err);
                   //     else {
                   //         data.data.forEach(function (item) {
                   //             if (!marks.includes(item.technic_mark))
                   //                 marks.push(item.technic_mark);
                   //         });
                   //
                   //         function callback2(err,data2) {
                   //             if(err) console.log(err);
                   //             else {
                   //                 for( let i =0; i < marks.length;i++) {
                   //                     data2.data.forEach(function (item) {
                   //                         if(marks[i] == item.name)
                   //                             marks[i] = {name : marks[i], logo_file : item.logo_file};
                   //                     })
                   //                 }
                   //                 //showMarks(marks);
                   //             }
                   //         }
                   //         require("../API").getMarks(callback2);
                   //
                   //     }
                   // }
                   // require("../API").getModelsbyTypeMark("Комбайни",null,callback3);
               }
           })
        if(document.location.href.toString().includes("combine_details")) {
                let model = getModelEquipments()
                //console.log(model);
            // let param = document.location.href.toString().split("/");
            //     param.slice(0,param.length-1)
            // let model = (param[param.length-1].replace("%20"," "));
            // let base_url =
                require("../API").getEquipmentsByModal(model, callback2);


                //require('./db').get_technic_by_type_model_mark(type,mark,model,
                function callback2(error, data) {

                    if (error) {
                        //console.log("Error! ", error.sqlMessage);
                    } else {
                        //console.log(data.data);
                        equipmentsByCategory = data.data;
                        filterSelectionEquipments(equipments_per_page);
                        lazyLoad();
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
           //localStorage.setItem("current_category_equipments", type.category_name);
        });

        $categories.append($node);
    }

    list.forEach(showOne);
}

exports.initializeCategories = function(){
    // delete id categories change
    $(".oneCategory").click(function () {
        let next = this.innerText.trim();
        document.location.href = API_URL+"/category_equipments/category?name="+ next ;
    });

    let crums = " <li>\n" +
        "        <a href=\"http://tracktop.com.ua\"><i class=\"fa fa-home\"></i>\n" +
        "            <span class=\"sr-only\">Головна</span></a>\n" +
        "    </li>\n";
    crums +=
        " <li class='current'>\n" +
        "        <a class='seturl' href=\"http://tracktop.com.ua/category_equipments\">\n" +
        "            <span>Запчастини</span></a>\n" +
        "    </li>\n";

$("#breadcrumb").append(crums);


    var l=[];
    // use if equipments categories change
    // function callback(err,data) {
    //     if(data.error) console.log(data.error);
    //     data.data.forEach(function(item){
    //         l.push(item)
    //     });
    //     showCategories(l);
    // }
    //
    // require("../API").get_equipments_categories(callback);
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
        //console.log(mark);

        $node.click(function () {
            //localStorage.setItem("current_category_equipments", "Запчастини до комбайнів");
            document.location.href = API_URL+"/category_equipments/category/combine_details/" + mark.name ;
        });

        $marks.append($node);
    }

    list.forEach(showOneMark);
}
exports.initializeModels = function () {
    localStorage.setItem("current_category_equipments", "Запчастини до комбайнів");

    let l = [];
    let str = "<ul style='margin-top: 10px'>";
    let loc = document.location.href.toString();
    let param = loc.split("/");
    let mark = (param[param.length-1].replace("%20"," "));
    while (mark.includes("%20")) mark = mark.replace("%20"," ");
    //initializeBreadcrumbMarks(mark);
    if(mark) {
        function callback(err, data) {
            if (data.error) console.log(data.error);
            data.data.forEach(function (item) {
                l.push({model: item.model, mark: mark});
                let model_location = loc.endsWith('/') ? loc + item.model : loc + '/' + item.model;
                str+="<li class='font-sm'><a href='" + model_location + "'><p>Запчастини до комбайна " + mark + " " + item.model + "</p></a></li>"
            })
            showModels(l);
            //if(data.data.length > 0 )initializeBreadcrumbMarks(mark);
            $('#text_models').append("<br> Ми пропонуємо: " + str + "</ul>");

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
            //localStorage.setItem("current_category_equipments", "df");
            document.location.href = document.location.href +"/"+ model.model ;
        });

        $models.append($node);
    }

    list.forEach(showOneMark);
}

filterSelectionEquipments = function(per_page) {
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
        showEquipments(list, "equipments", per_page, filter);
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


let eq = {
    "Запчастини до комбайнів": "Комбайни",
    "Запчастини до тракторів":"Трактори",
    "Запчастини до сівалок":"Сівалки",
    "Запчастини до пресів-підбирачів":"Преси-підбирачі"
}

getModelEquipments = function() {
    let param = document.location.href.toString().split("/");
    let model = (param[param.length-1].replace("%20"," "));
    if(model.includes("?page")) model = model.substring(0,model.indexOf("?page"));
    if(model.includes("#")) model = model.substring(0,model.indexOf("#"))
    //$("#breadcrumb").empty();
    while (model.includes("%20")) model = model.replace("%20"," ");
    return model;
}

lazyLoad = function() {
    let images = document.querySelectorAll(".lazy");
    //console.log(images)
    lazyload(images);
}



$(".pagination-next-page").click(function () {
    let next = this.innerText.trim();
    document.location.href = API_URL+"/category_equipments/category?name="+ next ;
});
openPage = function(base_url, page,) {
    document.location.href= base_url + "?page="+ page;
}


