const API_URL = "http://localhost:8080";
const token = localStorage.getItem("Token");

if(!token){
    window.location.href="/login.html";
}

async function displayCart(){
    try {
        const response = await fetch(`${API_URL}/cart/all-cart`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!response.ok) throw new Error(`Error ${response.status}`);
        const cart = await response.json();

        // put some error handling it like (Logo cart item is empty)
        renderCart(cart);
    } catch (error) {
        console.log(`Error ${error}`);
    }
    
}
function renderCart(cart){
    cart.forEach(product => {
        document.querySelector(".order-field").innerHTML += `
        <div class="order-grid">
            <div class="order-information">
                <div class="product-info">
                    <img src="${API_URL  + product.imgUrl}" alt="${product.productName}" id="productImg">
                </div>
                <div class="product-container">
                    <p class="info">${product.productName}</p>
                    <span class="supporting-info">Medium Size</span>
                </div>
            </div>
            <div>
                <span class="product-price">₱${product.price.toLocaleString()}</span>
            </div>
         </div> 
        `;
     })
}
document.querySelectorAll(".shipping-option").forEach(option => {

    option.addEventListener("click", () => {
        const shippingMethod = option.dataset.shippingFee ;
        console.log("Selected: " , shippingMethod)
        getSummary(shippingMethod);
        localStorage.setItem("Shipping-Method" , shippingMethod);
    });

});

const savedShippingMethod = localStorage.getItem("Shipping-Method") || "standard shipping";

localStorage.setItem("Shipping-Method", savedShippingMethod);

getSummary(savedShippingMethod);

async function getSummary(shippingMethod){
    try{
        const response = await fetch(`${API_URL}/cart/summary?shippingMethod=${encodeURIComponent(shippingMethod)}` , {
            headers:{"Authorization" : `Bearer ${token}`,
                     "Content-Type" : "application/json"},
        })
        if(!response.ok){
            throw new Error(`Error ${response.status}`);
        }
        const summary = await response.json();
    
        document.getElementById("subtotal").textContent = "₱" + summary.subTotal.toLocaleString();
        
        const shippingFee = document.getElementById("shipping-value");
        shippingFee.textContent = summary.shippingFee === 0.0 ? "Free" :"₱" + summary.shippingFee.toLocaleString();;
        shippingFee.style.color = summary.shippingFee === 0.0 ? "green" : "gray";

        document.getElementById("tax-value").textContent ="₱"+ summary.tax.toLocaleString();
        document.getElementById("total-value").textContent ="₱" + summary.totalPrice.toLocaleString();

        document.getElementById("info-total").textContent = summary.totalPrice.toLocaleString();
        document.getElementById("order-total").textContent = summary.totalPrice.toLocaleString();
    }catch(error){
        console.log(error);
    }
}


displayCart();