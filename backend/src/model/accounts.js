const Sequelize = require('sequelize');


const PG_HOST = process.env.PG_HOST || "baasu.db.elephantsql.com";
const PG_PORT = process.env.PG_PORT || "5432";
const PG_USER = process.env.PG_USER || "biubajng"; 
const PG_DATABASE = process.env.PG_DATABASE || "biubajng";
const PG_PASSWORD = process.env.PG_PASSWORD || "xwaN8EMAb-y7I02mbo1GgHL8d9xZEfxY";

global.db = new Sequelize( PG_DATABASE, PG_USER, PG_PASSWORD,{
		   host: PG_HOST,
		   port: PG_PORT,
		   dialect: 'postgres',
		   define: {
		     underscored: true
		   }
});

module.exports = global.db.define('accounts', {
  account_address: {
    type: Sequelize.STRING
  },
  car_owner_address: {
    type: Sequelize.STRING
  },
  renter_address: {
    type: Sequelize.STRING
  },
  car_address : {
    type: Sequelize.STRING
  }
}, {
  timestamps: false
});


global.db.authenticate().then(function(err){
    console.log('Connection to database could be established successfully.');
    global.db.sync().done(function () {
		console.log('DB Synced !');
	});
}).catch(function(err){
    console.error('Unable to connect to the database:', err);
});



