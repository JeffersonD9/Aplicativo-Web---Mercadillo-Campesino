const cerrarSesion = document.querySelector("#cerrar-sesion");
cerrarSesion.addEventListener("click",async(e)=>{
    e.preventDefault();
    try {
      const cerrar = await fetch("http://localhost:3000/MercadilloBucaramanga/LogOut",{
        method: "POST",
        headers: {
          "Content-type": "application/json",
        }
      }
    );
    const jsonCerrar = await cerrar.json();
    
    if(cerrarSesion.textContent.trim() === "Registrarse"){
      document.location.href = "/MercadilloBucaramanga/Registrar" ;
    }else{
      document.location.href = jsonCerrar.redirect;
    }
    
    } catch (error) {
      console.log(error);
    }
    
})