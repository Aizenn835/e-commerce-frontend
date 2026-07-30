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
        const response = await fetch(`${API_URL}/`) // not finish yet continue tomorrow
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