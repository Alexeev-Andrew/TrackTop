var mysql = require('mysql2');
var connection;

exports.connect = function() {
    if(connection===null)
        return;

    try {
        connection = mysql.createPool({
            host: 'localhost',
            user: 'tracktop',
            password: 'tracktop123',
            database: "tracktop"
            // user: 'root',
            // password: 'Mihamiha_123',
            // database: "tracktop2"
        });
    }
    catch (e) {

    }


    // connection.connect(function(err) {
    //     if (err) throw err;
    //     console.log("Connected!");
    // });

}

exports.insert_tehnic = function(tehnic,callback){
    connection.query("INSERT INTO technics SET ?", tehnic, callback);
}

exports.insert_tehnic_without_category = function(tehnic,callback){
    //console.log(tehnic)
    connection.query("INSERT INTO technics_without_category SET ?", tehnic, callback);
}

exports.insert_review = function(review,callback){
    connection.query("INSERT INTO reviews SET ?", review, callback);
}

exports.insert_equipment = function(equipment,callback){
    connection.query("INSERT INTO equipments SET ?", equipment, callback);
}

exports.insert_model = function(model,callback){
    connection.query("INSERT INTO models SET ?", model, callback);
}

exports.insert_equipments_models = function(equipments_models,callback){
    connection.query("INSERT INTO equipments_models SET ?", equipments_models, callback);
}

exports.insert_type_of_technics = function(type_of_technics,callback){
    connection.query("INSERT INTO types_of_technics SET ?", type_of_technics, callback);
}

exports.insert_marks_of_technics = function(mark_of_technics,callback){
    connection.query("INSERT INTO marks_of_technics SET ?", mark_of_technics, callback);
}

exports.insert_client = function(client,callback){
    connection.query("INSERT INTO clients SET ?", client, callback);
}

exports.insert_provider = function(provider,callback){
    connection.query("INSERT INTO providers SET ?", provider, callback);
}

exports.insert_check = function(check,callback){
    connection.query("INSERT INTO checks SET ?", check, callback);
}

exports.insert_order = function(order,callback){
    connection.query("INSERT INTO orders SET ?", order, callback);
}

exports.insert_currency_rate = function(currency,callback){
    connection.query("INSERT INTO currency SET ?", currency, callback);
}

// inserts

exports.insert_check_equipments = function(check_equipments,callback){
    connection.query("INSERT INTO check_equipments SET ?", check_equipments, callback);
}

exports.insert_check_technics = function(check_technics,callback){
    connection.query("INSERT INTO check_technics SET ?", check_technics, callback);
}

exports.insert_images_technics = function(images_technics,callback){
    connection.query("INSERT INTO images_technics SET ?", images_technics, callback);
}

exports.insert_images_equipments = function(images_equipments,callback){
    connection.query("INSERT INTO images_equipments SET ?", images_equipments, callback);
}

exports.insert_orders_equipments = function(orders_equipments,callback){
    connection.query("INSERT INTO orders_equipments SET ?", orders_equipments, callback);
}

exports.insert_orders_technics = function(orders_technics,callback){
    connection.query("INSERT INTO orders_technics SET ?", orders_technics, callback);
}

exports.insert_providers_technics = function(providers_technics,callback){
    connection.query("INSERT INTO providers_technics SET ?", providers_technics, callback);
}

exports.insert_providers_equipments = function(providers_equipments,callback){
    connection.query("INSERT INTO providers_equipments SET ?", providers_equipments, callback);
}

exports.insert_technics_equipments = function(technics_equipments,callback){
    connection.query("INSERT INTO technics_equipments SET ?", technics_equipments, callback);
}

exports.insert_technic_photos = function(photos,id,callback){

    for(var i=0;i<photos.length;i++){
        connection.query("INSERT INTO images_technics SET ?", {file_name:photos[i].val,id_technic:id}, callback);
    }
}

