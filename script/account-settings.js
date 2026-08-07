const API_URL = "http://localhost:8080";
const token = localStorage.getItem("Token");
// Return home and log out
document.getElementById("back").addEventListener("click" , () => {
    window.location.href = "/pages/home.html";
})
document.querySelector(".log-out").addEventListener("click" , () => {
    localStorage.removeItem("Token");
    window.location.href = "/login.html";
})

//Profile Information and Update
async function userInformation(){
    try{
        const response = await fetch(`${API_URL}/settings/view-profile`, {
            headers: {"Authorization" : `Bearer ${token}`}
        })
        if(!response.ok){
            throw new Error("Error :" + response.status);
        }
        const profile = await response.json();
        document.querySelector(".user-name").textContent = profile.fullName;
        document.querySelector(".user-email").textContent = profile.email;
    }catch(error){
        console.log(`Error: ${error}`)
    }
}

document.querySelector(".save-btn").addEventListener("click" , async () => {
    const firstName = document.getElementById("firstNameInput").value;
    const lastName = document.getElementById("lastNameInput").value;
    const email = document.getElementById("emailInput").value;
    const phoneNumber = document.getElementById("phoneNumberInput").value;

    document.getElementById("save-text").textContent = "Loading..."
    
    try{
        const response = await fetch(`${API_URL}/settings/profile   ` , {
            method : "PUT",
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : `Bearer ${token}`
            },
            body: JSON.stringify({
                firstname : firstName,
                lastname : lastName,
                email : email,
                number : phoneNumber
            })
        }) 
         const updatedInfo = await response.json();
         if(updatedInfo.status === 409){
            alert("Something went wrong"); // fix this with modal;
             document.getElementById("save-text").textContent = "Save Changes"
    
            return 
         }
         document.getElementById("save-text").textContent = "Save Changes!"
         alert("You're about to log back in")
         setTimeout(() => {
             window.location.href = "/login.html";
         }, 1000)
    }catch(error){
        console.log("Error: " + error)
    }
})
// Render order history data
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
        const response = await fetch(`${API_URL}/order/history`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const order = await response.json();

        if (order.length === 0) {
            document.querySelector(".order-history").innerHTML = `
                <div class="order-header">
                    <span>Order History</span>
                </div>
                <div class="empty-history">
                    <div>
                        <i class="ti ti-trash-x"></i>
                    </div>
                    <div>
                        <span>Order history is empty</span>
                    </div>
                </div>
            `;
            return;
        } else {
            renderOrderHistory(order);
        }
       
    }catch(error){
        console.log(error);
    }
}

loadHistory();
userInformation();  
