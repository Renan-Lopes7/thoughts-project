const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('toughts2', 'root', 'lopeslopes', {
    host: 'localhost',
    dialect: 'mysql'
})

try {
    sequelize.authenticate();
    console.log('conectamos !!');

}
catch (err) {
    console.log(`nao foi possivel ${err}`);
}


module.exports = sequelize