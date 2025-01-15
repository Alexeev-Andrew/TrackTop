const { render } = require('ejs');

exports.mainPage = function(req, res) {
    require('./db').get_marks_of_technics(callback);
    let marks = [];
    function callback(err, data) {
        if(data) {
            marks = data;
        }
        res.render('mainPage', {
            pageTitle: 'TrackTop | Магазин сг техніки Львівська область, сільгосптехніка Львів',
            marks: marks,
            user: req.currentUser,
        });
    }

};

exports.profile = function(req, res) {
    res.render('profile', {
        pageTitle: '',
        user: req.currentUser,
    });
};


exports.technics_without_category = function(req, res) {
    res.render('technicsPage', {
        pageTitle: 'Купити сг техніку Львівська область | TrackTop',
        description : "Купити сільгосптехніку техніку! Сільгосптехніка бу | Львівська область. Дзвоніть ☎ (067)-646-22-44" ,
        photo_location :"",
        types:null,
        mark:null,
        user: req.currentUser,
    });
};


exports.technics = function(req, res) {
    let {type,  mark, ...otherParams }  = req.query;
    console.log(req.query)
     console.log(req.url)
    // console.log(decodeURIComponent(type))
    if (Object.keys(otherParams).length > 0 || (type && mark)) {
         return render404(req,res);
    }

    let photo_location = null;
    //console.log(type)
    if(type) {  
        require('./db').get_types_of_technics( callback);
        function  callback(error,data) {
            if (error) {
                res.status(404).send({error:error.sqlMessage});
                //console.log("Error! ", error.sqlMessage);
            } else {
                let row;
                console.log(data)

                if(!isValueInRows("name", type, data)) {
                    return render404(req,res)
                }
                photo_location = data.find(row => row.name == type).photo_location;
                // console.log(photo_location)
                // data.forEach(function (i) {
                //     console.log(i)
                //     if (i.name == type) {
                //         row = i;
                //         photo_location = i.photo_location;
                //     }
                // })

                // if(row.name != type) {
                //     return render404(req,res);
                // }
    
                if (req.query.type == "Фронтальні навантажувачі")
                    res.render('technicsPage', {
                        pageTitle: req.query.type + " на МТЗ, Т-40, Т25 (Польща)",
                        description: "Купити " + req.query.type + " на трактор. Гарантія 1 рік. Доставка по всій Україні. Дзвоніть ☎ (097)-837-87-72",
                        types: req.query.type,
                        mark: null,
                        photo_location: photo_location,
                        user: req.currentUser,
    
                    });
                else if (req.query.type == "Жатки") {
                    // console.log(req.query.type + " " + photo_location)
                    res.render('technicsPage', {
                        pageTitle: req.query.type + " кукурудзяні. Купити приставку кукурудзяну. Львівська область | TrackTop",
                        description: "Купити " + req.query.type + " для кукурудзи. Жатки соняшникові. Приставка для кукурудзи. Великий вибір сг техніки. Обирай TrackTop! Дзвоніть ☎ (067)-646-22-44",
                        types: req.query.type,
                        mark: null,
                        photo_location: photo_location,
                        user: req.currentUser,
                    });
                } else if (req.query.type)
                    res.render('technicsPage', {
                        pageTitle: 'Купити ' + req.query.type + " Львівська область | купити бу " + req.query.type + " | TrackTop",
                        description: req.query.type + " бу. Великий вибір сг техніки. Купуй " + req.query.type + " в Львівській області від TrackTop! Дзвоніть ☎ (067)-646-22-44",
                        types: req.query.type,
                        mark: null,
                        photo_location: photo_location,
                        user: req.currentUser,
                    });    
            }
        }}
    else if(mark) {
        require('./db').get_marks_of_technics((err, data) => {
            //console.log(data)
            if(err || !isValueInRows("name", mark, data)) {
                return render404(req,res)
            }
            photo_location = data.find(row => row.name == mark).logo_file;

            //console.log(photo_location)

            res.render('technicsPage', {
            pageTitle: 'Купити техніку марки ' + req.query.mark + " Львівська область | TrackTop",
            description: "У нас ви можете купити сг техніку " + req.query.mark + "! Сільгосптехніка бу марки " + req.query.mark + " | Львівська область. Дзвоніть ☎ (067)-646-22-44",
            types: null,
            mark: mark,
            photo_location: photo_location,
            user: req.currentUser,
            });
        })
    
    }
    else {
        return render404(req,res);
    }
};

