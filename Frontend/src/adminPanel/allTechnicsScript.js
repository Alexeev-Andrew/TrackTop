 multipleEquipmentOpen = false;
var container_num = 1;

var values = require('../values.js');
var API_URL = values.url;
var file_uploader = require('blueimp-file-upload');
let jquery_ui = require('jquery-ui');
let notify = require('../pagesScripts/notify');
let type = 'tech';
let default_photo = "default_technic.jpg"
let files2 = [];

 // require("../API").deleteFile("./2.jpg",function (err,data) {
 //     if(err) console.log(err)
 // })

//multiple = new MultipleSelect();
openAddTechnicModel = function () {

    type = 'tech';
    document.getElementById('addTechnicModelWithoutCategory').style.display='block';
    // $('#addTechnicModel').style.display='block';
    $("#add-btn").text("Додати");
    $("#technic_url").hide()
    technicFormClear();
    $('.uploader__file-list').empty();
// class="js-uploader__contents uploader__contents uploader__hide"
    $('.uploader__contents').removeClass("uploader__hide");
    $('.js-uploader__further-instructions').addClass("uploader__hide");

    $('.js-uploader__submit-button').addClass("uploader__hide");

    // todo:
    // get all types of technics, loop through and add options text = type, value=type
    $('#type_technics').children().remove();
    $('#marks').children().remove();
    $('#type_technics').append('<option selected value="Тип" disabled>Тип</option>');
    function callback(err,data) {

        data.data.forEach(function(item){
            //console.log("type = "+ item);
            $('#type_technics').append(new Option(item.name, item.name));
        });

    }
    require("../API").getTypes(callback);


    // get all marks, loop through
    function callback2(err,data) {
        data.data.forEach(function(item){
            //console.log("mark = " + item);
            $('#marks').append(new Option(item.name, item.name));
        });

    }
    require("../API").getMarks(callback2);


}

getModels = function() {
    let type = $('#type_technics').children("option:selected").val();
    if($('#mark-choice').prop('disabled')) {
        $('#mark-choice').prop("disabled", false);
    }
    else if ($('#mark-choice').val()!=""){
        $('#model-choice').prop("disabled", false);
        let mark = $("#mark-choice").val();
        console.log("type=" + type + "  mark = " + mark);

        if (type != "" && mark != "") {

            function callback(err, data) {
            $('#models').children().remove();
                data.data.forEach(function (item) {
                    $('#models').append(new Option(item.model, item.model));
                });
            }

            require("../API").getModelsbyTypeMark(type, mark, callback);
            // not to use
            // $('#models').children().remove();
            // $('#models').append(new Option("consul", "consul"));
        }
    }
}

openEditTechnicModal = function(cell) {
    $('#addTechnicModelWithoutCategory').modal('show');
    //type = 'tech';
   // console.log(cell);

    let row = $(cell).parents("tr");
    let cols = row.children("td");
    let id  = $(cols[0]).text();
    localStorage.setItem("currId", id);
    //console.log(id);
    let type = $(cols[1]).text();
    //children("button")[0]).data("id");
    //$("#type_technics").val($(cols[1]).text());
    $("#type_technics").append(new Option(type, type,true,true));
    $('#type_technics').prop("disabled", true);
    $("#mark-choice").val($(cols[2]).text());
    let model = $("#model-choice").val($(cols[3]).text());
    let mark = $("#mark-choice").prop("disabled", true);
    $("#model-choice").prop("disabled", true);
    $("#price-input-technic").val($(cols[4]).text());
    console.log(model)
    console.log(mark)
    console.log(type)

    function callback(err,data) {
        if (err) {
            console.log(err);
        }
        else {
            $("#technic_url").attr("href",API_URL + "/technic?model=" + model.val() + "&mark=" + mark.val() + "&type=" + type + "&number_id=" + id)

            //http://tracktop.com.ua/technic?model=186&mark=Massey%20Ferguson&type=%D0%9A%D0%BE%D0%BC%D0%B1%D0%B0%D0%B9%D0%BD%D0%B8&number_id=229
            $("#description").val(data.data[0].description);
            $("#year-technic-input").val(data.data[0].production_date);
            let cur = data.data[0].currency;
            if(cur == "долар")  $("#currency-choice").val("$");
            if(cur == "євро")  $("#currency-choice").val("€");
            if(cur == "гривня")  $("#currency-choice").val("грн");
        }
    }
    require("../API").getTechnicsById(id,callback);
    function callback1(err,data) {
        if (err) {
            console.log(err);
        }
        else {
            localStorage.setItem("photo_arr", data.data);
            $('.uploader__file-list').empty();

            $('.js-uploader__submit-button').removeClass("uploader__hide");
            $('.js-uploader__further-instructions').removeClass("uploader__hide");

            $('.js-uploader__contents').addClass("uploader__hide");
           // console.log(data.data);

            let im = [];
            try {
                im = JSON.parse(data.data);
                for(let i=0;i< im.length;i++) {
                    let item = im[i];
                    getFileObject("/images/technics/" + item , function (fileObject) {
                        //console.log(fileObject.size);
                        $('.uploader__file-list').append( `<li class="uploader__file-list__item" data-src-file=${item} data-type="old" data-index="` + item +  "\"" +
                            "><span class=\"uploader__file-list__thumbnail\"><img  class=\"thumbnail\" src=\"/images/technics/" + item + "\"" +
                            " ></span> <button onclick=\"console.log('delete click')\" class=\"delete uploader__icon-button js-upload-remove-button fa fa-times\" data-index=\"" +
                            item.id +  "\""+ "></button></li>")
                    })
                }
                photosMakeSortable();
                // data.data.forEach(function(item) {
                //     getFileObject("/images/technics/" + item.file_name , function (fileObject) {
                //         //console.log(fileObject.size);
                //         $('.uploader__file-list').append( "<li class=\"uploader__file-list__item\" data-index=\"" + item.id +  "\"" + "><span class=\"uploader__file-list__thumbnail\"><img  class=\"thumbnail\" src=\"/images/technics/" + item.file_name + "\"" +
                //             " ></span><span class=\"uploader__file-list__text\"> " + item.file_name + " </span><span class=\"uploader__file-list__size\">"+ Math.round(fileObject.size/1024) + " Kb"   + "</span><span class=\"uploader__file-list__button\"><button class=\"uploader__icon-button js-upload-remove-button fa fa-times\" data-index=\"" + item.id +  "\""+ "></button></span></li>")
                //     })
                // }
                // );
            }
            catch(e) {
                // forget about it :)
            }

        }
    }
    require("../API").getTechnicsImagesById(id,callback1);
    // Change Update Button Text
    $("#add-btn").text("Оновити");

}

openRemoveModalTechnic = function(cell){
    $('#myModal').modal("toggle");
    let row = $(cell).parents("tr");
    let cols = row.children("td");
    let id  = $(cols[0]).text();
    $('#modal-btn-delete').click(function() {
            function callback(err,data) {
                if( err) {
                    Notify("Помилка! Не вдалось видалити.",null,null,'success');
                }
                else {
                    $(cell).parents("tr").remove();
                    $('#myModal').modal("hide");
                }
            }
            require("../API").deleteTechnicsByID(id,callback);
    });
     // todo if btn sold is clicked - delete images and attribute sold

    $('#modal-btn-sold').click(function() {
        function callback2(err,data2) {
            if( err) {
                Notify("Помилка! Не вдалось виконати.",null,null,'success');
            }
            else {
                $('#myModal').modal("hide");
            }
        }
        require("../API").updateTechnic(id,{sold: true},callback2)
    });

}



