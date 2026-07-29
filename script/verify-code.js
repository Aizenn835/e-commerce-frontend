document.querySelector(".back-arrow").addEventListener("click" , () => {
    document.querySelector(".content").classList.add("content-exit");
    setTimeout(() => {
        window.location.href="forgot-password.html";
    } , 300)
})