exports.marks = function(req, res) {
    let { ...otherParams} = req.query;
    if (Object.keys(otherParams).length > 0) {
        return render404(req,res);
    }

    require('./db').get_marks_of_technics( callback);
    function  callback(error, data) {
        if (error) {
            return res.status(404).send({error: error.sqlMessage })
            //console.log("Error! ", error.sqlMessage);
        }
         res.render('marks', {
                pageTitle: "Купити сільгосптехніку Львів. Купити спецтехніку Україна | TrackTop",
                description: "Купити сільгосптехніку бу та нова, спецтехніка в Україні та під замовлення | TrackTop",
                types: null,
                mark: null,
                photo_location: "",
                // marks: data
                user: req.currentUser,
            });

    }
};


exports.category = function(req, res) {
    if (req.query.name) {
        let photo_location = null;

        require('./db').get_equipments_categories( callback);
        function  callback(error,data) {
                if(error) {
                    res.status(404).json({error:error.sqlMessage})
                    //console.log("Error! ", error.sqlMessage);
                }
                else {
                    data.forEach(function (i) {
                       if(i.category_name == req.query.name) {
                           photo_location = i.photo_location;
                       }
                    })
                }
            if(!isValueInRows("category_name", req.query.name, data)) {
                return render404(req,res)
            }

            if(req.query.name=="Колеса"){
                res.render('categoryPage', {
                    pageTitle:  "Колеса до с/г техніки! Шини до спецтехніки. Корчин, Львівська область | TrackTop",
                    description: "Купити колеса/шини до сільгосптехніки та спецтехніки під замовлення. Доставка по всій Україні. Вибирай запчастини від TrackTop! Дзвоніть ☎ (067)-646-22-44",
                    name: req.query.name,
                    photo_location: photo_location,
                    user: req.currentUser,
                });
            }
            else if(req.query.name=="Запчастини до комбайнів")
                res.render('categoryPage', {
                    pageTitle:  req.query.name + " Claas,John Deere, MF та іншої с/г техніки! Львівська область | TrackTop",
                    description: "Купити " + req.query.name + " Клаас, Джон Дір, Массей Фергюсон. Вибирай запчастини до сільгосптехніки від TrackTop! Доставка по всій Україні. Дзвоніть ☎ (067)-646-22-44",
                    name: req.query.name,
                    photo_location: photo_location,
                    user: req.currentUser,
                });
            else if(req.query.name!="Інше")
                res.render('categoryPage', {
                    pageTitle:  req.query.name + " та іншої с/г техніки! Корчин, Львівська область | TrackTop",
                    description: "Купити " + req.query.name + ". Вибирай запчастини до сільгосптехніки від TrackTop! Доставка по всій Україні. Дзвоніть ☎ (067)-646-22-44",
                    name: req.query.name,
                    photo_location: photo_location,
                    user: req.currentUser,
                });
            else if(req.query.name=="Інше"){
                res.render('categoryPage', {
                    pageTitle:  "Запчастини до сільськогосподарської техніки! Корчин, Львівська область | TrackTop",
                    description: "Купити запчастини до сг техніки під замовлення. Доставка по всій Україні. Вибирай запчастини від TrackTop! Дзвоніть ☎ (067)-646-22-44",
                    name: req.query.name,
                    photo_location: photo_location,
                    user: req.currentUser,
                });
            }
            // not found
            else {
                return res.status(404).render('404_error_template', {
                    title: 'Сторінки не знайдено!',
                    user: req.currentUser,
                })
            }
        }

    }  else {
        res.status(404).render('404_error_template', {
            title: 'Сторінки не знайдено!',
            user: req.currentUser,
        })
    }

};

