const path = require('path');

// 3. taraf apileri import etme
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

// routes import etme
const adminRoutes = require('./routes/admin'); 
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

// kendi uretigimiz modulleri import etme
const errorController = require('./controllers/error');
const User = require('./models/user');

//db baglantisi
const MONGODB_URI =
  'mongodb://localhost:27017/shop';

const app = express();

//session apisini kullanma 
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

app.set('view engine', 'ejs'); //html sablonunun secimi
app.set('views', 'views'); // hangi klasorun view klasoru olacak




app.use(bodyParser.urlencoded({ extended: false })); 
app.use(express.static(path.join(__dirname, 'public'))); // herhangi bir klasoru webe acma

//session apisini aktif etme // app.use
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

app.use((req, res, next) => {
  
  if (!req.session.user) { //session a eklenen user yoksa next ile sonraki satira gecer
    return next();
  }
  
  User.findById(req.session.user._id) // sessiondan gelen user._id li user dbde varsa
    .then(user => { // findById() den promise ile gelen user verisi
      if (!user) {
         throw new Error('User nothing');
      }
      req.user = user; // req objesine deger ekleniyor req.user = user objesi ekleniyor
      next();
    })
    .catch(err => console.log(err));
});

//routes klasorunden gelen route dosyalari cagriliyor
app.use('/admin', adminRoutes); // '/admin', route-dosya-adi burada '/admin/' on ektir
app.use(shopRoutes); // www.localhost:3000/admin/herhangibiryol
app.use(authRoutes);
 
app.use(errorController.get404);

//mongodb veritabanina mongoose ile baglanma
mongoose.set('useCreateIndex', true); // otomatik index tanimlama

const intialDbConnection = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).then(()=> {
      
      app.listen(3000);
    }).catch(err => console.log(err));

    
    
  }
  catch (error) {
    console.error(error);
  }
}

intialDbConnection()
.then(() => console.log('connected'))