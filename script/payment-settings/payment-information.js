const API_URL = "http://localhost:8080";
const token = localStorage.getItem("Token");

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

function backShipping(){
    document.querySelector(".payment-body").classList.add("continue-payment");
    setTimeout(() => {
        window.location.href="/pages/payment-settings/shipping-information.html";
    }, 500)
}

document.addEventListener("DOMContentLoaded", () => {
    const shippingCost = Number(localStorage.getItem("selectedShipping")) || 0;
    updateOrderTotal(shippingCost);
});

function updateOrderTotal(shippingCost) {
    const subtotal = Number(document.getElementById("subtotal-value").dataset.amount);
    const tax = subtotal * 0.08;
    const total = subtotal + shippingCost + tax;

    const shippingEl = document.getElementById("shipping-value");
    shippingEl.textContent = shippingCost === 0 ? "Free" : `₱${shippingCost.toFixed(2)}`;
    shippingEl.style.color = shippingCost === 0 ? "green" : "gray";

    document.getElementById("tax-value").textContent = `₱${tax.toFixed(2)}`;
    document.getElementById("total-value").textContent = `₱${total.toFixed(2)}`;
}