exports.models = function(req, res) {
    //console.log(req.params.type);
        let {...otherParams} = req.query;
        let {type, mark} = req.params;
        let photo_location = null;

        if (Object.keys(otherParams).length > 0) {
            return render404(req,res);
        }

        let marks = ["John Deere", "Claas", "Massey Ferguson"]
        // if(!isValueInRows("category_name", req.query.name, data)) {
        //     return render404(req,res)
        // }

        if(type ==="combine_details" && mark && marks.includes(mark)) {
            res.render('models', {
                pageTitle: "Запчастини " + req.params.mark+ ". Купити запчастини до комбайнів " +req.params.mark + " Львівська область| TrackTop",
                mark: req.params.mark,
                description: "Великий вибір запчастин до зернозбиральних комбайнів "  + req.params.mark + " по вигідній ціні! Запчастини до комбайнів "  + req.params.mark +  ".Вибирай запчастини від TrackTop! Дзвоніть ☎ (067)-646-22-44",
                photo_location : photo_location,
                user: req.currentUser,
            });
        }  else {
            res.status(404).render('404_error_template', {
                title: 'Сторінки не знайдено!',
                user: req.currentUser,
            })
        }

};


exports.technic_without_category = function(req, res) {
    let id = req.params.id;

    require('./db').get_technics_without_category_by_id(id,

        function (error,data) {

            if(error) {
                res.status(404).json({error:error.sqlMessage})
            }
            else {
                if(data.length>0) {
                    let technic = data[0];
                    let photos = technic.photos || ["default_technic.jpg"];
                            res.render('oneTechnicWithoutCategoryPage', {
                                pageTitle: technic.name + " | Корчин, Львівська область",
                                name: technic.name,
                                description: "Купити "  + technic.name + " Дзвоніть ☎ (097)-837-87-72",
                                technic: technic,
                                photo_location : photos[0],
                                user: req.currentUser,
                            });
                }
                // not found
                else {
                    return render404(req,res)
                }
            }
        });


};


exports.technic = function(req, res) {
    let {model, mark, type, number_id, ...otherParams} = req.query
 

    require('./db').get_technics_by_id(number_id,

        function (error,data) {

        if(error) {
            res.status(404).send({
                success: false,
                error: error.sqlMessage
            });
        }
        else {
            if(data.length>0 ) {
                let row = data[0];
                //console.log(row)
                if(model!=row.model || row.types_of_technics_name!=type  || row.marks_of_technics_name!= mark
                    ||  Object.keys(otherParams).length > 0) {
                
                    return render404(req,res);
                }
                let og_description = stripHTMLAndRemoveWhitespace(row.description)
                //console.log(og_description)

                    if(type=="Сівалки") type="Сівалка";
                    else if(type=="Преси-підбирачі")type="Прес-підбирач";
                    else if(type=="Жатки")type="Жатка кукурудзяна (приставка кукурудзяна)";
                    else if(type=="Фронтальні навантажувачі")type="Фронтальний навантажувач";
                    else type = type.substring(0,type.length-1);
                    let type_ = type=="Жатка кукурудзяна (приставка кукурудзяна)" ? "Жатка" : type;
                if(type=="Фронтальні навантажувачі") {
                    // if(type.includes("гак") || type.includes("вила")) {
                    //     res.render('oneTechnicPage', {
                    //         pageTitle: model + ' ' + mark + " (Польща)",
                    //         name: mark + ' ' + model,
                    //         type: type_,
                    //         description: "Купити "  + model + " на МТЗ, Т-40, ЮМЗ, Т-25. Дзвоніть ☎ (097)-837-87-72",
                    //         technic: data[0],
                    //         user: req.currentUser,
                    //     });
                    // }
                    // else {
                        res.render('oneTechnicPage', {
                            pageTitle: type + ' ' + mark + ' ' + model + " (Польща)",
                            name: mark + ' ' + model,
                            type: type_,
                            og_description:og_description,
                            description: "Купити " + type.toLowerCase() + ' ' + mark + ' ' + model + " на МТЗ, Т-40, ЮМЗ, Т-25. Дзвоніть ☎ (097)-837-87-72",
                            technic: data[0],
                            user: req.currentUser,
                        });
                   // }
                }
                else {
                    res.render('oneTechnicPage', {
                        pageTitle: type + ' ' + mark + ' ' + model + ". Корчин, Львівська область | TrackTop",
                        name: mark + ' ' + model,
                        type: type_,
                        og_description:og_description,
                        description: "Купити " + type.toLowerCase() + ' ' + mark + ' ' + model + " від TrackTop у Львівській області. Великий вибір сг техніки та запчастин! Дзвоніть ☎ (067)-646-22-44",
                        technic: data[0],
                        user: req.currentUser,
                    });
                }
            }
            // not found
            else {
                render404(req,res)
            }
        }
    });


};


