const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Cliente')
const Cliente = mongoose.model('clientes')
require('../models/Agendamento')
const Agendamento = mongoose.model('agendamentos')

//Rotas de Clientes
router.get('/clientes', (req, res) => {
    Cliente.find().sort({ date: "desc" }).lean().then((clientes) => {
        res.render('admin/clientes', { clientes: clientes })
    }).catch((err) => {
        req.flash('error_msg', 'Ocorreu um erro ao listar os clientes')
        res.redirect('/admin/clientes')
    })

})

router.get('/clientes/add', (req, res) => {
    res.render('admin/addclientes')
})

router.post('/clientes/novo', (req, res) => {

    const newCliente = {
        nome: req.body.nome,
        telefone: req.body.telefone,
        email: req.body.email,
        cpf: req.body.cpf,
        cidade: req.body.cidade,
        estado: req.body.estado,
        cep: req.body.cep,
        rua: req.body.rua,
        bairro: req.body.bairro,
        numero: req.body.numero

    }

    new Cliente(newCliente).save().then(() => {
        req.flash('success_msg', 'Cliente Adicionado com Sucesso!!')
        res.redirect("/admin/clientes")
    }).catch((err) => {
        req.flash('error_msg', 'Não foi possivel adicionar um novo Cliente!!')
        res.redirect('/admin/clientes')
    })
})

router.get('/clientes/edit/:id', (req, res) => {
    Cliente.findOne({ _id: req.params.id }).lean().then((cliente) => {
        res.render('admin/editclientes', { cliente: cliente })
    }).catch((err) => {
        req.flash("error_msg", "Cliente não encontrado")
        res.redirect("/admin/clientes")
    })

    router.post('/clientes/edit', (req, res) => {
        Cliente.findOne({ _id: req.body.id }).then((cliente) => {

            cliente.nome = req.body.nome
            cliente.telefone = req.body.telefone
            cliente.email = req.body.email
            cliente.cpf = req.body.cpf
            cliente.cidade = req.body.cidade
            cliente.estado = req.body.estado
            cliente.cep = req.body.cep
            cliente.rua = req.body.rua
            cliente.bairro = req.body.bairro
            cliente.numero = req.body.numero

            cliente.save().then(() => {
                req.flash('success_msg', 'Cliente editado com Sucesso')
                res.redirect('/admin/clientes')
            }).catch((err) => {
                req.flash('error_msg', 'Ocorreu um erro ao editar o clientes')
                res.redirect('/admin/clientes')
            })

        }).catch((err) => {
            req.flash('error_msg', 'Ocorreu um erro ao Editar o cliente')
            res.redirect('/admin/clientes')
            console.log(err)
        })

    })

})

router.post('/clientes/deletar', (req, res) => {
    Cliente.deleteOne({ _id: req.body.id }).then(() => {
        req.flash('success_msg', "Cliente removido com sucesso")
        res.redirect('/admin/clientes')
    }).catch((err) => {
        req.flash('error_msg', 'Ocorreu um erro ao remover o cliente')
    })
})

//Agendamentos

router.get('/agendamentos', (req, res) => {
    Agendamento.find().lean().populate('clientes').sort({ date: "desc" }).then((agendamentos) => {
        res.render('admin/agendamentos', { agendamentos: agendamentos })
    }).catch((err) => {
        req.flash('error_msg', 'Ocorreu um erro ao listar os Serviços Agendados')
        res.redirect('/admin/agendamentos')
    })

})

router.get('/agendamentos/add', (req, res) => {
    Cliente.find().lean().then((clientes) => {
        res.render('admin/addagendamento', { clientes: clientes })
    }).catch((err) => {
        req.flash('error_msg', 'Ocorreu um erro ao carregar o formulario de agendamentos')
        res.redirect('/admin/agendamentos')
    })

})

router.post('/agendamentos/nova', (req, res) => {

    const newAgendamento = {
        placa: req.body.placa,
        modelo: req.body.modelo,
        descricao: req.body.desc,
        tipo: req.body.tipo,
        data: req.body.data,
        responsavel: req.body.responsavel,
        clientes: req.body.clientes
    }

    new Agendamento(newAgendamento).save().then(() => {
        req.flash('success_msg', 'Agendamento Adicionado com Sucesso!!')
        res.redirect("/admin/agendamentos")
    }).catch((err) => {
        req.flash('error_msg', 'Não foi possivel adicionar um novo Agendamento!!')
        res.redirect('/admin/agendamentos')
    })

})

router.get('/agendamentos/edit/:id', (req, res) => {
    Agendamento.findOne({ _id: req.params.id }).lean().then((agendamento) => {
        Cliente.find().lean().then((clientes) => {
            res.render('admin/editagendamentos', { clientes: clientes, agendamento: agendamento })
        }).catch((err) => {
            req.flash('error_msg', 'Ocorreu um erro ao listar o serviço')
            res.redirect('/admin/agendamentos')
        })

    }).catch((err) => {
        req.flash('error_msg', 'Erro ao carregar o Serviço')
        res.redirect('/admin/agendamentos')
    })

})

router.post('/agendamentos/edit', (req, res) => {
    Agendamento.findOne({ _id: req.body.id }).then((agendamento) => {
        agendamento.placa = req.body.placa,
            agendamento.modelo = req.body.modelo,
            agendamento.tipo = req.body.tipo,
            agendamento.data = req.body.data,
            agendamento.descricao = req.body.desc,
            agendamento.responsavel = req.body.responsavel,
            agendamento.clientes = req.body.clientes

        agendamento.save().then(() => {
            req.flash('success_msg', 'Agendamento editado com Sucesso')
            res.redirect('/admin/agendamentos')
        }).catch((err) => {
            console.log(err)
            req.flash('error_msg', 'Ocorreu Interno')
            res.redirect('/admin/agendamentos')
        })
    }).catch((err) => {
        req.flash('error_msg', 'Ocorreu um erro ao editar o Agendamento')
        res.redirect('/admin/agendamentos')
        console.log(err)
    })
})

router.post('/agendamentos/deletar', (req, res) => {
    Agendamento.deleteOne({ _id: req.body.id }).then(() => {
        req.flash('success_msg', "Agendamento removido com sucesso")
        res.redirect('/admin/agendamentos')
    }).catch((err) => {
        req.flash('error_msg', 'Ocorreu um erro ao remover o Agendamento')
        res.redirect('/admin/agendamentos')
    })
})

module.exports = router