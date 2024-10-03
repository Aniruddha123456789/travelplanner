// Placeholder API URL. Replace this with your actual API endpoint.
const apiUrl = "https://api.example.com/tourist-info";

// Function to show information when a user hovers over a state
async function showInfo(event, state) {
    const infoBox = document.getElementById('info-box');
    const stateName = document.getElementById('state-name');
    const touristSummary = document.getElementById('tourist-summary');
    const touristImage = document.getElementById('tourist-image');

    // Fetch tourist data from the API
    try {
        const response = await fetch(`${apiUrl}?state=${state}`);
        const data = await response.json();

        // Populate the info box with the API data
        stateName.textContent = data.name;
        touristSummary.textContent = data.summary;
        touristImage.src = data.image;

        // Position and display the info box
        infoBox.style.display = 'block';
        infoBox.style.left = event.pageX + 'px';
        infoBox.style.top = event.pageY + 'px';
    } catch (error) {
        console.error("Error fetching tourist data:", error);
    }
}

// Hide the info box when the mouse leaves the map
document.getElementById('india-map').addEventListener('mouseleave', () => {
    document.getElementById('info-box').style.display = 'none';
});

// Example event listener to call showInfo on hover
document.getElementById('india-map').addEventListener('mouseover', (event) => {
    // Assuming you have a way to identify the state the cursor is over, e.g., using event.target or event coordinates
    const hoveredState = "Karnataka";  // Replace this with actual state identification logic
    showInfo(event, hoveredState);
});
