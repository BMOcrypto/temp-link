# TempLink - A Limited URL Shortener with Analytics

TempLink is a simple and efficient URL shortener that allows users to create links that expire after a specified duration. This project aims to provide basic analytics for each shortened link, enabling users to track their link performance.

## Features

- **URL Shortening**: Create short links from long URLs.
- **Expiration Timer**: Set a duration for links to expire.
- **Link Dashboard**: View and manage your shortened links.
- **Expired Link Page**: Inform users when a link has expired.
- **Basic Analytics**: Track the usage of your links.
- **User Accounts**: Create and manage user accounts for personalized experiences.

## Getting Started

### Prerequisites

- Node.js
- npm (Node Package Manager)
- TypeScript

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd temp-link
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on the `.env.example` file and configure your environment variables.

### Running the Application

To start the application, run:
```
npm start
```

### Running the Expiry Job

The expiry job runs automatically as a cron job. Ensure that your server is set up to handle scheduled tasks.

## API Endpoints

- **Authentication**
  - POST `/api/auth/register`: Register a new user.
  - POST `/api/auth/login`: Log in an existing user.

- **Links**
  - POST `/api/links`: Create a new shortened link.
  - GET `/api/links`: Retrieve all links for the authenticated user.
  - GET `/api/links/:id`: Retrieve a specific link by ID.

- **Analytics**
  - GET `/api/analytics/:id`: Retrieve analytics data for a specific link.

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## Contact

For any inquiries, please reach out to the project maintainers.