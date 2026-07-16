const API_URL = "http://localhost:8080";

document.getElementById("submitBody").addEventListener("click" , async () => {

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
        if(!response.ok){
            document.getElementById("emailInput").classList.add("wrong-credentials");
            document.getElementById("passwordInput").classList.add("wrong-credentials");
            return;
        }
        const data = await response.json();
        localStorage.setItem("Token", data.token);
        window.location.href = "/pages/home.html"
        // testing
        console.log(data);
    }catch(error){
        console.log(`Error: ${error}`);
    } 
});