deleteEquipment = function(cell) {
    // check if we can delete
    var row = $(cell).parents("tr");
    var cols = row.children("td");
    var id  = $(cols[0]).text();
    console.log(id);
    var conf =confirm ("Ви впевнені, що хочете видалити?");
    if(conf) {
        function callback(err,data) {
            if(err) console.log(err);
            else {
                $(cell).parents("tr").remove();
                // hide modal not sure correct model
                $('#myModal').modal("hide");
            }
        }
        require("../API").deleteEquipmentsByID(id,callback)
    }

}

getMarks = function() {
    let selectedType = $('#type_technics').children("option:selected").val();
    //console.log(selectedType);
    $('#mark-choice').prop("disabled", false);
    $('#mark-choice').children().remove();
    $('#mark-choice').append('<option selected value="Марка" disabled>Марка</option>');
    function callback(err,data) {
        if(err) console.log(err);
         else {
             //console.log(data);
            data.data.forEach(function (item) {
                if (! $('#mark-choice').find("option[value='" + item.technic_mark + "']").length)
                $('#mark-choice').append(new Option(item.technic_mark, item.technic_mark));
                //console.log(item.technic_mark);
                // if(!marks.includes(item.technic_mark)) {
                //     marks.push(item.technic_mark);
                //     //console.log(item.technic_mark);
                //     $('#marks').append(new Option(item.technic_mark, item.technic_mark));
                // }
            });
        }
    }
    require("../API").getModelsbyTypeMark(selectedType,null,callback);
}

//multiple-select-container-1

showModels = function() {
    let selectedType = $('#type_technics').children("option:selected").val();
    let selectedMark = $('#mark-choice').val();
    $('#model-choice').prop("disabled", false);
    //let multipleSelect =

    if(multipleEquipmentOpen) {
        $('#model-choice').children().remove();
        console.log(container_num);
        $('#multiple-select-container-'+container_num).remove();
        container_num++;
    }
    function callback(err,data) {
        if(err) console.log(err);
        else {
            //console.log(data);
            data.data.forEach(function (item) {
                if (! $('#model-choice').find("option[value='" + item.model + "']").length)
                      $('#model-choice').append(new Option(item.model, item.model));
                    //console.log(item.model);
            });
            $('#model-choice').prop("multiple", true);
            if(!multipleEquipmentOpen) {
                multipleEquipmentOpen = true;
            }
            new MultipleSelect('#model-choice');
        }
    }
    require("../API").getModelsbyTypeMark(selectedType,selectedMark,callback);
}

openAddEquipmentModel = function () {
    type = 'eq';
    document.getElementById('addEquipmentModel').style.display='block';
    // $('#addEquipmentModel').modal('show');
    $("#add-btn").text("Додати");
    $('#type_technics').prop("disabled", true);
    // $('#multiple-select-container-'+container_num).css("display", "none");
    equipmentFormClear();
    $("#equipment_url").hide()

    $('#type_technics').children().remove();
    $('#type_technics').append('<option selected value="Тип" disabled>Тип</option>');
    function callback1(err,data) {
        if (err) console.log(err);
        data.data.forEach(function(item){
            if (! $('#type_technics').find("option[value='" + item.technic_type + "']").length)
            $('#type_technics').append(new Option(item.technic_type, item.technic_type));
        });
    }
    require("../API").getModels(callback1);
    // to do
    // get all types of technics, loop through and add options text = type, value=type

    $('#categories_modal').children().remove();
    $('#categories_modal').append('<option selected value="Категорія" disabled>Категорія</option>');
    function callback2(err,data) {
        if (err) console.log(err);
        data.data.forEach(function(item){
            if (! $('#categories_modal').find("option[value='" + item.category_name + "']").length)
                $('#categories_modal').append(new Option(item.category_name, item.category_name));
        });
    }
    require("../API").get_equipments_categories(callback2);

}

openEditEquipmentModal = function(cell) {
    $('#addEquipmentModel').modal('show');
    // console.log(cell);
    type = 'eq';
    let row = $(cell).parents("tr");
    let cols = row.children("td");
    let id  = $(cols[0]).text();
    console.log(id);
    localStorage.setItem("currEquipmentId",id);
    //children("button")[0]).data("id");
    $("#name-equipment").val($(cols[1]).text());
    $("#price-input").val($(cols[2]).text());
    $("#equipment-code").val($(cols[3]).text());
    $("#equipment-amount").val($(cols[4]).text());
    $('#model-choice').children().remove();
    $('#mark-choice').children().remove();
    $('#type_technics').children().remove();
    $('#mark-choice').prop("disabled", true);
    $('#model-choice').prop("disabled", true);
    $('#multiple-select-container-'+(container_num-1)).remove();
    $('#multiple-select-container-'+(container_num)).remove();



    // function callback1(err,data) {
    //     if(err) console.log(err);
    //     data.data.forEach(function(item){
    //         if (! $('#type_technics').find("option[value='" + item.technic_type + "']").length)
    //             $('#type_technics').append(new Option(item.technic_type, item.technic_type));
    //     });
    // }
    // require("../API").getModels(callback1);


    function callback(err,data) {
        if (err) {
            console.log(err);
        }
        else {
            let equipment = data.data[0];

            let categories = [];

            function callback2(err,data2) {
                if(err) console.log(err);
                else {
                    data2.data.forEach(function (item) {
                        categories.push(item);
                        //  $('#categories_modal').append(new Option(item.category_name, item.category_name,false,true));
                        // if (! $('#type_technics').find("option[value='" + item.technic_type + "']").length)
                        //     $('#type_technics').append(new Option(item.technic_type, item.technic_type));
                    });
                    for(let i =0;i<categories.length;i++) {
                        if(categories[i].id == data.data[0].id_category) {
                            $("#categories_modal").append(new Option(categories[i].category_name, categories[i].category_name,true,true));
                        }
                        else {
                            $("#categories_modal").append(new Option(categories[i].category_name, categories[i].category_name,true,false));
                        }
                        $('#categories_modal').prop("disabled",true);
                    }
                    ///

                    $("#equipment_url").attr("href",API_URL + "/equipment?name=" + data.data[0].name + "&id=" + id )

                    $("#description").val(data.data[0].description);
                    $("#state-choice").val(data.data[0].state);
                    let cur = data.data[0].currency;
                    $("#currency-choice").val(cur)


                    if($("#categories_modal").val() == "Запчастини до комбайнів") {
                        //$("#type_technics").prop("disabled", false);
                        //console.log(data5.data[0].technic_type);
                        $("#type_technics").append(new Option("Комбайни", "Комбайни",true,true));
                        //$("#type_technics").val(data.data[0].technic_type);
                        //$('#mark-choice').prop("disabled", false);
                        $('#model-choice').prop("disabled", false);

                        function callback5(err,data5){
                            if(err){
                                console.log("We have an error");
                                console.log(err);
                            }
                            else {
                                //console.log(data5.data[0]);
                                let arr = data5.data;
                                let models_old = [];
                                arr.forEach(function (item) {
                                   models_old.push({equipment_id: item.equipment_id , model_id: item.model_id});
                                })
                                localStorage.setItem("models_old",JSON.stringify(models_old));
                                ////
                                $("#mark-choice").append(new Option(data5.data[0].technic_mark, data5.data[0].technic_mark,true,true));
                                let models_selected = [] ;
                                data5.data.forEach(function (item) {
                                    models_selected.push(item.model);
                                })
                                function callback3(err, data3) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    $('#model-choice').prop("multiple",true);
                                    data3.data.forEach(function (item3) {
                                        if(models_selected.includes(item3.model)) {
                                            $('#model-choice').append(new Option(item3.model, item3.model,true,true));
                                            console.log("contains");
                                        }

                                        else {
                                            $('#model-choice').append(new Option(item3.model, item3.model,false,false));
                                            console.log("not contains");
                                        }
                                    });
                                    new MultipleSelect('#model-choice');
                                    console.log(container_num);
                                    multipleEquipmentOpen = true;
                                    container_num++;
                                }

                               require("../API").getModelsbyTypeMark(data5.data[0].technic_type, data5.data[0].technic_mark, callback3);
                               /////
                            }

                        }
                        console.log(id);
                        require("../API").getEquipmentsWithModels(id,callback5);
                    }

                }
            }
            require("../API").get_equipments_categories(callback2);

            /// to do photo for equipment

                    let images = JSON.parse(equipment.images) || [];
                    console.log(images)
                    localStorage.setItem("photo_arr", equipment.images);
                    $('.uploader__file-list').empty();

                    $('.js-uploader__submit-button').removeClass("uploader__hide");
                    $('.js-uploader__further-instructions').removeClass("uploader__hide");

                    $('.js-uploader__contents').addClass("uploader__hide");
                    // console.log(data.data);

            try {
                for(let i=0;i< images.length;i++) {
                    let item = images[i];
                    getFileObject("/images/equipments/" + item , function (fileObject) {
                        //console.log(fileObject.size);
                        $('.uploader__file-list').append( "<li class=\"uploader__file-list__item\" data-index=\"" + item +  "\"" +
                            "><span class=\"uploader__file-list__thumbnail\"><img  class=\"thumbnail\" src=\"/images/equipments/" + item + "\"" +
                            " ></span> <button onclick=\"console.log('delete click')\" class=\"delete uploader__icon-button js-upload-remove-button fa fa-times\" data-index=\"" +
                            item.id +  "\""+ "></button></li>")
                    })
                }
            }
            catch(e) {
                // forget about it :)
            }

            ///

        }
    }
    require("../API").getEquipmentsById(id,callback);
    // Change Update Button Text
    $("#add-btn").text("Оновити");

}

