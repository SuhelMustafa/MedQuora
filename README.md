# MedQuora

MedQuora is a doctor discovery and appointment management app with three role-based portals: patient, doctor, and admin. The frontend uses React, Vite, Tailwind CSS, and React Router. The API uses Express and MongoDB through Mongoose.

## Portals

- **Patient:** create an account, browse doctors, book appointments, manage a profile, view bookings, and cancel a booking.
- **Doctor:** view dashboard totals, appointment and patient details, mark bookings completed or cancelled, review earnings, and update a public profile.
- **Admin:** view clinic totals, manage appointment status, create doctor login accounts, edit doctor profiles, and activate or deactivate doctor accounts.

Doctor accounts are created by an admin. Admin credentials are bootstrapped from environment variables on first startup. Patient registration is public. Doctor earnings equal the consultation fees for appointments marked **Completed**; the app does not process payments.

## Run locally

Requirements: Node.js, npm, and MongoDB (local or hosted).

1. Copy `backend/.env.example` to `backend/.env`. Set `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` to private values.
2. In one terminal, run `cd backend && npm install && npm run dev`.
3. In another terminal, run `cd frontend && npm install && npm run dev`.
4. Open the Vite URL shown in the frontend terminal (normally `http://localhost:5173`).
5. Open `/login?role=admin` and sign in with the admin email and password configured in the backend environment. Use the admin portal to create doctor accounts.

### Doctor guide chat

The **Find care** page uses an n8n webhook to suggest relevant specialties and show matching doctors. This checkout includes a local n8n service in `docker-compose.yml`; start it with `docker compose --env-file backend/.env up -d n8n`. The `backend/.env` file needs a private `N8N_ENCRYPTION_KEY` (a random 64-character hex string) and the webhook URL `http://localhost:5678/webhook/medquora-doctor-guide`. The workflow in `backend/n8n/doctor-guide-workflow.json` is imported and published in the local n8n data volume for this setup. If you use a fresh n8n instance, import that JSON and publish the workflow.

The included workflow provides basic keyword-based directory guidance and does not diagnose conditions. You can replace its Code node with an n8n AI workflow; keep the same request and response format below and instruct the AI to recommend specialties only, avoid diagnosis or treatment advice, and return only specialties present in the request.

The backend sends `{ message, history, specialties, doctors }` and expects `{ "reply": "...", "recommendedSpecialties": ["Dermatologist"] }`. Specialty values must exactly match the supplied catalog. For a private deployment, configure Webhook Header Auth in n8n and set `N8N_DOCTOR_GUIDE_TOKEN` to the same bearer token. The chat is disabled until the webhook URL is configured.

The frontend API base defaults to `http://localhost:4000/api`. Copy `frontend/.env.example` to `frontend/.env` to change `VITE_API_URL`. Set `CLIENT_URL` in `backend/.env` if the frontend uses another origin.

## Structure

```text
backend/
  config/       MongoDB connection and admin bootstrap
  controllers/  Request handling by feature
  data/         Canonical sample doctor booking details
  middleware/   Authentication and role authorization
  models/       User, doctor, and appointment schemas
  routes/       Auth, patient, doctor, admin, and public routes
  utils/        Async handler and response serializers
  app.js        Express configuration and route mounting
  server.js     Database startup and HTTP server
  index.js      Executable entry point
frontend/src/
  assets/       Existing frontend and admin assets
  components/   Shared navigation and portal layout
  context/      Auth state, doctor data, and API helper
  pages/        Patient pages plus individual admin and doctor screens
```

## API overview

- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- Public catalog: `GET /api/doctors`, `POST /api/doctor-guide/chat` (n8n webhook required)
- Patient: `PUT /api/users/me`, `GET/POST /api/appointments`, `PATCH /api/appointments/:id/cancel`
- Doctor: `GET /api/doctor/dashboard`, `GET /api/doctor/appointments`, `PATCH /api/doctor/appointments/:id/status`, `PUT /api/doctor/profile`
- Admin: `GET /api/admin/dashboard`, doctor create/list/update/deactivate, appointment list/status management

Protected routes expect `Authorization: Bearer <token>`. The API checks the account role on every patient, doctor, and admin route.
