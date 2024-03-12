const Sequelize = require('sequelize');
const configs = require('../config/config.js');
const User = require('./user'); // User 모델을 가져옴

const env = process.env.NODE_ENV || 'development';
const config = configs[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

// User 모델을 초기화하고 sequelize에 연결
User.init(sequelize);

// db 객체에 sequelize와 모델을 추가
db.sequelize = sequelize;
db.User = User;

module.exports = db;
