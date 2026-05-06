const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('toughts2', 'root', 'sua_senha_aqui', {
    host: 'localhost',
    dialect: 'mysql'
})

try {
    sequelize.authenticate();
    console.log('Conectamos !!');

}
catch (err) {
    console.log(`Não foi possivel ${err}`);
}


module.exports = sequelize
