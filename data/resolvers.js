import mongoose from 'mongoose';
import { Usuarios, Libros } from './db';
import { rejects } from 'assert';


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
        }
    },
    Mutation: {
        //Usuarios
        crearUsuario : (root, {input}) => {
            const nuevoUsuario = new Usuarios({
                nombre: input.nombre,
                apellido: input.apellido,
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
        }
    }
}

export default resolvers;