
document.querySelectorAll(".grid-container").forEach(option => {
    option.addEventListener("click", () => {
        const radio = option.querySelector("input[type='radio']");
        if (radio) radio.checked = true;

        document.querySelectorAll(".grid-container").forEach(opt => opt.classList.remove("selected"));
        option.classList.add("selected");

        document.querySelectorAll(".payment-fields").forEach(field => field.style.display = "none");

        const method = option.dataset.method;
        const targetFields = document.getElementById(`${method}-fields`);
        if (targetFields) targetFields.style.display = "block";
    });
});