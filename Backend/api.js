const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const schedule = require('node-schedule');
const sharp = require('sharp')
let uniqid = require('uniqid');
const path = require('path'); // For working with file paths
let db = require('./db');
let helper = require('./helper');
let axios = require('axios');
let authService = require('./authentification/AuthService');
const fs = require("fs")

let CUR_RATES = [];

db.connect()

//let currency_map = {"usd" : "долар", "uah" : "гривня", "eur" : "євро"};


function initialaize() {
    async function callback(error, data) {
        if (error) {
            await initializeCurrencyRate()
        } else {
            await initializeCurrencyRate()
        }

        //convertPriceEquipment()
        //await priceconvert()
    }

    db.get_currency_last(callback);
}

initializeCurrencyRate = async function () {
    try {
        let response = await axios.get("https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5", {
            headers: {
                Accept: 'application/json'
            },
            timeout: 30000
        })
            .then(resp => {
                if (resp.data) {
                    let rates = resp.data;
                    if (rates) {
                        CUR_RATES = rates;
                        let currency_rate = {
                            info: JSON.stringify(rates),
                            date: new Date()
                        }

                        db.insert_currency_rate(currency_rate, function (err, data) {
                            //console.log(err)
                        })
                    }
                }
            })

    } catch (e) {
        //console.log(e.message)
    }
}

const job2 = schedule.scheduleJob('0 8 * * *', async function() {
    await initializeCurrencyRate()
    await priceconvert()
})

initialaize()


const job = schedule.scheduleJob('0 8 * * *', async function () {
    await initializeCurrencyRate()
    //console.log('The answer to life, the universe, and everything!');
    //sendEmail("mikehorbach1999@gmail.com", "tracktopshop@gmail.com\n" , "tracktop.com.ua")
});


function convertImagetoJSON() {
    let technics;
    db.connect()
    function callback(error,data){
        if(error) {
            //console.log("Error! ", error.sqlMessage);
        }
        else {
            technics = data;
            for(let i = 0; i < technics.length; i ++ ) {
                function callback2(error2, data2) {
                    let images = [];
                    for( let y = 0; y < data2.length; y++) {
                        images.push(data2[y].file_name);
                    }

                    technics[i].images = JSON.stringify(images);
                    db.update_technic(technics[i].id, technics[i])
                }
                db.get_technic_im_by_id( technics[i].id, callback2)
            }
        }
    }
    db.get_technics_simple(callback)
}

//convertImagetoJSON()

function convertImageEquipmentstoJSON() {
    let technics;

    function callback(error,data){
        if(error) {
            //console.log("Error! ", error.sqlMessage);
        }
        else {
            technics = data;
            //console.log(data)
            for(let i = 0; i < technics.length; i ++ ) {
                function callback2(error2, data2) {
                    let images = [];

                    //console.log(data2)
                    for( let y = 0; y < data2.length; y++) {
                        images.push(data2[y].file_name);
                    }

                    technics[i].images = JSON.stringify(images);
                    db.update_equipments(technics[i].id, technics[i])
                }
                db.get_equipment_im_by_id(technics[i].id, callback2)
            }
        }
    }
    db.get_equipments(callback)
}

//convertImageEquipmentstoJSON()


function convertPriceEquipment() {
    let equipments;

    function callback(error,data){
        if(error) {
            //console.log("Error! ", error.sqlMessage);
        }
        else {
            equipments = data;
            //console.log(data)
            for(let i = 0; i < equipments.length; i ++ ) {
                let cur = equipments[i].currency;
                switch (equipments[i].currency) {
                    case "гривня" :
                        cur = 'uah'
                        break;
                    case "долар" :
                        cur = 'usd'
                        break;
                    case "євро" :
                        cur = 'eur'
                        break;
                }
                 db.update_equipments(equipments[i].id, {currency: cur})

            }
        }
    }
    db.get_equipments(callback)
}

//convertPriceEquipment()

priceconvert = async function () {
    let rates = CUR_RATES;
    //console.log(rates);
    if(rates) {
        let equipments;

        function callback(error,data){
            if(error) {
                //console.log("Error! ", error.sqlMessage);
            }
            else {
                equipments = data;

                for(let i = 0; i < equipments.length; i ++ ) {
                    let currency = equipments[i].currency;
                    if(currency.toUpperCase() === "UAH") {
                        equipments[i].price_uah = equipments[i].price;
                    }
                    else {
                        for(let j = 0; j < rates.length; j++) {
                            let rate = rates[j];

                            if(currency.toUpperCase() == rate.ccy)  {
                                equipments[i].price_uah = equipments[i].price * rate.sale;
                                break;
                            }

                        }
                    }
                     db.update_equipments(equipments[i].id, equipments[i])

                }
            }
        }
        db.get_equipments(callback);

    }

}

//priceconvert()

