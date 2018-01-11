const Sequelize = require('sequelize');


const PG_HOST = process.env.PG_HOST || "localhost";
const PG_PORT = process.env.PG_PORT || "5432";
const PG_USER = process.env.PG_USER || "postgres"; 
const PG_DATABASE = process.env.PG_DATABASE || "logging";
const PG_PASSWORD = process.env.PG_PASSWORD || "root";

global.db = new Sequelize( PG_DATABASE, PG_USER, PG_PASSWORD,{
       host: PG_HOST,
       port: PG_PORT,
       dialect: 'postgres',
       define: {
         underscored: true
       }
});


var Accounts = global.db.define('accounts', {
    account_address: {
    type: Sequelize.STRING
  },
  car_owner_address: {
    type: Sequelize.STRING
  },
  renter_address: {
    type: Sequelize.STRING
  },
}, {
  timestamps: false
});

var Cars = global.db.define('cars', {
   account_address: {
    type: Sequelize.STRING
  },
    car_address : {
    type: Sequelize.STRING
  }}, {
  timestamps: false
});

var Locations = global.db.define('locations', {
   id : {
<<<<<<< HEAD
      type : Sequelize.INTEGER,
=======
      type : sequelize.INTEGER,
>>>>>>> c5a1e7146780f70362755e4d5fb85eb109629ca6
      autoIncrement : true,
      primaryKey: true ,
      allowNull:false
    },
<<<<<<< HEAD
   location_title : Sequelize.TEXT,
   location_string: Sequelize.TEXT
=======
   location_title : sequelize.TEXT,
   location_string: sequelize.TEXT
>>>>>>> c5a1e7146780f70362755e4d5fb85eb109629ca6
});




module.exports = {
              Accounts:Accounts ,
              Cars :Cars,
              Locations : Locations
                          };

global.db.authenticate().then(function(err){
    console.log('Connection to database could be established successfully.');
    global.db.sync().done(function () {
    console.log('DB Synced !');
  });
}).catch(function(err){
    console.error('Unable to connect to the database:', err);
});



