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
// cancel go to edit , open modal btn (address  , payment)
function reloadModal(){
    document.querySelector(".hero-container").classList.remove("remove-hero");
    document.querySelector(".edit-modal").classList.remove("show-edit");
}

document.querySelector(".add-info").addEventListener("click" , () => {
    document.querySelector(".modal-overlay").classList.add("modal-add");
    document.querySelector(".edit-back").style.display = "none";
    getAddress();
})
document.querySelector(".cancel").addEventListener("click" , () => {
    reloadModal();
    document.querySelector(".modal-overlay").classList.remove("modal-add");
})
document.querySelector(".exit").addEventListener("click" , () => {
    reloadModal()
    document.querySelector(".modal-overlay").classList.remove("modal-add");
})


document.querySelector(".payments").addEventListener("click" , () => {
    document.querySelector(".modal-overlay-payment").classList.add("open-payment-modal");
    fetchPaymentMethod();
})
document.querySelector(".exit-payment").addEventListener("click" , () => {
    document.querySelector(".modal-overlay-payment").classList.remove("open-payment-modal");
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
// The input radio always checked the last child fix this. (let addressId = null;)

let addressId = null;

document.querySelector(".save").addEventListener("click" , async () => {
    const isEdit = addressId != null;
    
    const fullname = document.getElementById(isEdit ? "fullNameEdit" : "fullName").value;
    const street = document.getElementById(isEdit ? "editStreet" :"streetAddress").value;
    const city = document.getElementById(isEdit ? "cityEdit" : "city").value;
    const state = document.getElementById(isEdit ? "stateEdit" : "state").value;
    const zipCode = document.getElementById(isEdit ? "zipCodeEdit" : "zipCode").value;
    const checkbox = document.getElementById(isEdit ? "edit-checkbox" : "footer-checkbox");

    const isChecked = checkbox.checked ? true : false;
    
    if(!validateAddressForm(fullname , street , city , state , zipCode)){
        alert("Input is empty");
        return;
    }

    const saving = document.querySelector(".save");
    saving.textContent = "Saving...";
    saving.disabled = true;

    const url = `${API_URL + '/settings' +  (isEdit ? ("/" + addressId) : "/add-address") }`;
    const method = isEdit ? "PUT" : "POST";
    console.log(url);
    
    try{
        const response = await fetch(url , {
            method: method,
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
// The input radio always checked the last child fix this.
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
// if there is only one address left make it the default one
function deleteListener(){
    document.querySelectorAll(".address-container").forEach(opt => {
        opt.addEventListener("click" , async (e) => {
            const id = opt.dataset.index;

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

            addressId = edit.dataset.index;

            if(!e.target.closest(".edit")){
               return;
            }
            helper();
            placeholderEditModal(addressId);
        })
    })
}
// edit arrow listener and save in edit
document.querySelector(".edit-back").addEventListener("click" , () => {
    document.querySelector(".hero-container").classList.remove("remove-hero");
    document.querySelector(".edit-modal").classList.remove("show-edit");
    document.querySelector(".edit-back").style.display = "none";
});

// event listener for payment modal
function addSelectedListenerPayment(){
    document.querySelectorAll(".payment-container").forEach(opt => {
    opt.addEventListener("click" , (e) => {     
        if(e.target.closest(".edit-payment")){
            return;
        }
        const inputRadio = opt.querySelector("input[type='radio']");
        inputRadio.checked = true;

        document.querySelectorAll(".payment-container").forEach(select => {
            select.classList.remove("selected-payment")
        })
            opt.classList.add("selected-payment");
    })
})
}
// event listener for card form
document.querySelectorAll(".card").forEach(option => {
option.addEventListener("click" , () => {
    
    document.querySelectorAll(".card").forEach(select =>
        select.classList.remove("payment-selected")); 

    option.classList.add("payment-selected");


    const cardId = option.dataset.card;
    document.querySelectorAll(".inner-form").forEach(form => {
        form.style.display = "none"
    });
    const openForm = cardId + "-field";
    
    document.getElementById(openForm).style.display = "flex";
    document.querySelector(".footer-payment").style.display = "flex";
    
 })
})

// API Connection for Payment methods 
let selectedType = "CARD";
document.getElementById("visa").addEventListener("click" , () => selectedType = "VISA");
document.getElementById("mc").addEventListener("click" , () => selectedType = "MC");
document.getElementById("gcash").addEventListener("click" , () => selectedType = "GCASH");
document.getElementById("payPal").addEventListener("click" , () => selectedType = "PAYPAL");

document.getElementById("save-payment").addEventListener("click" , async () => {
    let payload; 

    const checkBox = document.getElementById("payment-checkbox");
    const isDefault = checkBox.checked ? true : false;   
    
    const saveBtn = document.getElementById("save-payment");
    saveBtn.textContent = "Saving..";
    saveBtn.disabled = true;

    if(selectedType === "VISA" || selectedType === "MC"){
        
        payload = {
            "isDefault" : isDefault,
            "cardBrand" : selectedType ,
            "paymentType" : "CARD",
            "cardHolderName" : document.getElementById(selectedType === "VISA" ? "visaCardHolderName" : "mcCardHolderName")
            .value,
            "cardLastFourDigits" : document.getElementById(selectedType === "VISA" ? "visaCardNumber" : "mcCardNumber")
                                  .value,
            "month" : parseInt(document.getElementById(selectedType === "VISA" ? "visaCardExpiry" : "mcCardExpiry")
                     .value.split("/")[0]),
            "year" : parseInt(document.getElementById(selectedType === "VISA" ? "visaCardExpiry" : "mcCardExpiry")
                     .value.split("/")[1])
        };

    }else if(selectedType === "GCASH" || selectedType === "PAYPAL"){
       
        payload = {
            "isDefault" : isDefault,
            "cardBrand" : selectedType ,
            "paymentType" : "EWALLET",
            "provider" : selectedType === "GCASH" ? "gcash" : "paypal",
            "walletIdentifier" :  document.getElementById(selectedType === "GCASH" ?
                                  "gcashNumber" : "paypalEmail").value
        };
    }
    console.log(payload);
    try{
        const response = await fetch(`${API_URL}/settings/add-payment` , {
                method: "POST",
                headers: {"Authorization" : `Bearer ${token}`,
                        "Content-Type" : "application/json"},
                body: JSON.stringify(payload)
        });
        if(response.status === 409){
            alert("Payment Method Already Exist");
            saveBtn.textContent = "Save";
            saveBtn.disabled = false;r
            return;
        }
        if(!response.ok){
             console.error("Failed to add payment method");
             return;
        }

        saveBtn.textContent = "Saved";
        setTimeout(() => {
            saveBtn.textContent = "Save"
            saveBtn.disabled = false;
        },500)
        fetchPaymentMethod();
        document.querySelectorAll(".card-payment-input").forEach(inputBtn => inputBtn.value = "");
    }catch(error){
        console.log(error);
    }
})
// load/fetch data
async function fetchPaymentMethod(){
    try{
        const response = await fetch(`${API_URL}/settings/payments` , {
            headers: {"Authorization" : `Bearer ${token}`}
        })
        const paymentMethods = await response.json();
        loadPaymentMethods(paymentMethods);
        if(paymentMethods.length === 0){
            document.querySelector(".current-payment").innerHTML = `
           <div class="notfound-payment">
                <img src="/assets/images/undraw_enter-payment-info_k1yw.svg" alt="No address handler">
                <h3 class="main-text">How would you like to pay?</h3>
                <p class="supporting-text">Save your preferred payment methods to make checkout effortless.</p>
            </div>`;
             return;
        }
    }catch(error){
        console.log(error);
    }
}
function loadPaymentMethods(paymentMethods){
    const paymentContainer = document.querySelector(".current-payment");
    paymentContainer.innerHTML = "";

    paymentMethods.forEach(pm => {
        const card = document.createElement("div");
        card.className = "payment-container";
        card.dataset.id = pm.id;


        let logoName , cardName , walletIdentifier , logoColor;

        if(pm.cardBrand === "VISA" || pm.cardBrand === "MC"){
            logoName = pm.cardBrand === "VISA" ? "VISA" : "MC";
            cardName = pm.cardBrand === "VISA" ? "Visa" : "Master Card";
            logoColor = pm.cardBrand === "VISA" ? "visa" : "master-card";
            walletIdentifier = pm.cardLastFourDigits + " | " + "Expires " + pm.month + "/" + pm.year;
        }else if(pm.cardBrand === "GCASH" || pm.cardBrand === "PAYPAL"){
            logoName = pm.cardBrand === "GCASH" ? "G" : "PP";
            cardName = pm.cardBrand === "GCASH" ? "Gcash" : "PayPal";
            logoColor = pm.cardBrand === "GCASH" ? "g-cash" : "paypal";
            walletIdentifier = pm.walletIdentifier;
        }
        console.log(pm.cardBrand);
        card.innerHTML = `
                <input type="radio" name="paymentInput">
                <div class="logo-container ${logoColor}">
                    <p class="logo-name">${logoName}</p>
                </div>
                <div class="information-container">
                    <div class="payment-info-container">
                        <div class="inner-info-container">
                            <h4 class="card-name">${cardName}</h4>
                            <span class="default-payment" style="display:${pm.isDefault ? "flex" : "none"}">Default</span>
                        </div>
                        <p class="payment-card-info">${walletIdentifier} </p>
                    </div>
                    <div class="edit-payment">
                        <div class="edit-payment-container">
                            <i class="ti ti-edit"></i> 
                            <p class="edit-payment-method">Edit</p>
                        </div>
                        <p class="remove-payment-method">Remove</p>
                    </div>
                </div>
        `
        paymentContainer.appendChild(card);
    });
     addSelectedListenerPayment();
     addDeleteListener(paymentMethods);
}

function addDeleteListener(){
    document.querySelectorAll(".payment-container").forEach(pm => {
        pm.addEventListener("click" , async (e) => {
            const removeBtn = e.target.closest(".remove-payment-method");
            const id = pm.dataset.id;
            
            if(!removeBtn){return;}

            try{
                const response = await fetch(`${API_URL}/settings/payment/${id}` , {
                    method: "DELETE",
                    headers: {"Authorization" : `Bearer ${token}`}
                });

                if(!response.ok){
                    throw new Error("Status: " + response.status);
                }
                 fetchPaymentMethod();
            }catch(error){
                console.log(error);
            }
        })
    })
}
currentDefaultAddress();
loadHistory();
userInformation();  
