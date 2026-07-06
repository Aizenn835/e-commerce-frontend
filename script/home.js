document.querySelectorAll(".favorite").forEach(btn =>
    btn.addEventListener("click" , (event) => {
        event.stopPropagation();
        btn.classList.toggle("add-favorite");
    })
);
// needs dataset later if connecting to database (Revision)
document.querySelectorAll(".content").forEach((card) => {
    card.addEventListener("click" , () => { 

        const modalOverlay = document.querySelector(".modal-overlay");
        modalOverlay.style.display = "flex";
        modalOverlay.classList.remove("exitOverlay");
        modalOverlay.classList.add("openModal");

        const img = card.querySelector("img").src;
        const category = card.querySelector("h5").textContent;
        const productName = card.querySelector("p").textContent;
        const price = card.querySelector("h4").textContent;
        const rating = card.querySelector(".rating").textContent;

        document.getElementById("modal-id").src = img;
        document.getElementById("category").textContent = category;
        document.getElementById("modal-name").textContent = productName;
        document.getElementById("review-modal").textContent = rating;
        document.getElementById("modal-price").textContent = price;
    })
});
function backdropExit(){
    const modalOverlay = document.querySelector(".modal-overlay");
    modalOverlay.classList.add("exitOverlay");

    modalOverlay.addEventListener("transitionend", () => {
        modalOverlay.style.display = "none";
    }, { once: true });
}