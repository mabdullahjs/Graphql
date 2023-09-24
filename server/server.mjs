import express from "express";
import {ApolloServer} from '@apollo/server';
import {expressMiddleware} from '@apollo/server/express4';
import bodyParser from "body-parser";
import cors from 'cors';

import {users} from './user.mjs';
import {todos} from './todo.mjs';

const startServer = async ()=>{
    const app = express();
    const server = new ApolloServer({
        typeDefs:`
        type Todo {
            id: ID!
            title: String!
            completed: Boolean
        }

        type Query {
            getTodos: [Todo]
        }
        `,
        resolvers:{
            Query:{
                getTodos: ()=> todos
            }
        }
    })

    app.use(bodyParser.json())
    app.use(cors())

    await server.start()

    app.use('/graphql' , expressMiddleware(server));

    app.listen(5001 , ()=>{
        console.log('server is started on port 5001');
    })
}

startServer()