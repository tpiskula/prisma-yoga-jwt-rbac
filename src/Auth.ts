import * as jwt from 'jsonwebtoken'
import { User, Role, ID_Output } from './generated/prisma'
import { ContextParameters } from "graphql-yoga/dist/src/types";


export interface AuthUser {
    id: ID_Output
    email: String
    name: String
    roles?: Role[]
    scopes?: Scope[]
}
  
export type Scope = 
    'user' |
    'feed' |
    'drafts' |
    'post' |
    'users'
  

export class AuthError extends Error {
    constructor() {
      super('Not authorized')
    }
};

export class Auth {

    context: ContextParameters
    secret: String

    constructor(ctx: ContextParameters, jwtSecret: string) {
        this.context = ctx;
        this.secret = jwtSecret;
    }

    getUser() : AuthUser {
        const Authorization = this.context.request.get('Authorization')
        if (Authorization) {
          const token = Authorization.replace('Bearer ', '')
          const user = jwt.verify(token, this.secret) as User
          return user
        }
        throw new AuthError()
    }

    getUserId() {
        return this.getUser().id
    }
      
      
    checkRole(role: Role) : ID_Output {
        const user = this.getUser()
        if(!user.roles.includes(role))
        {
            throw new AuthError()
        }
        return user.id;
    }
      
    checkScope(scope: Scope) : ID_Output {
        const user = this.getUser()
        if(!user.scopes.includes(scope))
        {
            throw new AuthError()
        }
        return user.id;
    }
};