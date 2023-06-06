const Sequelize = require('sequelize');

class Auction extends Sequelize.Model {
  static initiate(sequelize) {
    Auction.init({
      bid: {
        type: Sequelize.INTEGER,


allowNull: false,
defaultValue: 0,
},
msg: {
type: Sequelize.STRING(100),
allowNull: true,
},
}, {
sequelize,
timestamps: true,
paranoid: true,
modelName: 'Auction',
tableName: 'auctions',
charset: 'utf8',
collate: 'utf8_general_ci',
});
}

static associate(db) {
db.Auction.belongsTo(db.User);
db.Auction.belongsTo(db.Good);
}
};

module.exports = Auction;


// const Sequelize = require('sequelize');

// module.exports = class User extends Sequelize.Model{
//     static init(sequelize) {
//         return super.init({
//             email : {
//                 type : Sequelize.STRING(40),
//                 allowNull : false,
//                 unique : true,
//             },
//             nick : {
//                 type : Sequelize.STRING(15),
//                 allowNull : false,
//             },
//             password : {
//                 type : Sequelize.STRING(100),
//                 allowNull : true,
//             },
//             money :{
//                 type : Sequelize.INTEGER,
//                 allowNull :false,
//                 defaultValue : 0,
//             },},{
//                 sequelize,
//                 timestamps : true,
//                 paranoid : true,
//                 modelName : 'User',
//                 tableName : 'user',
//                 charset : 'utf8',
//                 collate : 'utf8_general_ci',
            
//         });
//     }

//     static associate(db){
//         db.Auction.belongsTo(db.User);
//         db.Auction.belongsTo(db.Good);

//     }
// }