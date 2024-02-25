# Warehouse.io Assignment

This project is a solution to the Warehouse.io internship assignment, creating a web application that interacts with a Google Sheet to visualize and manage tabular data. The project is divided into frontend and backend components, utilizing React for the frontend, Node.js with Express for the backend, and Google Sheets for data storage.

## Features

- **Data Visualization:** The frontend application displays data from a Google Sheet in a tabular format, providing users with an organized view of the information.

- **Synchronization:** Users can sync the frontend application with the Google Sheet by clicking the "Sync" button. This fetches the latest data from the sheet and updates the UI accordingly.

- **Adding New Rows:** The application allows users to add new rows to the Google Sheet through a user-friendly modal. Users can input avatar names and performance scores to create new entries.

## Project Structure

### Frontend

- **Technology:** React with Chakra UI for styling.
- **File Structure:**
  - `src/App.js`: Main component wrapping the entire application.
  - `src/components/TableView.js`: Table component handling data rendering, synchronization, and new row addition.
  - `src/App.css`: Stylesheet for the application.

### Backend

- **Technology:** Node.js with Express.
- **File Structure:**
  - `server.js`: Backend server handling API routes for syncing data and adding new rows to the Google Sheet.

## Setup Instructions

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/AdityaNarayan05/Warehouse.git
   cd warehouse
  bash
  Copy code
  # Install backend dependencies
  cd backend
  npm install
  
  # Install frontend dependencies
  cd ../frontend
  npm install
  Configure Google Sheets API Credentials:
  
  Obtain Google Sheets API credentials (client email and private key) and save them in backend/secret-key.json.
  Run the Application:
  
  bash
  Copy code
  # Start the backend server
  cd backend
  npm start
  
  # Start the frontend application
  cd ../frontend
  npm start
  Access the application at http://localhost:3000 in your browser.
  
  Additional Notes
  Ensure that the backend server is running before interacting with the frontend to sync data or add new rows.
  Make sure to handle your Google Sheets API credentials securely, especially in production environments.
  Feel free to explore deployment options for both the frontend and backend, and update the API base URL accordingly.

  #Here are some Screenshots of the projects
  ![image](https://github.com/AdityaNarayan05/Warehouse/assets/85832994/1acdbaa8-8486-4f90-a14f-b865776b824d)

  ![image](https://github.com/AdityaNarayan05/Warehouse/assets/85832994/3ef41ee6-aae2-491e-8f5b-d96cf3ca12bd)

  ![image](https://github.com/AdityaNarayan05/Warehouse/assets/85832994/69527bff-bca1-4fd1-b4fc-341a0b7f2130)



