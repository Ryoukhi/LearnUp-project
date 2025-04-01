function checkRole(allowedRoles) {
    return (req, res, next) => {
        
        // Check if the user's role is in the allowed roles
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).send("Accès refusé. Vous n'avez pas les autorisations nécessaires.");
        }

        next(); // Proceed to the next middleware or route handler
    };
}

module.exports = { checkRole };