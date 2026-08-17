const API_URL = "http://localhost:8080";
const token = localStorage.getItem("Token");


// Switch
const switches = document.querySelectorAll(".switch-btn");

switches.forEach(switchEl => {
    switchEl.addEventListener("click", () => {
        switchEl.classList.toggle("onSwitchBtn");

        const circle = switchEl.querySelector(".circle"); 
        circle.classList.toggle("onCircle");
    });
});


// Update Password
document.querySelector(".save-changes").addEventListener("click", async () => {
    const currentPassword = document.getElementById("currentPassword").value.trim();
    const newPassword = document.getElementById("newPassword").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    if (newPassword !== confirmPassword) {
        alert("Password does not match with confirm password");
        return;
    }

    const updatedText = document.getElementById("updatedText");
    updatedText.textContent = "Loading...";

    try {
        const response = await fetch(`${API_URL}/settings/change-password`, {
            method: 'PATCH',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                oldPassword: currentPassword,
                newPassword: newPassword
            })
        });

        if (!response.ok) {
            let errorMessage = "Something went wrong";
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch {
                // error fall back to default
            }
            alert(errorMessage);
            updatedText.textContent = "Update Password";
            return;
        }

        updatedText.textContent = "Update Successfully!";
        alert("You're about to log back in");
        setTimeout(() => {
            window.location.href = "/login.html";
        }, 1000);

    } catch (error) {
        console.log(error);
        alert("Something went wrong. Please try again.");
        updatedText.textContent = "Update Password";
    }
});
// Log out 
document.querySelector(".log-out").addEventListener("click" , () => {
    localStorage.removeItem("Token");
    localStorage.removeItem("Shipping-Method");
    window.location.href = "/login.html";
})
