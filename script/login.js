const API_URL = "http://localhost:8080";


function errorFunction(message){
    const existingMessage = document.querySelector(".conflict-message");
            if(existingMessage) existingMessage.remove();
            
            const conflictMessage = document.createElement("div");
            conflictMessage.textContent = message;
            conflictMessage.className = "conflict-message";

            document.getElementById("emailInput").classList.add("wrong-credentials");
            document.getElementById("passwordInput").classList.add("wrong-credentials");

            const parent = document.querySelector(".email-container");
            parent.appendChild(conflictMessage);
}


document.getElementById("submitLogin")?.addEventListener("click" , async () => {

const emailInput = document.getElementById("emailInput").value;
const passwordInput = document.getElementById("passwordInput").value; 

    try{
        const response = await fetch(`${API_URL}/auth/login` , {
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email:emailInput,
            password:passwordInput
        })
    }); 
    /* better to create a function because this method is just duplicating in sign up
    and make a different response when a user is not found */
        if(!response.ok){ 
            errorFunction("Wrong email or password");
            return;
        }
        const data = await response.json();
        localStorage.setItem("Token", data.token);
        window.location.href = "/pages/home.html"
    }catch(error){
        console.log(`Error: ${error}`);
    } 
});
document.getElementById("submitSignUp")?.addEventListener("click" , async () => {

const emailInput = document.getElementById("emailInput").value;
const passwordInput = document.getElementById("passwordInput").value; 
const usernameInput = document.getElementById("usernameInput").value;

    try{
        const response = await fetch(`${API_URL}/auth/sign-up` , {
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email:emailInput,
            username: usernameInput,
            password:passwordInput
        })
    }); 
    
        if(response.status === 409){
            errorFunction("This email is already taken!");
            return;
        }
        window.location.href = "/login.html";
    }catch(error){
        console.log(`Error: ${error}`);
    } 
});