$(function(){
    //
    // for(var i=0;i<100;i++) {
    //     $("#allTechnics tbody").append(
    //         "<tr class='rowTechnic'>" +
    //         "<td class=\"id\">"+i+"</td>" +
    //         "<td class=\"type\">"+"Комбайни"+"</td>" +
    //         " <td class=\"mark\">"+"claas"+"</td>" +
    //         " <td class=\"model\">"+"mercator 50"+"</td>" +
    //         " <td class=\"price\">"+"9000"+"</td>" +
    //         " <td class=\"edit-btn\"><button class=\"btn btn-secondary\" onclick='openEditTechnicModal(this)'><i class=\"fa fa-edit\"></i></button></td>" +
    //         "<td class=\"delete-btn\"><button class=\"btn btn-secondary\" onclick='deleteTechnic(this)'><i class=\"fa fa-remove\"></i></button></td>" +
    //         "</tr>"
    //     );
    // }
    //alert( "ready!" );
    function callback(err,data) {
        data.data.forEach(function(item){

            //console.log(item.sold);
           // console.log(item.sold==true);
            let el;

            if (item.sold) el += "<tr class='rowTechnic soldTechnic'>"; else {
                el+="<tr class='rowTechnic'>";
            }
            el+= "<td class=\"id\">"+item.id+"</td>" +
                "<td class=\"type\">"+item.types_of_technics_name+"</td>" +
                " <td class=\"mark\">"+item.marks_of_technics_name+"</td>" +
                " <td class=\"model\">"+item.model+"</td>" +
                " <td class=\"price\">"+item.price+"</td>" +
                " <td class=\"edit-btn\"><button class=\"btn btn-secondary btn-admin-panel\" onclick='openEditTechnicModal(this)'><i class=\"fa fa-edit fa-button-admin\"></i></button></td>" + //onclick='deleteTechnic(this)'
                "<td class=\"delete-btn delete-btn-technic\"><button class=\"btn btn-secondary btn-admin-panel\" onclick='openRemoveModalTechnic(this)'><i class=\"fa fa-remove fa-button-admin\"></i></button></td>" +
                "</tr>"
            $("#allTechnics tbody").append(el
            );
        });
    }
    require("../API").getTechnics(callback);
});

$(function(){
    console.log( "window loaded" );

    // for(var i=0;i<100;i++) {
    //     $("#allEquipments tbody").append(
    //         "<tr class='rowEquipment'>" +
    //         "<td class=\"id\">"+i+"</td>" +
    //         "<td class=\"name\">"+"Комбайн"+"</td>" +
    //         " <td class=\"price\">"+"45"+"</td>" +
    //         " <td class=\"code\">"+"KM342342i"+"</td>" +
    //         " <td class=\"amount\">"+"9000"+"</td>" +
    //         " <td class=\"edit-btn\"><button class=\"btn btn-secondary\" onclick='openEditEquipmentModal(this)'><i class=\"fa fa-edit\"></i></button></td>" +
    //         "<td class=\"delete-btn\"><button class=\"btn btn-secondary\" onclick='deleteEquipment(this)'><i class=\"fa fa-remove\"></i></button></td>" +
    //         "</tr>"
    //     );
    // }
    //alert( "ready!" );
    function callback(err,data) {
        data.data.forEach(function(item){
            $("#allEquipments tbody").append(
                "<tr class='rowEquipment'>" +
                "<td class=\"id\">"+item.id+"</td>" +
                "<td class=\"name\">"+item.name+"</td>" +
                " <td class=\"price\">"+item.price+"</td>" +
                " <td class=\"code\">"+item.vendor_code+"</td>" +
                " <td class=\"amount\">"+item.amount+"</td>" +
                " <td class=\"edit-btn\"><button class=\"btn btn-secondary btn-admin-panel\" onclick='openEditEquipmentModal(this)'><i class=\"fa fa-edit fa-button-admin\"></i></button></td>" +
                "<td class=\"delete-btn\"><button class=\"btn btn-secondary btn-admin-panel\" onclick='deleteEquipment(this)'><i class=\"fa fa-remove fa-button-admin\"></i></button></td>" +
                "</tr>"
            );
        });

    }
    require("../API").getEquipments(callback);
});

function productBuildTableRow(item) {
    let el;

    if (item.sold) el += "<tr class='rowTechnic soldTechnic'>"; else {
        el+="<tr class='rowTechnic'>";
    }
    el+= "<td class=\"id\">"+item.id+"</td>" +
        "<td class=\"type\">"+item.type+"</td>" +
        " <td class=\"mark\">"+item.mark+"</td>" +
        " <td class=\"model\">"+item.model+"</td>" +
        " <td class=\"price\">"+item.price+"</td>" +
        " <td class=\"edit-btn\"><button class=\"btn btn-secondary btn-admin-panel\" onclick='openEditTechnicModal(this)'><i class=\"fa fa-edit fa-button-admin\"></i></button></td>" + //onclick='deleteTechnic(this)'
        "<td class=\"delete-btn delete-btn-technic\"><button class=\"btn btn-secondary btn-admin-panel\" onclick='openRemoveModalTechnic(this)'><i class=\"fa fa-remove fa-button-admin\"></i></button></td>" +
        "</tr>"

    return el;
}

 function productBuildEquipmentTableRow(item) {
     let el;

     el += "<tr class='rowEquipment'>" +
     "<td class=\"id\">"+item.id+"</td>" +
     "<td class=\"name\">"+item.name+"</td>" +
     " <td class=\"price\">"+item.price+"</td>" +
     " <td class=\"code\">"+item.vendor_code+"</td>" +
     " <td class=\"amount\">"+item.amount+"</td>" +
     " <td class=\"edit-btn\"><button class=\"btn btn-secondary btn-admin-panel\" onclick='openEditEquipmentModal(this)'><i class=\"fa fa-edit fa-button-admin\"></i></button></td>" +
     "<td class=\"delete-btn\"><button class=\"btn btn-secondary btn-admin-panel\" onclick='deleteEquipment(this)'><i class=\"fa fa-remove fa-button-admin\"></i></button></td>" +
     "</tr>"

     return el;
 }

