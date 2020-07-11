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
require('./models/Agendamento')
const Agendamento = mongoose.model('agendamentos')

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
        
        app.get('/', (req, res) => {
            Agendamento.find().lean().populate('clientes').sort({date: 'desc'}).then((agendamentos)=>{
                res.render('index', {agendamentos:agendamentos})
            })
            
        })

        app.get('/agendamento/:responsavel',(req, res)=>{
            Agendamento.findOne({responsavel: req.params.responsavel}).lean().then((agendamento)=>{
                if (agendamento) {
                    res.render('agendamento/index', {agendamento:agendamento})
                }else{
                    req.flase('error_msg', 'Este serviço não existe')
                    res.redirect('/')
                }
            }).catch((err)=>{
                req.flash('error_msg', 'Ocorreu um erro interno')
                res.redirect('/')
            })

        })


        app.use('/admin', admin)

    //Outros
        const PORT = 8081
        app.listen(PORT, () => {
            console.log("Servidor Rodando")
        })






