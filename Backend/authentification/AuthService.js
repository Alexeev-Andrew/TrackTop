let jwt = require('jsonwebtoken');

exports.generateToken = function(user) {

    const data =  {
        id: user.id,
        name: user.name,
        phone_number: user.phone_number,
        // role: user.role ? user.role : "user"
    };
    const signature = 'secret_$rsf@fsdioensa24sg,2';
    const expiration = '1h';

    return jwt.sign({ data, }, signature, { expiresIn: expiration });

}

