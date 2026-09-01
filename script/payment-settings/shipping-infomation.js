
document.querySelectorAll(".shipping-option").forEach(option => {
    option.addEventListener("click", () => {
        const radio = option.querySelector("input[type='radio']");
        if (radio) radio.checked = true;

        document.querySelectorAll(".shipping-option").forEach(opt => opt.classList.remove("selected"));
        option.classList.add("selected");
    });
});

function continuePayment(){
    document.querySelector(".shipping-body").classList.add("continue-payment");
    setTimeout(() => {
        window.location.href="/pages/payment-settings/payment-information.html";
    }, 500)
}
document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".back-btn").addEventListener("click", () => {
        window.location.href = "/pages/home.html";
    });
});






