const jwt = require('jsonwebtoken');
let authService = require('./AuthService')
let db = require('../db');
let {userTrim} = require('../utils')

exports.authenticateToken = async function (req, res, next) {

    let accessToken = req.cookies.jwt;
    let refresh_token = req.cookies.refresh_token;
    console.log(accessToken)
    console.log(refresh_token)
    //if there is no token stored in cookies, the request is unauthorized
    if (!accessToken) {
        if (!refresh_token) {
            return res.status(401).send()
        } else {

            try {

                //use the jwt.verify method to verify the access token
                //throws an error if the token has expired or has a invalid signature
                let payload = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);

                //console.log("email " + payload.data.email);

                if (payload && payload.data && payload.data.phone) {
                    db.get_client_by_phone(payload.data.phone,callback);
                    function callback(err, data) {
                        let user;
                        if (!err && data) user = data[0]
                        if(!user) {
                            return res.status(401).send()
                        }
                        else {
                            req.currentUser = user
                            let token = authService.generateToken(user);
                            let refresh_token = authService.generateRefreshToken(user);
                            //res.json(token);
                            res.cookie("jwt", token, {maxAge: 60000 * 60 * 24}) // 60000 is 1 min
                            res.cookie("phone", user.phone, {maxAge: 60000 * 60 * 24})
                            res.cookie("refresh_token", refresh_token, {maxAge: 60000 * 60 * 24 * 30}) // 60000 is 1 min
                            next();
                        }
                    }

                } else {
                    return res.status(401).send()
                }

            } catch (e) {
                //if an error occured return request unauthorized error
                return res.status(401).send()

            }


            // let token = authService.generateToken(data[0]);
            // let refresh_token = authService.generateToken(data[0]);
            // //res.json(token);
            // res.cookie("jwt", token, {maxAge: 60000 * 60 * 24, secure: true, httpOnly: true}) // 60000 is 1 min
            // res.cookie("refresh_token", token, {maxAge: 60000 * 60 * 24 * 30, secure: true, httpOnly: true}) // 60000 is 1 min
        }
    } else {

        let payload
        try {
            //use the jwt.verify method to verify the access token
            //console.log("access = " + accessToken)
            //throws an error if the token has expired or has a invalid signature


            payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            //console.log("email " + payload.data.email);

            if (payload) {

                db.get_client_by_phone(payload.data.phone,callback2);
                function callback2(err, data) {
                    let user;
                    if (!err && data) user = data[0]

                    if (!user) {
                        res.cookie("jwt", null, {maxAge: -1}) // 60000 is 1 min
                        res.cookie("phone", null, {maxAge: -1})
                        res.cookie("refresh_token", null, {maxAge: -1}) // 60000 is 1 min
                        return res.status(401).send()
                    }
                    else {
                        req.currentUser = user
                        next();
                    }
                }


            } else {
                return res.status(401).send()
            }

        } catch (e) {
            //if an error occured return request unauthorized error
            return res.status(401).send()

        }
    }
}