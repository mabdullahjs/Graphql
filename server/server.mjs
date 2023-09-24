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
        typeDefs: `
            type User {
                id: ID!
                name: String!
                username: String!
                email: String!
                phone: String!
                website: String!
            }
    
            type Todo {
                id: ID!
                title: String!
                completed: Boolean
                user: User
            }
    
            type Query {
                getTodos: [Todo]
                getAllUsers: [User]
                getUser(id: ID!): User
            }
    
        `,
        resolvers: {
          Todo: {
            user: (todo) => users.find((e) => e.id === todo.id),
          },
          Query: {
            getTodos: () => todos,
            getAllUsers: () => users,
            getUser: async (parent, { id }) => users.find((e) => e.id === id),
          },
        },
      });

    app.use(bodyParser.json())
    app.use(cors())

    await server.start()

    app.use('/graphql' , expressMiddleware(server));

    app.listen(5001 , ()=>{
        console.log('server is started on port 5001');
    })
}

startServer()