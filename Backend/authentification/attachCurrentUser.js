let db = require('../db');
const jwt = require('jsonwebtoken');
const authService = require("./AuthService");


exports.attachCurrentUser = async function (req, res, next) {
    let accessToken = req.cookies.jwt
    let refresh_token = req.cookies.refresh_token;

    if (!accessToken) {
        if (!refresh_token) {
            return res.status(401).send()
        } else {

            try {

                let payload = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);

                if (payload && payload.data && payload.data.phone) {
                    db.get_client_by_phone(payload.data.phone,callback);
                    function callback(err, data) {
                        let user;
                        if (!err && data) user = data[0]
                        if(!user) {
                            return res.status(401).send()
                        }
                        else {
                            req.currentUser = user;
                            let token = authService.generateToken(user);
                            let refresh_token = authService.generateRefreshToken(user);
                            res.cookie("jwt", token, {maxAge: 60000 * 60 * 24}) // 60000 is 1 min
                            res.cookie("phone", user.phone_number, {maxAge: 60000 * 60 * 24})
                            res.cookie("refresh_token", refresh_token, {maxAge: 60000 * 60 * 24 * 30}) // 60000 is 1 min
                            next()
                        }
                    }
                } else {
                    return res.status(401).send()
                }

            } catch (e) {
                return res.status(401).send()

            }
        }
    } else {

        let payload
        try {

            payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

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
                        req.currentUser = user;
                        next();
                    }
                }
            } else {
                return res.status(401).send()
            }

        } catch (e) {
            return res.status(401).send()
        }
    }

}
