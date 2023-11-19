## Setup

**Note:** For this exercise, we have provided an `.env` file with the database connection string. Normally, you would not commit this file to version control. We are doing it here for simplicity and given that we are using a local SQLite database.

## Migrations

Before running the migrations, we need to create a database. We can do this by running the following command:

```bash
npm run migrate:latest
```

## Running the server

In development mode:

```bash
npm run dev
```

In production mode:

```bash
npm run start
```

## Updating types

If you make changes to the database schema, you will need to update the types. You can do this by running the following command:

```bash
npm run generate-types
```


## Database Schema

### Users
- **id**: Unique identifier for users.
- **username**: User's username (discord username).

### Sprints
- **id**: Unique identifier for sprints.
- **sprint_code**: Sprint's code.
- **title**: Sprint's title.

### Templates
- **id**: Unique identifier for templates.
- **content**: Template's content.

### Messages
- **id**: Unique identifier for messages.
- **user_id**: Reference to the user who completed a sprint.
- **sprint_id**: Reference to the sprint associated with the message.
- **template_id**: Reference to the template used for the message.

## Users Endpoint

### `POST /`
Creates a new user.

- Request body should contain user data (username).
- Returns a `201 Created` status code if successful.

### `GET /`
Fetches all users.

### `GET /:id`
Fetches a specific user by ID.

- The user ID should be included in the URL.
- Throws a `UserNotFound` error if the user does not exist.

### `DELETE /:id`
Deletes a specific user by ID.

- The user ID should be included in the URL.
- Throws a `UserNotFound` error if the user does not exist.

### `PATCH /:id`
Updates a specific user by ID.

- The user ID should be included in the URL.
- Request body should contain the updated user data (the new username).
- Throws a `UserNotFound` error if the user does not exist.

### `PUT /:id`
This route is not supported.

## Template Endpoint

### `POST /`
Creates a new template.

- Request body should contain template data (content).
- Returns a `201 Created` status code if successful.

### `GET /`
Fetches all templates.

### `GET /:id`
Fetches a specific template by ID.

- The template ID should be included in the URL.
- Throws a `NotFound` error with the message 'Template not found' if the template does not exist.

### `DELETE /:id`
Deletes a specific template by ID.

- The template ID should be included in the URL.
- Throws a `NotFound` error with the message 'Template not found' if the template does not exist.

### `PATCH /:id`
Updates a specific template by ID.

- The template ID should be included in the URL.
- Request body should contain the updated template data (content).
- Throws a `NotFound` error with the message 'Template not found' if the template does not exist.

### `PUT /:id`
This route is not supported.

## Sprints Endpoint

### `POST /`
Creates a new sprint.

- Request body should contain sprint data (sprintCode, title).
- Returns a `201 Created` status code if successful.

### `GET /`
Fetches all sprints.

### `GET /:id`
Fetches a specific sprint by ID.

- The sprint ID should be included in the URL.
- Throws a `SprintNotFound` error if the sprint does not exist.

### `DELETE /:id`
Deletes a specific sprint by ID.

- The sprint ID should be included in the URL.
- Throws a `SprintNotFound` error if the sprint does not exist.

### `PATCH /:id`
Updates a specific sprint by ID.

- The sprint ID should be included in the URL.
- Request body should contain the updated sprint data (sprintCode & title, or can be either doesn't need to be both).
- Throws a `SprintNotFound` error if the sprint does not exist.

### `PUT /:id`
This route is not supported.

## Messages Endpoint

### `POST /`
Creates a new message.

- Request body should contain `userId` and `sprintId`.
- A random template is selected, and a message is sent via Discord.
- The `templateId` is selected randomly.
- Returns a `201 Created` status code if successful.

### `GET /`
Fetches messages.

- If `sprintCode` is provided in the request body, it fetches messages related to the sprint with that code.
- If `username` is provided in the request body, it fetches messages related to the user with that username.
- If neither `sprintCode` nor `username` is provided, it fetches all messages.

### `GET /:id`, `DELETE /:id`, `PATCH /:id`, `PUT /:id`
These routes are not supported.
