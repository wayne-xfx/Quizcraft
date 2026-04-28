// Function to handle both Registration and Login
async function handleAuth(event, type) {
    event.preventDefault(); // Stop the page from refreshing

    // 1. Grab the values from the input boxes
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageElement = document.getElementById('message');

    try {
        // 2. Send the "Courier" (Fetch) to your backend
        const response = await fetch(`/api/${type}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            // 3. If login was successful, save the token!
            if (type === 'login') {
                localStorage.setItem('token', data.token);
                messageElement.innerText = "Login Successful! Redirecting...";
                setTimeout(() => window.location.href = '/dashboard', 2000);
            } else {
                messageElement.innerText = "Registration Successful! Please log in.";
            }
        } else {
            messageElement.innerText = data.message || "Something went wrong.";
        }
    } catch (error) {
        console.error("Error:", error);
        messageElement.innerText = "Cannot connect to server.";
    }
}