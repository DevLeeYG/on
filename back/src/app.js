const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const cors = require('cors');
const kakaoAuthRouter = require('./routes/kakaoAuth.js');
const { sequelize } = require('./models');

dotenv.config();

const app = express();
app.set('port', process.env.BACK_PORT || 8000);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
   session({
      resave: false,
      saveUninitialized: false,
      secret: process.env.COOKIE_SECRET,
      cookie: {
         httpOnly: true,
         secure: true, // Use `true` for production if serving over HTTPS
      },
   }),
);

sequelize
   .sync({ force: false })
   .then(() => {
      console.log('데이터베이스 연결 성공');
   })
   .catch(err => {
      console.error('데이터베이스 연결 실패:', err);
   });

app.use(
   cors({
      origin: '*', // Allow only specific domain for CORS, replace with your domain
   }),
);

app.use('/', kakaoAuthRouter);

app.listen(app.get('port'), () => {
   console.log(app.get('port'), '번 포트에서 대기 중');
});
