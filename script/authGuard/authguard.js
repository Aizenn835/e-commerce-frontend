const googleUrl = new URLSearchParams(window.location.search)
const oauth = googleUrl.get("token");

if(oauth){
    localStorage.setItem("Token" , oauth);
    console.log("Replacing URL...");
    window.history.replaceState({} , document.title , window.location.pathname);
}
const token = localStorage.getItem("Token");

// this exits the content if the token is empty/null
if(!token) window.location.href="/login.html";
window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
        const token = localStorage.getItem("Token");
        if (!token) {
            window.location.href = "/login.html";
        }
    }
});