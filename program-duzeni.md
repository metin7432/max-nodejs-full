
auth.js guvenli login olma

app.use() butun gelen isteklerde aktif olur.
app.get('/rota') verilen rota girildiginde calisir.
app.post('/rota') verilen rota girildiginde veri gonderir.

// herhangi bir klasoru webe acma
app.use(express.static(path.join(__dirname'klasor-adi')));

// buferdan gelen degeri normale cevirme
app.use(bodyParser.urlencoded({ extended: false })); 

//html sablonunun secimi
app.set('view engine', 'ejs'); 

// hangi klasorun view klasoru olacak
app.set('views', 'views'); 

User.findOne({ email: email }) // tarayicidan gelen email ile dbde bu eamil user bulunursa

const user = new User({
email: email, //modelde tanimlanan alanlara(satirlar) tarayicidan gelen degerleri ekleme
           
          });

