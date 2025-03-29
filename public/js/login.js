

const forminciarSesion = document.querySelector('[data-inicio-sesion]');
const inputs = document.querySelectorAll('[data-inicio-sesion] input');
const mensajeError = document.querySelector(".error");

//asignmos el evento para cada input
inputs.forEach((input) => {
  console.log(input)
  input.addEventListener("keyup", eliminarError);
  input.addEventListener("blur", eliminarError);
});


function eliminarError(){
   mensajeError.classList.toggle("escondido",true);
}

async function iniciarSesion(e){
    e.preventDefault();
    let Email = (document.getElementById('email').value).trim();
    let Password = (document.getElementById('password').value).trim();
    try{
        const registroInicio = await fetch(
            "http://localhost:3000/MercadilloBucaramanga/Login",
            {
              method: "POST",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify({
                Email,
                Password
              }),
            }
          );
            const jsonInicio = await registroInicio.json();
          if(!registroInicio.ok){

            return mensajeError.classList.toggle("escondido",false);

          }
          window.location.href = jsonInicio.redirect;
          
          
    }catch(e){
        console.log(e.message);
    }
    



}



forminciarSesion.addEventListener("submit",(e)=>{iniciarSesion(e)});