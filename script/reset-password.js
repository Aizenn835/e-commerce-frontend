const API_URL = "http://localhost:8080";

const param = new URLSearchParams(window.location.search);
const email = param.get("email");

if(!email){
    window.location.href = "forgot-password.html";
}

const resetBtn = document.getElementById("reset-submit-container");
const resetLabel = document.getElementById("reset-btn");

async function resetPassword(){
    const newPasswordInput = document.getElementById("newPasswordInput").value.trim();
    const confirmPasswordInput = document.getElementById("confirmPasswordInput").value.trim();
    
    if( newPasswordInput != confirmPasswordInput || newPasswordInput.length === 0){
        alert("Invalid or mismatch input. Please try again.");
        return;
    }
    try{
        const response = await fetch(`${API_URL}/auth/reset-password` , {
            method: 'PATCH',
            headers:{"Content-Type" : "application/json"},
            body: JSON.stringify({
                email: email,
                password: newPasswordInput
            })
        });
        if(!response.ok){
            alert("Failed to change password. Please try again later");
            const errorData = await response.json();
            console.log("Server says: " + errorData);
            return;
        }
        window.location.href="login.html";
    }catch(error){
        console.log(error);
    }
}

document.querySelector(".back-arrow").addEventListener("click" , () => {
    document.querySelector(".content").classList.add("content-exit");
    setTimeout(() => {
        window.location.href="forgot-password.html";
    } , 300)
})