exports.insert_equipment_photos = function(photos,id,callback){

    for(var i=0;i<photos.length;i++){
        connection.query("INSERT INTO images_equipments SET ?", {file_name:photos[i].val,id_equipment:id}, callback);
    }
}

exports.insert_emails = function(email,callback){
        connection.query("INSERT INTO emails SET ?", {email:email}, callback);
}

exports.insert_client_phones = function(phone, name, callback){
    connection.query("INSERT INTO client_phones SET ?", {phone:phone,name:name}, callback);
}

//select methods

exports.get_id = function (table_name, name , callback) {
    connection.query("SELECT id FROM "+table_name + " where name= '" + name + "'",callback);
}

exports.get_types_of_technics = function(callback){
    connection.query("SELECT * FROM types_of_technics",callback);
}

exports.get_marks_of_technics = function(callback){
    connection.query("SELECT * FROM marks_of_technics",callback);
}

exports.get_currency_last = function(callback){
    connection.query("SELECT * FROM currency WHERE id=(SELECT max(id) FROM currency)",callback);
}

exports.get_reviews = function(callback){
    connection.query("SELECT text_review, reviews.show, reviews.recommend, photo_location, clients.name, clients.surname  FROM reviews inner join clients on clients.id=client_id",callback);
}

exports.get_review = function(id,callback){
    connection.query("SELECT text_review, reviews.show, reviews.recommend, photo_location, clients.name, clients.surname  FROM reviews inner join clients on clients.id=client_id where client_id = '" + id+"'",callback);
}

////
// select for technics
exports.get_technics_by_mark_name = function(mark_of_technics,callback){
connection.query("SELECT * FROM (technics INNER JOIN (SELECT id as type_id ,name type_name,photo_location FROM types_of_technics) T " +
    "ON technics.type_id = T.type_id ) inner JOIN (select id as mark_id, name  From marks_of_technics Where name = '" +
    mark_of_technics  +"') R1 ON technics.mark_id = R1.mark_id order by technics.id desc",callback);
}



exports.get_technics_by_type_name = function(type_of_technics,callback){
    connection.query("SELECT * FROM (technics inner JOIN (select id as marks_of_technics_id , name from marks_of_technics) k On k.marks_of_technics_id=technics.mark_id )  INNER JOIN (SELECT id as type_id ,name type_name,photo_location FROM types_of_technics WHERE name = '"+type_of_technics+
        "') T ON technics.type_id = T.type_id order by technics.id desc",callback);
}

exports.get_technics_by_type_and_mark = function(type_of_technics, mark_of_technics, callback){
    connection.query("SELECT * FROM technics INNER JOIN (SELECT * FROM types_of_technics as R1 WHERE R1.name = "+type_of_technics+
        "ON types_of_technics.type_id = R1.type_id INNER JOIN (SELECT * FROM marks_of_technics as R2 WHERE R1.name = "+mark_of_technics +
        +"ON technics.mark_id = R2.mark_id",callback);
}
/*
exports.get_technic_by_type_model_mark = function(type_of_technics, mark_of_technics,model, callback){
    connection.query("SELECT * FROM (technics inner join (select id id_mark,name mark_name from marks_of_technics) D on technics.mark_id = D.id_mark) \n" +
        "INNER JOIN (SELECT id,name type_name,photo_location from types_of_technics WHERE name= " + type_of_technics+") L\n" +
        "on type_id = L.id\n" +
        "WHERE model = " + model + " AND mark_name= '"+mark_of_technics+"'" , callback);
}
*/

