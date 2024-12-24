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
var i;

for (i = 0; i < acc.length; i++) {
    var panel = acc[i].nextElementSibling;
    var id = acc[i].getAttribute("data-id");

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
        var panel = this.nextElementSibling;
        var id = this.getAttribute("data-id");
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