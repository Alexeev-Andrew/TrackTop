var Templates = require('../Templates');
let {toMainPageBreadcrumb , getUrlParameter} = require("../helpers")
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
    // if(!document.location.href.includes("combine_details")) {

        $("#breadcrumb").empty();
        let curCategory = localStorage.getItem('current_category_equipments');
        let curType = eq[curCategory] ? eq[curCategory] : curCategory;
        let crums = toMainPageBreadcrumb();
        crums +=
            `<li>
                <a class='seturl' href="/category_equipments">
             <span>Запчастини</span></a>
            </li>`;
        crums +=
            `<li class='current'>
            <a class='seturl-last' 
                href="/category_equipments/category?name=${curCategory}">
                 <span>${curType}</span></a>
              </li>`;

        $("#breadcrumb").append(crums);
        //}
    //}
}

function initializeBreadcrumbMarks(mark) {
    // let curCategory = localStorage.getItem('current_category_equipments');
    if(document.location.href.toString().includes("combine_details")) {
        initilizebreadcrumbEquipmentCategory(mark);
        let h = $(".current");
        h.addClass("seturl").removeClass("current");
        h.find("a").removeClass("seturl-last");
        let crums =
            " <li class='current'>\n" +
            "        <a class='seturl-last' href=\"https://tracktop.com.ua\">\n" +
            "            <span>" + mark + "</span></a>\n" +
            "    </li>\n";
        //let curCategory = localStorage.getItem('current_category_equipments');
        $("#breadcrumb").append(crums);
        $(".seturl-last").attr("href", API_URL + "/category_equipments/category/combine_details/" + mark);
    }
}

