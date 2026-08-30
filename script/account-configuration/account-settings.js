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
// cancel go to edit , open modal btn 
document.querySelector(".add-info").addEventListener("click" , () => {
    document.querySelector(".modal-overlay").classList.add("modal-add");
    document.querySelector(".edit-back").style.display = "none";
    getAddress();
})
document.querySelector(".cancel").addEventListener("click" , () => {
    document.querySelector(".modal-overlay").classList.remove("modal-add");
})
document.querySelector(".exit").addEventListener("click" , () => {
    document.querySelector(".modal-overlay").classList.remove("modal-add");
})


// inner container event listener
function attachListener(){
    document.querySelectorAll(".address-container").forEach(option => {
    option.addEventListener("click" , (e) => {
        
        if(e.target.closest(".edit-address")){
            return;
        }
        
        const inputRadio = option.querySelector("input[type='radio']");
        if(inputRadio) inputRadio.checked = true;
        
        document.querySelectorAll(".address-container").forEach(opt => {
            opt.classList.remove("selected");
        });
        option.classList.add("selected");
    });     
 })
}


// Input validation
function validateAddressForm(fullname, street, city, state, zipCode) {
    
    if (
        fullname.trim() === "" ||
        street.trim() === "" ||
        city.trim() === "" ||
        state.trim() === "" ||
        zipCode.trim() === ""
    ) {
        return false; 
    }
    return true;
}
// API Connection for Address
// The input radio always (checked/input=radio) the last child fix this.
document.querySelector(".save").addEventListener("click" ,async () => {
    const fullname = document.getElementById("fullName").value;
    const street = document.getElementById("streetAddress").value;
    const city = document.getElementById("city").value;
    const state = document.getElementById("state").value;
    const zipCode = document.getElementById("zipCode").value;
    const checkbox = document.getElementById("footer-checkbox");

    const isChecked = checkbox.checked ? true : false;
    
    if(!validateAddressForm(fullname , street , city , state , zipCode)){
        alert("Input is empty");
        return;
    }

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
                    zipCode : zipCode,
                    isDefault : isChecked
                })
        });
        if(response.status === 409){
            alert("Address already existed!");
            const saveBtn =  document.querySelector(".save");
            saveBtn.textContent = "Save";
            saveBtn.disabled = false;
            return;
        }
        if(!response.ok){
            throw new Error("Status: " + response.status)
        }
        const success = await response.json();
        document.querySelector(".save").textContent = success.message;

        setTimeout(() => {
            const saveBtn =  document.querySelector(".save");
            saveBtn.textContent = "Save";
            saveBtn.disabled = false;
            getAddress();
        }, 900)

        document.querySelectorAll(".input-text").forEach(inpt => inpt.value = "")
    }catch(error){
        console.log(error);
    }
})
async function getAddress(){
    try{
        const response = await fetch(`${API_URL}/settings/view-address` , {
            headers:{"Authorization" : `Bearer ${token}`}
        })
        if(!response.ok){
            throw new Error("Status: " + response.status);
        }
        const userAddress = await response.json();
        const container =  document.querySelector(".current-addresses");

        if(userAddress.length === 0){
            container.innerHTML = `
             <div class="notfound">
                <img src="/assets/images/undraw_address_4imv.svg" alt="No address handler">
                <h3 class="main-text">Where should we ship your items?</h3>
                <p class="supporting-text">Save your favorite shipping addresses to make ordering effortless.</p>
             </div>`
             return;
        }
            currentDefaultAddress();
            showAvailableAddress(userAddress);
    }catch(error){
        console.log(error);
    }
}
// View address 
// The input radio always (checked/input=radio) the last child fix this.
function showAvailableAddress(userAddress){
    document.querySelector(".current-addresses").innerHTML = " ";
    userAddress.forEach((address) => {
        document.querySelector(".current-addresses").innerHTML += `
          <div class="address-container" data-index=${address.id}>
                <div class="input">
                    <input type="radio" name="defaultAddress" checked >
                </div>
                <div class="inner-address-container">
                    <div class="user-default">
                        <p class="user">${address.fullName}</p>
                        <span class="default-badge" style="display:${address.isDefault ? "block" : "none"}">Default</span>
                    </div>
                    <p class="user-address">${address.address}</p>
                </div>
                <div class="edit-address">
                    <div class="edit"> 
                        <i class="ti ti-edit"></i> 
                        <p class="btn-edit">Edit</p>
                    </div>
                    <div class="remove">Remove</div>
                </div>
           </div>
        `
    })
    attachListener();
    editListener();
    deleteListener();
}
// show current address
// handle the error when there is no current address save 
// throw exception Address not found? etc..
async function currentDefaultAddress(){
    try{
        const response = await fetch(`${API_URL}/settings/default-address` , {
            headers:{"Authorization" : `Bearer ${token}`}
        })
        if (response.status === 404) {
            document.querySelector(".address").textContent = "No default address";
        }else{
            const address = await response.json();
            document.querySelector(".address").textContent = address.address;
        }
       
    }catch(error){
        console.log(error);
    }
}
// delete address
// if there is only one address left make it the default one.
function deleteListener(){
    document.querySelectorAll(".address-container").forEach(opt => {
        opt.addEventListener("click" , async (e) => {
            const id = opt.dataset.index;
            // test the id

            if(!e.target.closest(".remove")){
                return;
            }

            try{
                await fetch(`${API_URL}/settings/${id}`, {
                    method: "DELETE",
                    headers: {"Authorization" : `Bearer ${token}`}
                });
                 getAddress();
                 currentDefaultAddress();
            }catch(error){
                console.log(error);
            }
        });
    })
}
//go to edit modal
function helper(){
    document.querySelector(".hero-container").classList.add("remove-hero");
    document.querySelector(".edit-modal").classList.add("show-edit");
    document.querySelector(".head-text").textContent = "Edit Address";
    document.querySelector(".edit-back").style.display = "flex";
}
async function placeholderEditModal(id){
    try{
        const response = await fetch(`${API_URL}/settings/${id}` , {
            headers: {"Authorization" : `Bearer ${token}`}
        });
        if(!response.ok){
            throw new Error(response.status);
        }
        const data = await response.json();
        document.getElementById("fullNameEdit").value = data.fullName;
        document.getElementById("editStreet").value = data.street;
        document.getElementById("cityEdit").value = data.city;
        document.getElementById("stateEdit").value = data.state;
        document.getElementById("zipCodeEdit").value = data.zipCode;

    }catch(error){
        console.log(error);
    }
}
function editListener(){
    document.querySelectorAll(".address-container").forEach((edit) => {
        edit.addEventListener("click" , (e) => {
            const id = edit.dataset.index;

            if(!e.target.closest(".edit")){
               return;
            }
            helper();
            placeholderEditModal(id);
        })
    })
}
// edit arrow listener
document.querySelector(".edit-back").addEventListener("click" , () => {
    document.querySelector(".hero-container").classList.remove("remove-hero");
    document.querySelector(".edit-modal").classList.remove("show-edit");
    document.querySelector(".edit-back").style.display = "none";
});



currentDefaultAddress();
loadHistory();
userInformation();  