filterSelect = function(i) {
    var input =  document.getElementsByClassName("mysearch")[0];
    filter = input.value.toUpperCase();
    var list;
    let count = 0;
    let nameRow;
    if(i==1) nameRow="rowTechnic";
    if(i==2) nameRow="rowEquipment";
    list = document.getElementsByClassName(nameRow);
    // console.log(list);
    for(let i =0 ; i< list.length;i++) {
        // let a = list[i].getElementsByClassName();
        var txtValue;
        txtValue = list[i].innerText;
        console.log(txtValue);
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            list[i].style.display = "";
        } else {
            list[i].style.display = "none";
            count++;
        }

    }

}

addTechnicToDB = function () {
    let selectedType = $('#type_technics').children("option:selected").val();
    let mark = $("#mark-choice").val();
    let model = $("#model-choice").val();
    let price = $("input[type=number][name=price-input]").val();
    let currency = $('#currency-choice').children("option:selected").val();
    let year = $("input[type=number][name=year-input]").val();
    var description = $("textarea[name=description]").val();
    // ..todo photos
    let add_update = $("#add-btn").text();

    // console.log(selectedType);
    // console.log(mark);
    // console.log(model);
    // console.log(price);
    // console.log(currency);
    // console.log(year);
    // console.log(description);
    let technic = {
        mark_id: null,
        type_id: null,
        model: model,
        amount: 1,
        price: price,
        production_date: year,
        currency: "долар",
        description: description,
    }

    let table_row = {
        type: selectedType,
        mark: mark,
        model:model,
        price: price,
        production_date: year,
        currency: "долар",
}

    if (currency == 'грн') {
        table_row.currency = "гривня";
        technic.currency = "гривня";
    }

    if (currency == '€') {
        table_row.currency = "євро";
        technic.currency = "євро";
    }

    console.log(files2)

    if(add_update=="Додати") {

        if (checkInputTechnic()) {

            function callback1(err, data) {

                if (err) console.log(err);
                else {

                    technic.type_id = (data.data[0].id);

                    function callback2(err, data) {
                        if (err) console.log(err);
                        if (data.data.length < 1) {
                            function callback4(err, data) {
                                // console.log(data.data.insertId);
                                technic.mark_id = data.data.insertId;

                                function callback(err, data) {
                                    if (err) console.log(err);
                                    else {
                                        let files = getFiles() || [];
                                        console.log(files)
                                        if(files.length > 0) {
                                            let data = new FormData();
                                            for (let i = 0; i < files.length; i++) {
                                                data.append('uploadFile[]', files[i]);
                                            }
                                            data.append("insertId", data.data.insertId)
                                            require('../API').uploadTechnicPhoto_(data, function (err, data) {
                                                    if (err || data.error)
                                                        console.log(err || data.error);
                                                    else {
                                                        require('../pagesScripts/notify').Notify("Оголошення додано.", null, null, 'success');

                                                        table_row.id = data.data.insertId;
                                                        let row = productBuildTableRow(table_row)
                                                        $("#allTechnics tbody").prepend(row);
                                                    }
                                                }
                                            )
                                        }
                                       // $('#addTechnicModel').modal('hide');
                                    }
                                    //$('#addTechnicModel').modal('hide');
                                }

                                require("../API").addTehnic({technic:technic}, callback);
                                $('#addTechnicModelWithoutCategory').css("display", "none");
                            }

                            require("../API").addMarkTechnic({name: mark}, callback4);
                        } else {
                            technic.mark_id = data.data[0].id;

                            function callback9(err, data9) {
                                if (err) console.log(err);
                                else {
                                    table_row.id = data9.data.insertId;

                                    let files = getFiles() || [];
                                    console.log(files)
                                    if(files.length > 0) {
                                        let data = new FormData();
                                        for (let i = 0; i < files.length; i++) {
                                            data.append('uploadFile[]', files[i]);
                                        }
                                        data.append("insertId", data9.data.insertId)
                                        require('../API').uploadTechnicPhoto_(data, function (err, data) {
                                                if (err || data.error)
                                                    console.log(err || data.error);
                                                else {

                                                }
                                            }
                                        )
                                    }

                                    $('#addTechnicModelWithoutCategory').css("display", "none");
                                    require('../pagesScripts/notify').Notify("Оголошення успішно додано!", null, null, "success")
                                    let row = productBuildTableRow(table_row)
                                    $("#allTechnics tbody").prepend(row);
                                }
                            }

                            require("../API").addTehnic({technic:technic}, callback9);
                            // //$('#addTechnicModelWithoutCategory').css("display", "none");
                            // require("../notify").Notify("Оголошення успішно додано!", null, null, "success")
                            // let row = productBuildTableRow(table_row)
                            // $("#allTechnics tbody").prepend(row);
                        }
                    }

                    require("../API").getId("marks_of_technics", mark, callback2);
                }

            }

            require("../API").getId("types_of_technics", selectedType, callback1);
        } else {
            alert("Невірні дані !!!");
        }
    }
    else {

        // update technic

        let id  = localStorage.getItem("currId");
        technic.id = id;


        let photo_arr = JSON.parse(localStorage.getItem("photo_arr")) || [];
        let photo_arr_names = [];

        console.log(photo_arr)
        photo_arr.forEach(function (item) {
            photo_arr_names.push(item.file_name);
        })
        let newPhotos = getFilesUpload() || [];
        let allFileNames = getActualFileNames() || [];


        //console.log(newPhotos);
            let data = new FormData();
            for (let i = 0; i < newPhotos.length; i++) {
                data.append('uploadFile[]', newPhotos[i]);
            }

            data.append("insertId", id)
            data.append("sorted_list", JSON.stringify(allFileNames));
            data.append("old_list", JSON.stringify(photo_arr));

            require('../API').updateTechnicPhoto_(data, function (err, data) {
                    if (err || data.error)
                        console.log(err || data.error);
                    else {}
                }
            )

        // let photos_to_add = [];
        // for( let i =0; i < newPhotos.length;i++) {
        //     let a = newPhotos[i].val.trim();
        //     if(!photo_arr_names.includes(a)) photos_to_add.push({val:a});
        //     newPhotos[i] = a;
        //
        // }
        //
        // for( let i =0; i < photo_arr.length;i++) {
        //     if (!newPhotos.includes(photo_arr[i].file_name)) {
        //         //console.log(photo_arr[i]);
        //         function callback8(err, data){
        //             if(err) console.log(err)
        //             else {
        //                 console.log("success")
        //             }
        //         }
        //         require("../API").delete_oneImageTechnic_by_id(photo_arr[i].id,callback8)
        //         // to do    delete photo from server
        //     }
        // }
        // function callback11(err, data){
        //     if(err) console.log(err)
        //     else {
        //         console.log("success")
        //         console.log(data);
        //     }
        // }
        // require("../API").addImagesTechnic( photos_to_add, id ,callback11)

        function callback(err,data) {
            if( err) {
                console.log(err);
                // Notify("Помилка! Не вдалось видалити.",null,null,'success');
            }
            else {
                technic.mark_id = data.data[0].mark_id;
                technic.type_id = data.data[0].type_id;
                // if (!newPhotos.includes(data.data[0].main_photo_location)) {
                //     technic.main_photo_location = newPhotos.length> 0 ? newPhotos[0] : "default_technic.jpg";
                // }
                function callback5(err,data1) {
                    if( err) {
                        console.log(err);
                        require('../pagesScripts/notify').Notify("Помилка. Не вдалось оновити!", null, null, "danger")
                    }
                    else {
                       // $('#addTechnicModel').modal('toggle');
                        //console.log("data = "+ data);
                        $('#addTechnicModelWithoutCategory').modal('toggle');
                        require('../pagesScripts/notify').Notify("Оголошення успішно оновлено!", null, null, "success")
                    }
                }
                require("../API").updateTechnic(id,technic,callback5)

            }
        }

        require("../API").getTechnicsById(id,callback)
    }

}