function showTechnicsWithoutCategory(list) {

    let crums = toMainPageBreadcrumb();

    crums +=
            `<li class='current'>
                <a class='seturl' href="/"">
            <span>Техніка</span></a>
            </li>`
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
        let main_photo_location = JSON.parse(type.photos) || [];
        type.main_photo_location = main_photo_location ? main_photo_location[0] : "default_technic.jpg"

        let html_code = Templates.technicWithoutCategory({technic: type});
        let $node = $(html_code);

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

        let crums = toMainPageBreadcrumb();
        crums +=
            `<li class='current'>
                <a class='seturl' href="/">
                <span>${curMark ? curMark : curType}</span></a>
             </li>`;

        $("#breadcrumb").append(crums);
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

        let url = API_URL+"/technic?model="+type.model+"&mark="+type.name+'&type='+type.type_name+ '&number_id='+type.id;
        type.url = url;
        let html_code = Templates.technicInList({technic: type});
        let $node = $(html_code);

        let model = $node.find('.model_').html();
        let mark = $node.find('.mark_technic').html();
        let typ = localStorage.getItem('currentTypeOfTechnics');

        let s = type.type_name;


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
            document.location.href = url;
        });

        $technics.append($node);
    }

    list.forEach(showOne);

    $(".write-message-card").click(function (e){
        e.stopImmediatePropagation()
        e.stopPropagation()
        e.preventDefault();
        let card =  e.target.closest(".oneTechnic");
        //console.log(card)
        let productId = card;
        //console.log($(card).data("id"))
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
            let one_technicCard = `<a class="tab-technic-menu-item ${tp1 == "Інша техніка" ? "active" : ""}" href="/technics-without-category" >Інша техніка</a>`
            category_slider.append(one_technicCard)
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
        $("#nothing_found").text("Категорія поки не заповнена. Напишіть нам або подзвоніть, щоб зробити замовлення");
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
        // console.log(card)
        let equipment = $(card).data("json");
        require('../basketPage').addToCart({
            id: equipment.id,
            title: equipment.name,
            price_uah: equipment.price_uah,
            price: equipment.price,
            currency: equipment.currency,
            icon: equipment.main_photo_location,
            status: equipment.status,
            state: equipment.state,
            vendor_code: JSON.parse(equipment.vendor_code),
            quantity: 1,
            url: equipment.url,
            isTech: false
        });

        require('../pagesScripts/notify').Notify("Товар додано. Перейдіть в корзину, щоб оформити замовлення!!!", null, null, 'success');

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
                       if(data.error) {
                           console.log(data.error);
                       }
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
                let mark = getMarkEquipment(2);
                initializeBreadcrumbMarks(mark)

                let h = $(".current");
                h.addClass("seturl").removeClass("current");
                h.find("a").removeClass("seturl-last");
                let crums =
                    `<li class='current'>
                        <a class='seturl-last' href="${API_URL + '/category_equipments/category/combine_details/' + mark + '/' + model}">
                              <span>${model}</span></a>
                    </li>`;
                $("#breadcrumb").append(crums);

                require("../API").getEquipmentsByModal(model, callback2);

                function callback2(error, data) {

                    if (error) {
                        //console.log("Error! ", error.sqlMessage);
                    } else {
                        //console.log(data.data);
                        equipmentsByCategory = data.data;
                        console.log(equipmentsByCategory)

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

    let crums = toMainPageBreadcrumb()
    crums +=
         `<li class='current'>
         <a class='seturl' href="/category_equipments">
            <span>Запчастини</span></a>
         </li>`;

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
        $(".nothing_found").css("display","block");
        return;
    }
    function showOneMark(mark) {
        mark.url = API_URL+"/category_equipments/category/combine_details/" + mark.name ;
        let html_code = Templates.oneMark({mark: mark});
        let $node = $(html_code);

        $node.click(function () {
            //localStorage.setItem("current_category_equipments", "Запчастини до комбайнів");
            document.location.href = API_URL+"/category_equipments/category/combine_details/" + mark.name ;
        });

        $marks.append($node);
    }

    list.forEach(showOneMark);
}

exports.initializeMarks = function () {
    $(".oneCategoryMark").click(function (e) {
        let url = $(e.target).closest(".oneCategoryWrapper").data("url")
        document.location.href = API_URL + url ;
    });
}
exports.initializeModels = function () {
    localStorage.setItem("current_category_equipments", "Запчастини до комбайнів");

    let l = [];
    let str = "<ul style='margin-top: 10px'>";
    let loc = document.location.href.toString();
    let mark = getMarkEquipment();
    console.log(mark)
    let marks = ["Massey Ferguson", "John Deere", "Claas"]
    if(mark && marks.includes(mark)) {
        function callback(err, data) {
            if (data.error) console.log(data.error);
            else {
                 initializeBreadcrumbMarks(mark);
                data.data.forEach(function (item) {
                    l.push({model: item.model, mark: mark});
                    let model_location = loc.endsWith('/') ? loc + item.model : loc + '/' + item.model;
                    str += "<li class='font-sm'><a href='" + model_location + "'><p>Запчастини до комбайна " + mark + " " + item.model + "</p></a></li>"
                })
                showModels(l);
                $('#text_models').append("<br> Ми пропонуємо: " + str + "</ul>");
            }

        }

        require("../API").getModelsbyTypeMark("Комбайни", mark, callback);
    }
}

function showModels(list) {

    $models.html("");

    function showOneModel(model) {
        model.url = document.location.href +"/"+ model.model ;
        var html_code = Templates.oneModel({model: model});
        var $node = $(html_code);


        $node.click(function () {
            document.location.href = document.location.href +"/"+ model.model ;
        });

        $models.append($node);
    }

    list.forEach(showOneModel);
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


let eq = {
    "Запчастини до комбайнів": "Комбайни",
    "Запчастини до тракторів": "Трактори",
    "Запчастини до сівалок": "Сівалки",
    "Запчастини до пресів-підбирачів": "Преси-підбирачі"
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

getMarkEquipment = function(from_page = 1) {
    let param = document.location.href.toString().split("/");
    let mark = (param[param.length - from_page].replaceAll("%20"," "));
    return mark;
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


