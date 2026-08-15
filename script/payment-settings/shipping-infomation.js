document.querySelectorAll(".shipping-option").forEach(option => {
    option.addEventListener("click", () => {
        const radio = option.querySelector("input[type='radio']");
        if (radio) radio.checked = true;

        document.querySelectorAll(".shipping-option").forEach(opt => opt.classList.remove("selected"));
        option.classList.add("selected");
    });
});