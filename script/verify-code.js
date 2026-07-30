const API_URL = "http://localhost:8080";

const param =  new URLSearchParams(window.location.search);
const email = param.get("email");

if(!email){
    window.location.href="forgot-password.html";
}

const verifyBtn = document.getElementById("verify-submit-container");
const verifyLabel = document.getElementById("verify-btn");
const codeInput = document.getElementById("codeInput");
document.querySelector(".user-email").textContent = email;
async function verifyCode(){
    const code = codeInput.value.trim();

    if(!code){
        alert("Please enter a  code");
        return;
    }
    if(!/^\d{6}$/.test(code)){
        alert("Please enter the  6-digit code");
        return;
    }
    verifyBtn.style.pointerEvents = "none";
    verifyLabel.textContent = "Verifying...";

    try{
        const response = await fetch(`${API_URL}/password/verify-code` , {
            method:'POST',
            headers:{"Content-Type": 'application/json'},
            body: JSON.stringify({ email , code })
        });

        if(!response.ok){
            alert("Invalid or expired code. Please try again.");
            verifyBtn.style.pointerEvents = "auto";
            verifyLabel.textContent = "Verify Code";
            return;
        }
        window.location.href= "reset-password.html?email=" + encodeURIComponent(email);
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