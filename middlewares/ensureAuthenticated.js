function ensureAuthenticated(req, res, next) {

console.log(req.isAuthenticated()); // Should log `true` if the user is authenticated
console.log(req.user); // Should log the authenticated user's details
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = { ensureAuthenticated };