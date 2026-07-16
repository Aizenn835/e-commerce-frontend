const API_URL = "http://localhost:8080";
// add to favorite
document.querySelector(".grid").addEventListener("click" , (event) => {
    const favoriteBtn = event.target.closest(".favorite");
    if(favoriteBtn){
    event.stopPropagation();
    favoriteBtn.classList.toggle("add-favorite");
    return;
    }
    const card = event.target.closest(".content");
    if(!card)return;
    const productId = card.dataset.id;
    resetCounter();
    modalData(productId);
    document.querySelector(".modal-overlay").classList.add("open-modal");
})
// modal 
async function modalData(id){
    const response = await fetch(`${API_URL}/product/${id}` , {
        headers:{
            "Authorization":`Bearer ${token}`
        }
    });
    const product = await response.json();
    document.getElementById("image-modal").src = API_URL + product.imgUrl;
    document.getElementById("modal-category").textContent = product.category;
    document.getElementById("productName").textContent = product.productName;
    document.getElementById("price").textContent = "₱" + product.price;
    document.getElementById("modal-dsc").textContent = product.productDescription; 
}
let count = 1;

function resetCounter() {
    count = 1;
    document.querySelector(".number").textContent = count;
}

document.querySelector(".counter").addEventListener("click", (event) => {
    const minusBtn = event.target.closest(".minus");
    const plusBtn = event.target.closest(".plus");

    if (minusBtn) {
        if (count > 1) {
            count--;
            document.querySelector(".number").textContent = count;
        }
    }
    if (plusBtn) {
        count++;
        document.querySelector(".number").textContent = count;
    }
});
document.querySelector(".modal-favorite").addEventListener("click", () => {
      document.getElementById("modalFav").classList.toggle("modal-fav");
});
// set active in category 
document.querySelectorAll(".nav li").forEach(item => {
    item.addEventListener("click" , () => {
        document.querySelectorAll(".nav li").forEach(li => li.classList.remove("active-filter"));
        item.classList.add("active-filter");
    });
})
//view favorite and cart
function openPanel(overlaySelector , panelSelector){
    document.querySelector(overlaySelector).classList.add("open-overlay");
    document.querySelector(panelSelector).classList.add("open-panel");
}
document.getElementById("cart").addEventListener("click" , () => {
    openPanel('.cart-overlay', '.cart-panel');
});
document.getElementById("wishlist").addEventListener("click" , () => {
    openPanel('.wishlist-overlay', '.wishlist-panel');
});
//close favorite and cart(continue)
function closePanel(overlaySelector , panelSelector){
     document.querySelector(overlaySelector).classList.remove("open-overlay");
     document.querySelector(panelSelector).classList.remove("open-panel");
}
document.getElementById("exit-cart").addEventListener("click" , () => {
    closePanel('.cart-overlay', '.cart-panel');
});
// document.getElementById("continue").addEventListener("click" , () => {
//     closePanel('.cart-overlay', '.cart-panel'); 
// });
document.getElementById("exit-wishlist").addEventListener("click" , () => {
    closePanel('.wishlist-overlay', '.wishlist-panel');
});
// exit modal
document.getElementById("exit-modal").addEventListener("click" ,() => {
    document.querySelector(".modal-overlay").classList.remove("open-modal");
});
// fetch all content
async function displayContent(){
    try{
        const response = await fetch(`${API_URL}/product/get-all`, {
            headers:{
                "Authorization": `Bearer ${token}`
            }
        });

        if(!response.ok) throw new Error(`Enable to fetch content data, Status: ${response.status}`);
        
        const content = await response.json();
        renderContent(content); // add a handler that controls  what user will see if the content is empty 
    }catch(Error){
        console.log(`Error: ${Error}`);
    }
}
//fetch content by category
async function getContentByCategory(category){
    try{
        const response = await fetch(`${API_URL}/product/get-category?category=${category}`, {
            headers:{
                "Authorization": `Bearer ${token}`
            }
        });
        
        if(!response.ok)throw new Error(`Enable to fetch content data, Status: ${response.status}`);
        const content =  await response.json();
        renderContent(content);
    }catch(error){
        console.log(`Error: ${error}`);
    }
}
// fetch search result content
async function searchContent(){
    try{
        const userInput = document.getElementById("search-input").value.trim();
        if(!userInput){
            displayContent();
            return;
        }
        const response = await fetch(`${API_URL}/product/search?keyword=${encodeURIComponent(userInput)}`, {
            headers:{
                "Authorization": `Bearer ${token}`
            }
        });
        
        if(!response.ok) throw new Error(`Status: ${response.status}`);
        const searchData = await response.json();
        if(searchData.length === 0){
           const notFound = document.querySelector(".grid");
           notFound.innerHTML = `   
        <div class="notfound">
            <img src="/assets/images/Empty-rafiki.svg" alt="">
            <span>No items match "${userInput}"</span>
        </div>`
        }else{
            renderContent(searchData);
        }
    }catch(Error){
        console.log(`Error: ${Error}`);
    }
}
// this needs to refresh if the user click add to favorite (get the id in renderWishlist)
async function displayWishlist(){
    try{
        const response = await fetch(`${API_URL}/favorite/get-favorite` , {
        headers:{
                "Authorization": `Bearer ${token}`
            }
        });
       if(!response.ok)throw new Error(`\n Status: ${response.status}`)
        const wishlist = await response.json();
        console.log(wishlist);
        renderWishlist(wishlist);
    }catch(error){
        console.log(error);
    }
}

