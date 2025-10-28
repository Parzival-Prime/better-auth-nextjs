import {auth} from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"

export const {POST, GET} = toNextJsHandler(auth)


// This route receives all api hits through better-auth 

// like
// /api/auth/sign-in
// /api/auth/sign-up
// /api/auth/sign-out
// /api/auth/update-user
// ...and more