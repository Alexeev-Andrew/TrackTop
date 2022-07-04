exports.mainPage = function(req, res) {
    res.render('mainPage', {
        pageTitle: 'Магазин сг техніки Львівська область, сільгосптехніка Львів| TrackTop',
    });
};

exports.profile = function(req, res) {
    res.render('profile', {
        pageTitle: ''
    });
};


exports.technics_without_category = function(req, res) {
            res.render('technicsPage', {
                pageTitle: 'Купити сг техніку Львівська область | TrackTop',
                description : "Купити сільгосптехніку техніку! Сільгосптехніка бу | Львівська область. Дзвоніть ☎ (067)-646-22-44" ,
                photo_location :"",
                types:null,
                mark:null
            });
};


exports.technics = function(req, res) {
    let type = req.query.type;
    let photo_location = null;
        require('./db').get_types_of_technics( callback);
        function  callback(error,data) {
            if (error) {
                console.log("Error! ", error.sqlMessage);
            } else {
                data.forEach(function (i) {
                    if (i.name == type) {
                        photo_location = i.photo_location;
                    }
                })

                if (req.query.type == "Фронтальні навантажувачі")
                    res.render('technicsPage', {
                        pageTitle: req.query.type + " на МТЗ, Т-40, Т25 (Польща)",
                        description: "Купити " + req.query.type + " на трактор. Гарантія 1 рік. Доставка по всій Україні. Дзвоніть ☎ (093)-493-14-81",
                        types: req.query.type,
                        mark: req.query.mark,
                        photo_location: photo_location
                    });
                else if (req.query.type == "Жатки") {
                    console.log(req.query.type + " " + photo_location)
                    res.render('technicsPage', {
                        pageTitle: req.query.type + " кукурудзяні. Купити приставку кукурудзяну. Львівська область | TrackTop",
                        description: "Купити " + req.query.type + " для кукурудзи. Жатки соняшникові. Приставка для кукурудзи. Великий вибір сг техніки. Обирай TrackTop! Дзвоніть ☎ (067)-646-22-44",
                        types: req.query.type,
                        mark: req.query.mark,
                        photo_location: photo_location
                    });
                } else if (req.query.type)
                    res.render('technicsPage', {
                        pageTitle: 'Купити ' + req.query.type + " Львівська область | купити бу " + req.query.type + " | TrackTop",
                        description: req.query.type + " бу. Великий вибір сг техніки. Купуй " + req.query.type + " в Львівській області від TrackTop! Дзвоніть ☎ (067)-646-22-44",
                        types: req.query.type,
                        mark: req.query.mark,
                        photo_location: photo_location
                    });
                else {
                    res.render('technicsPage', {
                        pageTitle: 'Купити ' + req.query.mark + " Львівська область | TrackTop",
                        description: "У нас ви можете купити сг техніку " + req.query.mark + "! Сільгосптехніка " + req.query.mark + " бу | Львівська область. Дзвоніть ☎ (067)-646-22-44",
                        types: req.query.type,
                        mark: req.query.mark,
                        photo_location: photo_location
                    });
                }
            }
        }
};

exports.category = function(req, res) {
    if (req.query.name) {
        let photo_location = null;

        require('./db').get_equipments_categories( callback);
        function  callback(error,data) {
                if(error) {
                    console.log("Error! ", error.sqlMessage);
                }
                else {
                    data.forEach(function (i) {
                       if(i.category_name == req.query.name) {
                           photo_location = i.photo_location;
                       }
                    })
                }
            if(req.query.name=="Колеса"){
                res.render('categoryPage', {
                    pageTitle:  "Колеса до с/г техніки! Шини до спецтехніки. Корчин, Львівська область | TrackTop",
                    description: "Купити колеса/шини до сільгосптехніки та спецтехніки під замовлення. Доставка по всій Україні. Вибирай запчастини від TrackTop! Дзвоніть ☎ (067)-646-22-44",
                    name: req.query.name,
                    photo_location: photo_location
                });
            }
            else if(req.query.name=="Запчастини до комбайнів")
                res.render('categoryPage', {
                    pageTitle:  req.query.name + " Claas,John Deere, MF та іншої с/г техніки! Львівська область | TrackTop",
                    description: "Купити " + req.query.name + " Клаас, Джон Дір, Массей Фергюсон. Вибирай запчастини до сільгосптехніки від TrackTop! Доставка по всій Україні. Дзвоніть ☎ (067)-646-22-44",
                    name: req.query.name,
                    photo_location: photo_location
                });
            else if(req.query.name!="Інше")
                res.render('categoryPage', {
                    pageTitle:  req.query.name + " та іншої с/г техніки! Корчин, Львівська область | TrackTop",
                    description: "Купити " + req.query.name + ". Вибирай запчастини до сільгосптехніки від TrackTop! Доставка по всій Україні. Дзвоніть ☎ (067)-646-22-44",
                    name: req.query.name,
                    photo_location: photo_location
                });
            else if(req.query.name=="Інше"){
                res.render('categoryPage', {
                    pageTitle:  "Запчастини до сільськогосподарської техніки! Корчин, Львівська область | TrackTop",
                    description: "Купити запчастини до сг техніки під замовлення. Доставка по всій Україні. Вибирай запчастини від TrackTop! Дзвоніть ☎ (067)-646-22-44",
                    name: req.query.name,
                    photo_location: photo_location
                });
            }
        }

    }

};

