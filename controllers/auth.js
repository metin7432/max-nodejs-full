const User = require('../models/user');
const bcrypt = require('bcryptjs')

// login sayfasini getir 
exports.getLogin = (req, res, next) => {
  res.render('auth/login', { // views deki auth/login.js webe tasima
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false 
  });
};

//user kayit sayfasini getirme
exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false
  });
};

//User kaydi ekleme
exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  // tarayicidan gelen email ile dbde bu emaili user bulunursa
  User.findOne({ email: email }) 
    .then(userDoc => {
      if (userDoc) { // user zaten kayit olmus ve dbde var
        return res.redirect('/signup'); //kayit sayfasina yonlendirme
      }

      //password sifreleme
      return bcrypt
        .hash(password, 12) //promise donuyor ve tarayicidan gelen password dbye sifreli aktariliyor
        .then(hashedPassword => {

          // modelden gelen User.jsten bir user nesnesi olusturuluyor 
          const user = new User({
            email: email, //modelde tanimlanan alanlara(satirlar) tarayicidan gelen degerleri ekleme
            password: hashedPassword, //hashlenen password yaziliyor
            cart: { items: [] }
          });
          return user.save(); // dbye obje dokuman(satir) olarak ekleniyor
        })
        .then(result => {
          res.redirect('/login'); // kayit tamamlandiktan sonra giris sayfasina yonlendirme
        });
    })
    .catch(err => {
      console.log(err);
    });
};

// webe sitesine login olma
exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({email: email}) // email kime ait bul
    .then(user => {

      if(!user) { 
        return res.redirect('/login') // user yoksa  /logine yonlendir
      };

      // login bilgilerini dogruluma ve req objesine session aktarma
      bcrypt.compare(password, user.password) //tarayicidan gelen deger ile dbden gelen password karsilastir
      .then(doMatch => {
        if (doMatch) { // eger bilgiler dogruysa req.session.aktarilacakdegerler aktar
          req.session.isLoggedIn = true; //dogrulandiysa isLoggedIn true degerini atma
          req.session.user = user; // dbden gelen user verisi sessiona aktariliyor

         return req.session.save((err) => { // session tarayiciya kaydediliyor
           console.log(err);
           res.redirect('/'); // anasayfaya yonlendiriliyor
            
           });
           };
           res.redirect('/login') // login bilgileri dogru degilse /login'e yonlendiriliyor
      })
      .catch(err => console.log(err))
    })
    .catch(err => console.log(err));
};

// logout olma
exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
