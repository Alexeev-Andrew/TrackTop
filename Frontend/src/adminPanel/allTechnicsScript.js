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

 $(function(){
     let editor = document.querySelector( '#editor' );
     if(editor) {
         ClassicEditor
             .create( editor, {
             } )
             .then( editor => {
                 window.editor = editor;
             } )
             .catch( error => {
                 console.error( error );
             } );
     }

     $('#vendor-choice')
         .select2({
             placeholder: 'Впишіть коди товару',
             // selectOnClose: true,
             allowClear: true,
             theme: "classic",
             tags: true
         });
 });

//multiple = new MultipleSelect();
openAddTechnicModel = function () {

    type = 'tech';
    $('#addTechnicModelWithoutCategory').modal("show");
    // document.getElementById('addTechnicModelWithoutCategory').style.display='block';
    // $('#addTechnicModel').style.display='block';
    $("#add-btn").text("Додати");
    $("#technic_url").hide()
    technicFormClear();

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


    function callback(err,data) {
        if (err) {
            console.log(err);
        }
        else {
            $("#technic_url").attr("href",API_URL + "/technic?model=" + model.val() + "&mark=" + mark.val() + "&type=" + type + "&number_id=" + id)

            //http://tracktop.com.ua/technic?model=186&mark=Massey%20Ferguson&type=%D0%9A%D0%BE%D0%BC%D0%B1%D0%B0%D0%B9%D0%BD%D0%B8&number_id=229
            editor.setData(data.data[0].description);
            $("#year-technic-input").val(data.data[0].production_date);

            $("#status").val(data.data[0].status);

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
                //im = JSON.parse(data.data);
                im = data.data;
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
                    require('../pagesScripts/notify').Notify("Помилка! Не вдалось виконати.", null, null, 'success');
                }
                else {
                    $(cell).parents("tr").remove();
                    $('#myModal').modal("hide");
                    require('../pagesScripts/notify').Notify("Успішно видалено", null, null, 'success');
                }
            }
            require("../API").deleteTechnicsByID(id,callback);
    });

    $('#modal-btn-sold').click(function() {
        function callback2(err,data2) {
            if( err) {
                require('../pagesScripts/notify').Notify("Помилка! Не вдалось виконати.", null, null, 'success');
            }
            else {
                $('#myModal').modal("hide");
                require('../pagesScripts/notify').Notify("Успішно видалено", null, null, 'success');
            }
        }
        require("../API").updateTechnic(id,{status: "продано"},callback2)
    });

}

