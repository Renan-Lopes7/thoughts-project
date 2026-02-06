const { where } = require('sequelize');
const Tought = require('../models/Toughts');
const User = require('../models/User');


//vou ter que chamar um operador que me permite criar uma consulta de "like" "like" no msql e uma busca de filtro 
//palavras que contenham oque eu busquei exemplo "tão" viram palavras que tenham então
const { Op } = require('sequelize');


module.exports = class ToughtController {
    static async showToughts(req, res) {

        let search = ''

        //verifico se chegou alguma coisa ! se chegar armazeno ela em uma variavel
        if (req.query.search) {
            search = req.query.search
        }               //se veio eu vou ter quer filtrar isso 

        let order = 'DESC'  //temos quer ver das mais novas pras mais velhas

        if (req.query.order === 'old') { //se vinher pela requisição
            order = 'ASC' //ascendente
        } else {
            order = 'DESC'
        }


        const toughtsData = await Tought.findAll({
            include: User,
            where: {
                title: { [Op.like]: `%${search}%` },  //e coloco como quero filtrar esse like as porcentagens indicam corigam palavras começo meio e fim
            },
            //pra definir isso eu posso eu tenho um atributo chamado order tbm
            order: [["createdAt", order]] //essa coluna agente não criou mais o sequelize cria automaticamente pra gente
        })


        const toughts = toughtsData.map((result) => result.get({ plain: true })); //plain todos eles vão ser jogados no mesmo array

        //quantos resultados teve na busca dele
        let toughtsQti = toughts.length

        if (toughtsQti === 0) {
            toughtsQti = false
        }


        res.render('toughts/home', { toughts, search, toughtsQti });
    }

    static async dashboard(req, res) {
        const Userid = req.session.userid

        const user = await User.findOne({ where: { id: Userid }, include: Tought, plain: true }) //plain pra poder vim so os dados interessantes

        //check if user exist
        if (!user) {
            res.redirect('/login')
        }

        //manipulação de dados pra instrair so as tarefas pensamentos // map serve pra modificar uns itens do array
        const toughts = user.Toughts.map((result) => result.dataValues);

        let emptyToughts = false

        if (toughts.length === 0) {
            emptyToughts = true
        }

        res.render('toughts/dashboard', { toughts, emptyToughts });
    }

    static createTought(req, res) {
        res.render('toughts/create');
    }


    static async createToughtSave(req, res) {
        const tought = {
            title: req.body.title,
            UserId: req.session.userid
        }

        try {
            await Tought.create(tought);

            req.flash('message', 'Pensamento criado com sucessso !');


            req.session.save(() => {
                res.redirect('/toughts/dashboard');

            })
        } catch (err) {
            console.log(err);

        }
    }

    static async removeTought(req, res) {
        const id = req.body.id
        const userId = req.session.userid

        try {
            await Tought.destroy({ where: { id: id, userId: userId } })
            req.flash('message', 'Pensamento removido !');

            req.session.save(() => {
                res.redirect('/toughts/dashboard');

            })

        } catch (err) {
            console.log(err)
        }

    }
    static async updateTought(req, res) {
        const id = req.params.id

        const tought = await Tought.findOne({ where: { id: id }, raw: true })
        res.render('toughts/edit', { tought });

    }

    static async updateToughtSave(req, res) {
        const id = req.body.id

        const tought = {
            title: req.body.title,     //aqui pegamos oque o usu mandou no body e colocamos em uma variavel 
        }

        try {
            await Tought.update(tought, { where: { id: id } })

            req.flash('message', 'Pensamento atualizado com sucessso !');

            req.session.save(() => {
                res.redirect('/toughts/dashboard');

            })
        } catch (err) {
            console.log(err)
        }

    }

}