// not in use
exports.get_technic_im_by_type_model_mark = function(type_of_technics, mark_of_technics,model, callback){
    // console.log("SELECT file_name from (SELECT id FROM (technics inner join (select id id_mark,name mark_name from marks_of_technics) D on technics.mark_id = D.id_mark) "+
    //     "INNER JOIN (SELECT id id_type,name type_name,photo_location from types_of_technics WHERE name='"+type_of_technics+"') L " +
    //     "on type_id = L.id_type WHERE model ='" + model+ "' AND mark_name='" +mark_of_technics+
    //     "' ) Q inner join images_technics on images_technics.id_technic=Q.id");

    connection.query("SELECT file_name from (SELECT id FROM (technics inner join (select id id_mark,name mark_name from marks_of_technics) D on technics.mark_id = D.id_mark) "+
        "INNER JOIN (SELECT id id_type,name type_name,photo_location from types_of_technics WHERE name='"+type_of_technics+"') L " +
        "on type_id = L.id_type WHERE model ='" + model+ "' AND mark_name='" +mark_of_technics+
        "' ) Q inner join images_technics on images_technics.id_technic=Q.id"
        , callback);
}

exports.get_technic_im_by_id = function(id, callback){
    connection.query("SELECT * from images_technics where id_technic="+id, callback);
}

exports.get_equipment_im_by_id = function(id, callback){
    connection.query("SELECT * from images_equipments where id_equipment="+id, callback);
}

/// find all occurenses
exports.get_technic_images_by_id = function(id, callback){
    connection.query("SELECT images from technics where id="+id, callback);
}

exports.get_equipment_images_by_id = function(id, callback){
    connection.query("SELECT images from equipments where id="+id, callback);
}

exports.get_technics_price_more = function(price,callback){
    connection.query("SELECT * FROM technics WHERE technics.price >" + price,callback);
}

exports.get_technics_price_less = function(price,callback){
    connection.query("SELECT * FROM technics WHERE technics.price <" + price,callback);
}

exports.get_technics_by_model = function(model,callback){
    connection.query("SELECT * FROM technics WHERE technics.model =" + model,callback);
}

exports.get_models_by_type_mark = function(type,mark,callback){
    if (mark==null || mark.toString().length==0)   connection.query("SELECT Distinct * FROM models WHERE models.technic_type = '" + type +"'",callback);
    else if (type!=null && mark !=null)
    connection.query("SELECT Distinct * FROM models WHERE models.technic_type = '" + type +"' AND models.technic_mark = '"+ mark+"'",callback);
}

exports.get_models = function(callback){
    connection.query("SELECT * FROM models",callback);
}


exports.get_technic_by_type_model_mark = function(type_of_technics, mark_of_technics,model, callback){
    connection.query("SELECT * FROM (technics inner join (select id id_mark,name mark_name from marks_of_technics) D on technics.mark_id = D.id_mark) \n" +
        "INNER JOIN (SELECT id,name type_name,photo_location from types_of_technics WHERE name= '" + type_of_technics+"') L\n" +
        "on type_id = L.id\n" +
        "WHERE model = '" + model+"' AND mark_name= '"+mark_of_technics+"'" , callback);
}



exports.get_technics_by_country = function(country,callback){
    connection.query("SELECT * FROM technics WHERE technics.country_producer =" + country,callback);
}


exports.get_technics_without_category = function(callback){
    connection.query("SELECT * from technics_without_category",callback);
}

exports.get_technics_simple = function(callback){
    connection.query("SELECT * from technics",callback);
}

exports.get_technics = function(callback){
    connection.query("SELECT technics.id, technics.mark_id , technics.type_id, technics.amount,technics.price, technics.images,technics.status, technics.delivery_time,technics.state,technics.model,technics.reserved_amount,technics.production_date,technics.country_producer,technics.shipping_date, technics.sold, technics.currency,technics.main_photo_location,technics.description, types_of_technics.id as types_of_technics_id , types_of_technics.name as types_of_technics_name , photo_location , marks_of_technics.id as marks_of_technics_id,marks_of_technics.name as marks_of_technics_name FROM (technics INNER JOIN types_of_technics on technics.type_id = types_of_technics.id) INNER JOIN marks_of_technics on technics.mark_id = marks_of_technics.id order by technics.id desc",callback);
}

