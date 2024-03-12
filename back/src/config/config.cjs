require('dotenv').config();

module.exports = {
   development: {
      username: 'root',
      password: process.env.MYSQL_ROOT_PASSWORD,
      database: 'database_development',
      host: 'db',
      dialect: 'mysql',
   },
   test: {
      username: 'root',
      password: process.env.MYSQL_ROOT_PASSWORD,
      database: 'database_test',
      host: 'db',
      dialect: 'mysql',
   },
   production: {
      username: 'root',
      password: process.env.MYSQL_ROOT_PASSWORD,
      database: 'database_production',
      host: 'db',
      dialect: 'mysql',
   },
};
