// var jwt = require('express-jwt');
//
// const getTokenFromHeader = (req) => {
//     if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
//         return req.headers.authorization.split(' ')[1];
//     }
// }
//
// module.exports = jwt({
//     secret: 'secret_$rsf@fsdioensa24sg,2',
//     userProperty: 'token', // Здесь следующее промежуточное ПО сможет найти то, что было закодировано в generateToken -> 'req.token'
//     getToken: getTokenFromHeader, // Функция для получения токена аутентификации из запроса
// })

const jwt = require('jsonwebtoken');

exports.authenticateToken = function(req, res, next) {
    // const authHeader = req.headers['authorization']
    // const token = authHeader && authHeader.split(' ')[1]
    //
    // if (token == null) return res.sendStatus(401)
    //
    // jwt.verify(token, 'secret_$rsf@fsdioensa24sg,2', (err, user) => {
    //     console.log(err)
    //
    //     if (err) return res.sendStatus(403)
    //
    //     req.user = user
    //
    //     next()
    // })

    let accessToken = req.cookies.jwt

    //if there is no token stored in cookies, the request is unauthorized
    if (!accessToken){
        return res.status(403).send()
    }

    let payload
    try{
        //use the jwt.verify method to verify the access token
        //throws an error if the token has expired or has a invalid signature
        payload = jwt.verify(accessToken, 'secret_$rsf@fsdioensa24sg,2')
        //console.log('pay'+payload)
        next()
    }
    catch(e){
        //if an error occured return request unauthorized error
        return res.status(401).send()
    }
}