import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/argon2";
import { nextCookies } from "better-auth/next-js";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { getValidDomains, normalizeName } from "@/lib/utils";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6, // to change minimum password length requirement
    maxPasswordLength: 30, // to change maximum password length requirement
    autoSignIn: true, // by default on successful signUp it automatically signIn s
    password: {
      hash: hashPassword,
      verify: verifyPassword,
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

  session: {
    expiresIn: 30 * 24 * 60 * 60,
  },

  advanced: {
    database: {
      generateId: false, // by default it generates Id itself, 'true' is not an option
    },
  },

  //  plugins: [nextCookies()]
});