exports.categories = function(req, res) {
    require('./db').get_types_of_technics(
        function (error,data) {

            if(error) {
                res.status(404).send({
                    success: true,
                    error: error.sqlMessage
                });
            }
            else {
                    res.render('categories', {
                        pageTitle: "Купити сільгосптехніку б/у Львів з Європи. Cпецтехніка Україна | TrackTop",
                        description: "Купити комбайни бу, трактори, жатки, сівалки. Спецтехніка під замовлення | Техніка з Європи",
                        photo_location : "",
                        user: req.currentUser,
                    })
            }
        });
};


exports.equipment = function(req, res) {
    let vendor_code;

    let {id, name, ...otherParams} = req.query;

    if (Object.keys(otherParams).length > 0) {
        return render404(req,res);
    }

    require('./db').get_equipment_by_id(req.query.id, function (error,data) {

        if(error) {
            //console.log("Error! ", error.sqlMessage);
            res.status(404).send({
                success: false,
                error: error.sqlMessage
            });
        }
        else {

            if(data.length>0) {
                let category = data[0].category_name;
                let equipment = data[0];
                if(name != equipment.name) {
                    return render404(req,res)
                }
                let og_description = stripHTMLAndRemoveWhitespace(equipment.description)

                vendor_code = equipment.vendor_code || [];
                if(data[0].category_name != "Запчастини до комбайнів") {
                    res.render('oneEquipmentPage', {
                        equipment: equipment,
                        title: "Купити " + equipment.name + ". " + equipment.category_name + " | TrackTop",
                        pageTitle: equipment.name + " " + vendor_code.join(", "),
                        description: "Купити " + equipment.description + " | TrackTop",
                        alt: "Купити " + equipment.description,
                        type_technic: category,
                        og_description:og_description,
                        marks: null,
                        models: null,
                        vendor_code: vendor_code,
                        short_description: equipment.name + " " + vendor_code.join(", "),
                        user: req.currentUser,
                    });
                }
                else {
                    ///
                    require('./db').get_equipment_withModels_by_id(req.query.id, function (error, data) {

                        if (error) {
                            //console.log("Error! ", error.sqlMessage);
                            return res.status(404).send({
                                success: fasle,
                                error: error.sqlMessage
                            });
                        } else {
                            let models = [];
                            if (data.length > 0) {
                                equipment = data[0]
                                let s = "";
                                for (let i =0; i < data.length;i ++) {
                                    models.push(data[i].model)
                                    s += data[i].model;
                                    if(i<data.length-1) s +=",";
                                }

                                let desc = "Купити " + equipment.name + " до комбайна " + equipment.technic_mark + " "  + s;
                                res.render('oneEquipmentPage', {
                                    equipment: equipment,
                                    title: equipment.name + " " + equipment.technic_mark + " "  + s,
                                    pageTitle: equipment.name + " " + data[0].technic_mark + " " + vendor_code.join(", "),
                                    description:  desc + " | TrackTop",
                                    alt: desc,
                                    og_description:og_description,
                                    models: models,
                                    marks: data[0].technic_mark,
                                    type_technic: category,
                                    vendor_code: vendor_code,
                                    short_description: equipment.name + " " + data[0].technic_mark + " " + vendor_code.join(", ") + ". Застосовується в комбайнах " +  data[0].technic_mark + " " + models.join(", "),
                                    user: req.currentUser,
                                });
                            }
                        }
                        ///
                    });
                }
            }
            // not found
            else {
                return render404(req,res)
            }
        }
    });


};

