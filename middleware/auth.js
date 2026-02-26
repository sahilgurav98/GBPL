function isAuthenticated(req, res, next) {
    if (req.session.userId) return next();
    res.redirect('/login');
}

function isAdmin(req, res, next) {
    if (req.session.isAdmin) return next();
    res.status(403).send("Access Denied: Admin only.");
}

module.exports = { isAuthenticated, isAdmin };