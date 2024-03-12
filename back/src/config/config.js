const dotenv = require('dotenv');
dotenv.config();

console.log('@@@@@@@@@@@@', process.env.MYSQL_ROOT_PASSWORD);

module.exports = {
   production: {
      username: 'root',
      password: process.env.MYSQL_ROOT_PASSWORD,
      database: 'database_production',
      host: 'db',
      dialect: 'mysql',
      logging: false,
   },
};
