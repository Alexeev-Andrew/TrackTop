let jwt = require('jsonwebtoken');
require('dotenv').config();


exports.generateToken = function(user) {

    const data =  {
        id: user.id,
        phone: user.phone_number,
        // role: user.role ? user.role : "user"
    };

    return jwt.sign({ data, }, process.env.ACCESS_TOKEN_SECRET);

}

exports.generateRefreshToken = function(user) {

    const data =  {
        id: user.id,
        phone: user.phone_number,
        // role: user.role ? user.role : "user"
    };

    return jwt.sign({ data, }, process.env.REFRESH_TOKEN_SECRET);

}

// const isTokenValid = (token) => jwt.verify(token, ACCESS_TOKEN_SECRET);
//
// const attachCookiesToResponse = ({ res, user, refreshToken }) => {
//     const accessTokenJWT = generateToken(user);
//     const refreshTokenJWT = createJWT({ payload: { user, refreshToken } });
//
//     const oneDay = 1000 * 60 * 60 * 24;
//     const longerExp = 1000 * 60 * 60 * 24 * 30;
//
//     res.cookie('accessToken', accessTokenJWT, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//         signed: true,
//         expires: new Date(Date.now() + oneDay),
//     });
//
//     res.cookie('refreshToken', refreshTokenJWT, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//         signed: true,
//         expires: new Date(Date.now() + longerExp),
//     });
// };




