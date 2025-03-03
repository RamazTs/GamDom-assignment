# Starting the Application

To start the application, Docker and Docker Compose need to be installed on the machine. To run the application, execute the following command in the root of the project:

```bash
docker compose -f docker-compose.dev.yml up
```

To stop the application, execute the following command:

```bash
docker compose -f docker-compose.dev.yml down
```

The react application will be avaialble on localhost:5173 and the backend will be available on localhost:5173 and the backend server on localhost:3001.

To run e2e tests on the backend, execute the following command in backend folder:

```bash
npm run test
```

Notes:
Certain points I could not address due to time limitations:

- The backend could have better test coverage (unit tests)
- The frontend could test coverage
- better authentication, currently the user is authenticated by the JWT token, and refresh token is not implemented.
- role based access control