function checkInputTechnic() {
    let selectedType = $('#type_technics').children("option:selected").val();
    let mark = $("#mark-choice").val();
    let model = $("#model-choice").val();
    let price = $("input[type=number][name=price-input]").val();
    //let currency = $('#currency-choice').children("option:selected").val();
    let year = $("input[type=number][name=year-input]").val();
    //let description = $("textarea[name=description]").val();

    if(selectedType.toString().trim() =="" || mark.toString().trim()=="" || model.toString().trim()=="" || price.toString().trim()=="" || year.toString().trim()=="") return false;
    else  return true;
}

unlockType = function() {
    if( $('#categories_modal').val() =="Запчастини до комбайнів")
    $('#type_technics').prop("disabled", false);
    else {
        $('#type_technics').prop("disabled", true);
    }
}

function checkInputEquipment() {
    var name = $('#name-equipment').val();
    var price = $("input[type=number][name=price-input]").val();
    var amount = $("#equipment-amount").val();
    var selectedType = $('#type_technics').children("option:selected").val();
    var mark = $("#mark-choice").val();
    var models = $("#model-choice").val();
    let categories = $("#categories_modal").val();
    if(categories=="Категорія") return false;
    if(categories=="Запчастини до комбайнів") {
        if(selectedType=="Комбайни") {
            if(mark=="Марка") return  false;
            if(models==null) return  false;
            if(models.length==0) return false;
        }
        else if(mark.trim()=="") return false;
    }

    if(name.toString().trim() =="" || price.toString().trim()=="" || amount.toString().trim()==""  ) return false; // selectedType.toString().trim()=="Тип" ||
    else  return true;
}

addEquipmentToDB = function () {
    let name = $('#name-equipment').val();
    let code = $("#equipment-code").val();
    let price = $("input[type=number][name=price-input]").val();
    let currency = $('#currency-choice').children("option:selected").val();
    let state = $('#state-choice').children("option:selected").val();
    let amount = $("#equipment-amount").val();
    let description = $("textarea[name=description]").val();
    let category = $("#categories_modal").val();
    let selectedType = $('#type_technics').children("option:selected").val();
    let mark = $("#mark-choice").val();
    let models = $("#model-choice").val();
    // console.log(name);
    // console.log(code);
    // console.log(price);
    // console.log(currency);
    // console.log(state);
    // console.log(description);
    // console.log(amount);
    let add_update_btn = $("#add-btn").text();

    let equipment = {
        name : name,
        amount:amount,
        price:price,
        vendor_code:code,
        currency:currency,
        state:state,
        id_category:1,
        description:description,
    };

    // if(currency=="€") equipment.currency="євро";
    // if(currency=="грн") equipment.currency="гривня";


    if(add_update_btn=="Додати") {

        if (checkInputEquipment()) {

            function callback5(err, data5) {
                if (err) console.log(err);
                else {
                    data5.data.forEach(function (item) {
                        if (item.category_name == category) equipment.id_category = item.id;
                    })

                    function callback(err, data) {
                        //console.log(data.data);
                       // console.log(data.data[0]);
                        let insertedid = data.data.insertId;
                         //console.log(data.data.insertId);
                        let model_id = null;

                        if (category == "Запчастини до комбайнів") {

                            function callback2(err, data1) {
                                if (err) console.log(err);
                                else {

                                    let equipmentmodel;
                                    models.forEach(function (item_model) {
                                        data1.data.forEach(function (item) {
                                            if (item.model == item_model) {
                                                model_id = item.id;
                                                equipmentmodel = {
                                                    equipment_id: insertedid,
                                                    model_id: model_id
                                                }

                                                function callback3(err, data) {
                                                    if (err) console.log(err);
                                                    else {
                                                        //$('#addEquipmentModel').modal('hide');
                                                    }
                                                }

                                                require("../API").addEquipmentsModels(equipmentmodel, callback3);
                                            }
                                        })
                                    })
                                    //$('#addEquipmentModel').modal('hide');
                                }

                            }

                            require("../API").getModels(callback2);
                        }

                        let files = getFiles() || [];
                        console.log(files)
                        if(files.length > 0) {
                            let data = new FormData();
                            for (let i = 0; i < files.length; i++) {
                                data.append('uploadFile[]', files[i]);
                            }
                            data.append("insertId", insertedid)
                            require('../API').uploadEquipmentPhoto_(data, function (err, data) {
                                    if (err || data.error)
                                        console.log(err || data.error);
                                }
                            )
                        }

                        $('#addEquipmentModel').css("display", "none");

                        equipment.id = insertedid;
                        let row = productBuildEquipmentTableRow(equipment);
                        $("#allEquipments tbody").prepend(row);
                        notify.Notify("Оголошення додано.", null, null, 'success');
                    }

                    require("../API").addEquipment({equipment:equipment}, callback);
                    //$('#addEquipmentModel').css("display", "none");
                }
            }
            require("../API").get_equipments_categories(callback5);

        } else {
            alert("Невірні дані!!!")
        }
    }
    else // update equipment
        {
        let curId = localStorage.getItem("currEquipmentId");
        console.log(curId);
            if (checkInputEquipment()) {

                //// in process
                equipment.id = curId;
                let photo_arr = JSON.parse(localStorage.getItem("photo_arr")) || [];

                let photo_arr_names = [];
                photo_arr.forEach(function (item) {
                    photo_arr_names.push(item.file_name);
                })

                let newPhotos = getFilesUpload() || [];
                let allFileNames = getActualFileNames() || [];


                //console.log(newPhotos);
                let data = new FormData();
                for (let i = 0; i < newPhotos.length; i++) {
                    data.append('uploadFile[]', newPhotos[i]);
                }

                data.append("insertId", curId)
                data.append("sorted_list", JSON.stringify(allFileNames));
                data.append("old_list", JSON.stringify(photo_arr));

                require('../API').updateEquipmentPhoto_(data, function (err, data) {
                        if (err || data.error)
                            console.log(err || data.error);
                        else {}
                    }
                )


                // let photo_arr_names = [];
                // photo_arr.forEach(function (item) {
                //     photo_arr_names.push(item.file_name);
                // })
                // let newPhotos = getPhotos();
                // let photos_to_add = [];
                // for( let i =0; i < newPhotos.length;i++) {
                //     let a = newPhotos[i].val.trim();
                //     if(!photo_arr_names.includes(a)) photos_to_add.push({val:a});
                //     newPhotos[i] = a;
                //
                // }
                //
                // for( let i =0; i < photo_arr.length;i++) {
                //     if (!newPhotos.includes(photo_arr[i].file_name)) {
                //         //console.log(photo_arr[i]);
                //         function callback8(err, data){
                //             if(err) console.log(err)
                //             else {
                //                 console.log("success")
                //             }
                //         }
                //         require("../API").delete_oneImageEquipment_by_id(photo_arr[i].id,callback8)
                //         // to do    delete photo from server
                //     }
                // }
                // function callback11(err, data){
                //     if(err) console.log(err)
                //     else {
                //         console.log("success")
                //         console.log(data);
                //     }
                // }
                // require("../API").addImagesEquipment( photos_to_add, curId ,callback11);



                if (category == "Запчастини до комбайнів") {

                    /// to do .. delete from db equip
                    let old_models = JSON.parse(localStorage.getItem("models_old"));
                    let new_models = [];

                    function callback12(err, data12) {
                        if (err) console.log(err);
                        else {
                            models.forEach(function (item_model) {
                                data12.data.forEach(function (item) {
                                    if (item.model == item_model) {
                                        model_id = item.id;
                                        new_models.push({equipment_id: parseInt(curId), model_id: model_id});
                                    }
                                });
                            });
                            console.log(new_models);
                            new_models.forEach(function (item) {
                                if (!old_models.includes(item)) {
                                    function callback3(err, data) {
                                        if (err) console.log(err);
                                        else {
                                            //$('#addEquipmentModel').modal('hide');
                                        }
                                    }

                                    require("../API").addEquipmentsModels(item, callback3);
                                }
                            })
                            console.log(old_models);
                            for (let i = 0; i < old_models.length; i++) {
                                if (!include(old_models[i], new_models)) {
                                    console.log(include(old_models[i], new_models) + " old " + old_models[i]);

                                    function callback13(err, data) {
                                        if (err) console.log(err);
                                        else {
                                            //$('#addEquipmentModel').modal('hide');
                                        }
                                    }

                                    require("../API").deleteEquipmentsModelsByIDS(old_models[i].equipment_id, old_models[i].model_id, callback13);
                                }
                            }
                        }
                    }

                    require("../API").getModels(callback12);
                }
                ////

                function callback5(err, data5) {
                    if (err) console.log(err);
                    else {
                        equipment.id_category = data5.data[0].id_category;

                        // if (!newPhotos.includes(data5.data[0].main_photo_location)) {
                        //     equipment.main_photo_location = newPhotos.length> 0 ? newPhotos[0] : "default_technic.jpg";
                        // }

                        //console.log(eq);
                        function callback6(err, data6) {
                            if (err) console.log(err);
                            else {
                                $('#addEquipmentModel').modal('hide');
                            }
                        }
                        require("../API").updateEquipment(curId,equipment, callback6);
                   }
                }
                require("../API").getEquipmentsById(curId, callback5);

            }
    }


    // $("#allEquipments tbody").append(
    //     productBuildTableRow(102));
}