exports.get_technics_by_id = function(id,callback){
    connection.query("SELECT technics.id, technics.mark_id , technics.type_id, technics.amount,technics.price, technics.images, technics.status,  technics.delivery_time,technics.state,technics.model,technics.reserved_amount,technics.production_date,technics.country_producer,technics.shipping_date,technics.currency,technics.main_photo_location,technics.description, types_of_technics.id as types_of_technics_id , types_of_technics.name as types_of_technics_name , photo_location , marks_of_technics.id as marks_of_technics_id,marks_of_technics.name as marks_of_technics_name FROM (technics INNER JOIN types_of_technics on technics.type_id = types_of_technics.id) INNER JOIN marks_of_technics on technics.mark_id = marks_of_technics.id where technics.id='"+id+"'",callback);
}

exports.get_technics_without_category_by_id = function(id,callback){
    console.log(id)
    connection.query("SELECT * from technics_without_category where id = '"+id +"'",callback);
}


exports.get_client_by_phone = function(phone,callback){
    connection.query("SELECT * FROM clients WHERE phone_number ='" + phone + "' limit 1",callback);
}

exports.get_client_by_id = function(id,callback){
    connection.query("SELECT * FROM clients WHERE id ='" + id + "'",callback);
}

exports.get_client_by_hash = function(hash,callback){
    connection.query("SELECT * FROM clients WHERE hash ='" + hash + "'",callback);
}

exports.get_equipments = function(callback){
    connection.query("SELECT * FROM equipments",callback);
}

exports.get_equipment_by_id = function(id,callback){
    //connection.query("SELECT * FROM models inner join equipments_models on models.id = equipments_models.model_id inner join equipments on equipments.id = equipments_models.equipment_id where equipment_id = " + id,callback);
    connection.query("SELECT * from ( select * FROM  equipments where equipments.id = ? ) s inner join equipments_categories on  s.id_category = equipments_categories.id " , [id],callback);
}

exports.get_equipment_withModels_by_id = function(id,callback){
    connection.query("SELECT * FROM models inner join equipments_models on models.id = equipments_models.model_id inner join equipments on equipments.id = equipments_models.equipment_id where equipments.id = " + id,callback);
}

exports.get_equipments_by_model = function(model,callback) {
    connection.query("SELECT * FROM models inner join equipments_models on models.id = equipments_models.model_id inner join equipments on equipments.id = equipments_models.equipment_id inner join ( select name as mark_name, mark_name_ukr from marks_of_technics) s on models.technic_mark = s.mark_name where "+
    "model = \'" + model + "\'", callback);
}

exports.get_equipments_by_category_id = function(id_category,callback) {
    connection.query("SELECT * FROM  equipments where "+
        "id_category = \'" + id_category + "\'", callback);
}

exports.get_equipments_categories = function(callback){
    connection.query("SELECT * FROM equipments_categories", callback);
}

exports.get_all_orders_by_client_id = function(id, callback){
    connection.query("SELECT * FROM orders where orders.client_id = " + id + " order by orders.purchase_date desc", callback);
}

exports.get_one_order_by_id = function(id,callback) {
    connection.query("SELECT * FROM orders where orders.id = " + id , callback);
}

// delete operations

exports.delete_technics = function(id,callback){
    connection.query("DELETE FROM technics WHERE technics.id = "+ id,callback);
}

exports.delete_technic_without_category_id = function(id,callback) {
    connection.query("DELETE FROM technics_without_category WHERE id = "+ id,callback);
}

exports.delete_types_of_technics = function(id,callback){
    connection.query("DELETE FROM types_of_technics WHERE types_of_technics.id = "+ id,callback);
}

exports.delete_marks_of_technics = function(id,callback){
    connection.query("DELETE FROM marks_of_technics WHERE marks_of_technics.id = "+ id,callback);
}

// exports.delete_user_photo = function(userId,callback){
//     connection.query("UPDATE clients SET photo_location = 'avatar.png' WHERE  id = "+ userId,callback);
// }

