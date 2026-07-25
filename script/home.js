const API_URL = "http://localhost:8080";

/* =========================================================
   FILTERS
========================================================= */

document.querySelectorAll(".nav li").forEach(item => {
    item.addEventListener("click", () => {
        document.querySelectorAll(".nav li").forEach(li => li.classList.remove("active-filter"));
        item.classList.add("active-filter");
    });
});

document.getElementById("logout").addEventListener("click", () => {
    localStorage.removeItem("Token");
    window.location.href="/login.html";
})
/* =========================================================
   PANEL OPEN / CLOSE (cart, wishlist , settings)
========================================================= */

function openPanel(overlaySelector, panelSelector) {
    document.querySelector(overlaySelector).classList.add("open-overlay");
    document.querySelector(panelSelector).classList.add("open-panel");
}

function closePanel(overlaySelector, panelSelector) {
    document.querySelector(overlaySelector).classList.remove("open-overlay");
    document.querySelector(panelSelector).classList.remove("open-panel");
}

document.getElementById("cart").addEventListener("click", () => {
    displayCart();
    openPanel('.cart-overlay', '.cart-panel');
});

document.getElementById("wishlist").addEventListener("click", () => {
    openPanel('.wishlist-overlay', '.wishlist-panel');
});

document.getElementById("exit-cart").addEventListener("click", () => {
    closePanel('.cart-overlay', '.cart-panel');
});

document.getElementById("exit-wishlist").addEventListener("click", () => {
    closePanel('.wishlist-overlay', '.wishlist-panel');
});

document.addEventListener("click", (event) => {
    const continueBtn = event.target.closest("#continueWishlist");
    if (!continueBtn) return;
    closePanel('.wishlist-overlay', '.wishlist-panel');
});

document.addEventListener("click", (event) => {
    const continueBtn = event.target.closest("#continueCart");
    if (!continueBtn) return;
    closePanel('.cart-overlay', '.cart-panel');
});

document.getElementById("settings-id").addEventListener("click", (event) => {
    event.stopPropagation();
    document.querySelector(".settings-container").classList.toggle("settings-open");
});
document.addEventListener("click" , (event) => {
    const settings = event.target.closest("settings-id");
    if(settings) return;
    document.querySelector(".settings-container").classList.remove("settings-open");
})
/* =========================================================
   PRODUCT MODAL
========================================================= */

let count = 1;

function resetCounter() {
    count = 1;
    document.querySelector(".number").textContent = count;
}

async function modalData(id) {
    const response = await fetch(`${API_URL}/product/${id}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    const product = await response.json();
    document.querySelector(".main-modal").dataset.id = id;

    document.getElementById("image-modal").src = API_URL + product.imgUrl;
    document.getElementById("modal-category").textContent = product.category;
    document.getElementById("productName").textContent = product.productName;
    document.getElementById("price").textContent = "₱" + product.price;
    document.getElementById("modal-dsc").textContent = product.productDescription;
}

document.getElementById("exit-modal").addEventListener("click", () => {
    document.querySelector(".modal-overlay").classList.remove("open-modal");
});

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

document.querySelector(".add-cart").addEventListener("click", async () => {
    try {
        const modal = document.querySelector(".main-modal");
        const id = modal.dataset.id;
        const count = Number(document.querySelector(".number").textContent);
        const response = await fetch(`${API_URL}/cart/add-cart`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                productId: id,
                quantity: count
            })
        });
        if (!response.ok) throw new Error(`Status: ${response.status}`);
        document.querySelector(".modal-overlay").classList.remove("open-modal");
        document.querySelector(".cart-overlay").classList.add("open-overlay");
        document.querySelector(".cart-panel").classList.add("open-panel");
        displayCart();
        console.log("Added to cart successfully");
    } catch (error) {
        console.log(error);
    }
});

/* =========================================================
   PRODUCT GRID
========================================================= */

async function displayContent() {
    try {
        const response = await fetch(`${API_URL}/product/get-all`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error(`Enable to fetch content data, Status: ${response.status}`);

        const content = await response.json();
        renderContent(content); // add a handler that controls what user will see if the content is empty
    } catch (Error) {
        console.log(`Error: ${Error}`);
    }
}

async function getContentByCategory(category) {
    try {
        const response = await fetch(`${API_URL}/product/get-category?category=${category}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error(`Enable to fetch content data, Status: ${response.status}`);
        const content = await response.json();
        renderContent(content);
    } catch (error) {
        console.log(`Error: ${error}`);
    }
}

async function searchContent() {
    try {
        const userInput = document.getElementById("search-input").value.trim();
        if (!userInput) {
            displayContent();
            return;
        }
        const response = await fetch(`${API_URL}/product/search?keyword=${encodeURIComponent(userInput)}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error(`Status: ${response.status}`);
        const searchData = await response.json();
        if (searchData.length === 0) {
            const notFound = document.querySelector(".grid");
            notFound.innerHTML = `   
        <div class="notfound">
            <img src="/assets/images/Empty-rafiki.svg" alt="">
            <span>No items match "${userInput}"</span>
        </div>`;
        } else {
            renderContent(searchData);
        }
    } catch (Error) {
        console.log(`Error: ${Error}`);
    }
}

function renderContent(products) {
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
        `;
    });
}