function technicFormClear() {
    $("#mark-choice").val("");
    $('#mark-choice').prop("disabled", true);
    $("#description").val("");
    $("#model-choice").val("");
    $('#model-choice').prop("disabled", true);
    $("#price-input-technic").val("");
    $("#year-technic-input").val("");
    $('#type_technics').val("Тип");
    $('#type_technics').prop("disabled", false);
   // delete photoes if needed
}

function equipmentFormClear() {
    $("#mark-choice").val("");
    $('#mark-choice').prop("disabled", true);
    $("#description").val("");
    $("#model-choice").children().remove();
    $('#model-choice').prop("disabled", true);
    $('#categories_modal').prop("disabled", false);
    //multipleEquipmentOpen = true;
    $('#multiple-select-container-'+(container_num-1)).remove();
    $('.uploader__file-list').empty();
// class="js-uploader__contents uploader__contents uploader__hide"
    $('.uploader__contents').removeClass("uploader__hide");
    $('.js-uploader__further-instructions').addClass("uploader__hide");

    $('.js-uploader__submit-button').addClass("uploader__hide");
}


function openTab(value){
    document.location.href = API_URL+"/admin-panel7913?page="+value;
}

function uploadPhoto(){
    require('../API').uploadPhotos($('#fileinput')[0].files,function(err,data){
        if(err || data.error){}
        else {
            require('../API').uploadPhotos(id,{
                photo_location: event.target.files[0].name,
                phone_number: $phone_value.value
            },function(err){
                if (err) console.log(err);
            })
        }
    })
}
/*не корректный */
// function getPhotos(){
//     var arrCheck = [];
//     $('.uploader__file-list li .uploader__file-list__text').each(function(idx, item) {
//         var ert = {
//             val: $(this, item).text()
//         };
//         arrCheck.push(ert);
//     });
//     return arrCheck;
// }

 $(document).on('input','#fileinput0', function (event) {
     //console.log(event.target.files)
     files2 = files2.concat(Array.from(event.target.files))
     //console.log(files)
 });

 $(document).on('input','#secondaryfileinput0', function (event) {
     //console.log(event.target.files)
     files2 = files2.concat(Array.from(event.target.files))
     //console.log(files)
 });

 function getFiles() {
     //let files1 = Array.from($('#fileinput0').prop('files'));
     //let files2 = Array.from($('#secondaryfileinput0').prop('files'));
     //let files = files1.concat(files2);
     let filesNames = [];
     // let files_slice = $.map(files, function (item) {
     //     return item.name
     // })
     $('#sortable1 li').each(function(i)
     {
         filesNames.push($(this).data('src-file')); // This is your rel value
     });
     // check for method update technic/equipment
     let list_return = [];
     filesNames.forEach(function (item) {
         for (let i = 0; i < files2.length; i++) {

             let file_input = files2[i];

             if (item == cleanName(file_input.name)) {
                 list_return.push(file_input);
                 break;
             }
         }
     })
     return list_return || [];
     //return filesNames;
 }


 function getFilesUpload() {
     let filesNames = [];

     $('#sortable1 li').each(function(i)
     {
         let src = $(this).data('src-file');
         let type = $(this).data('type');
         if(type === "new")
         filesNames.push(src);
     });
     // check for method update technic/equipment
     let list_return = [];
     filesNames.forEach(function (item) {
         for (let i = 0; i < files2.length; i++) {

             let file_input = files2[i];

             if (item == cleanName(file_input.name)) {
                 list_return.push(file_input);
                 break;
             }
         }
     })
     return list_return || [];
     //return filesNames;
 }

 function getActualFileNames() {
     let filesNames = [];

     $('#sortable1 li').each(function(i)
     {
         let type = $(this).data('type');
         filesNames.push({src: $(this).data('src-file'), type: type});
     });

     return filesNames;
 }


 function cleanName (name) {
     name = name.replace(/\s+/gi, '-'); // Replace white space with dash
     return name;//name.replace(/[^a-zA-Z0-9.\-]/gi, ''); // Strip any special characters
 }

function uploadphotoToModal() {
    $('.uploader__file-list').append();
}

