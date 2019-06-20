import express from 'express';
// graphql
import {ApolloServer} from 'apollo-server-express';
import { typeDefs } from './data/schema';
import { resolvers } from './data/resolvers';
import dotenv from 'dotenv';
dotenv.config({path: 'variables.env'});
import jwt from 'jsonwebtoken';


const app = express();
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async({req}) => {
        //obtener token
        const token = req.headers['authorization'];
        if(token !== "null"){
            try {
                //verificar el token del frontend
                const usuarioActual = await jwt.verify(token, process.env.SECRETO);
                //agregar el usuario actual al request
                req.usuarioActual = usuarioActual;
                return {
                    usuarioActual
                }
            } catch (err) {
                console.error(err);
            }
        }
        
    }
    
});

server.applyMiddleware({app});

app.listen({port: 4000}, () => console.log(`Servidor funcionando satisfactoriamente en ${server.graphqlPath}`))
