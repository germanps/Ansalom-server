import mongoose, { mongo } from 'mongoose';

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/libreria', {useNewUrlParser: true});
mongoose.set('setFindAndModify', false);

//definir schema de usuarios
const usuariosSchema = new mongoose.Schema({
    nombre: String,
    apellido: String,
    password: String,
    email: String,
    descargas: Number,
    favoritos: Array,
    rol: String,
    comentarios: Array
});
const Usuarios = mongoose.model('usuarios', usuariosSchema);

//definir schema de libros
const librosSchema = new mongoose.Schema({
    titulo: String,
    autor: String,
    genero: String,
    coleccion: String,
    cover: String,
    epub: String,
    pdf: String,
    sinopsis: Array
});
const Libros = mongoose.model('libros', librosSchema);


export { Usuarios, Libros };
