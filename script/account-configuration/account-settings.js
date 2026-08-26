const API_URL = "http://localhost:8080";
const token = localStorage.getItem("Token");
// Return home and log out
document.getElementById("back").addEventListener("click" , () => {
    window.location.href = "/pages/home.html";
})
document.querySelector(".log-out").addEventListener("click" , () => {
    localStorage.removeItem("Token");
    localStorage.removeItem("Shipping-Method");
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
        document.getElementById("userProfileImg").src = `${API_URL + profile.pfpUrl}`;
       
        
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
                        <img src="${API_URL + product.productImage}" alt="This is product photo">
                    </div>
                <div>
                    <p class="order-id">${product.orderId}</p>
                    <span class="order-date">${product.orderDate} · ${product.quantity} ${(product.quantity >= 2) ? "items" : "item"} </span>
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
// Notification 
const switches = document.querySelectorAll(".switch-btn");

switches.forEach(switchEl => {
    switchEl.addEventListener("click", () => {
        switchEl.classList.toggle("onSwitchBtn");

        const circle = switchEl.querySelector(".circle"); 
        circle.classList.toggle("onCircle");
    });
});
// change image
const changePfp = document.querySelector(".change-pfp");
const pfpInput = document.getElementById("pfp-input");

changePfp.addEventListener("click" , () => { 
    pfpInput.click();
})

pfpInput.addEventListener("change" , async (e) => {
    const file = e.target.files[0];

    if(!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
        console.log("Preview reader" , e.target.result);
    }
    reader.readAsDataURL(file);
    const success = await saveChangesPfp(file);
    if(success){
      location.reload();
   }
})
async function saveChangesPfp(file){
    const formData = new FormData();
    formData.append("file" , file);
    try{
        const response = await fetch(`${API_URL}/settings/change-pfp` , {
            method: "POST",
            headers: {"Authorization" : `Bearer ${token}`},
            body: formData      
        })
        if(!response.ok){
            console.log("Update failed:" + response.status )
            location.reload();
            return false;
        }
        return true;
    }catch(error){
        console.log(error);
    }
}
function openForm(){
    document.querySelector(".field-address").classList.toggle("openForm");
}
// cancel and open modal btn
document.querySelector(".add-info").addEventListener("click" , () => {
    document.querySelector(".modal-overlay").classList.add("modal-add");
})
document.querySelector(".cancel").addEventListener("click" , () => {
    document.querySelector(".modal-overlay").classList.remove("modal-add");
})
// inner container event listener
document.querySelectorAll(".address-container").forEach(option => {
    option.addEventListener("click" , () => {
        const inputRadio = option.querySelector("input[type='radio']");
        if(inputRadio) inputRadio.checked = true;
        
        document.querySelectorAll(".address-container").forEach(opt => {
            opt.classList.remove("selected");

            const defaultBadge = opt.querySelector(".default-badge");
            if(defaultBadge) defaultBadge.style.display = "none";
        });
        option.classList.add("selected");
        option.querySelector(".default-badge").style.display = "block";
       
    });     
})
// API Connection for Address
document.querySelector(".save").addEventListener("click" ,async () => {
    const fullname = document.getElementById("fullName").value;
    const street = document.getElementById("streetAddress").value;
    const city = document.getElementById("city").value;
    const state = document.getElementById("state").value;
    const zipCode = document.getElementById("zipCode").value;

    const saving = document.querySelector(".save");
    saving.textContent = "Saving...";
    saving.disabled = true;
    
    try{
        const response = await fetch(`${API_URL}/settings/add-address` , {
            method: "POST",
            headers: {"Authorization" : `Bearer ${token}`,
                      "Content-Type" : "application/json"},
            body:
                JSON.stringify({
                    fullName: fullname,
                    street: street,
                    city: city,
                    state: state,
                    zipCode : zipCode
                })
        });
        if(!response.ok){
            throw new Error("Status: " + response.status)
        }
        const success = await response.json();
        document.querySelector(".save").textContent = success.message;

        setTimeout(() => {
            document.querySelector(".save").textContent = "Save & Use This Address";
        }, 900)

        document.querySelectorAll(".input-text").forEach(inpt => inpt.value = "")
    }catch(error){
        console.log(error);
    }
 })



loadHistory();
userInformation();  
