var authService = require('./authentification/AuthService');

exports.addTehnic = function(req, res) {
    var db = require('./db');
    var info = req.body;

    function callback(error,data){
        if(error) {
            console.log("Error! ", error.sqlMessage);
            res.send({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            console.log("Success! ", data);
            function callback(error,data){
                if(error) {
                    console.log("Error! ", error.sqlMessage);
                    res.send({
                        success: true,
                        error: error.sqlMessage
                    });
                }
            }
            db.insert_technic_photos(info.photos,data.insertId, callback);

        }
    }

    db.insert_tehnic(info.technic,callback);

};

exports.addReview = function(req, res) {
    var db = require('./db');
    var info = req.body;

    function callback(error,data){
        if(error) {
            console.log("Error! ", error.sqlMessage);
            res.send({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            console.log("Success! ", data);
            res.send({
                success: true,
                data: data
            });
        }
    }

    db.insert_review(info,callback);

};

exports.addEquipment = function(req, res) {
    var db = require('./db');
    var info = req.body;

    function callback(error,data){
        if(error) {
            console.log("Error! ", error.sqlMessage);
        }
        else {
            console.log("Success! ", data);
            res.send({
                success: true,
                data: data
            });
            function callback1(error,data2){
                if(error) {
                    console.log("Error! ", error.sqlMessage);
                    // res.send({
                    //     success: true,
                    //     error: error.sqlMessage
                    // });
                }
            }
            db.insert_equipment_photos(info.photos,data.insertId, callback1);

        }
    }

    db.insert_equipment(info.equipment,callback);

};

exports.addEquipmentsModels = function(req, res) {
    var db = require('./db');
    var info = req.body;

    function callback(error,data){
        if(error) {
            console.log("Error! ", error.sqlMessage);
            res.send({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            console.log("Success! ", data);
            res.send({
                success: true,
                data: data
            });
        }
    }
console.log("info = " + info);
    db.insert_equipments_models(info,callback);

};

exports.addMarkTechnics = function(req, res) {
    var db = require('./db');
    var info = req.body;

    function callback(error,data){
        if(error) {
            console.log("Error! ", error.sqlMessage);
            res.send({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            console.log("Success! ", data);
            res.send({
                success: true,
                data: data
            });
        }
    }

    db.insert_marks_of_technics(info,callback);

};

exports.addModel = function(req, res) {
    var db = require('./db');
    var info = req.body;

    function callback(error,data){
        if(error) {
            console.log("Error! ", error.sqlMessage);
            res.send({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            console.log("Success! ", data);
            res.send({
                success: true,
                data: data
            });
        }
    }

    db.insert_model(info,callback);

};

exports.addClient = function(req, res) {
    var db = require('./db');
    var info = req.body;

    info.hash = require('./hash').md5(info.hash);

    function callback(error,data){
        if(error) {
            console.log("Error! ", error.sqlMessage);
            res.send({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            console.log("Success! ", data);
            res.send({
                success: true,
                data: data
            });
        }
    }

    db.insert_client(info,callback);

};
// to do
exports.addCheck = function(req, res) {
    var db = require('./db');
    var info = req.body;


    function callback(error,data){
        if(error) {
            console.log("Error! ", error.sqlMessage);
            res.send({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            console.log("Success! ", data);
            res.send({
                success: true,
                data: data
            });
        }
    }

    db.insert_check(info,callback);

};

exports.addCheckEquipment = function(req, res) {
    var db = require('./db');
    var info = req.body;


    function callback(error,data){
        if(error) {
            console.log("Error! ", error.sqlMessage);
            res.send({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            console.log("Success! ", data);
            res.send({
                success: true,
                data: data
            });
        }
    }

    db.insert_check_equipments(info,callback);

};


exports.addCheckTechnic = function(req, res) {
    var db = require('./db');
    var info = req.body;


    function callback(error,data){
        if(error) {
            console.log("Error! ", error.sqlMessage);
            res.send({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            console.log("Success! ", data);
            res.send({
                success: true,
                data: data
            });
        }
    }

    db.insert_check_technics(info,callback);

};

//
exports.sign_in = function(req, res) {
    var db = require('./db');
    var info = req.body;

    function callback(error,data){
        if(error) {
            console.log("Error! ", error.sqlMessage);
            res.send({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            // console.log("Success! ", data);
            // console.log("Passw ", info.password);
            // console.log("PasswH ", require('./hash').md5(info.password));
            // console.log("Passw ", data[0].hash);

            if(!(data[0]==null) && require('./hash').md5(info.password) === data[0].hash){
                res.send({
                    success: true,
                    data: {
                        // token: authService.generateToken(data[0]),
                        id: require('./hash').md5(""+data[0].id),
                        surname: data[0].surname,
                        name: data[0].name,
                        settelment: data[0].settelment,
                        phone_number: data[0].phone_number,
                        photo_location: data[0].photo_location
                    }
                });
            }
            else
                res.send({
                    success: true,
                    error: 'Wrong password'
                });
        }
    }

    db.get_client_by_phone(info.phone_number,callback);

}


exports.get_models_by_type_mark = function(req,res) {
    var db = require('./db');
    function callback(error,data){
        if(error) {
            console.log("Error! ", error.sqlMessage);
            res.send({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            console.log("Success! ", data);
            res.send({
                success: true,
                data: data
            });
        }
    }

    db.get_models_by_type_mark(req.query.type,req.query.mark, callback);
}

exports.get_models = function(req,res) {
    var db = require('./db');
    function callback(error,data){
        if(error) {
            console.log("Error! ", error.sqlMessage);
            res.send({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            console.log("Success! ", data);
            res.send({
                success: true,
                data: data
            });
        }
    }

    db.get_models(callback);
}

exports.get_reviews = function(req,res) {
    var db = require('./db');
    function callback(error,data){
        if(error) {
            console.log("Error! ", error.sqlMessage);
            res.send({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            console.log("Success! ", data);
            res.send({
                success: true,
                data: data
            });
        }
    }

    db.get_reviews(callback);
}

exports.get_id = function(req,res) {
    var db = require('./db');
    function callback(error,data){
        if(error) {
            console.log("Error! ", error.sqlMessage);
            res.send({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            console.log("Success! ", data);
            res.send({
                success: true,
                data: data
            });
        }
    }

    db.get_id(req.query.table_name,req.query.name, callback);
}

exports.get_types_of_technics = function (req,res) {
    var db = require('./db');

    function callback(error,data){
        if(error) {
            console.log("Error! ", error.sqlMessage);
            res.send({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            console.log("Success! ", data);
            res.send({
                success: true,
                data: data
            });
        }
    }

    db.get_types_of_technics(callback);
}

exports.get_marks_of_technics = function (req,res) {
    var db = require('./db');


    function callback(error,data){
        if(error) {
            console.log("Error! ", error.sqlMessage);
            res.send({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            console.log("Success! ", data);
            res.send({
                success: true,
                data: data
            });
        }
    }

    db.get_marks_of_technics(callback);
}


exports.get_technics = function (req,res) {
    var db = require('./db');

    function callback(error,data){
        if(error) {
            console.log("Error! ", error.sqlMessage);
            res.send({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            console.log("Success! ", data);
            res.send({
                success: true,
                data: data
            });
        }
    }
    db.get_technics(callback);
}

exports.get_equipments_categories = function (req,res) {
    var db = require('./db');

    function callback(error,data){
        if(error) {
            console.log("Error! ", error.sqlMessage);
            res.send({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            console.log("Success! ", data);
            res.send({
                success: true,
                data: data
            });
        }
    }
    db.get_equipments_categories(callback);
}


exports.get_equipments = function (req,res) {
    var db = require('./db');

    function callback(error,data){
        if(error) {
            console.log("Error! ", error.sqlMessage);
            res.send({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            console.log("Success! ", data);
            res.send({
                success: true,
                data: data
            });
        }
    }
    db.get_equipments(callback);
}

exports.get_technics_by_tp = function (req,res) {
    var db = require('./db');

    function callback(error,data){
        if(error) {
            console.log("Error! ", error.sqlMessage);
            res.send({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            console.log("Success! ", data);
            res.send({
                success: true,
                data: data
            });
        }
    }
    if(req.body.type) db.get_technics_by_type_name(req.body.type, callback);
    else if(req.body.mark) db.get_technics_by_mark_name(req.body.mark, callback);
}


// exports.get_technics_im_by_tp_model = function (req,res) {
//     var db = require('./db');
//
//     function callback(error,data){
//         if(error) {
//             console.log("Error! ", error.sqlMessage);
//             res.send({
//                 success: true,
//                 error: error.sqlMessage
//             });
//         }
//         else {
//             console.log("Success! ", data);
//             res.send({
//                 success: true,
//                 data: data
//             });
//         }
//     }
//     db.get_technic_im_by_type_model_mark(req.body.type, req.body.mark, req.body.model, callback);
// }

exports.get_technics_im_by_id = function (req,res) {
    var db = require('./db');

    function callback(error,data){
        if(error) {
            console.log("Error! ", error.sqlMessage);
            res.send({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            console.log("Success! ", data);
            res.send({
                success: true,
                data: data
            });
        }
    }
    db.get_technic_im_by_id(req.body.id, callback);
}

exports.get_technic_by_id = function (req,res) {
    var db = require('./db');

    function callback(error,data){
        if(error) {
            console.log("Error! ", error.sqlMessage);
            res.send({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            console.log("Success! ", data);
            res.send({
                success: true,
                data: data
            });
        }
    }
    db.get_technics_by_id(req.body.id, callback);
}

exports.get_equipment_by_id = function (req,res) {
    var db = require('./db');

    function callback(error,data){
        if(error) {
            console.log("Error! ", error.sqlMessage);
            res.send({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            console.log("Success! ", data);
            res.send({
                success: true,
                data: data
            });
        }
    }
    db.get_equipment_by_id(req.body.id, callback);
}


exports.get_equipment_im_by_id = function (req,res) {
    var db = require('./db');

    function callback(error,data){
        if(error) {
            console.log("Error! ", error.sqlMessage);
            res.send({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            console.log("Success! ", data);
            res.send({
                success: true,
                data: data
            });
        }
    }
    db.get_equipment_im_by_id(req.body.id, callback);
}

exports.get_review = function (req,res) {
    var db = require('./db');

    function callback(error,data){
        if(error) {
            console.log("Error! ", error.sqlMessage);
            res.send({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            console.log("Success! ", data);
            res.send({
                success: true,
                data: data
            });
        }
    }
    db.get_review(req.body.id, callback);
}

exports.get_user_information = function (req,res) {
    var db = require('./db');
    var info = req.query;

    function callback(error,data){
        if(error) {
            console.log("Error! ", error.sqlMessage);
            res.send({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            console.log("Success! ", data);
            res.send({
                success: true,
                data: data
            });
        }
    }
    db.get_client_by_phone(info.phone_number,callback);
}


var fs = require("fs"),
    multiparty = require('multiparty');

exports.upload_user_photo = function (req,res) {
    upload_photo(req,res,'users_photos');

}
exports.upload_technic_photo = function (req,res) {
    upload_photo(req,res,'technics');

}
exports.upload_equipment_photo = function (req,res) {
    upload_photo(req,res,'equipments');

}


function upload_photo(req,res,path){
    var form = new multiparty.Form();
    var uploadFile = {uploadPath: '', type: '', size: 0};
    var maxSize = 2 * 1024 * 1024; //2MB
    var supportMimeTypes = ['image/jpg', 'image/jpeg', 'image/png'];
    var errors = [];

    form.on('error', function(err){
        if(fs.existsSync(uploadFile.path)) {
            //если загружаемый файл существует удаляем его
            fs.unlinkSync(uploadFile.path);
            console.log('error');
        }
    });

    form.on('close', function() {
        //если нет ошибок и все хорошо
        if(errors.length == 0) {
            //сообщаем что все хорошо
            res.send({status: 'ok', text: 'Success'});
        }
        else {
            if(fs.existsSync(uploadFile.path)) {
                //если загружаемый файл существует удаляем его
                fs.unlinkSync(uploadFile.path);
            }
            //сообщаем что все плохо и какие произошли ошибки
            res.send({status: 'bad', errors: errors});
        }
    });

    // при поступление файла
    form.on('part', function(part) {
        console.log(part.byteCount);
        console.log(part);
        //читаем его размер в байтах
        uploadFile.size = part.byteCount;
        //читаем его тип
        uploadFile.type = part.headers['content-type'];
        //путь для сохранения файла
        uploadFile.path = './Backend/res/images/'+path+'/' + part.filename;

        //проверяем размер файла, он не должен быть больше максимального размера
        if(uploadFile.size > maxSize) {
            errors.push('File size is ' + uploadFile.size + '. Limit is' + (maxSize / 1024 / 1024) + 'MB.');
        }

        //проверяем является ли тип поддерживаемым
        if(supportMimeTypes.indexOf(uploadFile.type) == -1) {
            errors.push('Unsupported mimetype ' + uploadFile.type);
        }

        //если нет ошибок то создаем поток для записи файла
        if(errors.length == 0) {
            var out = fs.createWriteStream(uploadFile.path);
            part.pipe(out);
        }
        else {
            console.log(errors);
            //пропускаем
            //вообще здесь нужно как-то остановить загрузку и перейти к onclose
            part.resume();
        }
    });

    // парсим форму
    form.parse(req);
}

exports.update_user = function(req,res){
    var db = require('./db');
    var info = req.body;

    function callback(error,data){
        if(error) {
            console.log("Error! ", error.sqlMessage);
            res.send({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            console.log("Success! ", data);
            res.send({
                success: true
            });
        }
    }

    db.get_client_by_phone(info.info.phone_number,function(error,data){
        if(error) {
            console.log("Error! ", error.sqlMessage);
            res.send({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
           // if(require('./hash').md5(""+data.id) == info.id)
            if(!data.error)
                db.update_client(data[0].id,info.info,callback);
        }
    });

}

exports.update_review = function(req,res){
    var db = require('./db');
    var info = req.body;

    function callback(error,data){
        if(error) {
            console.log("Error! ", error.sqlMessage);
            res.send({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            console.log("Success! ", data);
            res.send({
                success: true
            });
        }
    }

    db.update_review(info.id,info.info,callback);

}

exports.update_technic = function(req,res){
    var db = require('./db');
    var info = req.body;

    function callback(error,data){
        if(error) {
            console.log("Error! ", error.sqlMessage);
            res.send({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            console.log("Success! ", data);
            res.send({
                success: true
            });
        }
    }

    db.update_technic(info.id,info.info,callback);

}


exports.update_equipment = function(req,res){
    var db = require('./db');
    var info = req.body;

    function callback(error,data){
        if(error) {
            console.log("Error! ", error.sqlMessage);
            res.send({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            console.log("Success! ", data);
            res.send({
                success: true
            });
        }
    }

    db.update_equipments(info.id,info.info,callback);
    console.log("id =  " + info.id + " info = " + info.info);
}

exports.delete_technic_by_id = function(req,res){
    var db = require('./db');
    var info = req.body;

    function callback1(error,data1){
        if(error) {
            console.log("Error! ", error.sqlMessage);

            res.send({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            function callback2(error,data2){
                if(error) {
                    console.log("Error! ", error.sqlMessage);
                    res.send({
                        success: true,
                        error: error.sqlMessage
                    });
                }
                else {
                    function callback(error,data){
                        if(error) {
                            console.log("Error! ", error.sqlMessage);
                            res.send({
                                success: true,
                                error: error.sqlMessage
                            });
                        }
                        else {
                            console.log("Success! ", data);
                            res.send({
                                success: true
                            });
                        }
                    }

                    db.delete_technics(info.id,callback);
                }
            }
            db.delete_check_technics_by_technic_id(info.id,callback2)
        }
    }

    db.delete_images_by_technic_id(info.id,callback1);


}

exports.delete_equipments_by_id = function(req,res){
    var db = require('./db');
    var info = req.body;

    function callback(error,data){
        if(error) {
            console.log("Error! ", error.sqlMessage);
            res.send({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            console.log("Success! ", data);
            res.send({
                success: true
            });
        }
    }

    // ..todo delete images
    db.delete_equipments(info.id,callback);

}

exports.delete_equipments_models_by_id = function(req,res){
    var db = require('./db');
    var info = req.body;

    function callback(error,data){
        if(error) {
            console.log("Error! ", error.sqlMessage);
            res.send({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            console.log("Success! ", data);
            res.send({
                success: true
            });
        }
    }
    db.delete_equipments_models(info.id,callback);
}

exports.delete_images_by_technic_id = function(req,res){
    var db = require('./db');
    var info = req.body;

    function callback(error,data){
        if(error) {
            console.log("Error! ", error.sqlMessage);
            res.send({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            console.log("Success! ", data);
            res.send({
                success: true
            });
        }
    }

    db.delete_images_by_technic_id(info.id,callback);
}

exports.delete_check_technics_by_technic_id = function(req,res){
    var db = require('./db');
    var info = req.body;

    function callback(error,data){
        if(error) {
            console.log("Error! ", error.sqlMessage);
            res.send({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            console.log("Success! ", data);
            res.send({
                success: true
            });
        }
    }

    db.delete_check_technics_by_technic_id(info.id,callback);
}

exports.delete_images_by_equipment_id = function(req,res){
    var db = require('./db');
    var info = req.body;

    function callback(error,data){
        if(error) {
            console.log("Error! ", error.sqlMessage);
            res.send({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            console.log("Success! ", data);
            res.send({
                success: true
            });
        }
    }

    db.delete_images_by_equipment_id(info.id,callback);
}

exports.delete_check_equipments_by_equipment_id = function(req,res){
    var db = require('./db');
    var info = req.body;

    function callback(error,data){
        if(error) {
            console.log("Error! ", error.sqlMessage);
            res.send({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            console.log("Success! ", data);
            res.send({
                success: true
            });
        }
    }

    db.delete_check_equipments_by_equipment_id(info.id,callback);
}