document.querySelector(".grid").addEventListener("click", (event) => {
    const favoriteBtn = event.target.closest(".favorite");
    if (favoriteBtn) {
        event.stopPropagation();
        favoriteBtn.classList.toggle("add-favorite");
        return;
    }
    const card = event.target.closest(".content");
    if (!card) return;
    const productId = card.dataset.id;
    resetCounter();
    modalData(productId);
    document.querySelector(".modal-overlay").classList.add("open-modal");
});

/* =========================================================
   WISHLIST
========================================================= */

// this needs to refresh if the user click add to favorite (get the id in renderWishlist)
async function displayWishlist() {
    try {
        const response = await fetch(`${API_URL}/favorite/get-favorite`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!response.ok) throw new Error(`\n Status: ${response.status}`);
        const wishlist = await response.json();
        if (wishlist.length === 0) {
            document.querySelector(".side-content").innerHTML = `
            <div class="noContent">
                <i class="bi bi-heart" id="content-logo"></i>
                <h3>No saved items yet</h3>
                <p>Tap the heart on any product to save it here.</p> 
                <span id="continueWishlist">Browse Products</span>
            </div>
                `;
            return;
        }
        renderWishlist(wishlist);
    } catch (error) {
        console.log(error);
    }
}

function renderWishlist(wishlist) {
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
         `;
    });
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
                displayWishlist();
            } catch (error) {
                console.log(`Error: ${error}`);
            }
        });
    });
}

/* =========================================================
   CART
========================================================= */

async function displayCart() {
    try {
        const response = await fetch(`${API_URL}/cart/all-cart`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!response.ok) throw new Error(`Error ${response.status}`);
        const cart = await response.json();
        if (cart.length === 0) {
            document.querySelector(".side-cnt").innerHTML = `
            <div class = "noContent">
                <i class="ti ti-shopping-bag" id="content-logo"></i>
                <h3>Your cart is empty</h3>
                <p>Browse our collection and add something.</p>
                <span id="continueCart">Continue Shopping</span>
            </div>
            `;
            return;
        }
        renderCart(cart);
    } catch (error) {
        console.log(`Error ${error}`);
    }
}

function renderCart(cart) {
    document.querySelector(".side-cnt").innerHTML = ``;
    cart.forEach(product => {
        document.querySelector(".side-cnt").innerHTML += ` 
        <div class="cart-list" data-id="${product.id}">
                    <div>
                        <img src="${API_URL + product.imgUrl}" alt="${product.productName}" id="cart-image">
                    </div>
                    <div class="cart-dsc">
                        <div class="cart-side-head">
                            <div>
                                <span class="cart-product-name">${product.productName}</span>
                            </div>
                            <div class="exit-cart-side">
                                <span>X</span>
                            </div>
                        </div>
                        <div class="cart-size">
                            <span>Size: </span>
                            <span>400ml</span>
                        </div>
                        <div class="counter-price">
                            <div class="cart-counter">
                                <div class="minus-cart-side">-</div>
                                <div class="number-cart-side" >${product.quantity}</div>
                                <div class="plus-cart-side">+</div>
                            </div>
                            <div class="cart-price">
                                <span class="price">${"₱" + product.price}</span>
                            </div>
                        </div>
                    </div>
                </div>
        `;
    });
    removeFromCart();
}

document.querySelector(".side-cnt").addEventListener("click", async (event) => {
    const minusBtn = event.target.closest(".minus-cart-side");
    const plusBtn = event.target.closest(".plus-cart-side");
    if (!minusBtn && !plusBtn) return;

    const row = event.target.closest(".cart-list");
    const numberEl = row.querySelector(".number-cart-side");
    let quantity = Number(numberEl.textContent);

    if (minusBtn) quantity--;
    if (plusBtn) quantity++;

    if (quantity < 1) quantity = 0;

    try {
        const response = await fetch(`${API_URL}/cart/${row.dataset.id}?quantity=${quantity}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error(`Status: ${response.status}`);

        displayCart();
    } catch (error) {
        console.log(error);
    }
});

function removeFromCart() {
    document.querySelectorAll(".exit-cart-side").forEach(card => {
        card.addEventListener("click", async () => {
            const parent = card.closest(".cart-list");
            const id = parent.dataset.id;
            try {
                const response = await fetch(`${API_URL}/cart/${id}`, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (!response.ok) throw new Error(`Status: ${response.status}`);
                if (response.status !== 204) await response.json();

                parent.remove();
                displayCart();
            } catch (error) {
                console.log(`Error: ${error}`);
            }
        });
    });
}

/* =========================================================
   INIT
========================================================= */

displayContent();
searchContent();
displayWishlist();
displayCart();

// add new product (will use later)