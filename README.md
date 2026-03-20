# DTS Developer Technical Test
> A full-stack task management application demonstrating CRUD operations.

**Hello**, please find my codetest results...

I used the starter repo's found [here](https://github.com/hmcts/dts-developer-challenge) so I could follow your IRL workflows.

I have built a CRUD for the **Tasks** hopefully meeting the requirements, beginning with a Tasks Dashboard to be found at `/` via the FE server.

I was not previously familiar with the Design/Component system - but did my best to follow practice.

## Features

- **CRUD Operations:** Create, read, update, delete tasks
- **Task Fields:** Title, description, status, due date
- **Dashboard:** Summary counts by status
- **Filtering:** Active tasks sorted by due date
- **Validation:** Required fields with error messages
- **API Documentation:** OpenAPI/Swagger UI
- **Testing:** Unit tests for utilities and routes

## Installation and development runtime

### Backend
> prerequsiste - You will need Docker installed.

(from `/backend`)
* First run `docker compose up --build`
* Thereafter `docker compose up`

API will be exposed on port `4000`
**Tasks** API Swagger: [http://localhost:4000/swagger-ui/index.html]

I used a SQLite database, and exposed the mount volume to `/data` for persistance and visibility.

### Frontend

(from `/frontend`)
* `yarn install`
* `yarn webpack`
* `yarn start:dev`

App will be exposed on port `3100`

For unit tests `yarn test:coverage`

_Thanks for looking!_
