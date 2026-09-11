document.querySelectorAll(".questions").forEach(btn => {
    const answer = btn.querySelector(".question-answer");
    const icon = btn.querySelector(".dropdown-btn i");

    btn.querySelector(".dropdown-btn").addEventListener("click", () => {
        answer.classList.toggle("show-answer");

        // swap icon based on new state
        const isOpen = answer.classList.contains("show-answer");
        icon.classList.toggle("ti-caret-down", !isOpen);
        icon.classList.toggle("ti-caret-up", isOpen);
    });
});