const API_URL = "http://localhost:8080";

const emailInput = document.getElementById("emailInput");
const submitContainer = document.getElementById("submit-container");
const submitBtn = document.getElementById("forgot-btn");

async function submitEmail(){
    const email = emailInput.value.trim();
    console.log(email);
    if(!email){
        alert("Please enter your email");
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailPattern.test(email)){
        alert("Please enter a valid email");
        return;
    }

    submitContainer.style.pointerEvents = "none";
    submitBtn.textContent = "Loading    ...";

    try{
        const response = await fetch(`${API_URL}/password/reset` , {
            method:'POST',
            headers:{'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: email
            })
        });
         window.location.href="verify-code.html?email=" + encodeURIComponent(email);
         submitContainer.style.pointerEvents = "auto";
         submitBtn.textContent = "Send Code";
    }catch(error){
        console.log(error)
    }
}

document.querySelector(".back-arrow").addEventListener("click" , () => {
    document.querySelector(".content").classList.add("content-exit");
    setTimeout(() => {
        window.location.href="login.html";
    } , 300)
})
