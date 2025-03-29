import { Strategy } from "passport-local";

export const Login = new Strategy({
    usernameField: "Email",
    passwordField: "Password"

},async (email,password,done)=>{
    try {
        
    } catch (error) {
        
    }
}
)