//render wishlist
function renderWishlist(wishlist){
    document.querySelector(".side-content").innerHTML = "";
    wishlist.forEach(product => {
         document.querySelector(".side-content").innerHTML += ` 
                <div class="wishlist-list" data-id="${product.id}">
                    <div>
                        <img src="${API_URL + product.imgUrl}" alt="${product.productName}" id="wishlist-image">
                    </div>
                    <div class="wishlist-dsc">
                        <h5 class="wishlist-category">${product.category}</h5>
                        <span class="wishlist-name">${product.productName}</span>
                        <div class="wishlist-rating">
                            <span>⭐</span>
                            <span class="rate">4.9 (89)</span>
                        </div>
                        <div class="lower-wishlist">
                            <div>
                                <span class="wishlist-price">${"₱" + product.price}</span>
                            </div>
                            <div class="wishlist-add">
                                <div class="wishlist-remove-btn">
                                    <span><i class="ti ti-trash"></i></span>
                                    <span class="remove-label">Remove</span>
                                </div>
                                <span id="add-cart"><i class="ti ti-shopping-bag"></i> Add</span>
                            </div>
                        </div>
                    </div>
                </div>
         `
    })
    attachRemoveListeners();
}

function attachRemoveListeners() {
    document.querySelectorAll(".wishlist-remove-btn").forEach(card => {
        card.addEventListener("click", async () => {
            const parent = card.closest(".wishlist-list");
            const id = parent.dataset.id;

            try {
                const response = await fetch(`${API_URL}/favorite/${id}`, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (!response.ok) throw new Error(`Status: ${response.status}`);
                if (response.status !== 204) await response.json();

                parent.remove();
            } catch (error) {
                console.log(`Error: ${error}`);
            }
        });
    });
}
// render content (util)
function renderContent(products){
    document.querySelector(".grid").innerHTML = "";
    products.forEach(content => {
        document.querySelector(".grid").innerHTML += `
        <div class="content" data-id="${content.id}">
            <div class="image">
                <img src="${API_URL + content.imgUrl}" alt="${content.productName}">
                <div class="favorite"><i class="ti ti-heart" title="Add to favorite?"></i></div>
            </div>
            <div class="description">
                <h5>${content.category}</h5>
                <p>${content.productName}</p>
                <div class="lower-description">
                    <div><h4>₱${content.price}</h4></div>
                    <div class="rating">⭐ 5.0</div>
                </div>
            </div>
        </div>
        `
    })
}

displayContent();
searchContent();
displayWishlist();
//add new product (will use later) 