$(function(){
    $('#technic_menu').click(function(){
        openTab(1);
    });
    $('#equipments_menu').click(function(){
        openTab(2);
    });
    $('#technics_without_category_menu').click(function(){
        openTab(3);
    });
    var options = {
        submitButtonCopy: 'Upload Selected Files',
        instructionsCopy: 'Drag and Drop, or',
        furtherInstructionsCopy: 'Your can also drop more files, or',
        selectButtonCopy: 'Select Files',
        secondarySelectButtonCopy: 'Select More Files',
        dropZone: $(this),
        fileTypeWhiteList: ['jpg', 'png', 'jpeg', 'gif', 'pdf'],
        badFileTypeMessage: 'Sorry, we\'re unable to accept this type of file.',
        testMode: false
    };
    $('#fileUploadForm').uploader();

    $('.uploadButton').click(function(){
        addTechnicToDB();
        /*require('../API').uploadPhotos($('#fileinput')[0].files,function(err,data){
            if(err || data.error){}
            else {
                require('../API').uClient(id,{
                    photo_location: event.target.files[0].name,
                    phone_number: $phone_value.value
                },function(err){
                    if (err) console.log(err);
                })
            }
        })*/
    });

    // $('#fileinput0').change(function (event) {
    //     for(var i=0;i<event.target.files.length;i++)
    //         //files.push(event.target.files[i])
    //         if(type=='tech') {
    //             console.log(event.target.files[i])
    //             require('../API').uploadTechnicPhoto(event.target.files[i],function(err,data){
    //                 if(err || data.error)
    //                     console.log(err||data.error);
    //             });
    //         }
    //
    //         else
    //             require('../API').uploadEquipmentPhoto(event.target.files[i],function(err,data){
    //                 if(err || data.error)
    //                     console.log(err||data.error);
    //             })
    // })
    //
    // $('#secondaryfileinput0').change(function (event) {
    //     for(var i=0;i<event.target.files.length;i++)
    //         if(type=='tech')
    //             require('../API').uploadTechnicPhoto(event.target.files[i],function(err,data){
    //                 if(err || data.error)
    //                 console.log(err||data.error);
    //                 console.log(event.target.files[i])
    //             });
    //         else
    //             require('../API').uploadEquipmentPhoto(event.target.files[i],function(err,data){
    //                 if(err || data.error)
    //                     console.log(err||data.error);
    //             })
    //
    // })




});

 var getFileBlob = function (url, cb) {
     var xhr = new XMLHttpRequest();
     xhr.open("GET", url, false);
     try {
         xhr.send();
         if (xhr.status != 200) {
             alert(`Ошибка ${xhr.status}: ${xhr.statusText}`);
         } else {
             let res = xhr.response;
             cb(xhr.response);
             //alert(xhr.response);
         }
     } catch(err) { // для отлова ошибок используем конструкцию try...catch вместо onerror
         alert("Запрос не удался");
     }

     // var xhr = new XMLHttpRequest();
     // xhr.open("GET", url);
     // xhr.responseType = "blob";
     // xhr.addEventListener('load', function() {
     //     cb(xhr.response);
     // });
     // xhr.send();
 };

 var blobToFile = function (blob, name) {
     blob.lastModifiedDate = new Date();
     blob.name = name;
     return blob;
 };

 var getFileObject = function(filePathOrUrl, cb) {
     getFileBlob(filePathOrUrl, function (blob) {
         cb(blobToFile(blob, 'mf-186.jpg'));
     });
 };

