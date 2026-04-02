// Wait for the DOM to be fully loaded before running any JavaScript
document.addEventListener("DOMContentLoaded", function() {
    console.log("Script Loaded");

    // Temporary credentials
    const tempUsername = "admin";
    const tempPassword = "admin";

    // Handle 'Get Started' button click and redirect
    const getStartedBtn = document.getElementById('getStartedBtn');
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', function() {
            // Redirect to another page
            window.location.href = 'login_page.html'; // Replace with the target URL
        });
    }

    // Handle the toggle between customer and partner login
    const partnerLoginBtn = document.querySelector(".partner-login-btn");
    const customerLoginDiv = document.getElementById("customerLogin");
    const partnerLoginDiv = document.getElementById("partnerLogin");

    if (partnerLoginBtn && customerLoginDiv && partnerLoginDiv) {
        partnerLoginBtn.addEventListener("click", function() {
            // Toggle between customer and partner login
            if (customerLoginDiv.style.display !== "none") {
                customerLoginDiv.style.display = "none";
                partnerLoginDiv.style.display = "block";
                partnerLoginBtn.textContent = "Customer Login";
            } else {
                customerLoginDiv.style.display = "block";
                partnerLoginDiv.style.display = "none";
                partnerLoginBtn.textContent = "Partner Login";
            }
        });
    }

    // Handle customer login form submission
    const customerLoginForm = document.getElementById('customerLoginForm');
    const loginError = document.getElementById('loginError');

    if (customerLoginForm) {
        customerLoginForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent form from reloading page

            // Get the entered username and password
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Check if the entered credentials match the temporary ones
            if (username === tempUsername && password === tempPassword) {
                // Redirect to the protected page (e.g., dashboard.html)
                window.location.href = "dashboard.html"; // Replace with the actual dashboard page URL
            } else {
                // Show error message
                loginError.style.display = "block";
            }
        });
    }
});
