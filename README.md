# NASA Space Explorer

NASA Space Explorer is a web application that lets you explore NASA's Astronomy Picture of the Day (APOD) archive. Choose a start and end date, then load a gallery of space images and videos with their titles, dates, and descriptions.

The app fetches live data from NASA's APOD API and displays the results in a responsive gallery. Clicking an item opens a modal with more details, and video entries can be viewed directly in the app or opened in a new tab.

## Technologies Used

- HTML for the page structure
- CSS for layout and styling
- JavaScript for fetching data, rendering the gallery, and handling the modal interactions
- NASA APOD API for the space imagery and metadata
- `dateRange.js` for setting valid date limits and default dates

## How It Works

1. Select a start date and end date.
2. Click the button to fetch APOD entries from NASA.
3. Browse the gallery and open any item for more details.

## Project Files

- `index.html` contains the page structure.
- `style.css` contains the visual styles.
- `js/script.js` contains the app logic.
- `js/dateRange.js` sets the allowed date range.
