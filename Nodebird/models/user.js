const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
           id :{
            type : Sequelize.INTEGER(11),
            allowNull :false,
            primaryKey : true,
           },

            email : {
                Sequelize : STRING(40),
                allowNull : true,
                unique : true,
            },
            nick : {
                type : Sequelize.STRING(15),
                allowNull : false,
            },
            password  :{
                type : Sequelize.STRING(100),
                allowNull : false,
            },
            provider : {
                type : Sequelize.STRING(10),
                allowNull : false,
                defaultValue : 'local',
            },
            snsId : {
                type : Sequelize.STRING(30),
                allowNull : true,
            },
        }, {
            sequelize,
            timestamps : true,
            underscoredd : false,
            modelName : 'User',
            tableName : 'users',
            paranoid : true,
            charset : 'utf8',
            collate : 'utf8_general_ci',

        });
    }
    static associate(db) {
        db.User.hasMany(db.Post);
        db.User.belongsToMany(db.User, {
            foreignKey : 'followingId',  //following하는 연예인이 팔로우하는 사람드를 가져오기 위해서면, 팔로윙하는 사람 아이디를 검색해야 하기 때문에 키값을 followingId를 가져온다. 연예인들의 팔로워를 가져와라 할때는 연예인을 검색해야됨! followingId는 연예인 아이디 
            as : 'Followers',  // 연예인의 follwer들을 가져올거기 때문
            through : 'Follow,'
            // User 테이블을 만들었고, User와 Post는 1: N 이기 때문에 Post를 hasMany한다.

        });
        db.User.belongsToMany(db.User, {
            foreignKey : 'follwerId',   //follwer
            as : 'Followings',
            through : 'Follow',  //중간 테이블 명칭
        });
    }

    
    };
//provider : 카카오 로그인의 경우 kakao, 로컬 로그인인 경우 local
//snsId : 카카오 로그인일 때 주어지는 id

    module.exports = User;
