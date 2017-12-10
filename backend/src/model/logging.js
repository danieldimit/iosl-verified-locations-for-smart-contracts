const Sequelize = require('sequelize');


const PG_HOST = process.env.PG_HOST || "baasu.db.elephantsql.com";
const PG_PORT = process.env.PG_PORT || "5432";
const PG_USER = process.env.PG_USER || "biubajng"; 
const PG_DATABASE = process.env.PG_DATABASE || "biubajng";
const PG_PASSWORD = process.env.PG_PASSWORD || "xwaN8EMAb-y7I02mbo1GgHL8d9xZEfxY";

var database = new Sequelize( PG_DATABASE, PG_USER, PG_PASSWORD,{
		   host: PG_HOST,
		   port: PG_PORT,
		   dialect: 'postgres',
		   define: {
		     underscored: true
		   }
});

var logging = global.db.define('accounts', {
  account_address: {
    type: Sequelize.STRING
  },
  car_owner_address: {
    type: Sequelize.STRING
  },
  renter_address: {
    type: Sequelize.STRING
  }
}, {
  timestamps: false
});


module.exports ={
	sequelize: Sequelize, 
	db: database,
	logging : logging
};

database.sync().done(function () {
	console.log('DB Synced !');
});
