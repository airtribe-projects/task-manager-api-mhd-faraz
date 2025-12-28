# Task Manager API

A RESTful API for managing tasks built with Node.js and Express.js.

## Features

- ✅ Create, Read, Update, and Delete tasks
- ✅ In-memory data storage
- ✅ Input validation
- ✅ Error handling
- ✅ Filter tasks by completion status

## Installation

```bash
npm install
```

## Running the Application

```bash
node app.js
```

Server will start on `http://localhost:3000`

## Running Tests

```bash
npm test
```

## API Endpoints

### 1. Get All Tasks
**GET** `/tasks`

Optional query parameter: `?completed=true` or `?completed=false`

```bash
curl http://localhost:3000/tasks
```

### 2. Get Task by ID
**GET** `/tasks/:id`

```bash
curl http://localhost:3000/tasks/1
```

### 3. Create Task
**POST** `/tasks`

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"New Task","description":"Task description","completed":false}'
```

### 4. Update Task
**PUT** `/tasks/:id`

```bash
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'
```

### 5. Delete Task
**DELETE** `/tasks/:id`

```bash
curl -X DELETE http://localhost:3000/tasks/1
```

## Data Model

```json
{
  "id": 1,
  "title": "Task title",
  "description": "Task description",
  "completed": false
}
```

## Validation Rules

- **title**: Required, non-empty string
- **description**: Required, non-empty string
- **completed**: Optional boolean (default: false)

## Error Responses

- `400` - Bad Request (invalid input)
- `404` - Not Found (task doesn't exist)
- `500` - Internal Server Error

## Project Structure

```
task-manager-api-mhd-faraz/
├── app.js              # Main application
├── package.json        # Dependencies
├── test/
│   └── server.test.js  # Tests
└── README.md           # Documentation
```

## Technologies Used

- Node.js (>= 18.0.0)
- Express.js
- Supertest (testing)
- Tap (test framework)

## Author

Airtribe Assignment

## License

ISC