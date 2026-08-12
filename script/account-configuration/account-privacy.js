const switches = document.querySelectorAll(".switch-btn");

switches.forEach(switchEl => {
    switchEl.addEventListener("click", () => {
        switchEl.classList.toggle("onSwitchBtn");

        const circle = switchEl.querySelector(".circle"); 
        circle.classList.toggle("onCircle");
    });
});

