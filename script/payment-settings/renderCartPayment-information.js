
async function displayCart(){
    try {
        const response = await fetch(`${API_URL}/cart/all-cart`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!response.ok) throw new Error(`Error ${response.status}`);
        const cart = await response.json();

        if (cart.length === 0) {
            document.querySelector(".side-cnt").innerHTML = `
            <div class="noContent">
                <i class="ti ti-shopping-bag" id="content-logo"></i>
                <h3>Your cart is empty</h3>
                <p>Browse our collection and add something.</p>
                <span id="continueCart">Continue Shopping</span>
            </div>
            `;
            document.querySelector(".checkout").classList.remove("show-checkout");
            document.querySelector(".side-cnt").classList.add("noProd");
            return;
        }
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
                <span class="product-price">₱${product.price}</span>
            </div>
         </div> 
        `;
     })
}

displayCart();