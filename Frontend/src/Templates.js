var fs = require('fs');
var ejs = require('ejs');


exports.typeOfTechnic = ejs.compile(fs.readFileSync('./Frontend/templates/type_of_technics.ejs', "utf8"));
exports.technicInList = ejs.compile(fs.readFileSync('./Frontend/templates/technic_in_list.ejs', "utf8"));
exports.technicInMenu = ejs.compile(fs.readFileSync('./Frontend/templates/technicInMenu.ejs', "utf8"));
exports.technicInOrder = ejs.compile(fs.readFileSync('./Frontend/templates/technic_in_order.ejs', "utf8"));
exports.equipmentInOrder = ejs.compile(fs.readFileSync('./Frontend/templates/equipment_in_order.ejs', "utf8"));
exports.oneImage = ejs.compile(fs.readFileSync('./Frontend/templates/one_image.ejs', "utf8"));
exports.equipmentInList = ejs.compile(fs.readFileSync('./Frontend/templates/equipment_in_list.ejs', "utf8"));
exports.oneReview = ejs.compile(fs.readFileSync('./Frontend/templates/one_review.ejs', "utf8"));
exports.equipmentCategory = ejs.compile(fs.readFileSync('./Frontend/templates/category.ejs', "utf8"));
