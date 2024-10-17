const cookie = require("cookie");


exports.getLogin = (req, res, next) => {
  var cookies = cookie.parse(req.headers.cookie || "");

res.render('auth/login', {
  path: '/login',
  pageTitle: 'Login',
  isAuthenticated: cookies.loggedIn
});

};

exports.postLogin = (req, res, next) => {
    //res.setHeader('Set-Cookie', 'loggedIn=true; Max-Age=10');

    res.setHeader(
      "Set-Cookie",
      cookie.serialize("loggedIn", true), {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 1 week
      }),
    
    res.redirect('/');
  };