const token =  localStorage.getItem("Token");

if(!token) window.location.href="/login.html";
window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
        const token = localStorage.getItem("Token");
        if (!token) {
            window.location.href = "/login.html";
        }
    }
});