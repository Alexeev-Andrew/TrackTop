var authService = require('./authentification/AuthService');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const schedule = require('node-schedule');
const sharp = require('sharp')
let uniqid = require('uniqid');

// const job = schedule.scheduleJob('28 13 * * *', function(){
//     console.log('The answer to life, the universe, and everything!');
//     sendEmail("mikehorbach1999@gmail.com", "tracktopshop@gmail.com\n" , "tracktop.com.ua")
// });


// function convertImagetoJSON() {
//     let technics;
//     var db = require('./db');
//     db.connect()
//     function callback(error,data){
//         if(error) {
//             console.log("Error! ", error.sqlMessage);
//         }
//         else {
//             technics = data;
//             for(let i = 0; i < technics.length; i ++ ) {
//                 function callback2(error2, data2) {
//                     let images = [];
//                     for( let y = 0; y < data2.length; y++) {
//                         images.push(data2[y].file_name);
//                     }
//
//                     technics[i].images = JSON.stringify(images);
//                     db.update_technic(technics[i].id, technics[i])
//                 }
//                 db.get_technic_images_by_id( technics[i].id, callback2)
//             }
//         }
//     }
//     db.get_technics_simple(callback)
// }
//
// convertImagetoJSON()

const asyncSaveImageToDB = async (file_name) => {
    try {
        const image = sharp('./Backend/res/images/technics/'+file_name);
        image
            .metadata()
            .then(function(metadata) {
                let height = metadata.height;
                let width = metadata.width;
                let orientation = metadata.orientation;
                console.log(orientation)
                if(height > 500)
                    image.resize({height:500});
                let il = image.clone();
                //let bytes = (getFilesizeInBytes(file_location));
                //console.log(getFilesizeInBytes(file_location))
                //if(bytes > 1024)
                    image
                        // .resize(Math.round(metadata.width / 2))
                        .composite([{ input: 'logo.png', gravity: 'southeast' }])
                        .webp()
                        .toFile('./Backend/res/images/placeholders/' + file_name, function(err) {
                        });;

                il
                    .resize({height:200})
                    .webp()
                    .toFile('./Backend/res/images/placeholders/small' + file_name, function(err) {
                    });;

            })
            .then(function(data) {
                // data contains a WebP image half the width and height of the original JPEG
            });

        console.log("success");
        // save image to database here
        return image;
    } catch (e) {
        console.warn(e);
    }
};


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
            sendEmail("mikehorbach1999@gmail.com", "tracktop@tracktop.com.ua" , "tracktop.com.ua")
            console.log("Success! ", data);
            function callback(error,data){
                if(error) {
                    console.log("Error! ", error.sqlMessage);
                    res.send({
                        success: true,
                        data: data
                    });
                }
            }
            db.insert_technic_photos(info.photos,data.insertId, callback);

        }
    }

    db.insert_tehnic(info.technic,callback);

};



//send email function
function sendEmail(_to, _from, _link) {
    console.log(process.env.password)
    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "mikehorbach1999@gmail.com",
            pass: "Mihamiha_0058"
        }
    });
    let clientUrl = `tracktop.com.ua`;
    var mailOptions = {
        from: "tracktop@tracktop.com.ua",
        to: _to,
        subject: "You have been Invited to Awesome App",
        html: `<p> Your invitation link is: <a href='${clientUrl}'> ${clientUrl}</a> <img src="http://tracktop.com.ua/images/technics/изображение_viber_2021-06-23_00-09-15-1.jpg">`
    };
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            return console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
}

exports.addTehnicWithoutCategory = function(req, res) {
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
            res.send({
                success: true,
                data: data
            });
        }
    }

    db.insert_tehnic_without_category(info,callback);

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

exports.addImagesTechnic = function(req, res) {
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
            console.log("Success ");
            res.send({
                success: true,
                data: data
            });
        }
    }
    db.insert_technic_photos(info.photos,info.tehnic_id, callback);

};

