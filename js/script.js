// Find page elements we need
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
const fetchButton = document.querySelector('.filters button');
const gallery = document.getElementById('gallery');
const imageModal = document.getElementById('imageModal');
const modalCloseButton = document.getElementById('modalClose');
const modalImage = document.getElementById('modalImage');
const modalVideo = document.getElementById('modalVideo');
const modalTitle = document.getElementById('modalTitle');
const modalDate = document.getElementById('modalDate');
const modalExplanation = document.getElementById('modalExplanation');
const modalVideoLinkWrap = document.getElementById('modalVideoLinkWrap');
const modalVideoLink = document.getElementById('modalVideoLink');

let currentGalleryItems = [];

// NASA APOD endpoint and free demo API key
const APOD_URL = 'https://api.nasa.gov/planetary/apod';
const API_KEY = '0Ypve5xBx9a5Q15tr2lQvXumHZZlCkFnfSF9hPQr';

// Set up default and valid date ranges from dateRange.js
setupDateInputs(startInput, endInput);

// Build one card for each APOD item
function createGalleryItem(apodItem, index) {
	const isVideo = apodItem.media_type === 'video';
	const previewImage = isVideo ? (apodItem.thumbnail_url || 'img/NASA-Logo-Large.jpg') : apodItem.url;
	const mediaBadge = isVideo ? '<p class="media-badge">Video</p>' : '<p class="media-badge">Image</p>';

	return `
		<article class="gallery-item" data-index="${index}" tabindex="0" role="button" aria-label="Open details for ${apodItem.title}">
			<img src="${previewImage}" alt="${apodItem.title}" loading="lazy" />
			${mediaBadge}
			<p><strong>${apodItem.title}</strong> (${apodItem.date})</p>
		</article>
	`;
}

// Convert common YouTube URLs to embed URLs for iframe display
function getVideoEmbedUrl(videoUrl) {
	if (videoUrl.includes('youtube.com/watch?v=')) {
		return videoUrl.replace('watch?v=', 'embed/');
	}

	if (videoUrl.includes('youtu.be/')) {
		const videoId = videoUrl.split('youtu.be/')[1].split('?')[0];
		return `https://www.youtube.com/embed/${videoId}`;
	}

	return videoUrl;
}

function openModal(apodItem) {
	const isVideo = apodItem.media_type === 'video';

	if (isVideo) {
		modalImage.classList.add('hidden');
		modalVideo.classList.remove('hidden');
		modalVideo.src = getVideoEmbedUrl(apodItem.url);
		modalVideoLinkWrap.classList.remove('hidden');
		modalVideoLink.href = apodItem.url;
	} else {
		modalVideo.classList.add('hidden');
		modalVideo.src = '';
		modalVideoLinkWrap.classList.add('hidden');
		modalImage.classList.remove('hidden');
		modalImage.src = apodItem.hdurl || apodItem.url;
		modalImage.alt = apodItem.title;
	}

	modalTitle.textContent = apodItem.title;
	modalDate.textContent = apodItem.date;
	modalExplanation.textContent = apodItem.explanation;
	imageModal.classList.remove('hidden');
}

function closeModal() {
	// Reset iframe source so video playback stops when modal closes
	modalVideo.src = '';
	imageModal.classList.add('hidden');
}

// Show message in gallery (used for loading and errors)
function showGalleryMessage(message) {
	gallery.innerHTML = `
		<div class="placeholder">
			<p>${message}</p>
		</div>
	`;
}

// Fetch APOD data from NASA for selected date range
async function getApodByDateRange(startDate, endDate) {
	const url = `${APOD_URL}?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}&thumbs=true`;
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`NASA API request failed with status ${response.status}`);
	}

	return response.json();
}

// Display all APOD entries (images and videos) in newest-to-oldest order
function renderGallery(apodData) {
	const galleryItems = apodData.sort((a, b) => new Date(b.date) - new Date(a.date));

	currentGalleryItems = galleryItems;

	if (galleryItems.length === 0) {
		showGalleryMessage('No APOD entries found in this date range. Try another range.');
		return;
	}

	gallery.innerHTML = galleryItems.map((item, index) => createGalleryItem(item, index)).join('');
}

// Handle button click: validate dates, fetch data, and show results
async function handleGetSpaceImages() {
	const startDate = startInput.value;
	const endDate = endInput.value;

	if (!startDate || !endDate) {
		showGalleryMessage('Please select both a start date and an end date.');
		return;
	}

	if (new Date(startDate) > new Date(endDate)) {
		showGalleryMessage('Start date must be before or equal to end date.');
		return;
	}

	showGalleryMessage('Loading space images...');

	try {
		const apodData = await getApodByDateRange(startDate, endDate);
		renderGallery(apodData);
	} catch (error) {
		showGalleryMessage('Could not load images from NASA right now. Please try again.');
		console.error(error);
	}
}

// Run the fetch when user clicks the button
fetchButton.addEventListener('click', handleGetSpaceImages);

// Open modal when a gallery item is clicked
gallery.addEventListener('click', (event) => {
	const card = event.target.closest('.gallery-item');
	if (!card) return;

	const itemIndex = Number(card.dataset.index);
	const selectedItem = currentGalleryItems[itemIndex];
	if (!selectedItem) return;

	openModal(selectedItem);
});

// Keyboard support: open modal with Enter on focused card
gallery.addEventListener('keydown', (event) => {
	if (event.key !== 'Enter') return;

	const card = event.target.closest('.gallery-item');
	if (!card) return;

	const itemIndex = Number(card.dataset.index);
	const selectedItem = currentGalleryItems[itemIndex];
	if (!selectedItem) return;

	openModal(selectedItem);
});

// Close modal with X button, outside click, or Escape key
modalCloseButton.addEventListener('click', closeModal);

imageModal.addEventListener('click', (event) => {
	if (event.target === imageModal) {
		closeModal();
	}
});

document.addEventListener('keydown', (event) => {
	if (event.key === 'Escape' && !imageModal.classList.contains('hidden')) {
		closeModal();
	}
});

// Optional: load the default date range immediately on page load
handleGetSpaceImages();
