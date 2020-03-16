exports.mainPage = function(req, res) {
    res.render('mainPage', {
        pageTitle: 'Інтернет-магазин сг техніки Львівська область | TrackTop'
    });
};

exports.profile = function(req, res) {
    res.render('profile', {
        pageTitle: ''
    });
};

exports.technics = function(req, res) {
    if (req.query.type)
    res.render('technicsPage', {
        pageTitle: 'Купити ' + req.query.type + " Львівська область | купити бу " + req.query.type +" | TrackTop",
        description: req.query.type + " бу. Великий вибір техніки. Купуй "+ "в Львівській області від TrackTop! Дзвоніть ☎ (067)-646-22-44",
        types: req.query.type,
        mark: req.query.mark
    });
    else {
        res.render('technicsPage', {
            pageTitle: 'Купити ' + req.query.mark + " Львівська область | TrackTop",
            description : "У нас ви можете придбати сг техніку" + " марки " + req.query.mark + " ! Дзвоніть ☎ (067)-646-22-44 " ,
            types: req.query.type,
            mark: req.query.mark
        });
    }
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
                    else type = type.substring(0,type.length-1);
                res.render('oneTechnicPage', {
                    pageTitle: "Купити " + type + ' ' + mark + ' ' + model + " Львівська обасть | TrackTop" ,
                    name: mark + ' ' + model,
                    // type:type,
                    description :  mark + ' ' + model + " від TrackTop у Львівській області. Великий вибір техніки та запчастин! Дзвоніть ☎ (067)-646-22-44",
                    technic: data[0]
                });
            }
        }
    });


};

exports.equipment = function(req, res) {
   // var model = req.query.model;

    console.log(req);

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

                res.render('oneEquipmentPage', {
                    equipment: data[0]
                });
            }
        }
    });


};

exports.equipments = function(req, res) {

    res.render('equipmentsPage', {
        pageTitle: 'Запчастини до сг техніки Львіська область | TrackTop',
        description: "У нас ви можете купити запчастини до комбайнів, тракторів, плугів, пресів та сівалок! Дзвоніть ☎ (067)-646-22-44",
        types: null,
        mark: null
    });

};

exports.about = (req, res) => {
    res.render('about', {
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

exports.adminPanel = (req, res) => {
    res.render('adminPage', {
        pageTitle: 'admin panel',
        currPage:  req.query.page || "0"
    })
}