deleteEquipment = function(cell) {
    // check if we can delete
    let row = $(cell).parents("tr");
    let cols = row.children("td");
    let id  = $(cols[0]).text();
    // console.log(id);
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

showModels = function() {
    let selectedType = $('#type_technics').children("option:selected").val();
    let selectedMark = $('#mark-choice').val();
    $('#model-choice').prop("disabled", false);
    ///

    $('#model-choice').children().remove();

    function callback(err,data) {
        if(err) console.log(err);
        else {
            let ar = [];
            data.data.forEach(function (item) {
                ar.push({id: item.model,text:  item.model})
            });
            $('#model-choice').append('<option></option>');
            $('#model-choice')
                .select2({
                    placeholder: 'Оберіть моделі',
                    closeOnSelect: false,
                    selectOnClose: false,
                    allowClear: true,
                    data: ar
                });

        }
    }
    require("../API").getModelsbyTypeMark(selectedType,selectedMark,callback);


    ///




    //
    // if(multipleEquipmentOpen) {
    //     $('#model-choice').children().remove();
    //     $('#multiple-select-container-'+container_num).remove();
    //     container_num++;
    // }
    // function callback(err,data) {
    //     if(err) console.log(err);
    //     else {
    //         //console.log(data);
    //         data.data.forEach(function (item) {
    //             if (! $('#model-choice').find("option[value='" + item.model + "']").length)
    //                   $('#model-choice').append(new Option(item.model, item.model, false, false));
    //                 //console.log(item.model);
    //         });
    //         $('#model-choice').prop("multiple", true);
    //         if(!multipleEquipmentOpen) {
    //             multipleEquipmentOpen = true;
    //         }
    //         new MultipleSelect('#model-choice');
    //     }
    // }
    // require("../API").getModelsbyTypeMark(selectedType,selectedMark,callback);
}

openAddEquipmentModel = function () {
    type = 'eq';
    $('#addEquipmentModel').modal("show");
    $("#add-btn").text("Додати");
    $('#type_technics').prop("disabled", true);
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
    equipmentFormClear();

    type = 'eq';
    let row = $(cell).parents("tr");
    let cols = row.children("td");
    let id  = $(cols[0]).text();
    // console.log(id);
    localStorage.setItem("currEquipmentId",id);
    //children("button")[0]).data("id");
    $("#name-equipment").val($(cols[1]).text());
    // $("#equipment-code").val($(cols[3]).text());
    $('#model-choice').children().remove();
    $('#mark-choice').children().remove();
    $('#type_technics').children().remove();
    $('#mark-choice').prop("disabled", true);
    $('#model-choice').prop("disabled", true);
    $('#multiple-select-container-'+(container_num-1)).remove();
    $('#multiple-select-container-'+(container_num)).remove();

    function callback(err,data) {
        if (err) {
            console.log(err);
        }
        else {
            let equipment = data.data[0];
            $("#price-input").val(equipment.price);

            //console.log(equipment)
            // check 
            //console.log(typeof equipment.vendor_code)
            //let eq_codes =  JSON.parse(equipment.vendor_code) || [];
            //console.log(eq_codes)
            let eq_codes =  equipment.vendor_code || [];
            $("#equipment-amount").val(equipment.amount);
            eq_codes.forEach(function (item) {
                    let option = new Option(item, item, false, true);
                    $('#vendor-choice').append(option).trigger("change")
            })

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
                    $("#status").val(data.data[0].status);

                    editor.setData(data.data[0].description);
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
                    //let images = JSON.parse(equipment.images) || [];
                    let images = equipment.images || [];
                    //console.log(images)
                    localStorage.setItem("photo_arr", JSON.stringify(equipment.images));
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
                        // $('.uploader__file-list').append( "<li class=\"uploader__file-list__item\" data-index=\"" + item +  "\"" +
                        //     "><span class=\"uploader__file-list__thumbnail\"><img  class=\"thumbnail\" src=\"/images/equipments/" + item + "\"" +
                        //     " ></span> <button onclick=\"console.log('delete click')\" class=\"delete uploader__icon-button js-upload-remove-button fa fa-times\" data-index=\"" +
                        //     item.id +  "\""+ "></button></li>")

                        $('.uploader__file-list').append( `<li class="uploader__file-list__item" data-src-file=${item} data-type="old" data-index="` + item +  "\"" +
                            "><span class=\"uploader__file-list__thumbnail\"><img  class=\"thumbnail\" src=\"/images/equipments/" + item + "\"" +
                            " ></span> <button onclick=\"console.log('delete click')\" class=\"delete uploader__icon-button js-upload-remove-button fa fa-times\" data-index=\"" +
                            item.id +  "\""+ "></button></li>")
                     })
                }
                photosMakeSortable()
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

    function callback(err,data) {
        data.data.forEach(function(item){
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
    //alert( "ready!" );
    function callback(err,data) {
        data.data.forEach(function(item){
            $("#allEquipments tbody").append(`
                <tr class="rowEquipment">
                    <td class="id">${item.id}</td>
                    <td class="name">${item.name}</td>
                    <td class="price">${item.price} ${item.currency}</td>
                    <td class="code column-limited">${item.vendor_code}</td>
                    <td class="edit-btn">
                        <button class="btn btn-secondary btn-admin-panel" onclick="openEditEquipmentModal(this)">
                            <i class="fa fa-edit fa-button-admin"></i>
                        </button>
                    </td>
                    <td class="delete-btn">
                        <button class="btn btn-secondary btn-admin-panel" onclick="deleteEquipment(this)">
                            <i class="fa fa-remove fa-button-admin"></i>
                        </button>
                    </td>
                </tr>`
                // "<tr class='rowEquipment'>" +
                // "<td class=\"id\">"+item.id+"</td>" +
                // "<td class=\"name\">"+item.name +"</td>" +
                // " <td class=\"price\">"+item.price+ item.currency +"</td>" +
                // " <td class=\"code column-limited\">"+item.vendor_code+"</td>" +
                // " <td class=\"edit-btn\"><button class=\"btn btn-secondary btn-admin-panel\" onclick='openEditEquipmentModal(this)'><i class=\"fa fa-edit fa-button-admin\"></i></button></td>" +
                // "<td class=\"delete-btn\"><button class=\"btn btn-secondary btn-admin-panel\" onclick='deleteEquipment(this)'><i class=\"fa fa-remove fa-button-admin\"></i></button></td>" +
                // "</tr>"
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
     "<td class=\"name\">"+item.name + item.mark + "</td>" +
     " <td class=\"price\">"+item.price+"</td>" +
     " <td class=\"code\">"+item.vendor_code+"</td>" +
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
    let description = editor.getData()
    let status = $('#status').children("option:selected").val();

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
        status : status,
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
                                                data.append('uploadFile', files[i]);
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
                                    }
                                }

                                require("../API").addTehnic({technic:technic}, callback);
                                $('#addTechnicModelWithoutCategory').modal("toggle");
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
                                            data.append('uploadFile', files[i]);
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

                                    $('#addTechnicModelWithoutCategory').modal("toggle");
                                    require('../pagesScripts/notify').Notify("Оголошення успішно додано!", null, null, "success")
                                    let row = productBuildTableRow(table_row)
                                    $("#allTechnics tbody").prepend(row);
                                }
                            }

                            require("../API").addTehnic({technic:technic}, callback9);

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
                data.append('uploadFile', newPhotos[i]);
            }

            data.append("insertId", id)
            data.append("sorted_list", JSON.stringify(allFileNames));
            data.append("old_files", JSON.stringify(photo_arr));
            console.log(allFileNames)
            console.log(photo_arr)


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
    let name = $('#name-equipment').val();
    let price = $("input[type=number][name=price-input]").val();
    let amount = $("#equipment-amount").val();
    let selectedType = $('#type_technics').children("option:selected").val();
    let mark = $("#mark-choice").val();
    let models = $("#model-choice").val();
    let categories = $("#categories_modal").val();
    if(!categories || categories=="Категорія") return false;
    if(categories=="Запчастини до комбайнів") {
        if(selectedType=="Комбайни") {
            if(mark=="Марка") return  false;
            if(models==null) return  false;
            if(models.length==0) return false;
        }
        else if(!mark || mark.trim()=="") return false;
    }

    if(name.toString().trim().length <= 2 || +price < 0 || +amount < 0 ) return false; // selectedType.toString().trim()=="Тип" ||
    else  return true;
}

addEquipmentToDB = function () {
    let name = $('#name-equipment').val();
    let code = $("#vendor-choice").val();
    code = Array.isArray(code) ? code : (code ? [code] : []);
    let price = $("input[type=number][name=price-input]").val();
    let currency = $('#currency-choice').children("option:selected").val();
    let state = $('#state-choice').children("option:selected").val();
    let amount = $("#equipment-amount").val();
    let description = editor.getData();
    let category = $("#categories_modal").val();
    let selectedType = $('#type_technics').children("option:selected").val();
    let mark = $("#mark-choice").val();
    let models = $("#model-choice").val();
    let status = $("#status").val()

    let add_update_btn = $("#add-btn").text();

    code.filter(item => item.toString().trim().length > 2)

    let equipment = {
        name : name,
        amount:amount,
        price:price,
        vendor_code: JSON.stringify(code),
        currency:currency,
        state:state,
        id_category:1,
        description:description,
        status: status
    };



    if(add_update_btn=="Додати") {

        if (checkInputEquipment()) {

            function callback5(err, data5) {
                if (err) console.log(err);
                else {
                    data5.data.forEach(function (item) {
                        if (item.category_name == category) equipment.id_category = item.id;
                    })

                    function callback(err, data) {
                        let insertedid = data.data.insertId;
                        let model_id = null;

                        if (category == "Запчастини до комбайнів") {

                            function callback2(err, data1) {
                                if (err) console.log(err);
                                else {

                                    let equipmentmodel;
                                    console.log(models)
                                    models.forEach(function (item_model) {
                                        data1.data.forEach(function (item) {
                                            if (item.model == item_model) {
                                                model_id = item.id;
                                                equipmentmodel = {
                                                    equipment_id: insertedid,
                                                    model_id: model_id
                                                }

                                                console.log(equipmentmodel)

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
                        if(files.length > 0) {
                            let data = new FormData();
                            for (let i = 0; i < files.length; i++) {
                                data.append('uploadFile', files[i]);
                            }
                            data.append("insertId", insertedid)
                            require('../API').uploadEquipmentPhoto_(data, function (err, data) {
                                    if (err || data.error)
                                        console.log(err || data.error);
                                }
                            )
                        }

                        $('#addEquipmentModel').modal("toggle");
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
                    data.append('uploadFile', newPhotos[i]);
                }

                data.append("insertId", curId)
                data.append("sorted_list", JSON.stringify(allFileNames));
                data.append("old_files", JSON.stringify(photo_arr));

                console.log(allFileNames)
                console.log(photo_arr)

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
    editor.setData("");
    $("#model-choice").val("");
    $('#model-choice').prop("disabled", true);
    $("#status").val("в наявності");
    $("#price-input-technic").val("");
    $("#year-technic-input").val("");
    $('#type_technics').val("Тип");
    $('#type_technics').prop("disabled", false);
   // delete photoes if needed

    $('.uploader__file-list').empty();
// class="js-uploader__contents uploader__contents uploader__hide"
    $('.uploader__contents').removeClass("uploader__hide");
    $('.js-uploader__further-instructions').addClass("uploader__hide");

    $('.js-uploader__submit-button').addClass("uploader__hide");
}

function equipmentFormClear() {
    $("#mark-choice").val("");
    $("#name-equipment").val("")
    $("#price-input").val(1)
    $("#equipment-amount").val(1);
    $("#currency-choice").val("$")
    $('#mark-choice').prop("disabled", true);
    $("#description").val("");
    $("#status").val("в наявності");
    $("#vendor-choice").val("");
    $("#vendor-choice").children().remove();
    $("#vendor-choice").trigger("change")
    editor.setData("")
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
    document.location.href = API_URL+"/admin-panel?page="+value;
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

 $(document).on('input','#fileinput0', function (event) {
     //console.log(event.target.files)
     files2 = files2.concat(Array.from(event.target.files))
     console.log(files2)
 });

 $(document).on('input','#secondaryfileinput0', function (event) {
     //console.log(event.target.files)
     files2 = files2.concat(Array.from(event.target.files))
     console.log(files2)
 });

 function getFiles() {

     let filesNames = [];

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
         filesNames.push($(this).data('src-file'));
         //filesNames.push({src: $(this).data('src-file'), type: type});

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


 /// technics without category


 openAddTechnicWithoutCategoryModel = function () {
     type = 'tech';
     $('#addTechnicModelWithoutCategory').modal("show");
     // document.getElementById('addTechnicModelWithoutCategory').style.display='block';
     $("#add-btn").text("Додати");
     loaderFormClear();
 }


 openEditTechnicWithoutCategoryModal = function(cell) {
     $('#addTechnicModelWithoutCategory').modal('show');
     type = 'tech';
     let row = $(cell).parents("tr");
     let cols = row.children("td");
     let id  = $(cols[0]).text();
     localStorage.setItem("currId", id);
     //console.log(id);
     $("#name_loader").val("");
     $("#price-input-technic").val($(cols[4]).text());

     function callback(err,data) {
         if (err) {
             console.log(err);
         }
         else {
             $('#name_loader').val(data.data[0].name);
             $("#price-input-technic").val(data.data[0].price);
             $("#year-technic-input").val(data.data[0].production_date);
             $("#status").val(data.data[0].status);


             let cur = data.data[0].currency;
             if (cur == "долар")  $("#currency-choice").val("$");
             else if(cur == "євро")  $("#currency-choice").val("€");
             else  $("#currency-choice").val("грн");

             editor.setData(data.data[0].description);
            //  let photos = JSON.parse(data.data[0].photos) || [];
             let photos = data.data[0].photos || [];
             console.log(photos)
             localStorage.setItem("photo_arr", JSON.stringify(photos));


             $('.uploader__file-list').empty();
             $('.js-uploader__submit-button').removeClass("uploader__hide");
             $('.js-uploader__further-instructions').removeClass("uploader__hide");
             $('.js-uploader__contents').addClass("uploader__hide");

             try {
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
                 photosMakeSortable();
             }
             catch(e) {
             }

             // for(let i=0;i< photos.length;i++) {
             //     let item = photos[i];
             //     getFileObject("/images/technics/" + item , function (fileObject) {
             //         //console.log(fileObject.size);
             //         $('.uploader__file-list').append( `<li class="uploader__file-list__item" data-src-file=${item} data-type="old" data-index="` + item +  "\"" +
             //             "><span class=\"uploader__file-list__thumbnail\"><img  class=\"thumbnail\" src=\"/images/technics/" + item + "\"" +
             //             " ></span> <button onclick=\"console.log('delete click')\" class=\"delete uploader__icon-button js-upload-remove-button fa fa-times\" data-index=\"" +
             //             item.id +  "\""+ "></button></li>")
             //     })
             // }

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
     console.log(id)
     $('#modal-btn-delete').click(function() {

     function callback(err,data) {
             if(err) {
                 console.log(err)
                 notify.Notify("Помилка! Не вдалось видалити.",null,null,'success');
             }
             else {
                 notify.Notify("Успішно видалено",null,null,'success');
                 $(cell).parents("tr").remove();
                 $('#myModal').modal("hide");
             }
         }
             require("../API").deleteTechnicsWithoutCategoryByID(id,callback);

     });

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
     let year = $("input[type=number][name=year-input]").val();
     let description = editor.getData()
     let status = $('#status').children("option:selected").val();
     let currency = $('#currency-choice').children("option:selected").val();

     // ..todo photos
     let add_update = $("#add-btn").text();

     let table_row = {
         name: loader_name,
         price: price,
         production_date: year,
         currency: "долар",
     }

     let loader = {
         amount: 1,
         name: loader_name,
         price: price,
         production_date: year,
         description: description,
         currency:"долар",
         status: status
     }
     if (currency == 'грн') {
         table_row.currency = "гривня";
         loader.currency = "гривня";
     }

     if (currency == '€') {
         table_row.currency = "євро";
         loader.currency = "євро";
     }

     if(add_update=="Додати") {

         if (checkInputLoader()) {

             function callback1(err, data1){
                 if(err) console.log(err)
                 else {
                     console.log(data1)
                     let id = data1.data.insertId;
                     let files = getFiles() || [];

                     if(files.length > 0) {
                         let data = new FormData();
                         for (let i = 0; i < files.length; i++) {
                             data.append('uploadFile', files[i]);
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

                     $('#addTechnicModelWithoutCategory').modal("toggle");
                     require('../pagesScripts/notify').Notify("Оголошення успішно додано!", null, null, "success")
                 }
             }
             require("../API").addTehnicWithoutCategory(loader, callback1);
         } else {
             alert("Невірні дані !!!");
         }
     }
     else {
         let id  = localStorage.getItem("currId");
         let photo_arr = JSON.parse(localStorage.getItem("photo_arr"));

         let photo_arr_names = [];

         photo_arr.forEach(function (item) {
             photo_arr_names.push(item.file_name);
         })
         let newPhotos = getFilesUpload() || [];
         let allFileNames = getActualFileNames() || [];


         //console.log(newPhotos);
         let data = new FormData();
         for (let i = 0; i < newPhotos.length; i++) {
             data.append('uploadFile', newPhotos[i]);
         }

         data.append("insertId", id)
         data.append("sorted_list", JSON.stringify(allFileNames));
         data.append("old_files", JSON.stringify(photo_arr));
         data.append("type", "withoutCategoryTechnics")

         require('../API').updateTechnicPhoto_(data, function (err, data) {
                 if (err || data.error)
                     console.log(err || data.error);
                 else {}
             }
         )


         function callback5(err,data1) {
             if( err) {
                 require('../pagesScripts/notify').Notify("Помилка. Не вдалось оновити!", null, null, "danger")
             }
             else {
                 $('#addTechnicModelWithoutCategory').modal("toggle");
                 require('../pagesScripts/notify').Notify("Оголошення успішно додано!", null, null, "success")
             }
         }
         require("../API").updateTechnicWithoutCategory(id,loader,callback5)
     }
 }

 function checkInputLoader() {
     let loader_name = $('#name_loader').val().trim();
     let price = $("input[type=number][name=price-input]").val();
     let year = $("input[type=number][name=year-input]").val();

     if(loader_name.length < 3 || price.toString().trim()=="" || year.toString().trim()=="") return false;
     else  return true;

 }

 function loaderFormClear() {
     $('#name_loader').val("");
     $("#price-input-technic").val("");
     $("#year-technic-input").val("");
     $("#status").val("в наявності");
     editor.setData("")

     $('.uploader__file-list').empty();
     $('.uploader__contents').removeClass("uploader__hide");
     $('.js-uploader__further-instructions').addClass("uploader__hide");

     $('.js-uploader__submit-button').addClass("uploader__hide");
 }

 function photosMakeSortable() {
     $('ul.sorter').amigoSorter();
     //$('.list.parent').sortable({container: '.list', nodes: ':not(.list span)'});
 }

