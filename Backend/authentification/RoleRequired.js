exports.requiredRole = function(requiredRoles) {
    // requiredRoles is array
    return (req, res, next) => {
        console.log(req.currentUser)
        console.log(req.currentUser.role)

        if (requiredRoles.includes(req.currentUser.role)) {
            return next();
        } else {
            return res.status(401).send('Action not allowed');
        }
    }
}