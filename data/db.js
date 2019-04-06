import mongoose from 'mongoose';

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/libreria', {useNewUrlParser: true});

//definir schema de usuarios
const usuariosSchema = new mongoose.Schema({
    nombre: String,
    apellido: String,
    email: String,
    descargas: Number,
    favoritos: Array,
    rol: String,
    comentarios: Array
});

const Usuarios = mongoose.model('usuarios', usuariosSchema);
export { Usuarios };
