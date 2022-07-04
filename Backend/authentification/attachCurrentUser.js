var db = require('../db');
const jwt = require('jsonwebtoken');

exports.attachCurrentUser = function(req, res, next) {
    let accessToken = req.cookies.jwt

    //if there is no token stored in cookies, the request is unauthorized
    if (!accessToken){
        return res.status(403).send()
    }

    let payload
    try{
        payload = jwt.verify(accessToken, 'secret_$rsf@fsdioensa24sg,2')
        console.log(payload)
        console.log(payload.phone_number)
        function callback(error,data) {
            if (error){
                return res.status(401).end(error.sqlMessage);
            }
            else {
                console.log(data)
                console.log("data" + data[0])
                req.currentUser = data[0];
                if(req.currentUser)
                    return next();
                else
                    return res.status(401).end('User not found');
            }
        }
        db.get_client_by_phone(payload.data.phone_number,callback);
    }
    catch(e){
        //if an error occured return request unauthorized error
        return res.status(401).send()
    }

}
