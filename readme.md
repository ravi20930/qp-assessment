# Grocery Booking API

This project is a Grocery Booking API that facilitates managing grocery items, user authentication, user profiles, orders, and administrative tasks.

## Technologies Used

- **TypeScript**
- **Express.js**
- **Sequelize**
- **MySQL**
- **Google OAuth**

## Functionality

- Users can create orders, view profile, and view top selling items.
- Admins can manage grocery items, view all users & revenue.

## Model Structure

1. **User**: Represents users of the system.
2. **Group**: Defines user groups for organizational purposes.
3. **UserGroup**: Represents the association between users and groups.
4. **Order**: Represents orders placed by customers.
5. **GroceryItem**: Represents grocery items available for booking.

## Endpoints

### Authentication

- **POST /api/auth/google/login**: Initiates Google OAuth2 login.
- **GET /api/auth/google/callback**: Handles Google OAuth2 callback.

### User Routes

- **GET /api/user/profile**: Retrieves user profile information.
- **POST /api/user/create-order**: Creates a new order.
- **GET /api/user/grocery-items**: Retrieves all available grocery items.
- **GET /api/user/top-sellers**: Retrieves top-selling grocery items.

### Admin Routes

- **GET /api/admin/users**: Retrieves all users.
- **POST /api/admin/create-admin**: Creates a new admin user.
- **GET /api/admin/revenue**: Retrieves revenue statistics.
- **GET /api/admin/grocery-items**: Retrieves all grocery items.
- **POST /api/admin/add-grocery-item**: Adds a new grocery item.
- **DELETE /api/admin/remove-grocery-item/:id**: Removes a grocery item by ID.
- **PUT /api/admin/update-grocery-item/:id**: Updates details of a grocery item by ID.
- **POST /api/admin/manage-grocery-inventory/:id**: Manages inventory levels of a grocery item by ID.

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/ravi20930/grocery-api
   ```

2. Install dependencies using Yarn:

   ```
   yarn install
   ```

3. Set up the MySQL database and update the database configuration in the `.env` file. Provide values for the following variables:

   ```plaintext
   DB_CONNECTION=mysql
   DB_HOST=<database_host>
   DB_DATABASE=grocery
   DB_USERNAME=<database_username>
   DB_PASSWORD=<database_password>
   ```

4. Update JWT secrets, expiry times, and Google OAuth credentials in the `.env` file.

5. Final `.env` should look like this along with their values:

   ```plaintext
   NODE_ENV=development
   PORT=3009
   DB_SYNC_FLAG=true

   DB_CONNECTION=mysql
   DB_HOST=localhost
   DB_DATABASE=grocery
   DB_USERNAME=root
   DB_PASSWORD=password

   JWT_ACCESS_SECRET=
   JWT_ACCESS_EXPIRY=7d
   JWT_REFRESH_SECRET=
   JWT_REFRESH_EXPIRY=30d

   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=
   GOOGLE_AUTH_CALLBACK_URL=http://localhost:3009/api/auth/google/callback
   ```

6. First admin must be inserted manually into the database for security concerns. User will be created after google login.

```
INSERT INTO Groups (id, name, createdAt, updatedAt) VALUES (<UUID>, 'ADMIN', NOW(), NOW());
INSERT INTO UserGroups (id, groupId, userId, createdAt, updatedAt) VALUES (<UUID>, <GROUP_ID>, <USER_ID>, NOW(), NOW());
```

7. Start the server:

```
yarn build
yarn start
```

Ensure all environment variables are properly configured to run the application smoothly.
