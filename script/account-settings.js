const API_URL = "http://localhost:8080";
const token = localStorage.getItem("Token");
function renderOrderHistory(order){
    orderContainer = document.querySelector(".order-history");
    orderContainer.innerHTML = `
         <div class="order-header">
            <span>Order History</span>
         </div>
    `;
    order.forEach(product => {
        
        document.querySelector(".order-history").innerHTML += `
            <div class="order-list">
                <div class="order-container">
                    <div class="order-logo">
                        <img src="${API_URL + product.productImage}" alt="This is a photo">
                    </div>
                <div>
                    <p class="order-id">${product.orderId}</p>
                    <span class="order-date">${product.orderTime} · ${product.quantity} ${(product.quantity >= 2) ? "items" : "item"} </span>
                </div>
                </div>
                <div>
                    <p class="product-price">₱${product.totalPrice}</p>
                    <span class="deliver">${product.status}</span>
                </div>
            </div>
        `;
    })
}

async function loadHistory(){
    try{
        const response = await fetch(`${API_URL}/order/history` , {
            headers:{ "Authorization" : `Bearer ${token}`}
        })
        if(!response.ok) {
            throw new Error("Status" + error);
        }
        const order = await response.json();
        renderOrderHistory(order);
    }catch(error){
        console.log(error);
    }
}

loadHistory();
