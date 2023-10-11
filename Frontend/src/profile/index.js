exports.userLogged = function (callback) {
    function callback(err, value) {
        if(value) {
            return true;
        } else return false;
    }
    require("../API").isLogIn(callback)
}