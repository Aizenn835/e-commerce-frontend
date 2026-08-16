const API_URL = "http://localhost:8080";
const token = localStorage.getItem("Token");

document.querySelectorAll(".shipping-option").forEach(option => {
    option.addEventListener("click", () => {
        const radio = option.querySelector("input[type='radio']");
        if (radio) radio.checked = true;

        document.querySelectorAll(".shipping-option").forEach(opt => opt.classList.remove("selected"));
        option.classList.add("selected");

        localStorage.setItem("selectedShipping", option.dataset.price);

        const shippingCost = Number(option.dataset.price);
        updateOrderTotal(shippingCost);
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

function updateOrderTotal(shippingCost) {
    const subtotal = Number(document.getElementById("subtotal").dataset.amount);
    const tax = subtotal * 0.08;

    const total = subtotal + shippingCost + tax;

    const shippingFee = document.getElementById("shipping-value");
    shippingFee.textContent = shippingCost === 0 ? "Free" : `₱${shippingCost.toFixed(2)}`;
    shippingFee.style.color = shippingCost === 0 ? "green" : "gray";
    
    document.getElementById("tax-value").textContent = `₱${tax.toFixed(2)}`;
    document.getElementById("total-value").textContent = `₱${total.toFixed(2)}`;
}



