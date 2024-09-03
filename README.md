Chat and Sell 

Chat and Sell is an online marketplace application inspired by OLX. It allows users to buy and sell products with a focus on real-time chat functionality. The project is built using the MEAN stack (MongoDB, Express, Angular, Node.js) and includes a range of features to enhance the user experience.
Features
User Authentication

    JWT Authentication: Secure login and registration using JSON Web Tokens (JWT).
    Route Guards: All pages are protected with route guards to ensure only authenticated users can access them.

Product Management

    Product Listing: All products are listed on the homepage with details like name, price, and a brief description.
    Product Details: Detailed view of a product including images, seller profile, and options to zoom images, copy the product URL, and view the seller's profile.
    Chat with Seller: Directly chat with the seller via a button that sends an initial message, "Hi, myself [username] and I am interested in your ad."

Ad Posting

    Post Ad: Users can post their products for sale by filling out a form and uploading up to 3 images of the product.
    Image Upload: Images are handled using Multer in the backend for secure file uploads.
    Ad Expiry: Ads automatically expire after 30 days using a Node.js cron job that runs every midnight.

Sponsored Ads

    Sponsor Ad: Users can sponsor their ads to have them displayed at the top of the product listing.
    Boosted Ads: Sponsored ads appear prominently in the product listing to attract more views.

User Dashboard

    My Ads: Users can view all the ads they have posted, with options to delete ads or view expired ads (greyed out after 30 days).
    My Wishlist: Users can add products to their wishlist and view them under the "My Wishlist" section.
    Chat: Real-time chat feature where users can see all their conversations and chat with sellers about specific products.

Real-Time Communication

    Socket.io: Integrated real-time chat functionality allowing seamless communication between buyers and sellers.

Tech Stack
Frontend

    Angular: Used for building the user interface and handling client-side logic.
    Toaster: For displaying user-friendly notifications throughout the app.

Backend

    Node.js & Express: Backend server and API implementation.
    MongoDB: Database for storing user data, product information, and chat messages.
    Multer: Middleware for handling image uploads.
    Node Cron: Scheduled tasks to handle ad expiration automatically.

Real-Time Communication

    Socket.io: For implementing real-time chat between users.

Installation
Prerequisites

    Node.js
    MongoDB
    Angular CLI

Setup

    Clone the repository:

    bash

git clone https://github.com/yourusername/Chat-and-Sell.git
cd Chat-and-Sell

Install backend dependencies:

bash

cd OLX_Server
npm install

Install frontend dependencies:

bash

cd ../Olx_Client
npm install

Set up environment variables:

    Create a .env file in the OLX_Server directory with the following:

    bash

    MONGO_URI=your_mongo_connection_string
    JWT_SECRET=your_jwt_secret

Run the backend server:

bash

cd OLX_Server
npm start

Run the frontend server:

bash

    cd ../Olx_Client
    ng serve

    Access the application:
        Open your browser and navigate to http://localhost:4200.

Usage

    Register/Login: Create an account or log in to start using the platform.
    Browse Products: Explore the listed products on the homepage.
    Post an Ad: Post a new product for sale through the "Post Ad" page.
    Chat with Sellers: Click on "Chat with Seller" to start a conversation about a product.
    Manage Ads: Go to "

"My Ads" to manage your posted ads, sponsor them, or delete them if necessary.

    Add to Wishlist: Save products you're interested in by adding them to your wishlist.
    Real-Time Chat: Use the chat feature to communicate in real-time with sellers.

Project Structure
Backend (OLX_Server)

    Controllers: Handles the application logic and interacts with services.
    Services: Contains the business logic for user management, product management, and chat functionality.
    Utils: Utility functions for tasks like database connections, encryption, and decryption.

Frontend (Olx_Client)

    Components: Contains Angular components for the navbar, product listing, product details, ad posting, chat, etc.
    Models: Defines the data structures used throughout the application, such as user, product, and chat models.
    Services: Handles API calls, local storage, and authentication.

Contribution

Contributions are welcome! Please feel free to submit a pull request or open an issue if you find any bugs or have suggestions for new features.


Chat & Sell Visuals:

![Screenshot from 2024-09-02 12-14-24](https://github.com/user-attachments/assets/c131f8f8-f122-4066-8797-f697416d45d3)
![Screenshot from 2024-09-02 12-16-49](https://github.com/user-attachments/assets/73f9462f-7b90-42ed-9af6-524fddf780f4)
![Screenshot from 2024-09-02 12-17-37](https://github.com/user-attachments/assets/c1b747ee-cecc-4c5f-afe6-d57ca7aeb990)
![Screenshot from 2024-09-02 12-20-48](https://github.com/user-attachments/assets/41f64202-f0ca-4829-b292-d0bf769e30ab)
![Screenshot from 2024-09-02 12-22-03](https://github.com/user-attachments/assets/5446654c-f5ca-4912-9848-52e985cc7bad)
![Screenshot from 2024-09-02 12-22-27](https://github.com/user-attachments/assets/1b843cfa-719c-48c5-9010-f53c5fb5116a)
![Screenshot from 2024-09-02 12-24-35](https://github.com/user-attachments/assets/c275246b-5c86-4bd0-acc1-9d78d90f7c49)
![Screenshot from 2024-09-02 12-26-00](https://github.com/user-attachments/assets/980c7f03-fbef-461f-86a7-e34a15c89e3d)
![Screenshot from 2024-09-02 12-28-17](https://github.com/user-attachments/assets/0cc46576-db36-4772-862a-9627d4ece23e)
![Screenshot from 2024-09-02 12-30-08](https://github.com/user-attachments/assets/f57c8253-171c-4f5e-9e4f-4b08900bc7bf)
![Screenshot from 2024-09-02 12-30-57](https://github.com/user-attachments/assets/59b23f91-6250-4e77-ae0c-e1cdeb36587f)
![Screenshot from 2024-09-02 12-31-48](https://github.com/user-attachments/assets/c76f2226-6853-4e3f-a8fb-050a01611a30)
![Screenshot from 2024-09-02 12-32-12](https://github.com/user-attachments/assets/77aacd24-a268-470e-bb20-40a5b2faa003)
![Screenshot from 2024-09-02 12-32-51](https://github.com/user-attachments/assets/2b642a23-196c-415f-8ac7-0005d055b8c4)
