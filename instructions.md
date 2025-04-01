**Prerequisites
Before you begin, make sure you have the following installed:

1. Docker: Download and install Docker
2. Node.js (v16 or higher): Download and install Node.js
3. npm (comes with Node.js)

--Getting Started--
1. Clone the repository
command: git clone https://github.com/RonShlomo/popcorn/tree/main cd <your-project-directory>

2. Install the dependencies
In the project directory, install the necessary dependencies for the NestJS application.
command: npm install

3. Set up Docker and PostgreSQL
The application uses Docker to run PostgreSQL. Follow these steps:

a.Ensure you have Docker running on your system.
b. Make sure your docker-compose.yml is correctly set up (it should already be in the project).

If you want to persist database data, you can uncomment the volume section in your docker-compose.yml.
volumes:
  - ./data:/var/lib/postgresql/data  # Persist data to local disk
This will mount the ./data directory from your project to PostgreSQL's data directory in the container.

4. Start Docker Containers
To run PostgreSQL in a Docker container, execute the following command:
command: docker-compose up -d

This will start the PostgreSQL container & map the PostgreSQL container's port 5432 to the host machine's port 5432.

5. Configure the Environment Variables
Ensure that the .env file is configured with the correct PostgreSQL connection details. It should look like this:

DATABASE_URL="postgresql://popcorn-palace:popcorn-palace@db:5432/popcorn-palace?schema=public"
//popcorn-palace: Username, password, and database name as defined in docker-compose.yml.
//db: Refers to the service name of the PostgreSQL container.
//5432: Default PostgreSQL port.

6. Run Prisma Migrations (Optional)
If you're setting up a fresh database or need to apply migrations:
command: npx prisma migrate dev --name init
This will apply the migrations to your PostgreSQL database.

7. Building the Project
To build the NestJS project, run the following command:
command: npm run build
This will transpile the TypeScript code into JavaScript in the dist folder.

8. Running the Project
To start the NestJS application, run:
command: npm run start:dev
This will start the app in development mode, and you can access it at http://localhost:3000.

9. Running Tests
NestJS uses Jest for testing. To run the tests, use the following commands:
command: npm install --save-dev jest @nestjs/testing ts-jest @types/jest
command: npm run test
This will run all unit tests in the project.

To stop the running Docker containers, use:
command: docker-compose down
This will stop and remove the containers. If you want to remove the containers along with the volumes (and delete the data), use:
command: docker-compose down -v