exports.models = function(req, res) {
    //console.log(req.params.type);
        let type = req.params.type;
        let photo_location = null;
        if(type ==="combine_details") {
            res.render('models', {
                pageTitle: "Запчастини " + req.params.mark+ ". Купити запчастини до комбайнів " +req.params.mark + " Львівська область| TrackTop",
                mark: req.params.mark,
                description: "Великий вибір запчастин до зернозбиральних комбайнів "  + req.params.mark + " по вигідній ціні! Запчастини до комбайнів "  + req.params.mark +  ".Вибирай запчастини від TrackTop! Дзвоніть ☎ (067)-646-22-44",
                photo_location : photo_location
            });
        }

};


exports.technic_without_category = function(req, res) {
    var id = req.params.id;

    require('./db').get_technics_without_category_by_id(id,

        function (error,data) {

            if(error) {
                console.log("Error! ", error.sqlMessage);
                res.send({
                    success: true,
                    error: error.sqlMessage
                });
            }
            else {

                if(data.length>0) {
                    let technic = data[0];
                            res.render('oneTechnicWithoutCategoryPage', {
                                pageTitle: technic.name + " | Корчин, Львівська область",
                                name: technic.name,
                                description: "Купити "  + technic.name + " Дзвоніть ☎ (097)-837-87-72",
                                technic: technic,
                                photo_location : JSON.parse(technic.photos)[0].val
                            });
                }
            }
        });


};


exports.technic = function(req, res) {
    var model = req.query.model;
    var mark = req.query.mark;
    var type = req.query.type;
    var number_id = req.query.number_id;

     console.log("model"+ model + "mark = " + mark + "type" + type + " id = "+ number_id);

    require('./db').get_technics_by_id(number_id,


    //require('./db').get_technic_by_type_model_mark(type,mark,model,
        function (error,data) {

        if(error) {
            console.log("Error! ", error.sqlMessage);
            res.send({
                success: true,
                error: error.sqlMessage
            });
        }
        else {

            if(data.length>0) {
               // console.log(data[0]+"\n");
                    if(type=="Сівалки") type="Сівалка";
                    else if(type=="Преси-підбирачі")type="Прес-підбирач";
                    else if(type=="Жатки")type="Жатка кукурудзяна (приставка кукурудзяна)";
                    else if(type=="Фронтальні навантажувачі")type="Фронтальний навантажувач";
                    else type = type.substring(0,type.length-1);
                    let type_ = type=="Жатка кукурудзяна (приставка кукурудзяна)" ? "Жатка" : type;
                if(type=="Фронтальні навантажувачі") {
                    if(type.includes("гак") || type.includes("вила")) {
                        res.render('oneTechnicPage', {
                            pageTitle: model + ' ' + mark + " (Польща)",
                            name: mark + ' ' + model,
                            type: type_,
                            description: "Купити "  + model + " на МТЗ, Т-40, ЮМЗ, Т-25. Дзвоніть ☎ (093)-493-14-81",
                            technic: data[0]
                        });
                    }
                    else {
                        res.render('oneTechnicPage', {
                            pageTitle: type + ' ' + mark + ' ' + model + " (Польща)",
                            name: mark + ' ' + model,
                            type: type_,
                            description: "Купити " + type.toLowerCase() + ' ' + mark + ' ' + model + " на МТЗ, Т-40, ЮМЗ, Т-25. Дзвоніть ☎ (093)-493-14-81",
                            technic: data[0]
                        });
                    }
                }
                else {
                    res.render('oneTechnicPage', {
                        pageTitle: type + ' ' + mark + ' ' + model + ". Корчин, Львівська область | TrackTop",
                        name: mark + ' ' + model,
                        type: type_,
                        description: "Купити " + type.toLowerCase() + ' ' + mark + ' ' + model + " від TrackTop у Львівській області. Великий вибір сг техніки та запчастин! Дзвоніть ☎ (067)-646-22-44",
                        technic: data[0]
                    });
                }
            }
        }
    });


};