///

exports.delete_equipments = function(id,callback){
    connection.query("DELETE FROM equipments WHERE equipments.id = "+ id,callback);
}

exports.delete_equipments_models = function(id,callback){
    connection.query("DELETE FROM equipments_models WHERE equipments_models.equipment_id = "+ id,callback);
}

exports.delete_equipments_models_by_IDS = function(equipment_id, model_id,callback){
    connection.query("DELETE FROM equipments_models WHERE equipments_models.equipment_id = "+ equipment_id + " AND model_id = " + model_id,callback);
}

exports.delete_client = function(id,callback){
    connection.query("DELETE FROM clients WHERE clients.id = "+ id,callback);
}

exports.delete_review = function(id,callback){
    connection.query("DELETE FROM reviews WHERE review_id = "+ id,callback);
}

exports.delete_provider = function(id,callback){
    connection.query("DELETE FROM providers WHERE providers.id = "+ id,callback);
}

exports.delete_check = function(id,callback){
    connection.query("DELETE FROM checks WHERE checks.id = "+ id,callback);
}

// ..todo

exports.delete_images_by_technic_id = function(id,callback){
    connection.query("DELETE FROM images_technics WHERE images_technics.id_technic = "+ id,callback);
}

exports.delete_technic_image_by_id= function(id,callback) {
    connection.query("DELETE FROM images_technics WHERE images_technics.id = "+ id,callback);
}

exports.delete_equipment_image_by_id= function(id,callback){
    connection.query("DELETE FROM images_equipments WHERE images_equipments.id = "+ id,callback);
}

exports.delete_check_technics_by_technic_id = function(id,callback){
    connection.query("DELETE FROM check_technics WHERE check_technics.technic_id = "+ id,callback);
}

exports.delete_images_by_equipment_id = function(id,callback){
    connection.query("DELETE FROM images_equipments WHERE images_equipments.id_equipment = "+ id,callback);
}


exports.delete_check_equipments_by_equipment_id = function(id,callback){
    connection.query("DELETE FROM check_equipments WHERE check_equipments.equipment_id = "+ id,callback);
}

/////////////////

// update methods

exports.update_provider = function(id,provider,callback){
    connection.query("UPDATE providers SET ?"+ provider + "WHERE id = "+ id,callback);
}

exports.update_check = function(id,check,callback){
    connection.query("UPDATE checks SET ?"+ check + "WHERE id = "+ id,callback);
}

exports.update_client = function(id,client,callback){
    connection.query("UPDATE clients SET ? WHERE id = ?", [client,id],callback);
}

exports.update_client_by_phone = function(phone,client,callback){
    connection.query("UPDATE clients SET ?  WHERE phone_number = ?", [client,phone],callback);
}

// exports.update_client_by_hash = function(hash,client,callback) {
//     connection.query("UPDATE clients SET ? "+ client + " WHERE hash = "+ hash,callback);
// }

exports.update_equipments = function(id,equipment,callback){
    connection.query("UPDATE equipments SET ? Where id = ? ", [equipment,id],callback);
}

exports.update_mark_of_technic = function(id,mark,callback){
    connection.query("UPDATE marks_of_technics SET ?"+ mark + "WHERE id = "+ id,callback);
}

exports.update_type_of_technic = function(id,type,callback){
    connection.query("UPDATE types_of_technics SET ?"+ type + "WHERE id = "+ id,callback);
}

exports.update_technic = function(id,technic,callback){
    connection.query("UPDATE technics SET ? Where id = ? ", [technic,id],callback);
}

exports.update_technic_without_category = function(id,technic,callback){
    connection.query("UPDATE technics_without_category SET ? Where id = ? ", [technic,id],callback);
}

exports.update_review = function(id,review,callback){
    connection.query("UPDATE reviews SET ?"+ review + "WHERE id = "+ id,callback);
}