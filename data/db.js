import mongoose, { mongo } from 'mongoose';
import bcrypt from 'bcrypt';

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
//hashear passwords antes de guardarlos
usuariosSchema.pre('save', function(next){
    //si el password no esta modificado ejecutar
    if(!this.isModified('password')){
        return next();
    }
    bcrypt.genSalt(10, (err, salt) => {
        if(err) return next(err);
        bcrypt.hash(this.password, salt, (err, hash) => {
            if(err) return next(err);
            this.password = hash;
            next();
        })
    })
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
