
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
// buttons
function backShipping(){
    document.querySelector(".payment-body").classList.add("continue-payment");
    setTimeout(() => {
        window.location.href="/pages/payment-settings/shipping-information.html";
    }, 500)
}
document.querySelector(".continue-shopping").addEventListener("click" , () => {
    window.location.href="/pages/home.html";
})

// payment method summary
const shippingMethod = localStorage.getItem("Shipping-Method");
getSummary(shippingMethod);

document.querySelector(".continue-btn").addEventListener("click" , () => {
    document.querySelector(".modal-overlay").classList.add("open-modal");
    modalData();
    userEmail();
})
// payment modal data
async function modalData(){
    try{
        const response = await fetch(`${API_URL}/cart/purchase` , {
            method: "POST",
            headers:{"Authorization" : `Bearer ${token}`}
        })
        if(!response.ok){
            throw new Error("Error: " + response.status);
        }
        const order = await response.json();
        renderModalData(order);
    }catch(error){
        console.log(error);
    }
}

function renderModalData(order){
    const statusColors = {
        "PROCESSING": "green",
        "CANCELLED": "red",
        "PENDING": "orange",
        "SHIPPED": "blue",
        "DELIVERED": "teal"
    };

    document.getElementById("order-number").textContent = order.orderNumber; 
    document.getElementById("order-date").textContent = order.estTime;
    document.getElementById("order-paid").textContent = "₱" + Number(order.totalPaid).toLocaleString();

    const orderStatus = document.getElementById("order-status");
    orderStatus.textContent = order.status;
    orderStatus.style.color = statusColors[order.status];
    
    document.querySelector(".modal-data-container").innerHTML = "";
    order.orderItems.forEach(items => {
        document.querySelector(".modal-data-container").innerHTML += `
        <div class="list-container">
            <div class="product-modal-container">
                <div class="inner-container">
                    <div class="product-image">
                        <img src="${API_URL + items.imgUrl}" alt="${items.productName}" id="productImage">
                    </div>  
                    <div class="product-dsc">
                        <p class="product-text">${items.productName}</p>
                        <span class="product-info">Qty ${items.quantity} •  400ml</span>
                    </div>
                </div>
                <div class="product-price">${"₱"+ items.productPrice.toLocaleString()}</div>
            </div>    
        </div>
        `
    })
}
// email data
async function userEmail(){
    try{
        const response = await fetch(`${API_URL}/settings/view-profile` , {
            headers:{"Authorization" : `Bearer ${token}`}
        })
        if(!response.ok){
            throw new Error(`Error ${response.status}`);
        }
        const user = await response.json();
        document.getElementById("email").textContent = user.email;
    }catch(error){

    }
}




