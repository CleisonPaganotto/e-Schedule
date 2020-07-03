const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Agendamento = new Schema({
    placa:{type:String, required: true},
    modelo:{type: String, required: true},
    data:{type: String,required:true},
    descricao:{type: String, required: true},
    tipo:{type: String, required: true},
    responsavel:{type: String, required: true},
    date:{type:Date, default:Date.now()},
    clientes:{type:Schema.Types.ObjectId, ref: 'clientes', required: true}
})

mongoose.model('agendamentos', Agendamento)