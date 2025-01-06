// Function to save state to localStorage
function saveState(id, isActive) {
    localStorage.setItem(id, isActive ? "open" : "closed");
}

// Function to retrieve state from localStorage
function getState(id) {
    return localStorage.getItem(id);
}

// Accordion functionality
var acc = document.getElementsByClassName("accordion");

for (let i = 0; i < acc.length; i++) {
    let panel = acc[i].nextElementSibling;
    let id = acc[i].getAttribute("data-id");

    // Retrieve saved state and apply it
    if (getState(id) === "open") {
        acc[i].classList.add("active");
        panel.style.display = "block";
    } else {
        acc[i].classList.remove("active");
        panel.style.display = "none";
    }

    // Add click event listener
    acc[i].addEventListener("click", function () {
        // Collapse all other panels
        for (let j = 0; j < acc.length; j++) {
            if (j !== i) {
                acc[j].classList.remove("active");
                acc[j].nextElementSibling.style.display = "none";
                saveState(acc[j].getAttribute("data-id"), false); // Save state as closed
            }
        }

        // Toggle the current panel
        let panel = this.nextElementSibling;
        let id = this.getAttribute("data-id");
        this.classList.toggle("active");

        if (panel.style.display === "block") {
            panel.style.display = "none";
            saveState(id, false); // Save state as closed
        } else {
            panel.style.display = "block";
            saveState(id, true); // Save state as open
        }
    });
}