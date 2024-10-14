const API = 'https://api.pexels.com/v1/search';
const API_KEY = 'ngd5QKKqXWIm8eGp2ioOYh31igAl49KpMYQ9aW6kQPWpBiVIhwsOF7PF';

let currentPage = 1;
let currentQuery = '';

const form = document.querySelector('form');
const resultSection = document.getElementById('result');
const loadMoreSection = document.getElementById('load-more');
const loadMore = document.createElement('button');
loadMore.textContent = 'Load More';
loadMore.style.display = 'none';
loadMore.style.margin = '0.5rem auto 0'; // Set top margin to 0.5rem and left/right margins to auto
loadMore.style.backgroundColor = 'white';
loadMore.style.border = '1px solid #2c343e'; // Add a light gray border (optional)
loadMore.style.color = '#2c343e';
loadMoreSection.appendChild(loadMore);

form.addEventListener('submit', (event) => {
    event.preventDefault();
    currentQuery = document.getElementById('query').value;
    currentPage = 1;
    resultSection.innerHTML = ''; // Clear previous results
    loadMore.style.display = 'none'; // Hide the Load More button when searching
    fetchPhotos(currentQuery, currentPage);
});

loadMore.addEventListener('click', () => {
    currentPage++;
    fetchPhotos(currentQuery, currentPage);
});

function fetchPhotos(query, page) {
    fetch(`${API}?query=${encodeURIComponent(query)}&per_page=20&page=${page}`, {
        headers: {
            Authorization: API_KEY
        }
    })
    .then(response => response.json())
    .then(body => {
        body.photos.forEach(photo => {
            // Create an image element for each photo
            const img = document.createElement('img');
            img.src = photo.src.medium; // Use the medium size of the image
            img.alt = photo.alt; // Use the alt text for accessibility
            img.style.cursor = 'pointer'; // Change cursor to pointer on hover

            // Add click event to show the original image size
            img.addEventListener('click', () => {
                showOriginalImage(photo.src.original); // Call the function to show the original image
            });

            // Append the image to the result section
            resultSection.appendChild(img);
        });

        // Apply styles to the result section for consistent spacing
        resultSection.style.display = 'flex';
        resultSection.style.flexWrap = 'wrap'; // Wrap images to the next line
        resultSection.style.justifyContent = 'center'; // Center images horizontally
        resultSection.style.gap = '0.5rem'; // Set consistent gap between images

        // Show the "Load More" button if there are more photos
        if (body.photos.length > 0 && body.photos.length === 20) {
            loadMore.style.display = 'block'; // Show button if more photos available
        } else {
            loadMore.style.display = 'none'; // Hide button if no more photos
        }
    })
    .catch(err => {
        console.error('There was a problem with the fetch operation:', err);
    });
}

function showOriginalImage(src) {
    // Create a new div for the original image
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'; // Semi-transparent background
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = 1000; // High z-index to ensure it appears above other content

    // Create an image element for the original image
    const originalImg = document.createElement('img');
    originalImg.src = src;
    originalImg.alt = 'Original Image';
    originalImg.style.maxWidth = '90%'; // Limit max width
    originalImg.style.maxHeight = '90%'; // Limit max height

    // Add a click event to remove the overlay when clicked
    overlay.addEventListener('click', () => {
        document.body.removeChild(overlay); // Remove overlay from the DOM
    });

    // Append the original image to the overlay
    overlay.appendChild(originalImg);
    document.body.appendChild(overlay); // Add overlay to the body
}
