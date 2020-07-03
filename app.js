//Carregando os Modulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyparser = require('body-parser')
const app = express()
const admin = require('./router/admin')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')

//Configurações

    //Sessao

        app.use(session({
            secret: "eschedule",
            resave: true,
            saveUninitialized: true
        }))

        app.use(flash())
    
    //Middleware

        app.use((req, res, next)=>{
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            next()
        })    

    //Body Parser
        app.use(bodyparser.urlencoded({ extended: true }))
        app.use(bodyparser.json())

        //HandleBars
        app.engine('handlebars', handlebars({
            defaultLayout: 'main', helpers: {
                formatDate: (date) => {
                    return moment(date).format('DD/MM/YYYY')
                }
            }
        }))
        app.set('view engine', 'handlebars')

    //Mongoose
        mongoose.Promise = global.Promise
        mongoose.connect('mongodb://localhost/eschedule', {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
            console.log("Conectado ao Banco de dados!")
        }).catch((err) => {
            console.log("Erro ao se conectar: " + err)
        })

        //Public
        app.use(express.static(path.join(__dirname, "public")))

    //Rotas

        app.use('/admin', admin)

    //Outros
        const PORT = 8081
        app.listen(PORT, () => {
            console.log("Servidor Rodando")
        })






