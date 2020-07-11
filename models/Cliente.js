const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Cliente = new Schema({
    nome:{type:String, required: true},
    telefone:{type:String, required: true},
    email:{type:String, required: true},
    cpf:{type:String, required: true},
    cidade:{type:String, required: true},
    estado:{type:String, required: true},
    cep:{type:String, required: true},
    rua:{type:String, required: true},
    bairro:{type:String, required: true},
    numero:{type:String, required: true},
    date: {type: Date, default:Date.now}
})

mongoose.model("clientes", Cliente)