// const asyncSaveImageToDB = async (file_name) => {
//     try {
//         const image = sharp('./Backend/res/images/technics/'+file_name);
//         image
//             .metadata()
//             .then(function(metadata) {
//                 let height = metadata.height;
//                 let width = metadata.width;
//                 let orientation = metadata.orientation;
//                 console.log(orientation)
//                 if(height > 500)
//                     image.resize({height:500});
//                 let il = image.clone();
//                 //let bytes = (getFilesizeInBytes(file_location));
//                 //console.log(getFilesizeInBytes(file_location))
//                 //if(bytes > 1024)
//                     image
//                         // .resize(Math.round(metadata.width / 2))
//                         .composite([{ input: 'logo.png', gravity: 'southeast' }])
//                         .webp()
//                         .toFile('./Backend/res/images/placeholders/' + file_name, function(err) {
//                         });;
//
//                 il
//                     .resize({height:200})
//                     .webp()
//                     .toFile('./Backend/res/images/placeholders/small' + file_name, function(err) {
//                     });;
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


exports.addTehnic = function(req, res) {
    let info = req.body;

    function callback(error,data){
        if(error) {
            //console.log("Error! ", error.sqlMessage);
            res.json({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            res.json({
                success: true,
                data: data
            });

            //sendEmail("mikehorbach1999@gmail.com", "tracktop@tracktop.com.ua" , "tracktop.com.ua")
            // console.log("Success! ", data);
            // function callback(error,data){
            //     if(error) {
            //         console.log("Error! ", error.sqlMessage);
            //         res.json({
            //             success: true,
            //             data: data
            //         });
            //     }
            // }
            // db.insert_technic_photos(info.photos,data.insertId, callback);

        }
    }

    db.insert_tehnic(info.technic,callback);

};

//sendEmail("best8games@gmail.com")

//send email function
function sendEmail(_to, _link) {
    //console.log(process.env.password)
    // var transporter = nodemailer.createTransport({
    //     service: "gmail",
    //     auth: {
    //         user: "mikehorbach1999@gmail.com",
    //         pass: "Mihamiha_0058"
    //     }
    // });
    let transporter = nodemailer.createTransport({
        host: "mail.tracktop.com.ua",
        port: 587,
        secure: false,
        auth: {
            user: "tracktop@tracktop.com.ua",
            pass: "Mihamiha_123",
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false,
        },
    });
    let clientUrl = `tracktop.com.ua`;
    var mailOptions = {
        from: "tracktop@tracktop.com.ua",
        to: _to,
        subject: "You have been Invited to Awesome App",
        html: `<p> Your invitation link is: <a href='http://tracktop.com.ua'> http://tracktop.com.ua</a> <img src="http://tracktop.com.ua/images/technics/изображение_viber_2021-06-23_00-09-15-1.jpg">`
    };
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            return console.log(error);
        } else {
            //console.log("Email sent: " + info.response);
        }
    });
}

exports.sendMessage = function (req, res) {

    //console.log(req.body.message)
    axios.post('https://api.telegram.org/bot6751808105:AAFDpv3i2zw7CQABbuuAGNhXN-zvgnhba3E/sendMessage',{
        chat_id :"-4117522667",
        text: req.body.message,
        parse_mode: 'HTML',
        disable_web_page_preview: false,
        disable_notification: false,
        reply_to_message_id: null
    },
        // {headers: {
        //         'Content-type': 'application/json; charset=utf-8',
        //     }}

        ).then(function (response) {
            res.json({status: true})
    })
        .catch(function (error) {
            res.json({status: false})
        });

}