exports.equipment = function(req, res) {
   // var model = req.query.model;

    //console.log(req);

    require('./db').get_equipment_by_id(req.query.id, function (error,data) {

        if(error) {
            console.log("Error! ", error.sqlMessage);
            res.send({
                success: true,
                error: error.sqlMessage
            });
        }
        else {

            if(data.length>0) {
                // console.log(data[0]+"\n");
                if(data[0].category_name != "Запчастини до комбайнів") {
                    res.render('oneEquipmentPage', {
                        equipment: data[0],
                        title: "Купити " + data[0].name + ". " + data[0].category_name + ". Запчастини до сг техніки Львів | TrackTop",
                        description: "Купити " + data[0].description + " | TrackTop"
                    });
                }
                else {
                    ///
                    require('./db').get_equipment_withModels_by_id(req.query.id, function (error, data) {

                        if (error) {
                            console.log("Error! ", error.sqlMessage);
                            res.send({
                                success: true,
                                error: error.sqlMessage
                            });
                        } else {

                            if (data.length > 0) {

                                let s = "";
                                for (let i =0; i < data.length;i ++) {
                                    s += data[i].model;
                                    if(i<data.length-1) s +=",";
                                }

                                res.render('oneEquipmentPage', {
                                    equipment: data[0],
                                    title: data[0].name + " " + data[0].technic_mark + " "  + s +" | TrackTop",
                                    description: "Купити " + data[0].name + " до комбайна " + data[0].technic_mark + " "  + s +". Запчастини до комбайнів " + "Львів | TrackTop"
                                });
                            }
                        }
                        ///
                    });
                }
            }
        }
    });


};

exports.equipments = function(req, res) {

    res.render('equipmentsPage', {
        pageTitle: 'Запчастини до сг техніки Львівська область | TrackTop',
        description: "У нас ви можете купити запчастини до комбайнів, тракторів, плугів, пресів та сівалок! Львів | TrackTop. Дзвоніть ☎ (067)-646-22-44",
        types: null,
        mark: null
    });

};

exports.equipmentsByModel = function(req, res) {

    require('./db').get_equipments_by_model(req.params.model, callback);


    //require('./db').get_technic_by_type_model_mark(type,mark,model,
    function callback(error, data) {

        if (error) {
            console.log("Error! ", error.sqlMessage);
            res.send({
                success: true,
                error: error.sqlMessage
            });
        } else {
            let page = req.query.page;
            if(!page) page = 1;
            console.log("page = "+ page)
            res.render('categoryPage', {
                pageTitle: "Запчастини до комбайна " + req.params.mark + " " + req.params.model +", Львіська область | TrackTop",
                description: "Купити запчастини до зернозбирального комбайна " + req.params.mark + " " + req.params.model + "! Запчастини до с/г техніки. Доставка по всій Україні! Дзвоніть ☎ (067)-646-22-44",
                name: "Запчастини до комбайна " + req.params.mark + " " + req.params.model,
                data: data.data,
                page: page,
                mark : req.params.mark,
                model : req.params.model,
                photo_location : null
            });
        }

    }
}

exports.about = (req, res) => {
    res.render('about', {
        pageTitle: 'Про компанію TrackTop'
    })
}

exports.test = (req, res) => {
    res.render('test', {
        pageTitle: 'Про компанію TrackTop'
    })
}

exports.sitemap = (req, res) => {
    res.render('sitemap', {
        pageTitle: 'Карта сайту магазину сг техніки TrackTop | Львівська область'
    })
}

exports.reviews = (req, res) => {
    res.render('reviews', {
    })
}

exports.basket = (req, res) => {
    res.render('basket', {
        pageTitle:  "Корзина | TrackTop" ,
        description :  "Корзина | Магазин до комбайнів",
    });
}

exports.purchases = (req, res) => {
    res.render('purchases', {
    })
}

exports.adminPanel = (req, res) => {
    res.render('adminPage', {
        pageTitle: 'admin panel',
        currPage:  req.query.page || "check",
    })
}