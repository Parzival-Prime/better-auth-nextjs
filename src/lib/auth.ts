import {betterAuth} from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import {prisma} from "@/lib/prisma"
import { hashPassword, verifyPassword } from '@/lib/argon2'
import { nextCookies } from 'better-auth/next-js'


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),

    emailAndPassword: {
        enabled: true,
        minPasswordLength: 6,    // to change minimum password length requirement
        maxPasswordLength: 30,    // to change maximum password length requirement
        autoSignIn: true,       // by default on successful signUp it automatically signIn s    
        password: {
            hash: hashPassword,
            verify: verifyPassword
        }
    },

     advanced: {
        database: {
            generateId: false,   // by default it generates Id itself, 'true' is not an option
        }
     },

    //  plugins: [nextCookies()]
})