exports.addTehnicWithoutCategory = function(req, res) {
    let info = req.body;

    function callback(error,data){
        if(error) {
            //console.log("Error! ", error.sqlMessage);
            res.json({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            res.json({
                success: true,
                data: data
            });
        }
    }

    db.insert_tehnic_without_category(info,callback);

};

function addStatus () {
    function callback(error,data){
        if(data) {
            data.forEach(function (item) {
                db.update_equipments(data)
            })

        }
    }
    db.get_equipments(callback);
}


exports.addReview = function(req, res) {
    var db = require('./db');
    var info = req.body;

    function callback(error,data){
        if(error) {
            //console.log("Error! ", error.sqlMessage);
            res.json({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            //console.log("Success! ", data);
            res.json({
                success: true,
                data: data
            });
        }
    }

    db.insert_review(info,callback);

};

exports.addEquipment = function(req, res) {
    let info = req.body;

    function callback(error,data){
        if(error) {
            //console.log("Error! ", error.sqlMessage);
        }
        else {
            //console.log("Success! ", data);
            res.json({
                success: true,
                data: data
            });

        }
    }

    let equipment = info.equipment;

    let price_uah = convertPriceToUAH(equipment.price, equipment.currency)

    //console.log("ua" + price_uah)
    equipment.price_uah = price_uah;

    db.insert_equipment(info.equipment,callback);

};

exports.addEquipmentsModels = function(req, res) {
    var db = require('./db');
    var info = req.body;

    function callback(error,data){
        if(error) {
            //console.log("Error! ", error.sqlMessage);
            res.json({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            //console.log("Success! ", data);
            res.json({
                success: true,
                data: data
            });
        }
    }
    db.insert_equipments_models(info,callback);

};

exports.addMarkTechnics = function(req, res) {
    let info = req.body;

    function callback(error,data){
        if(error) {
           // console.log("Error! ", error.sqlMessage);
            res.json({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            //console.log("Success! ", data);
            res.json({
                success: true,
                data: data
            });
        }
    }

    db.insert_marks_of_technics(info,callback);

};

exports.addModel = function(req, res) {
    let info = req.body;

    function callback(error,data){
        if(error) {
            //console.log("Error! ", error.sqlMessage);
            res.json({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            //console.log("Success! ", data);
            res.json({
                success: true,
                data: data
            });
        }
    }

    db.insert_model(info,callback);

};

exports.addImagesTechnic = function(req, res) {
    let info = req.body;

    function callback(error,data){
        if(error) {
            //console.log("Error! ", error.sqlMessage);
            res.json({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            //console.log("Success ");
            res.json({
                success: true,
                data: data
            });
        }
    }
    db.insert_technic_photos(info.photos,info.tehnic_id, callback);

};

exports.addImagesEquipment = function(req, res) {
    let info = req.body;

    function callback(error,data){
        if(error) {
            //console.log("Error! ", error.sqlMessage);
            res.json({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            //console.log("Success ");
            res.json({
                success: true,
                data: data
            });
        }
    }
    db.insert_equipment_photos(info.photos,info.equipment_id, callback);

};

exports.addClient = function(req, res) {
    let info = req.body;
    // console.log(info)
    info.hash = require('./hash').md5(info.hash);

    function callback(error,data){
        if(error) {
            //console.log("Error! ", error.sqlMessage);
            res.json({
                error: error.sqlMessage
            });
        }
        else {
            //console.log("Success! ", data);
            res.json({
                success: true,
                data: data
            });
        }
    }

    db.insert_client(info,callback);

};
// to do
exports.addCheck = function(req, res) {
    let info = req.body;


    function callback(error,data){
        if(error) {
            //console.log("Error! ", error.sqlMessage);
            res.json({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            //console.log("Success! ", data);
            res.json({
                success: true,
                data: data
            });
        }
    }

    db.insert_check(info,callback);

};

exports.addOrder = function(req, res) {
    let info = req.body;

    function callback(error,data){
        if(error) {
            //console.log("Error! ", error.sqlMessage);
            res.json({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            //console.log("Success! ", data);
            res.json({
                success: true,
                data: data
            });
        }
    }

    info.order_array = JSON.stringify(info.order_array)

    db.insert_order(info,callback);

};


exports.addCheckEquipment = function(req, res) {
    let info = req.body;


    function callback(error,data){
        if(error) {
            //console.log("Error! ", error.sqlMessage);
            res.json({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            //console.log("Success! ", data);
            res.json({
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
            //console.log("Error! ", error.sqlMessage);
            res.json({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            //console.log("Success! ", data);
            res.json({
                success: true,
                data: data
            });
        }
    }

    db.insert_check_technics(info,callback);

};

//
exports.sign_in = function(req, res) {
    let info = req.body;

    function callback(error,data){
        if(error) {
            res.json({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            // console.log(data)
            if(!(data[0]==null) && require('./hash').md5(info.password) === data[0].hash){
                let token = authService.generateToken(data[0]);
                let refresh_token = authService.generateRefreshToken(data[0]);
                //res.json(token);
                res.cookie("jwt", token, {maxAge: 60000 * 60 * 24}) // 60000 is 1 min
                res.cookie("phone", data[0].phone_number, {maxAge: 60000 * 60 * 24})
                res.cookie("refresh_token", refresh_token, {maxAge: 60000 * 60 * 24 * 30}) // 60000 is 1 min

                res.json({
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
                res.json({
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
            //console.log("Error! ", error.sqlMessage);
            res.json({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            //console.log("Success! ", data);
            res.json({
                success: true,
                data: data
            });
        }
    }

    db.get_models_by_type_mark(req.query.type,req.query.mark, callback);
}

exports.get_models = function(req,res) {
    // var db = require('./db');
    function callback(error,data){
        if(error) {
            //console.log("Error! ", error.sqlMessage);
            res.json({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            //console.log("Success! ", data);
            res.json({
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
            //console.log("Error! ", error.sqlMessage);
            res.json({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            //console.log("Success! ", data);
            res.json({
                success: true,
                data: data
            });
        }
    }

    db.get_reviews(callback);
}

exports.get_id = function(req,res) {
    // var db = require('./db');
    function callback(error,data){
        if(error) {
            //console.log("Error! ", error.sqlMessage);
            res.json({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            //console.log("Success! ", data);
            res.json({
                success: true,
                data: data
            });
        }
    }

    db.get_id(req.query.table_name,req.query.name, callback);
}

exports.get_types_of_technics = function (req,res) {
    // var db = require('./db');

    function callback(error,data){
        if(error) {
            //console.log("Error! ", error.sqlMessage);
            res.json({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            //console.log("Success! ", data);
            res.json({
                success: true,
                data: data
            });
        }
    }

    db.get_types_of_technics(callback);
}

exports.get_marks_of_technics = function (req,res) {

    function callback(error,data){
        if(error) {
            //console.log("Error! ", error.sqlMessage);
            res.json({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            //console.log("Success! ", data);
            res.json({
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
            //console.log("Error! ", error.sqlMessage);
            res.json({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            //console.log("Success! ", data);
            res.json({
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
            //console.log("Error! ", error.sqlMessage);
            res.json({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            //console.log("Success! ", data);
            res.json({
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
            //console.log("Error! ", error.sqlMessage);
            res.json({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            //console.log("Success! ", data);
            res.json({
                success: true,
                data: data
            });
        }
    }
    db.get_equipments_categories(callback);
}


exports.get_equipments = function (req,res) {
    function callback(error,data){
        if(error) {
            //console.log("Error! ", error.sqlMessage);
            res.json({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            //console.log("Success! ", data);
            res.json({
                success: true,
                data: data
            });
        }
    }
    db.get_equipments(callback);
}


exports.getequipmentswithmodels = function (req,res) {
    function callback(error,data){
        if(error) {
            //console.log("Error! some ", error.sqlMessage);
            res.json({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            //console.log("Success! ", data);
            res.json({
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
            //console.log("Error! some ", error.sqlMessage);
            res.json({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            res.json({
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
            //console.log("Error! ", error.sqlMessage);
            res.json({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            //console.log("Success! ", data);
            res.json({
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
            //console.log("Error! ", error.sqlMessage);
            res.json({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            //console.log("Success! ", data);
            res.json({
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
//             res.json({
//                 success: true,
//                 error: error.sqlMessage
//             });
//         }
//         else {
//             console.log("Success! ", data);
//             res.json({
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
            //console.log("Error! ", error.sqlMessage);
            res.json({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            //console.log("Success! ", data[0].images);
            res.json({
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
            //console.log("Error! ", error.sqlMessage);
            res.json({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            //console.log("Success! ", data);
            res.json({
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
            //console.log("Error! ", error.sqlMessage);
            res.json({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            //console.log("Success! ", data);
            res.json({
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
            //console.log("Error! ", error.sqlMessage);
            res.json({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            res.json({
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
            //console.log("Error! ", error.sqlMessage);
            res.json({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            //console.log("Success! ", data);
            res.json({
                success: true,
                data: data
            });
        }
    }
    db.get_equipment_images_by_id(req.body.id, callback);
}

exports.get_review = function (req,res) {
    var db = require('./db');

    function callback(error,data){
        if(error) {
            //console.log("Error! ", error.sqlMessage);
            res.json({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            //console.log("Success! ", data);
            res.json({
                success: true,
                data: data
            });
        }
    }
    db.get_review(req.body.id, callback);
}

exports.get_user_information = function (req,res) {
    let info = req.query;

    function callback(error,data){
        if(error) {
            //console.log("Error! ", error.sqlMessage);
            res.json({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            res.json({
                success: true,
                data: data
            });
        }
    }
    db.get_client_by_phone(info.phone_number,callback);
}


exports.get_client_orders_by_phone = function (req,res) {
    let info = req.query;

    function callback2(error2,data2) {
        if (error2) {
            res.json({
                success: true,
                error: error.sqlMessage
            })
        } else {
            //console.log(data2)
            let client_id = data2[0].id;
            function callback(error, data) {
                if (error) {
                    //console.log("Error! ", error.sqlMessage);
                    res.json({
                        success: true,
                        error: error.sqlMessage
                    });
                } else {
                    //console.log("Success! ", data);
                    res.json({
                        success: true,
                        data: data
                    });
                }
            }

            db.get_all_orders_by_client_id(client_id, callback);

        }
    }
    db.get_client_by_phone(info.phone, callback2)
}

exports.get_one_order_by_id = function (req,res) {
    let info = req.query;

            function callback(error, data) {
                if (error) {
                    //console.log("Error! ", error.sqlMessage);
                    res.json({
                        success: true,
                        error: error.sqlMessage
                    });
                } else {
                    //console.log("Success! ", data);
                    //console.log(data[0].order)
                    //data.order_array = Array.from(JSON.parse(data[0].order_array))
                    data.order_array = Array.from(data[0].order_array)
                   

                    res.json({
                        success: true,
                        data: data
                    });
                }
            }

            db.get_one_order_by_id(info.id, callback);

}

exports.is_log_in = function (req,res) {
    let user = req.currentUser;
    //console.log(req.currentUser)

    if (user) {
        function callback(err, data) {
            if(err) {
                return res.json({auth: false});
            } else {
                return res.json({auth: true, user : user});
            }
        }
        db.get_client_by_id(user.id, callback)
    } else {
        return res.json({auth: false});
    }

}


exports.upload_user_photo = function (req,res) {
    upload_photo_new(req,res,'users_photos', "add");
}


exports.update_user_photo = function (req,res) {
    upload_photo_new(req,res,'users_photos', "update");
}

exports.upload_equipment_photo = function (req,res) {
    upload_photo_new(req,res,'equipments', "add");
}

exports.upload_technic_photo = function (req,res) {
    upload_photo_new(req,res,'technics', "add");
}

exports.update_technic_photo = function (req,res) {
    upload_photo_new(req,res,'technics', "update");
}

exports.update_equipment_photo = function (req,res) {
    upload_photo_new(req,res,'equipments', "update");
}

const asyncSaveImageToDB = async (oldpath, file_name, type) => {
    try {
        const image = sharp(oldpath);
        image
            .metadata()
            .then(function(metadata) {
                let height = metadata.height;
                let width = metadata.width;
                let orientation = metadata.orientation;
                if(height > 700)
                    image.resize({height:700});

                //let bytes = (getFilesizeInBytes(file_location));
                //console.log(getFilesizeInBytes(file_location))
                //if(bytes > 1024)
                image
                // .resize(Math.round(metadata.width / 2))
                    .composite([{ input: 'logo.png', gravity: 'southeast' }])
                    .ensureAlpha(0.8)
                    .webp()
                    .toFile('./Backend/res/images/' + type + "/"+ file_name + ".webp", function(err) {
                    });

            })
            .then(function(data) {
                // data contains a WebP image half the width and height of the original JPEG
            });

        //console.log("success");
        // save image to database here
        return image;
    } catch (e) {
        //console.warn(e);
    }
};

const asyncSaveBufferToDB = async (fileBuffer, file_name, type) => {
    try {
        let image = sharp(fileBuffer);
        image
            .metadata()
            .then(function(metadata) {
                let height = metadata.height;
                let width = metadata.width;
                let orientation = metadata.orientation;
                if(height > 720)
                    image.resize({height:720});

                if (type != "users_photos")
                    image = image.composite([{ input: 'logo.png', gravity: 'southeast' }])

                    image
                        // .composite([{ input: 'logo.png', gravity: 'southeast' }])
                        .webp()
                        .toFile('./Backend/res/images/' + type + "/"+ file_name + ".webp", function(err) {
                            //console.log(err)
                        });
            })
            .then(function(data) {
                // data contains a WebP image half the width and height of the original JPEG
            });

        //console.log("success");
        // save image to database here
        return image;
    } catch (e) {
        //console.warn(e);
    }
};


function upload_photo_new(req,res,path,action){

    let {insertId, type} = req.body;
    let files = req.files || Array.of(req.file);

    if (!files) files = []

    let file_names = []

    for (let i = 0; i < files.length; i++) {
        let fileBuffer = files[i].buffer;

        let newpath = uniqid()
        file_names.push(newpath + ".webp")
        //console.log(file_names)
        asyncSaveBufferToDB(fileBuffer, newpath, path).then()
    }

    if (action == "add") {
        if (file_names.length > 0) {
            switch (path) {
                case "technics" : {

                    if(type && type == "withoutCategoryTechnics") {
                        db.update_technic_without_category(insertId, {
                            photos: JSON.stringify(file_names),
                        })
                    }
                    else {
                        db.update_technic(insertId, {
                            images: JSON.stringify(file_names),
                            main_photo_location: file_names[0]
                        }, function (err, data) {
                            res.json({success: true, "files" :file_names})
                        });
                    }
                    break;
                }
                case "equipments" : {
                    db.update_equipments(insertId, {
                        images: JSON.stringify(file_names),
                        main_photo_location: file_names[0]
                    }, function (err, data) {
                        res.json({success: true, "files" :file_names})
                    });
                    break;
                }
                case "users_photos" : {
                    db.update_client_by_phone(insertId, {
                        photo_location: file_names[0]
                    }, function (err, data) {
                        res.json({success: true, "files" :file_names})
                    });
                    break;
                }
            }
        }
    }
    else if (action == "update") {
        let {old_files,sorted_list } = req.body;

        old_files = JSON.parse(old_files) || [];
        sorted_list = JSON.parse(sorted_list) || [];;
        //console.log(old_files)

        let j = 0;
        for (let i = 0; i < sorted_list.length; i++) {
            if (!old_files.includes(sorted_list[i])) {
                if (j < file_names.length) {
                    sorted_list[i] = file_names[j];
                    j++;
                }
            }
        }

        let to_insert = {
            images: JSON.stringify(sorted_list)
        }

        if (sorted_list.length > 0) {
            to_insert.main_photo_location = sorted_list[0]
        } else {
            to_insert.main_photo_location = "default_technic.jpg"
        }

        switch (path) {
            case "technics" :
                if(type && type == "withoutCategoryTechnics") {
                    db.update_technic_without_category(insertId, {photos : JSON.stringify(sorted_list)},
                        (err, data) => {
                            res.json({success: true, "files" :file_names})
                        })
                } else {
                    db.update_technic(insertId, to_insert, function (err, data) {
                        res.json({success: true, "files" :file_names})
                    });
                }
                break;
            case "equipments" :
                db.update_equipments(insertId, to_insert, function (err, data) {
                    res.json({success: true, "files" :file_names})
                });
                break;
        }


        // delete old_files
        // let files_to_delete = [];
        // old_files.forEach(function (item) {
        //     if (!sorted_list.includes(item)) {
        //         files_to_delete.push("./Backend/res/images/technics/" + item)
        //     }
        // })
        // deleteFiles(files_to_delete)

    }

}



exports.update_user = function(req,res){
    let info = req.body;
    let user = req.currentUser;
    if (user) {
        let user_update = info.info
        if (user_update.hash) {
            delete user_update.hash;
        }

        if (user_update.role) {
            delete user_update.role;
        }

        delete user_update["id"]

        function callback(error,data){
            if(error) {
                //console.log("Error! ", error.sqlMessage);
                res.json({
                    success: true,
                    error: error.sqlMessage
                });
            }
            else {
                //console.log("Success! ", data);
                res.json({
                    success: true
                });
            }
        }

        db.update_client(user.id, user_update,callback);
    } else {
        res.json("error")
    }

}

exports.update_user_pwd = function(req,res){
    let {pas, old_pas} = req.body;
    let user = req.currentUser;
    //console.log(user.password)
    if (user && user.hash == require('./hash').md5(old_pas)) {
        let hash = require('./hash').md5(pas);
        //console.log(hash)
        function callback(error,data){
            if(error) {
                // console.log("Error! ", error.sqlMessage);
                res.json({
                    success: true,
                    error: "Виникла помилка"
                });
            }
            else {
                res.json({
                    success: true
                });
            }
        }

        db.update_client(user.id, {hash},callback);
    } else {
        res.json({
            error: "Перевірте актуальний пароль"
        })
    }

}


exports.update_review = function(req,res){
    var db = require('./db');
    var info = req.body;

    function callback(error,data){
        if(error) {
            //console.log("Error! ", error.sqlMessage);
            res.json({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            //console.log("Success! ", data);
            res.json({
                success: true
            });
        }
    }

    db.update_review(info.id,info.info,callback);

}


exports.update_technic_without_category = function(req,res){
    var info = req.body;

    function callback(error,data){
        if(error) {
            //console.log("Error! ", error.sqlMessage);
            res.json({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            //console.log("Success! ", data);
            res.json({
                success: true
            });
        }
    }

    db.update_technic_without_category(info.id,info.info,callback);

}


exports.update_technic = function(req,res){
    let info = req.body;
    // if technic is sold we have to delete images except first
    if(info && info.info.status == "продано") {
        function callback5(error,data5){
            if(error) {
                //console.log("Error! ", error.sqlMessage);
                res.json({
                    success: true,
                    error: error.sqlMessage
                });
            }
            else {
                //console.log("Success! ", data);
                //let images = JSON.parse(data5[0].images);
                let images = data5[0].images;
                if(images.length > 0) {
                    let first_image = images[0];

                    let newpath = helper.getFileName(first_image) + "-sold";

                    helper.SaveImageToDB(first_image, newpath, "technics", function (err, data) {
                        //console.log(data)
                        let newpath_witFormat = newpath + "." + data.format;
                        info.info.images = JSON.stringify(Array.of(newpath_witFormat))
                        info.info.main_photo_location = newpath_witFormat;
                        //console.log(info)
                        update_tehnic_helper(res, info, images)
                    }).then(r => {
                        // set images field, set main_photo field

                    });

                }


            }
        }
        db.get_technics_by_id(info.id, callback5);

    }

    else {
        update_tehnic_helper(res, info)
    }


}

update_tehnic_helper = function(res, info, images) {
    function callback(error,data){
        if(error) {
            res.json({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            //console.log("Success! ", data);

            res.json({
                success: true
            });

            if(images) {
                //helper.deleteFiles("./Backend/res/images/technics/", images)
            }
        }
    }

    db.update_technic(info.id,info.info,callback);
}


exports.update_equipment = function(req,res){
    let info = req.body;

    function callback(error,data){
        if(error) {
            res.json({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            res.json({
                success: true
            });
        }
    }

    if(info.info.price && info.info.currency) {
        let price_uah = convertPriceToUAH(info.info.price, info.info.currency)
        info.info.price_uah = price_uah;
    }

    db.update_equipments(info.id,info.info,callback);
}

exports.delete_technic_without_category_by_id = function(req,res){
        let info = req.body;

        function callback1(err1, data1) {
            if (err1)      {
                res.json({
                    success: true,
                    error: error.sqlMessage
                });
            }
            else {
                //let photos = JSON.parse(data1[0].photos) || [];
                let photos = data1[0].photos || [];
                if(photos && photos.length > 0)
                    photos.forEach(function (item) {
                        let file_path = "./Backend/res/images/technics/"+ item;
                        try {
                            if(fs.existsSync(file_path)) {
                                fs.unlinkSync(file_path);
                            }
                        } catch(err) {
                        }
                    })

                function callback(error, data) {
                    if (error) {
                        res.json({
                            success: true,
                            error: error.sqlMessage
                        });
                    } else {
                        res.json({
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
    let info = req.body;

    // function callback3(error,data3) {
    //     if(error) console.log(error)
    //     else {
    //             if(data3 && data3.length > 0)
    //             data3.forEach(function (item) {
    //                 let file_path = "./Backend/res/images/technics/"+ item.file_name;
    //                 if(fs.existsSync(file_path)) {
    //                     fs.unlinkSync(file_path);
    //                 }
    //                 else {
    //                     //console.log("file not exist")
    //                 }
    //
    //             })
    //
    //         function callback1(error, data1) {
    //             if (error) {
    //                 console.log("Error! ", error.sqlMessage);
    //
    //                 res.json({
    //                     success: true,
    //                     error: error.sqlMessage
    //                 });
    //             } else {

    function callback5(error,data5) {
        if(error) console.log(error)
        else {
            // console.log(data5[0].images)
            if( data5 && data5[0]) {

            function callback2(error, data2) {
                if (error) {
                    //console.log("Error! ", error.sqlMessage);
                    res.json({
                        success: true,
                        error: error.sqlMessage
                    });
                } else {
                    function callback(error, data) {
                        if (error) {
                            //console.log("Error! ", error.sqlMessage);
                            res.json({
                                success: true,
                                error: error.sqlMessage
                            });
                        } else {
                            try {
                                helper.deleteFiles("./Backend/res/images/technics/", data5[0].images)//JSON.parse(data5[0].images))
                            } catch (e) {}

                            res.json({
                                success: true
                            });
                        }
                    }

                    db.delete_technics(info.id, callback);
                }
            }

        }

                    db.delete_check_technics_by_technic_id(info.id, callback2)
                }
            }

            db.get_technics_by_id(info.id, callback5);
    //             }
    //         }
    //
    //         db.delete_images_by_technic_id(info.id, callback1);
    //     }
    // }
    // db.get_technic_images_by_id(info.id,callback3)

}


deleteFiles = function(file_loactions){
    try {
        file_loactions.forEach(function (item) {
            fs.unlinkSync(item)
        })
    } catch(err) {
        //console.error(err)
    }
}

deleteFile = function(file) {
    try {
        fs.unlinkSync(file);
    } catch (e) {
        console.log(e)
    }
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
                        //console.log("unlink")
                        fs.unlinkSync(file_path);
                    } else {
                        //console.log("file not exist")
                    }

                })

            function callback4(err4, data4) {
                if (err4) console.log(err4)
                else {

                    function callback1(error, data1) {
                        if (error) {
                           // console.log("Error! ", error.sqlMessage);

                            res.json({
                                success: true,
                                error: error.sqlMessage
                            });
                        } else {
                            function callback2(error, data2) {
                                if (error) {
                                    //console.log("Error! ", error.sqlMessage);
                                    res.json({
                                        success: true,
                                        error: error.sqlMessage
                                    });
                                } else {
                                    function callback(error, data) {
                                        if (error) {
                                            //console.log("Error! ", error.sqlMessage);
                                            res.json({
                                                success: true,
                                                error: error.sqlMessage
                                            });
                                        } else {
                                            //console.log("Success! ", data);
                                            res.json({
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
            //console.log("Error! ", error.sqlMessage);
            res.json({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            //console.log("Success! ", data);
            res.json({
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
            //console.log("Error! ", error.sqlMessage);
            res.json({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            //console.log("Success! ", data);
            res.json({
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
            //console.log("Error! ", error.sqlMessage);
            res.json({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            //console.log("Success! ", data);
            res.json({
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
            //console.log("Error! ", error.sqlMessage);
            res.json({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            //console.log("Success! ", data);
            res.json({
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
            //console.log("Error! ", error.sqlMessage);
            res.json({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            //console.log("Success! ", data);
            res.json({
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
            //console.log("Error! ", error.sqlMessage);
            res.json({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            //console.log("Success! ", data);
            res.json({
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
            //console.log("Error! ", error.sqlMessage);
            res.json({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            //console.log("Success! ", data);
            res.json({
                success: true
            });
        }
    }

    db.delete_images_by_equipment_id(info.id,callback);
}

exports.delete_user_photo = function(req,res){
    let user = req.currentUser;

    if (user) {
        function callback(error,data){
            if(error) {
                res.json({
                    success: true,
                    error: error.sqlMessage
                });
            }
            else {
                // delete images
                if (user.photo_location && user.photo_location != "avatar.png")
                deleteFile("./Backend/res/images/users_photos/" + user.photo_location)
                res.json({
                    success: true
                });
            }
        }
        db.update_client(user.id, {photo_location: "avatar.png"}, callback);
    } else {
        res.json({})
    }
}

exports.delete_check_equipments_by_equipment_id = function(req,res){
    var db = require('./db');
    var info = req.body;

    function callback(error,data){
        if(error) {
            //console.log("Error! ", error.sqlMessage);
            res.json({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            //console.log("Success! ", data);
            res.json({
                success: true
            });
        }
    }

    db.delete_check_equipments_by_equipment_id(info.id,callback);
}

exports.logout = function(req,res) {
    res.clearCookie('jwt') ;
    res.clearCookie('refresh_token');
    res.clearCookie('phone');
    res.json({success: true});
}

exports.addUserSubmitFnc = function (req, res)
{

    let db = require('./db');

    function callback(error,data){
        if(error) {
            //console.log("Error! ", error.sqlMessage);
            res.json({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            //console.log("Success! ", data);
            res.json({
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
            //console.log("Error! ", error.sqlMessage);
            res.json({
                success: true,
                error: error.sqlMessage
            });
        }
        else {
            //console.log("Success! ", data);
            res.json({
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


convertPriceToUAH = function(value, currency){
    //console.log(currency)
    let price_return = value;
    if(currency.toUpperCase() === "UAH") {
        price_return = value;
    }
    else {
        let rates = CUR_RATES;

        for(let j = 0; j < rates.length; j++) {
            let rate = rates[j];

            if(currency.toUpperCase() === rate.ccy)  {
                //console.log("here")
                price_return = value * rate.sale;
                //console.log(price_return)
                break;
            }

        }
    }

    return price_return
}




// Step 3: Convert image to .webp format
async function convertImageToWebp(imagePath) {
    //console.log("jjj"+ imagePath)
    if(imagePath.toString().endsWith(".webp")) {
        //console.log("here")
        return imagePath;
    }
    //const newImagePath = imagePath.replace(/\.\w+$/, '.webp'); // Replace the file extension with .webp
    const newImagePath = uniqid() + ".webp";
    //console.log(newImagePath)
    try {
        // Use sharp to convert the image
        await sharp(imagePath).composite([{ input: 'logo.png', gravity: 'southeast' }])
                    .ensureAlpha(0.8).toFormat('webp').toFile(newImagePath);
        return newImagePath; // Return the new image path
    } catch (err) {
        console.error(`Error converting image ${imagePath} to .webp:`, err);
        throw err;
    }
}

//Step 4: Update the database with the new image path
// async function updateDatabase(connection, goodId, newImagePath) {
//     try {
//         await connection.execute('UPDATE goods SET image_path = ? WHERE id = ?', [newImagePath, goodId]);
//         console.log(`Database updated for good ID ${goodId}: ${newImagePath}`);
//     } catch (err) {
//         console.error(`Error updating database for good ID ${goodId}:`, err);
//         throw err;
//     }
// }

async function fileExists(filePath) {
    try {
        await fs.promises.access(filePath); // Check if file is accessible
        return true; // File exists
    } catch {
        return false; // File does not exist
    }
}

//Step 5: Main function to orchestrate the task
async function main() {

    try {
        db.get_equipments(callback); // Fetch goods with image paths
        async function callback(err, data) {
            if(data) {
                //console.log(data)
                let goods = data
                for (const good of goods) {
                    const { id, images } = good;
                    //console.log(id)
                    try {
                        let newImagePaths = new Array; // Array to store updated image paths
                            // Parse the JSON array of image paths
                            //console.log(Array.isArray(good["images"]))              
                            //console.log(Array.isArray(images) )

                            let oldImagePathsArray = images || [];
                            // Process each image in the array
                            for (const [index, imagePath] of oldImagePathsArray.entries()) {
                                //console.log(imagePath)
                                let _imagePath = "./Backend/res/images/" + "equipments" + "/" + imagePath
                                const absolutePath =  path.resolve(_imagePath); // Resolve the absolute path
                                // let f_res = await fileExists(absolutePath)
                                // console.log( f_res + "res")

                                 // Check if the file exists
                                if (await fileExists(absolutePath)) {
                                    const newImagePath = await convertImageToWebp(absolutePath); // Convert the image to .webp
                                    const fileName = path.basename(newImagePath);
                                    newImagePaths.push(fileName); // Add the new path to the array
                                    //console.log(fileName)
    
                                    // Optionally delete the old image
                                    if(fileName != oldImagePathsArray[index]) {
                                        // console.log(imagePathsArray[index])
                                        // console.log(fileName == imagePathsArray[index])
                                        // console.log(fileName != imagePathsArray[index])
                                        //await fs.promises.unlink(absolutePath);
                                        //fs.unlink(absolutePath);
                                        //console.log(`Old image deleted: ${absolutePath}`);
                                    }   
                                }
                                else {
                                    console.warn(`File not found: ${absolutePath}`);
                                }
                                                      
                            }

                                let eq_to_update = {images: JSON.stringify(newImagePaths),
                                main_photo_location : newImagePaths.length > 0 ? newImagePaths[0] : "default_technic.webp"}
                                // db.update_equipments(id, eq_to_update, function(err,data){
                                //     console.log(err)
                                // })
                        
        
                    } catch (err) {
                        console.error(`Error processing good ID ${id}:`, err);
                    }
                }
            }
        }
      
    } catch (err) {
        console.error('Error fetching goods:', err);
    } finally {
       // await connection.end(); // Close the database connection
    }
}


 //main();