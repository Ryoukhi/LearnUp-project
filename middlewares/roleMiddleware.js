function checkRole(allowedRoles) {
    return (req, res, next) => {
        
        // Check if the user's role is in the allowed roles
        if (!allowedRoles.includes(req.user.role)) {
            return res.redirect("/login");
        }

        next(); // Proceed to the next middleware or route handler
    };
}

module.exports = { checkRole };