exports.equipments = function(req, res) {

    res.render('equipmentsPage', {
        pageTitle: 'Запчастини до сг техніки Львівська область | TrackTop',
        description: "У нас ви можете купити запчастини до комбайнів, тракторів, плугів, пресів та сівалок! Львів | TrackTop. Дзвоніть ☎ (067)-646-22-44",
        types: null,
        mark: null,
        user: req.currentUser,
    });

};

exports.equipmentsByModel = function(req, res) {
    let {mark, model, type} = req.params;
    let {page, ...otherParamsQuery} = req.query;
    if(!page) page = 1;

    if (Object.keys(otherParamsQuery).length > 0) {
        return render404(req,res);
    }

    require('./db').get_equipments_by_model(req.params.model, callback);


    //require('./db').get_technic_by_type_model_mark(type,mark,model,
    function callback(error, data) {

        //console.log(data)
        if (error) {
            //console.log("Error! ", error.sqlMessage);
            return res.status(404).send({
                success: false,
                error: error.sqlMessage
            });
        } else {
            let mark_ukr, model_ukr;
                            //console.log(data)

            if (data && data.length > 0) {
                // console.log(data)
                 mark_ukr = data[0].mark_name_ukr;
                 model_ukr = data[0].model_ukr;
            }
            if(data.length==0 || data[0].model != model || data[0].mark_name != mark || type != "combine_details") {
                return render404(req,res);
            }
            //console.log("page = "+ page)
            res.render('categoryPage', {
                pageTitle: "Запчастини до комбайна " + req.params.mark + " " + req.params.model +", Львіська область | TrackTop",
                description: "Купити запчастини до зернозбирального комбайна " + req.params.mark + " " + req.params.model + "! Запчастини до с/г техніки. Доставка по всій Україні! Дзвоніть ☎ (067)-646-22-44",
                name: "Запчастини до комбайна " + req.params.mark + " " + req.params.model,
                //data: data,
                page: page,
                mark : req.params.mark,
                model : req.params.model,
                mark_ukr: mark_ukr,
                model_ukr: model_ukr,
                photo_location : null,
                user: req.currentUser,
            });
        }

    }
}

exports.about = (req, res) => {
    res.render('about', {
        pageTitle: 'Про компанію TrackTop',
        user: req.currentUser,
    })
}

exports.sitemap = (req, res) => {
    res.render('sitemap', {
        pageTitle: 'Карта сайту магазину сг техніки TrackTop | Львівська область',
        user: req.currentUser,
    })
}

exports.reviews = (req, res) => {
    res.render('reviews', {
    })
}

exports.basket = (req, res) => {
    res.render('basket', {
        pageTitle:  "Корзина | TrackTop" ,
        description :  "Корзина | Магазин запчастини до комбайнів",
        user: req.currentUser,
    });
}

exports.purchases = (req, res) => {
    res.render('purchases', {
        user: req.currentUser,
    })
}

exports.error_404 = (req, res) => {
    res.status(404).render('404_error_template', {
        title: 'Сторінки не знайдено!',
        user: req.currentUser,
    })
}

exports.thank_you = (req, res) => {
    res.render('Thank-You', {
        title: 'Дякуємо за замовлення!',
        user: req.currentUser,
    })
}

exports.adminPanel = (req, res) => {
    res.render('adminPage', {
        pageTitle: 'Адмін панель',
        currPage:  req.query.page || "check",
        user: req.currentUser,
    })
}

render404 = (req,res) => {
     res.status(404).render('404_error_template', {
        title: 'Сторінки не знайдено!',
        user: req.currentUser,
    })
    return;
}

isValueInRows = (columnToCheck, myvalue, rows) => rows.some(row => row[columnToCheck] === myvalue);

function stripHTMLAndRemoveWhitespace(text) {
    if (typeof text !== "string") return text; // Ensure input is a string

    // Match and remove all HTML tags, including self-closing and multiline tags
    const regex = /<\/?[^>]+(>|$)/g;
    let strippedText = text.replace(regex, "");

    // Replace tabs, new lines, and carriage returns with an empty string
    return strippedText.replace(/[\t\n\r]/g, "").trim();
}