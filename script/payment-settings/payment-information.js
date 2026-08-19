

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
// payment method summary
const shippingMethod = localStorage.getItem("Shipping-Method");
getSummary(shippingMethod);

document.querySelector(".continue-btn").addEventListener("click" , () => {
    document.querySelector(".modal-overlay").classList.add("open-modal");
})
// payment modal data
async function modalData(){
    try{
        const response = await fetch(`${API_URL}/order/history` , {
            headers:{"Authorization" : `Bearer ${token}`}
        })
        const order = await response.json();
        document.getElementById("order-number").textContent = "HAHA"
    }catch(error){
        console.log(error);
    }
}