exports.addImagesEquipment = function(req, res) {
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
            console.log("Success ");
            res.send({
                success: true,
                data: data
            });
        }
    }
    db.insert_equipment_photos(info.photos,info.equipment_id, callback);

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
            if(!(data[0]==null) && require('./hash').md5(info.password) === data[0].hash){
                let token = authService.generateToken(data[0]);
                //res.json(token);
                res.cookie("jwt", token, {secure: true, httpOnly: true})
                res.send({
                    success: true,
                    data: {
                        token: token,
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


exports.getTechnicsWithoutCategory = function (req,res) {
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
    db.get_technics_without_category(callback);
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


exports.getequipmentswithmodels = function (req,res) {
    var db = require('./db');
    console.log(req.body.id);
    console.log(req.body);
    function callback(error,data){
        if(error) {
            console.log("Error! some ", error.sqlMessage);
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
    db.get_equipment_withModels_by_id(req.body.id, callback);
}

exports.getequipmentsbymodal = function (req,res) {
    var db = require('./db');

    function callback(error,data){
        if(error) {
            console.log("Error! some ", error.sqlMessage);
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
    db.get_equipments_by_model(req.body.modal, callback);
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

exports.getequipmentsbycategoryid = function (req,res) {
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
     db.get_equipments_by_category_id(req.body.id, callback);
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
            console.log("Success! ", data[0].images);
            res.send({
                success: true,
                data: data[0].images
            });
        }
    }
    db.get_technic_images_by_id(req.body.id, callback);
}



exports.get_technics_without_category_by_id = function (req,res) {
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
    db.get_technics_without_category_by_id(req.body.id, callback);
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

exports.upload_equipment_photo = function (req,res) {
    upload_photo(req,res,'equipments', "add");
}

exports.upload_technic_photo = function (req,res) {
    upload_photo(req,res,'technics', "add");
}

exports.update_technic_photo = function (req,res) {
    upload_photo(req,res,'technics', "update");
}

// const asyncSaveImageToDB = async (oldpath, file_name, type) => {
//     try {
//         const image = sharp(oldpath);
//         image
//             .metadata()
//             .then(function(metadata) {
//                 let height = metadata.height;
//                 let width = metadata.width;
//                 let orientation = metadata.orientation;
//                 if(height > 500)
//                     image.resize({height:500});
//
//                 //let bytes = (getFilesizeInBytes(file_location));
//                 //console.log(getFilesizeInBytes(file_location))
//                 //if(bytes > 1024)
//                 image
//                 // .resize(Math.round(metadata.width / 2))
//                     .composite([{ input: 'logo.png', gravity: 'southeast' }])
//                     .webp()
//                     .toFile('./Backend/res/images/' + type + "/"+ file_name + ".webp", function(err) {
//                     });;
//
//
//
//             })
//             .then(function(data) {
//                 // data contains a WebP image half the width and height of the original JPEG
//             });
//
//         console.log("success");
//         // save image to database here
//         return image;
//     } catch (e) {
//         console.warn(e);
//     }
// };

function upload_photo(req,res,path,action){


    var form = new multiparty.Form();
    var uploadFile = {uploadPath: '', type: '', size: 0};
    var maxSize = 10 * 1024 * 1024; //10MB
    var supportMimeTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];
    var errors = [];
    let file_names = []
    let insertId;


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
    form.on('part', function(err, fields, files) {

        //console.log(part.byteCount);
        console.log(fields);
        console.log(files)
        console.log(typeof fields);

        //читаем его размер в байтах
        //uploadFile.size = part.byteCount;
        //читаем его тип
        uploadFile.type = part.headers['content-type'];
        //путь для сохранения файла
        //uploadFile.path = './Backend/res/images/'+path+'/' + part.filename;
        //
        // //проверяем размер файла, он не должен быть больше максимального размера
        // if(uploadFile.size > maxSize) {
        //     errors.push('File size is ' + uploadFile.size + '. Limit is' + (maxSize / 1024 / 1024) + 'MB.');
        // }
        //
        // //проверяем является ли тип поддерживаемым
        // if(supportMimeTypes.indexOf(uploadFile.type) == -1) {
        //     errors.push('Unsupported mimetype ' + uploadFile.type);
        // }
        //
        // //если нет ошибок то создаем поток для записи файла
        // if(errors.length == 0) {
        //     var out = fs.createWriteStream(uploadFile.path);
        //     part.pipe(out);
        //     console.log(uploadFile.path)
        //     out.on('finish', () => {
        //         console.log('/images/technics/' + part.filename)
        //         asyncSaveImageToDB(part.filename).then(r => console.log(''))
        //     });
        // }
        // else {
        //     console.log(errors);
        //     //пропускаем
        //     //вообще здесь нужно как-то остановить загрузку и перейти к onclose
        //     part.resume();
        // }
    });

    // парсим форму
    form.parse(req, function(err, fields, files) {
        // console.log("d")
        console.log(fields)
        insertId = fields.insertId[0];


        files = files['uploadFile[]'];
        if(!files) files = []
        console.log( files)
        for(let i = 0; i < files.length;i++) {
            let file = files[i];
            uploadFile.type = file.headers['content-type'];
            // //путь для сохранения файла
            uploadFile.path = './Backend/res/images/'+path+'/' + file.originalFilename;
            //
            // //проверяем размер файла, он не должен быть больше максимального размера
            if(uploadFile.size > maxSize) {
                errors.push('File size is ' + uploadFile.size + '. Limit is' + (maxSize / 1024 / 1024) + 'MB.');
            }
            //
            // //проверяем является ли тип поддерживаемым
            if(supportMimeTypes.indexOf(uploadFile.type) == -1) {
                errors.push('Unsupported mimetype ' + uploadFile.type);
            }
            //
            // //если нет ошибок то создаем поток для записи файла
            if(errors.length == 0) {

                let oldpath = file.path;
                // save to array and write to db
                // update ads with this photos
                let newpath = uniqid()
                file_names.push(newpath+".webp")

                asyncSaveImageToDB(oldpath, newpath, path).then(r => console.log(''))

                // fs.copyFile(oldpath, newpath, function (err) {
                //     if (err) throw err;
                // });

                // fs.rename(oldpath, newpath, function (err) {
                //     if (err) throw err;
                //     res.write('File uploaded and moved!');
                //     res.end();
                // });

                // let out = fs.createWriteStream(uploadFile.path);
                // file.pipe(out);
                // out.on('finish', () => {
                //     console.log('/images/technics/' + file.filename)
                //     asyncSaveImageToDB(file.filename).then(r => console.log(''))
                // });
            }
            else {
                console.log(errors);
                //пропускаем
                //вообще здесь нужно как-то остановить загрузку и перейти к onclose
                file.resume();
            }

        }
        if(action == "add") {
            if (file_names.length > 0) {
                // db.update_ad_by_id(insertId, {
                //     images: JSON.stringify(file_names),
                //     image_placeholder: file_names[0]
                // }, function (err, data) {
                // });
                console.log(file_names)
            }
        }
        else if(action == "update") {
            console.log(fields);
            let old_files = JSON.parse(fields.old_files[0]);
            let sorted_list = JSON.parse(fields.sorted_list[0]);
            let j = 0;
            for(let i = 0; i< sorted_list.length; i++) {
                if(!old_files.includes(sorted_list[i])) {
                    if(j < file_names.length) {
                        console.log("here " + file_names.length)
                        sorted_list[i] = file_names[j];
                        j++;
                    }
                }
            }

            db.get_ad_by_id(insertId, function (err, data) {
                let ad = data[0];
                //console.log(ad.image_placeholder);
                let ad_insert = {
                    images: JSON.stringify(sorted_list)
                }
                ad_insert.image_placeholder = ad.image_placeholder;

                if (sorted_list.length > 0) {

                    if (ad.image_placeholder != sorted_list[0]) {
                        savePlaceholder("./Backend/res/images/technics/" + sorted_list[0], sorted_list[0]).then(r => console.log(""));
                        if (ad.image_placeholder) {
                            let arr_temp_delete = []
                            arr_temp_delete.push("./Backend/res/images/technics_placeholders/" + ad.image_placeholder)
                            deleteFiles(arr_temp_delete)
                        }
                        ad_insert.image_placeholder = sorted_list[0];
                    }
                }
                else if (ad.image_placeholder) {
                    let arr_temp_delete = []
                    arr_temp_delete.push("./Backend/res/images/technics_placeholders/" + ad.image_placeholder)
                    deleteFiles(arr_temp_delete);
                    ad_insert.image_placeholder = "";
                }

                db.update_ad_by_id(insertId, ad_insert, function (err, data) {
                    if(err) console.log(err)
                    else {
                        console.log(data)
                    }
                });

                // delete old_files
                let files_to_delete = [];
                old_files.forEach(function (item) {
                    if(!sorted_list.includes(item)) {
                        files_to_delete.push("./Backend/res/images/technics/"+ item)
                    }
                })
                deleteFiles(files_to_delete)
            })

        }
    })
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


exports.update_technic_without_category = function(req,res){
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

    db.update_technic_without_category(info.id,info.info,callback);

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

exports.delete_technic_without_category_by_id = function(req,res){
        var db = require('./db');
        var info = req.body;

        function callback1(err1, data1) {
            if (err1) console.log(err1);
            else {

                let photos = JSON.parse(data1[0].photos);
                if(photos && photos.length > 0)
                    photos.forEach(function (item) {
                        let file_path = "./Backend/res/images/technics/"+ item.val;
                        if(fs.existsSync(file_path)) {
                            fs.unlinkSync(file_path);
                        }
                        else {
                            console.log("file not exist")
                        }

                    })


                function callback(error, data) {
                    if (error) {
                        console.log("Error! ", error.sqlMessage);
                        res.send({
                            success: true,
                            error: error.sqlMessage
                        });
                    } else {
                        console.log("Success! ", data);
                        res.send({
                            success: true
                        });
                    }
                }

                db.delete_technic_without_category_id(info.id, callback);
            }
        }

        db.get_technics_without_category_by_id(info.id, callback1)
}

exports.delete_technic_by_id = function(req,res){
    var db = require('./db');
    var info = req.body;

    function callback3(error,data3) {
        if(error) console.log(error)
        else {
                if(data3 && data3.length > 0)
                data3.forEach(function (item) {
                    let file_path = "./Backend/res/images/technics/"+ item.file_name;
                    if(fs.existsSync(file_path)) {
                        fs.unlinkSync(file_path);
                    }
                    else {
                        //console.log("file not exist")
                    }

                })

            function callback1(error, data1) {
                if (error) {
                    console.log("Error! ", error.sqlMessage);

                    res.send({
                        success: true,
                        error: error.sqlMessage
                    });
                } else {
                    function callback2(error, data2) {
                        if (error) {
                            console.log("Error! ", error.sqlMessage);
                            res.send({
                                success: true,
                                error: error.sqlMessage
                            });
                        } else {
                            function callback(error, data) {
                                if (error) {
                                    console.log("Error! ", error.sqlMessage);
                                    res.send({
                                        success: true,
                                        error: error.sqlMessage
                                    });
                                } else {
                                    console.log("Success! ", data);
                                    res.send({
                                        success: true
                                    });
                                }
                            }

                            db.delete_technics(info.id, callback);
                        }
                    }

                    db.delete_check_technics_by_technic_id(info.id, callback2)
                }
            }

            db.delete_images_by_technic_id(info.id, callback1);
        }
    }
    db.get_technic_images_by_id(info.id,callback3)

}

exports.deleteFiles = function(req,res){
    let files = req.body;
    console.log(files);
    files.forEach(fs.unlink)
}

exports.deleteFile = function(req,res) {
    let file = req.body;
    console.log(file);
    fs.unlink(file, (err => {
        if (err) {
            console.log(err);
            res.send({
                success: true,
                error: err
            });
        }
        else {
            console.log("\nDeleted file: example_file.txt");
            res.send({success:true})
        }
    }));
}

exports.delete_equipments_by_id = function(req,res){
    var db = require('./db');
    var info = req.body;


    function callback3(error,data3) {
        if(error) console.log(error)
        else {
            if (data3 && data3.length > 0)
                data3.forEach(function (item) {
                    let file_path = "./Backend/res/images/equipments/" + item.file_name;
                    if (fs.existsSync(file_path)) {
                        console.log("unlink")
                        fs.unlinkSync(file_path);
                    } else {
                        console.log("file not exist")
                    }

                })

            function callback4(err4, data4) {
                if (err4) console.log(err4)
                else {

                    function callback1(error, data1) {
                        if (error) {
                            console.log("Error! ", error.sqlMessage);

                            res.send({
                                success: true,
                                error: error.sqlMessage
                            });
                        } else {
                            function callback2(error, data2) {
                                if (error) {
                                    console.log("Error! ", error.sqlMessage);
                                    res.send({
                                        success: true,
                                        error: error.sqlMessage
                                    });
                                } else {
                                    function callback(error, data) {
                                        if (error) {
                                            console.log("Error! ", error.sqlMessage);
                                            res.send({
                                                success: true,
                                                error: error.sqlMessage
                                            });
                                        } else {
                                            console.log("Success! ", data);
                                            res.send({
                                                success: true
                                            });
                                        }
                                    }

                                    db.delete_equipments(info.id, callback);
                                }
                            }

                            db.delete_check_technics_by_technic_id(info.id, callback2)
                        }
                    }

                    db.delete_images_by_equipment_id(info.id, callback1);
                }
            }
            db.delete_equipments_models(info.id, callback4)
        }
    }
    db.get_equipment_images_by_id(info.id,callback3)

}

exports.delete_equipments_models_by_ids = function(req,res){
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
    db.delete_equipments_models_by_IDS(info.equipment_id, info.model_id,callback);
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

exports.delete_imageTechnic_by_id = function(req,res){
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

    db.delete_technic_image_by_id(info.id,callback);
}

exports.delete_imageEquipment_by_id = function(req,res){
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

    db.delete_equipment_image_by_id(info.id,callback);
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

exports.addUserSubmitFnc = function (req, res)
{

    let db = require('./db');

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

    db.insert_emails(req.body.email,callback);

}

exports.addPhone = function (req, res)
{

    let db = require('./db');

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

    db.insert_client_phones(req.body.phone, req.body.name, callback);

}

exports.adminPanel = function(req,res){
    res.render('adminPage', {
        pageTitle: 'admin panel',
        currPage:  req.query.page || "check",
    })
}

