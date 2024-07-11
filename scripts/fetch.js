document.addEventListener('DOMContentLoaded', function() {
    const appElement = document.getElementById('app'); // Main container
    const loadingElement = document.getElementById('loading');

    async function fetchData() {
        try {
            const response = await fetch('https://script.googleusercontent.com/macros/echo?user_content_key=rPM3d5v5m1XpzTqqrLfMbALU46tjSCLei61HHSdDW1LW4WztdBSeBfi17ifa1vqZ7fjyPFaciNiX_C7qgkVGwXMep727dR4im5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnDqIju9jtyeSxnuNzFcy8Ycqmb4u5P-m3GPoBbem44AgdoZov6eGMszytH0ZW5WGbeqijaeHLFknwUOMBeH84Y3cHXuPp82r7Nz9Jw9Md8uu&lib=M7zMVhDnsSo1RE-JTI0CmJ4IeVLfGYZxt');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const datas = await response.json();

            // Check if data.people exists and is an array
            if (!datas.data || !Array.isArray(datas.data)) {
                console.error("Error: 'people' property is missing or not an array");
                return; // Exit the function if the check fails
            }

            // Clear existing content
            appElement.innerHTML = '<h1>People</h1>'; // Reset content, keeping the header

            // Dynamically create and append elements for each person
            datas.data.forEach(person => {
                const personDiv = document.createElement('div');
                personDiv.className = 'person';

                const name = document.createElement('p');
                name.textContent = `Name: ${person.first_name} ${person.last_name}`;
                personDiv.appendChild(name);

                const favoriteColor = document.createElement('p');
                favoriteColor.textContent = `Favorite Color: ${person.favorite_color}`;
                personDiv.appendChild(favoriteColor);

                const favoritePerson = document.createElement('p');
                favoritePerson.textContent = `Favorite Person: ${person.favorite_person}`;
                personDiv.appendChild(favoritePerson);

                appElement.appendChild(personDiv);
            });
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            loadingElement.style.display = 'none'; // Hide loading indicator
        }
    }

    fetchData(); // Initial fetch
    setInterval(fetchData, 10000); // Poll every 10 seconds
});