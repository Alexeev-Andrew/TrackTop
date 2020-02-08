var values = require('./values.js');

var API_URL = values.url;



function backendGet(url, callback, data) {
    $.ajax({
        url: API_URL + url,
        type: 'GET',
        data: data,
        success: function(data){
            callback(null, data);
        },
        error: function() {
            callback(new Error("Ajax Failed"));
        }
    })
}

function backendPost(url, data, callback) {
    $.ajax({
        url: API_URL + url,
        type: 'POST',
        contentType : 'application/json',
        data: JSON.stringify(data),
        success: function(data){
            callback(null, data);
        },
        error: function() {
            callback(new Error("Ajax Failed"));
        }
    })
}

function backendPostFiles(url, data, callback) {
    $.ajax({
        url: API_URL + url,
        type: 'POST',
        cache: false,
        contentType : false,
        processData: false,
        data: data,
        success: function(data){
            callback(null, data);
        },
        error: function() {
            callback(new Error("Ajax Failed"));
        }
    })
}

exports.addTehnic = function(tehnic, callback) {
    backendPost("/api/addtechnic/", tehnic, callback);
};

exports.addReview = function(review, callback) {
    backendPost("/api/addreview/", review, callback);
};

exports.addEquipment = function(equipment, callback) {
    backendPost("/api/addequipment/", equipment, callback);
};

exports.addEquipmentsModels = function(equipment_model, callback) {
    backendPost("/api/addequipmentsmodels/", equipment_model, callback);
};

exports.addTypeTechnics = function(type, callback) {
    backendPost("/api/addtypetechnics/", type, callback);
};

exports.addMarkTechnic = function(mark, callback) {
    backendPost("/api/addmarktechnics/", mark, callback);
};

exports.addModel = function(model, callback) {
    backendPost("/api/addmodel/", model, callback);
};

exports.addClient = function(client, callback) {
    backendPost("/api/addclient/", client, callback);
};

exports.addCheck = function(check, callback) {
    backendPost("/api/addcheck/", check, callback);
};
exports.addCheck_equipment = function(check_equipment, callback) {
    backendPost("/api/addcheckequipment/", check_equipment, callback);
};
exports.addCheck_technic = function(check_technic, callback) {
    backendPost("/api/addchecktechnic/", check_technic, callback);
};

exports.sign_in = function(phone, callback) {
    backendPost("/api/signin/", phone, callback);
}


exports.getTypes = function(callback) {
    backendGet("/api/gettypes/", callback);
};

exports.getMarks = function(callback) {
    backendGet("/api/getmarks/", callback);
};

exports.getId = function(table_name, name,callback) {
    backendGet("/api/getid/", callback,{table_name :table_name, name:name});
};

exports.getReview = function(id,callback) {
    backendGet("/api/getreview/", callback,{id :id});
};

exports.get_equipments_categories = function(callback) {
    backendGet("/api/get_equipments_categories/", callback);
};

exports.getReviews = function(callback) {
    backendGet("/api/getreviews/", callback,);
};

exports.getModelsbyTypeMark = function(type,mark,callback) {
    backendGet("/api/getmodelsbytypemark/", callback,{type:type, mark:mark});
};

exports.getModels = function(callback) {
    backendGet("/api/getmodels/", callback);
};

/////// adedd
exports.getClientbyPhone = function(phone,callback) {
    backendGet("/api/getclient/", callback, {phone_number: phone});
};
/////

exports.getTechnics = function(callback) {
    backendGet("/api/gettechnics/", callback);
};

exports.getEquipments = function(callback) {
    backendGet("/api/getequipments/", callback);
};

exports.getTechnicsByType = function(tp,callback) {
    backendPost("/api/gettechnics/", tp, callback);
};

// exports.getTechnicsImagesByTypeMarkModel = function(tp,callback) {
//     backendPost("/api/gettechnicsmodelim/", tp, callback);
// };

exports.getTechnicsImagesById = function(id,callback) {
    backendPost("/api/gettechnicsmodelim/", {id: id}, callback);
};

exports.getTechnicsById = function(id,callback) {
    backendPost("/api/gettechnicsbyid/", {id: id}, callback);
};

exports.getEquipmentsById = function(id,callback) {
    backendPost("/api/getequipmentsbyid/", {id: id}, callback);
};

exports.getEquipmentsByModal = function(modal,callback) {
    backendPost("/api/getequipmentsbymodal/", {modal: modal}, callback);
};

exports.getEquipmentImagesById = function(id,callback) {
    backendPost("/api/getequipmentim/", {id: id}, callback);
};

exports.uploadUserPhoto = function(photo,callback){
    var data = new FormData();
    data.append('uploadFile', photo);
    backendPostFiles("/api/upload_user_photo/", data, callback);
};

exports.uploadTechnicPhoto = function(photo,callback){
    var data = new FormData();
    data.append('uploadFile', photo);
    backendPostFiles("/api/upload_technic_photo/", data, callback);
};
exports.uploadEquipmentPhoto = function(photo,callback){
    var data = new FormData();
    data.append('uploadFile', photo);
    backendPostFiles("/api/upload_equipment_photo/", data, callback);
};


exports.updateClient = function(id,info,callback) {
    backendPost("/api/update_user",{id: id, info: info},callback);
}

exports.updateReview = function(id,info,callback) {
    backendPost("/api/update_review",{id: id, info: info},callback);
}

exports.updateTechnic = function(id,info,callback) {
    backendPost("/api/update_technic",{id: id, info: info},callback);
}

exports.updateEquipment = function(id,info,callback) {
    backendPost("/api/update_equipment",{id: id, info: info},callback);
}

exports.deleteTechnicsByID = function(id,callback) {
    backendPost("/api/delete_technic_by_id",{id: id},callback);
}

// exports.deleteUserPhotoDB = function(id,callback) {
//     backendPost("/api/delete_user_photo_db",{id: id},callback);
// }

exports.deleteEquipmentsByID = function(id,callback) {
    backendPost("/api/delete_equipments_by_id",{id: id},callback);
}

exports.deleteEquipmentsModelsByID = function(id,callback) {
    backendPost("/api/delete_equipments_models_by_id",{id: id},callback);
}
/////

exports.delete_images_by_technic_id = function(id,callback) {
    backendPost("/api/delete_images_by_technic_id",{id: id},callback);
}

exports.delete_check_technics_by_technic_id = function(id,callback) {
    backendPost("/api/delete_check_technics_by_technic_id",{id: id},callback);
}

exports.delete_images_by_equipment_id = function(id,callback) {
    backendPost("/api/delete_images_by_equipment_id",{id: id},callback);
}

exports.delete_check_equipments_by_equipment_id = function(id,callback) {
    backendPost("/api/delete_check_equipments_by_equipment_id",{id: id},callback);
}