import { SearchUser } from "../Services/ServicesUser.js";
import { SearchAdmin } from "../Services/ServicesAdmin.js";

export async function FilterRole(email){

    try {       
        const adminFound = await SearchAdmin(email)    
        const salesFound = await SearchUser(email)
        
        if (adminFound) {
            console.log("es Admin")
            return adminFound.id_Rol

        } else if (salesFound) {
            console.log("es Vendedor")
            return salesFound.id_Rol

        } else {
            return null;
        }
        
    } catch (error) {
        
        console.error("Error al buscar usuario:", error);
        throw error;
    }

}