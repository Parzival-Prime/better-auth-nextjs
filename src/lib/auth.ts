import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/argon2";
import { nextCookies } from "better-auth/next-js";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { getValidDomains, normalizeName } from "@/lib/utils";
import { UserRole } from "@/generated/prisma/enums";
import { admin } from "better-auth/plugins";
import {ac, roles} from "@/lib/permissions"
import sendEmail from "@/lib/resend"

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6, // to change minimum password length requirement
    maxPasswordLength: 30, // to change maximum password length requirement
    autoSignIn: false, // by default on successful signUp it automatically signIn 
    autoSignUp: false,
    password: {
      hash: hashPassword,
      verify: verifyPassword,
    },
    requireEmailVerification: true
  },

  emailVerification: {
    sendOnSignUp: true,
    expiresIn: 60 * 5,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async({user, url})=>{
      console.log("sending verification mail to: ", user.email)
      await sendEmail({
        email: user.email,
        subject: "Verify your email address",
        message: "Please verify you email to complete your verification.",
        url: String(url)
      })
    }
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string
    },
  },

  user: {
    additionalFields: {
      role: {
        type: ["USER", "ADMIN"] as Array<UserRole>,
        input: false,
      },
      username: {
        type: "string",
      },
    },
  },

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const email = String(ctx.body.email);
        const domain = email.split("@")[1];
        if (!getValidDomains().includes(domain)) {
          throw new APIError("BAD_REQUEST", {
            message: "please use a valid email domain.",
          });
        }
        const name = normalizeName(ctx.body.name);

        return {
          context: {
            ...ctx,
            body: {
              ...ctx.body,
              name,
            },
          },
        };
      }
    }),
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const adminEmails = process.env.ADMIN_EMAILS?.split(";") ?? [];

          if (adminEmails.includes(user.email)) {
            return { data: { ...user, role: UserRole.ADMIN } };
          }

          return { data: user };
        },
      },
    },
  },

  session: {
    expiresIn: 30 * 24 * 60 * 60,
  },

  account: {
    accountLinking: {
      enabled: false
    },
  },

  advanced: {
    database: {
      generateId: false, // by default it generates Id itself, 'true' is not an option
    },
  },

   plugins: [
    // nextCookies(),
    admin({
      defaultRole: UserRole.USER,
      adminRoles: [UserRole.ADMIN],
      ac,
      roles
    })
   ]
});