function hideModal(){
    $(".modal").removeClass("in");
    $(".modal-backdrop").remove();
    $('body').removeClass('modal-open');
    $('body').css('padding-right', '');
    $(".modal").hide();
}

 function sleep(milliseconds) {
     const date = Date.now();
     let currentDate = null;
     do {
         currentDate = Date.now();
     } while (currentDate - date < milliseconds);
 }

 function  include(elem,arr2) {

         for(let i = 0 ; i < arr2.length;i++){
             if(elem.equipment_id == arr2[i].equipment_id && elem.model_id == arr2[i].model_id) return true;
         }
        return false;
 }


 // $(".uploader__file-list__item").each(function(i) {
 //     var item = $(this);
 //     var item_clone = item.clone();
 //     item.data("clone", item_clone);
 //     var position = item.position();
 //     item_clone
 //         .css({
 //             left: position.left,
 //             top: position.top,
 //             visibility: "hidden"
 //         })
 //         .attr("data-pos", i+1);
 //
 //     $("#cloned.uploader__file-list__items").append(item_clone);
 // });
 //
 // $(".js-uploader__file-list").sortable({
 //
 //     axis: "y",
 //     revert: true,
 //     scroll: false,
 //     placeholder: "sortable-placeholder",
 //     cursor: "move",
 //
 //     start: function(e, ui) {
 //         ui.helper.addClass("exclude-me");
 //         $(".js-uploader__file-list .uploader__file-list__item:not(.exclude-me)")
 //             .css("visibility", "hidden");
 //         ui.helper.data("clone").hide();
 //         $(".cloned.uploader__file-list__items .uploader__file-list__item").css("visibility", "visible");
 //     },
 //
 //     stop: function(e, ui) {
 //         $(".js-uploader__file-list .uploader__file-list__item.exclude-me").each(function() {
 //             var item = $(this);
 //             var clone = item.data("clone");
 //             var position = item.position();
 //
 //             clone.css("left", position.left);
 //             clone.css("top", position.top);
 //             clone.show();
 //
 //             item.removeClass("exclude-me");
 //         });
 //
 //         $(".js-uploader__file-list .uploader__file-list__item").each(function() {
 //             var item = $(this);
 //             var clone = item.data("clone");
 //
 //             clone.attr("data-pos", item.index());
 //         });
 //
 //         $(".js-uploader__file-list .uploader__file-list__item").css("visibility", "visible");
 //         $(".cloned.uploader__file-list__items .uploader__file-list__item").css("visibility", "hidden");
 //     },
 //
 //     change: function(e, ui) {
 //         $(".js-uploader__file-list .uploader__file-list__item:not(.exclude-me)").each(function() {
 //             var item = $(this);
 //             var clone = item.data("clone");
 //             clone.stop(true, false);
 //             var position = item.position();
 //             clone.animate({
 //                 left: position.left,
 //                 top: position.top
 //             }, 200);
 //         });
 //     }
 //
 // });




 /// technics without category


 let editor = require('../pagesScripts/loader').admin_editor("admin-editor");


 openAddTechnicWithoutCategoryModel = function () {
     type = 'tech';
     document.getElementById('addTechnicModelWithoutCategory').style.display='block';
     $("#add-btn").text("Додати");
     loaderFormClear();
 }


 openEditTechnicWithoutCategoryModal = function(cell) {
     $('#addTechnicModelWithoutCategory').modal('show');
     type = 'tech';
     var row = $(cell).parents("tr");
     var cols = row.children("td");
     var id  = $(cols[0]).text();
     localStorage.setItem("currId", id);
     //console.log(id);
     var s = $(cols[1]).text();
     $("#name_loader").val("");
     $("#price-input-technic").val($(cols[4]).text());

     function callback(err,data) {
         if (err) {
             console.log(err);
         }
         else {
             let cont = JSON.parse(data.data[0].description,function (key, value) {
                 if(typeof value === 'string')
                     value = value.replace("/n/","\n");
                 return value
             });
             //console.log(cont);

             editor.setContents(cont);
             $('#name_loader').val(data.data[0].name);
             $("#price-input-technic").val(data.data[0].price);
             //$("#description").val(data.data[0].description);
             let cur = data.data[0].currency;
             if(cur == "долар")  $("#currency-choice").val("$");
             else if(cur == "євро")  $("#currency-choice").val("€");
             else  $("#currency-choice").val("грн");


             let photos = JSON.parse(data.data[0].photos);

             let dataset = [];
             if(photos == null) {
                 photos = []
             }
             console.log(photos)

             // if(photos.length != 0)
             //     photos.forEach(function(item) {
             //         dataset.push("technics/"+item.val)
             //     });
             // if(dataset.length === 0) {
             //     dataset.push("technics/"+default_photo)
             // }
             // photos = dataset;
             // localStorage.setItem("photo_arr", JSON.stringify(dataset));
             $('.uploader__file-list').empty();
             $('.js-uploader__submit-button').removeClass("uploader__hide");
             $('.js-uploader__further-instructions').removeClass("uploader__hide");
             $('.js-uploader__contents').addClass("uploader__hide");

             for(let i=0;i< photos.length;i++) {
                 let item = photos[i];
                 getFileObject("/images/technics/" + item , function (fileObject) {
                     //console.log(fileObject.size);
                     $('.uploader__file-list').append( `<li class="uploader__file-list__item" data-src-file=${item} data-type="old" data-index="` + item +  "\"" +
                         "><span class=\"uploader__file-list__thumbnail\"><img  class=\"thumbnail\" src=\"/images/technics/" + item + "\"" +
                         " ></span> <button onclick=\"console.log('delete click')\" class=\"delete uploader__icon-button js-upload-remove-button fa fa-times\" data-index=\"" +
                         item.id +  "\""+ "></button></li>")
                 })
             }

         }
     }
     require("../API").getTechnicsWithoutCategoryById(id,callback);
     $("#add-btn").text("Оновити");

 }

 openRemoveModalTechnicWithoutCategory = function(cell){
     $('#myModal').modal("toggle");
     let row = $(cell).parents("tr");
     let cols = row.children("td");
     let id  = $(cols[0]).text();
     $('#modal-btn-delete').click(function() {

         function callback1(err,data1) {
             if (err) {
                 console.log(err);
             }
             else {
                 // let photos = JSON.parse(data1.data[0].photos);
                 // if(photos!= null && photos!= undefined) {
                 //    // deleteFile(photos);
                 //     fs.unlink("yabluna.png", (err) => {
                 //         if (err) {
                 //             console.error(err)
                 //             return
                 //         }
                 //     })
                 //     // try {
                 //     //     fs.unlink("yabluna.png")
                 //     //     //file removed
                 //     // } catch(err) {
                 //     //     console.error(err)
                 //     // }
                 // }
                 function callback(err,data) {
                     if( err) {
                         Notify("Помилка! Не вдалось видалити.",null,null,'success');
                     }
                     else {
                         $(cell).parents("tr").remove();
                         $('#myModal').modal("hide");
                     }
                 }
                 require("../API").deleteTechnicsWithoutCategoryByID(id,callback);
             }
         }
         require("../API").getTechnicsWithoutCategoryById(id,callback1);


     });
     //


 }

 $(function(){
     function callback(err,data) {
         data.data.forEach(function(item){

             let el;

             if (item.sold) el += "<tr class='rowTechnic soldTechnic'>"; else {
                 el+="<tr class='rowTechnic'>";
             }
             el+= "<td class=\"id\">"+item.id+"</td>" +
                 "<td class=\"type\">"+
                 // item.name
                 item.name
                 +
                 "</td>" +
                 " <td class=\"price\">"+item.price+"</td>" +
                 " <td class=\"edit-btn\"><button class=\"btn btn-secondary btn-admin-panel\" onclick='openEditTechnicWithoutCategoryModal(this)'><i class=\"fa fa-edit fa-button-admin\"></i></button></td>" + //onclick='deleteTechnic(this)'
                 "<td class=\"delete-btn delete-btn-technic\"><button class=\"btn btn-secondary btn-admin-panel\" onclick='openRemoveModalTechnicWithoutCategory(this)'><i class=\"fa fa-remove fa-button-admin\"></i></button></td>" +
                 "</tr>"
             $("#allTechnicsWithoutCategory tbody").append(el
             );
         });
     }
     require("../API").getTechnicsWithoutCategory(callback);
 });

 addTechnicWithoutCategoryToDB = function () {

     let loader_name = $('#name_loader').val().trim();
     let price = $("input[type=number][name=price-input]").val().trim();
     function replacer(key, value) {
         // Фільтрація властивостей
         if(typeof value === 'string')
             value = value.toString().replace("\n","/n/");
         return value;
     }

     let json_desc = JSON.stringify(editor.getContents(),replacer);
     let currency = $('#currency-choice').children("option:selected").val();
     // ..todo photos
     let add_update = $("#add-btn").text();
     //json_desc = json_desc.replace("\n","/n/")

     let loader = {
         name: loader_name,
         price: price,
         description: json_desc,
         currency:"гривня"
     }
     if (currency == '$') loader.currency = "долар";
     if (currency == '€') loader.currency = "євро";

     if(add_update=="Додати") {

         if (checkInputLoader()) {
             console.log(loader)

             //loader.photos = getPhotos().length > 0 ? JSON.stringify(getPhotos()) : JSON.stringify(["default_technic.jpg"])
             function callback1(err, data1){
                 if(err) console.log(err)
                 else {

                     console.log(data1.data.insertId)
                     let id = data1.data.insertId;
                     console.log("success");
                     let files = getFiles() || [];

                     if(files.length > 0) {
                         let data = new FormData();
                         for (let i = 0; i < files.length; i++) {
                             data.append('uploadFile[]', files[i]);
                         }
                         data.append("insertId", id)

                         data.append("type", "withoutCategoryTechnics")
                         require('../API').uploadTechnicPhoto_(data, function (err, data) {
                                 if (err || data.error)
                                     console.log(err || data.error);
                                 else {

                                 }
                             }
                         )
                     }
                 }
             }
             require("../API").addTehnicWithoutCategory(loader, callback1);
         } else {
             alert("Невірні дані !!!");
         }
     }
     else {
         // Оновлення фото не відбуваються


         let id  = localStorage.getItem("currId");
         let photo_arr = JSON.parse(localStorage.getItem("photo_arr"));
         //let newPhotos = getPhotos();
         //console.log(newPhotos)

         let photos_to_add = [];

         //
         // for( let i =0; i < newPhotos.length;i++) {
         //     let a = newPhotos[i].val.trim();
         //     if(!photo_arr_names.includes(a)) photos_to_add.push({val:a});
         //     newPhotos[i] = a;
         //
         // }
         //
         // for( let i =0; i < photo_arr.length;i++) {
         //     if (!newPhotos.includes(photo_arr[i].file_name)) {
         //         // to do    delete photo from server
         //     }
         // }

         //loader.photos = newPhotos.length > 0 ? JSON.stringify(newPhotos) : JSON.stringify(["default_technic.jpg"])
         console.log(loader)
         function callback5(err,data1) {
             if( err) {
                 console.log(err);
             }
             else {
                 alert("Товар оновлено!");
             }
         }
         require("../API").updateTechnicWithoutCategory(id,loader,callback5)
     }

 }

 function checkInputLoader() {
     let loader_name = $('#name_loader').val().trim();
     let price = $("input[type=number][name=price-input]").val().trim();
     //
     // if(loader_name.isNullOrEmpty
     //     || producer.isNullOrEmpty() || country_producer.isNullOrEmpty() || price.isNullOrEmpty())
     //     return false;
     // else
     return true;
 }

 function loaderFormClear() {
     $("#producer").val("");
     $("#country-producer").val("");
     editor.deleteText(0,editor.getLength())
     $("#price-input-technic").val("");
     $("#year-technic-input").val("");
     $('#name_loader').val("Фронтальний навантажувач");

     $('.uploader__file-list').empty();
// class="js-uploader__contents uploader__contents uploader__hide"
     $('.uploader__contents').removeClass("uploader__hide");
     $('.js-uploader__further-instructions').addClass("uploader__hide");

     $('.js-uploader__submit-button').addClass("uploader__hide");
 }

 function photosMakeSortable() {
     $('ul.sorter').amigoSorter();
     //$('.list.parent').sortable({container: '.list', nodes: ':not(.list span)'});
 }

