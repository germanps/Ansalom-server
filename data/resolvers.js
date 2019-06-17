import mongoose from 'mongoose';
import { Usuarios, Libros } from './db';
import { rejects } from 'assert';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

//Generar token auth
dotenv.config({path: 'variables.env'});
const crearToken = (email, secreto, expiresIn) => {
    return jwt.sign({email}, secreto, {expiresIn});
}


export const resolvers = {
    Query: {
        getUsuarios : (root, {limite, offset}) => {
            return Usuarios.find({}).limit(limite).skip(offset)
        },
        getUsuario: (root, {id}) => {
            return new Promise((resolve, object) => {
                Usuarios.findById(id, (error, usuario) => {
                    if(error) rejects(error)
                    else resolve(usuario)
                });
            });
        },
        totalUsuarios: (root) => {
            return new Promise((resolve, object) => {
                Usuarios.countDocuments({}, (error, count) => {
                    if(error) rejects(error)
                    else resolve(count)
                });
            })
        },
        obtenerLibros : (root, {limite, offset}) => {
            return Libros.find({}).limit(limite).skip(offset)
        },
        obtenerLibro : (root, {id}) => {
            return new Promise((resolve, object) => {
                Libros.findById(id, (error, libro) => {
                    if(error) rejects(error)
                    else resolve(libro)
                });
            });
        }
    },
    Mutation: {
        //Usuarios
        crearUsuario : async(root, {input}) => {
            //revisar si existe el email(usuario duplicado)
            const usuarioExistente = await Usuarios.findOne({email: input.email});
            if(usuarioExistente){
                throw new Error("Un usuario con el mismo email ya existe!");
            }
            const nuevoUsuario = await new Usuarios({
                nombre: input.nombre,
                apellido: input.apellido,
                password: input.password,
                email: input.email,
                descargas: input.descargas,
                favoritos: input.favoritos,
                rol: input.rol,
                comentarios: input.comentarios
            });
            nuevoUsuario.id = nuevoUsuario._id;
            return new Promise((resolve, object) => {
                nuevoUsuario.save((error) => {
                    if(error) rejects(error)
                    else resolve(nuevoUsuario)
                })
            });
        },
        actualizarUsuario : (root, {input}) => {
            return new Promise((resolve, object) => {
                Usuarios.findOneAndUpdate( {_id: input.id} , input, {new: true}, (error, usuario) => {
                    if(error) rejects(error)
                    else resolve(usuario)
                });
            });
        },
        eliminarUsuario : (root, {id}) => {
            return new Promise((resolve, object) => {
                Usuarios.findOneAndDelete({_id: id}, (error) => {
                    if(error) rejects(error)
                    else resolve("Registro del usuario eliminado correctamente!")
                });
            });
        },
        autenticarUsuario : async (root, {email, password}) => {
            const emailUsuario = await Usuarios.findOne({email});
            if(!emailUsuario) {
                throw new Error('Usuario no encontrado');
            }
            
            //comparar password que introduce el usuario con el hasheado que esta en mongo
            const passwordCorrecto = await bcrypt.compare(password, emailUsuario.password);
            //incorrecto
            if(!passwordCorrecto){
                console.log('throw error');
                
                throw new Error('Password incorrecto')
            }
            return {
                token: crearToken(emailUsuario, process.env.SECRETO, '604800')//1 week
            }
        },
        //Libros
        nuevoLibro : (root, {input}) => {
            const nuevoLibro = new Libros({
                titulo: input.titulo,
                autor: input.autor,
                genero: input.genero,
                coleccion: input.coleccion,
                cover: input.cover,
                epub: input.epub,
                pdf: input.pdf,
                sinopsis: input.sinopsis
            });
            //mongo crea automaticamente el _id
            nuevoLibro.id = nuevoLibro._id;
            return new Promise((resolve, object) => {
                nuevoLibro.save((error) => {
                    if(error) rejects(error)
                    else resolve(nuevoLibro)
                });
            });
        },
        actualizarLibro : (root, {input}) => {
            return new Promise((resolve, libro) => {
                Libros.findOneAndUpdate({_id :  input.id}, input, {new: true}, (error, libro) => {
                    if(error) rejects(error)
                    else resolve(libro)
                });
            });
        },
        eliminarLibro : (root, {id}) => {
            return new Promise((resolve, object) => {
                Libros.findOneAndDelete({_id: id}, (error) => {
                    if(error) rejects(error)
                    else resolve("Registro del libro eliminado correctamente!")
                })
            });
        }
    }
}

export default resolvers;