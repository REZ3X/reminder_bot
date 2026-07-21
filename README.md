# Reminder Bot — Backend Proxy

A Next.js backend proxy that integrates with **Google Calendar API** to provide CRUD reminder operations, designed to work with **Botika Agentic Platform** chatbot workflows.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [1. Setup Google Calendar API \& Service Account](#1-setup-google-calendar-api--service-account)
- [2. Setup Google Calendar](#2-setup-google-calendar)
- [3. Setup Backend Proxy](#3-setup-backend-proxy)
- [4. Deploy Backend Proxy](#4-deploy-backend-proxy)
- [5. Chatbot Intent (Platform v2)](#5-chatbot-intent-platform-v2)
- [6. Chatbot Workflow (Platform v3 / Agentic Platform)](#6-chatbot-workflow-platform-v3--agentic-platform)
- [API Reference](#api-reference)

---

## Prerequisites

| # | Requirement | Notes |
|---|-------------|-------|
| 1 | Google Account | Required for Google Cloud Console & Calendar |
| 2 | Google Cloud Console Project | Any existing or new project |
| 3 | GitHub Account | For repository hosting |
| 4 | Vercel Account | Connected to your GitHub Account |
| 5 | Git | Version control |
| 6 | Node.js 22+ | Runtime environment |
| 7 | IDE | Preferably integrated with GitHub |
| 8 | Botika Account | Access to Platform v2 & v3 |
| 9 | Postman *(optional)* | For API testing |

---

## 1. Setup Google Calendar API & Service Account

### 1.1 Enable Google Calendar API

1. Go to [Google Cloud Console](https://console.cloud.google.com/). Ensure you have an active project — if not, create one.
2. Navigate to **API & Services** → **Enabled APIs & services**.
3. Click **"Enable APIs and services"**.
4. Search for **Google Calendar API** and enable it.

![Enable APIs & Services](public/chatbot/images/APIs.png)

![Google Calendar API](public/chatbot/images/calendar.png)

### 1.2 Create a Service Account

1. In the same project, navigate to **IAM & Admin** → **Service Accounts**.

![IAM & Admin](public/chatbot/images/IAMADMIN.png)

2. Click **"Create Service Account"** and follow the prompts.
3. After creation, click the **three-dot menu (⋮)** on your new service account and select **"Manage keys"**.

![Manage Keys](public/chatbot/images/3dots-managekeys.png)

4. Click **"Add key"** → **"Create new key"** → select **JSON** format.
5. A JSON file will be downloaded automatically. **Save this file securely.**

> [!NOTE]
> The downloaded JSON has the following structure. You will need the `private_key` and `client_email` values later.

```json
{
  "type": "service_account",
  "project_id": "<project-id>",
  "private_key_id": "<key-id>",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "google-calendar@<project-id>.iam.gserviceaccount.com",
  "client_id": "<client-id>",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/...",
  "universe_domain": "googleapis.com"
}
```

---

## 2. Setup Google Calendar

1. Go to [Google Calendar](https://calendar.google.com/).
2. Open **Settings**, then scroll down to **"Settings for my calendars"**. Select your desired calendar.

![Choose Calendar](public/chatbot/images/chooseCalendar.png)

3. Scroll down to the **"Share with specific people or groups"** section.

![Shared With Section](public/chatbot/images/sharedwith.png)

4. Click **"Add people and groups"** and enter the **Service Account email** from your Google Cloud Console (the `client_email` value in the JSON).
5. Set the permission to **"Make changes to events"**.

![Share with Service Account](public/chatbot/images/sharewithserviceaccount.png)

6. Scroll down to the **"Integrate calendar"** section and copy the **Calendar ID**.

> [!TIP]
> If you selected your primary calendar, the Calendar ID is usually your Google email address.

![Calendar ID](public/chatbot/images/calD.png)

---

## 3. Setup Backend Proxy

### 3.1 Clone the Repository

```bash
git clone https://github.com/REZ3X/reminder_bot.git
cd reminder_bot
```

### 3.2 Configure Environment Variables

```bash
cp .env.example .env
```

Open the `.env` file and fill in the following variables:

| Variable | Description | Source |
|----------|-------------|--------|
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Service Account email | `client_email` field in the downloaded JSON |
| `GOOGLE_PRIVATE_KEY` | Private key string | `private_key` field in the downloaded JSON |
| `GOOGLE_CALENDAR_ID` | Calendar ID | "Integrate calendar" section in Google Calendar settings |

### 3.3 Install Dependencies

```bash
npm install
```

### 3.4 Test Locally

1. Start the development server:

   ```bash
   npm run dev
   ```

2. The server will be available at `http://localhost:3000`.

3. Use **Postman** (or any API client) to test the endpoints. Refer to the [API Reference](#api-reference) section below for endpoint details, example parameters, and expected responses.

### 3.5 Push to GitHub

Push the code to your own GitHub repository using Git or your IDE's built-in source control.

> [!IMPORTANT]
> Ensure your GitHub account is integrated with your IDE and that Git is installed on your system.

![GitHub Repository](public/chatbot/images/repo.png)

---

## 4. Deploy Backend Proxy

### 4.1 Deploy on Vercel

1. Go to [Vercel](https://vercel.com/) and navigate to your dashboard.
2. Click **"Add new"** → **"Project"**.
3. Import your backend proxy GitHub repository.

![Import Repository](public/chatbot/images/importrepo.png)

4. Under **Environment Variables**, copy the entire content of your `.env` file and paste it into the Vercel environment variable field.
5. Click **Deploy** and wait for the deployment to complete.

![Deployment](public/chatbot/images/deployment.png)

### 4.2 Domain Setup

Vercel provides a free domain. Your API endpoints will be available at:

```
https://<your-domain>/api/reminder/<operation>
```

You may also configure a custom domain on Vercel if desired.

![Domain Settings](public/chatbot/images/domain.png)

> [!NOTE]
> Refer to the [API Reference](#api-reference) section for the full list of endpoints, parameters, and response formats.

---

## 5. Chatbot Intent (Platform v2)

### 5.1 Import Intents

1. Download the intent CSV file: [`intent_reminder.csv`](chatbot/intent/intent_reminder.csv)
2. Open and log in to [Botika Platform v2](https://platform.botika.online/app).
3. Create a **new blank rule**.
4. Copy the **Rule ID** from the URL: `https://platform.botika.online/app/graph/<ruleID>`
5. Go to the **Intents** tab and click **Import intents**. Upload the `intent_reminder.csv` file.
6. Click **Train** the intent model.

> [!WARNING]
> Training may take some time — typically up to 1–2 hours. You can proceed to set up the workflow while waiting.

### 5.2 Intent Reference

| Intent Name | Description |
|-------------|-------------|
| `#usr.reminderCreate` | User intent to **create** a reminder |
| `#usr.reminderEdit` | User intent to **edit** an existing reminder |
| `#usr.reminderList` | User intent to **list/show** reminders |
| `#usr.reminderDelete` | User intent to **delete** a reminder |

---

## 6. Chatbot Workflow (Platform v3 / Agentic Platform)

### 6.1 Initial Setup

1. Open and log in to [Botika Platform v3 / Agentic Platform](https://platform.botika.online/gpt).
2. Create a **new blank bot**.

### 6.2 Persona Configuration

1. Go to the **"Persona"** tab.
2. Copy the persona from [`persona.md`](chatbot/persona/persona.md) and paste it into the **Input Description** field.
3. Save the configuration.

### 6.3 Knowledge Base Setup

1. Go to the **"Knowledge Base"** section.
2. Download the knowledge base file: [`reminder-bot-kb.xlsx`](chatbot/knowledge_base/reminder-bot-kb.xlsx)
3. Click the **"+"** button → **"Import Excel File"** and upload the file.
4. Save after the import completes.

### 6.4 Workflow Configuration

![Workflow Overview](public/chatbot/images/v2.png)

1. Go to the **"Workflow"** tab.

#### Key Nodes Used

The following table describes the key workflow nodes used in this project. Click the links for detailed documentation.

| # | Node Type | Description | Reference |
|---|-----------|-------------|-----------|
| 1 | **Start** | Entry point of the workflow; handles multi-channel triggers and cross-channel messaging. | [Docs](https://client.botika.online/docs/agentic-platform/node/start-node.html) |
| 2 | **Intent Classification** | Classifies user intent using trained NLP models to understand user goals and route conversations. | [Docs](https://client.botika.online/docs/agentic-platform/node/intent-classification.html) |
| 3 | **Switch** | Handles multiple conditional paths efficiently, similar to a switch-case statement in programming. | [Docs](https://client.botika.online/docs/agentic-platform/node/switch.html) |
| 4 | **Agent Assistant** | Advanced LLM processing with agent capabilities for complex conversational AI tasks. | [Docs](https://client.botika.online/docs/agentic-platform/node/agent-assistant.html) |
| 5 | **Entity LLM** | Extracts structured entities from user input using LLM-based parsing. | [Docs](https://client.botika.online/docs/agentic-platform/node/entity-llm.html) |
| 6 | **Set User Variable** | Stores and manages user-specific variables that persist across conversation turns. | [Docs](https://client.botika.online/docs/agentic-platform/node/set-user-var.html) |
| 7 | **HTTP Request** | Makes external HTTP/API calls to interact with third-party services (e.g., this proxy). | [Docs](https://client.botika.online/docs/agentic-platform/node/http-request.html) |
| 8 | **Response Formatter** | Formats and structures the final response text before delivering to the user. | [Docs](https://client.botika.online/docs/agentic-platform/node/response-formatter.html) |
| 9 | **Auto Integration** | Automatically sends the response through the originating messaging platform. | [Docs](https://client.botika.online/docs/agentic-platform/node/integration/auto.html) |

#### Step-by-Step Workflow Setup

##### A. Start → Intent Classification → Switch

1. Connect the **Start** node to a new **Intent Classification** node:
   - **Rule ID**: Enter the Rule ID copied from Platform v2 URL (`https://platform.botika.online/app/graph/<ruleID>`).

2. Connect the **Intent Classification** node to a new **Switch** node (label: `Main`).

3. Configure the **Switch** node with the following rules:

   | Rule # | Condition | Intent |
   |--------|-----------|--------|
   | 1 | `{{node_output.intent}}` string equals (case insensitive) | `usr.reminderCreate` |
   | 2 | `{{node_output.intent}}` string equals (case insensitive) | `usr.reminderEdit` |
   | 3 | `{{node_output.intent}}` string equals (case insensitive) | `usr.reminderList` |
   | 4 | `{{node_output.intent}}` string equals (case insensitive) | `usr.reminderDelete` |
   | 5 | Fallback (default) | — |

##### B. Intent Branches

###### B.1 — `usr.reminderCreate` Branch

| Step | Node Type | Label | Description |
|------|-----------|-------|-------------|
| 1 | Agent Assistant | `Grab Context` | <!-- TODO: Fill description --> |
| 2 | Entity LLM | `Retrieve Data` | <!-- TODO: Fill description --> |
| 3 | Set User Variable | `Save Data` | <!-- TODO: Fill description --> |
| 4 | HTTP Request | `Create API` | <!-- TODO: Fill description --> |
| 5 | Agent Assistant | `Response Formatting` | <!-- TODO: Fill description --> |

###### B.2 — `usr.reminderEdit` Branch

| Step | Node Type | Label | Description |
|------|-----------|-------|-------------|
| 1 | Agent Assistant | `Grab Context` | <!-- TODO: Fill description --> |
| 2 | Entity LLM | `Retrieve Data` | <!-- TODO: Fill description --> |
| 3 | Set User Variable | `Save Data` | <!-- TODO: Fill description --> |
| 4 | HTTP Request | `Edit API` | <!-- TODO: Fill description --> |
| 5 | Agent Assistant | `Response Formatting` | <!-- TODO: Fill description --> |

###### B.3 — `usr.reminderList` Branch

| Step | Node Type | Label | Description |
|------|-----------|-------|-------------|
| 1 | Agent Assistant | `Grab Context` | <!-- TODO: Fill description --> |
| 2 | Entity LLM | `Retrieve Params` | <!-- TODO: Fill description --> |
| 3 | Set User Variable | `Store Params` | <!-- TODO: Fill description --> |
| 4 | HTTP Request | `List API` | <!-- TODO: Fill description --> |
| 5 | Set User Variable | `Store List` | <!-- TODO: Fill description --> |
| 6 | Agent Assistant | `Formatting` | <!-- TODO: Fill description --> |

###### B.4 — `usr.reminderDelete` Branch

| Step | Node Type | Label | Description |
|------|-----------|-------|-------------|
| 1 | Agent Assistant | `Grab Context` | <!-- TODO: Fill description --> |
| 2 | Entity LLM | `Retrieve Params` | <!-- TODO: Fill description --> |
| 3 | Set User Variable | *(default)* | <!-- TODO: Fill description --> |
| 4 | HTTP Request | `Delete API` | <!-- TODO: Fill description --> |
| 5 | Agent Assistant | `Response Formatting` | <!-- TODO: Fill description --> |

###### B.5 — Fallback Branch

| Step | Node Type | Label | Description |
|------|-----------|-------|-------------|
| 1 | Agent Assistant | `Fallback KB` | <!-- TODO: Fill description --> |

##### C. Global End

1. Add a new **Response Formatter** node (label: `Global Formatting`).
2. Connect **all** terminal Agent Assistant nodes from every branch to this node.
3. Connect the **Response Formatter** node to a new **Auto Integration** node.

### 6.5 Testing & Integration

1. Test your workflow directly using the **"Test Workflow"** feature in the Agentic Platform.
2. *(Optional)* Integrate with **Botika Webchat**:
   - Click the **"+"** button on the Start node and configure your webchat settings.
   - The webchat URL can be found under the **"Integration"** tab → **"Webchat"**.
   - Open the Webchat URL (e.g., `https://chat.botika.online/v3/<id>`) to test your bot.

---

## API Reference

All endpoints use the **POST** method and accept/return **JSON**.

**Base URL:** `https://<your-domain>/api/reminder/`

---

### `POST /api/reminder/create-reminder`

Creates a new reminder event in Google Calendar.

**Request Body:**

```json
{
  "date": "2026-07-21",
  "start_time": "2026-07-21T08:00:00",
  "end_time": "2026-07-21T08:15:00",
  "summary": "Minum Obat",
  "reference_datetime": "2026-07-20T13:52:59"
}
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `start_time` | `string` | ✅ | ISO 8601 start datetime |
| `end_time` | `string` | ✅ | ISO 8601 end datetime |
| `summary` | `string` | ❌ | Event title (defaults to `"Reminder"`) |
| `timeZone` | `string` | ❌ | Timezone (defaults to `"Asia/Jakarta"`) |

**Success Response (`200`):**

```json
{
  "success": true,
  "event_id": "abc123xyz",
  "html_link": "https://www.google.com/calendar/event?eid=..."
}
```

**Error Response (`400`):**

```json
{
  "success": false,
  "error": "Missing start_time or end_time"
}
```

---

### `POST /api/reminder/list-reminder`

Lists reminder events from Google Calendar within a time range.

**Request Body:**

```json
{
  "timeMin": "2026-07-20T00:00:00+07:00",
  "timeMax": "2026-07-26T23:59:59+07:00",
  "maxResults": 20
}
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `timeMin` | `string` | ❌ | ISO 8601 start of range (defaults to current time) |
| `timeMax` | `string` | ❌ | ISO 8601 end of range |
| `maxResults` | `number` | ❌ | Maximum events to return (defaults to `20`) |

**Success Response (`200`):**

```json
{
  "success": true,
  "count": 2,
  "reminders": [
    {
      "id": "abc123xyz",
      "summary": "Minum Obat",
      "start": "2026-07-21T08:00:00+07:00",
      "end": "2026-07-21T08:15:00+07:00",
      "timeZone": "Asia/Jakarta",
      "status": "confirmed",
      "html_link": "https://www.google.com/calendar/event?eid=..."
    },
    {
      "id": "def456uvw",
      "summary": "Meeting Sama Klien",
      "start": "2026-07-22T10:00:00+07:00",
      "end": "2026-07-22T11:00:00+07:00",
      "timeZone": "Asia/Jakarta",
      "status": "confirmed",
      "html_link": "https://www.google.com/calendar/event?eid=..."
    }
  ]
}
```

---

### `POST /api/reminder/edit-reminder`

Edits an existing reminder event in Google Calendar.

**Request Body:**

```json
{
  "id": "def456uvw",
  "candidates": [],
  "new_summary": "Review Project",
  "new_date": "2026-07-23",
  "new_start_time": "2026-07-23T15:00:00",
  "new_end_time": null
}
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | `string` | ✅ | Event ID of the reminder to edit |
| `new_summary` | `string` | ❌ | Updated event title |
| `new_start_time` | `string` | ❌ | Updated start datetime |
| `new_end_time` | `string` | ❌ | Updated end datetime |
| `timeZone` | `string` | ❌ | Timezone (defaults to `"Asia/Jakarta"`) |

> [!NOTE]
> At least one of `new_summary`, `new_start_time`, or `new_end_time` must be provided.

**Success Response (`200`):**

```json
{
  "success": true,
  "event_id": "def456uvw",
  "summary": "Review Project",
  "start": {
    "dateTime": "2026-07-23T15:00:00+07:00",
    "timeZone": "Asia/Jakarta"
  },
  "end": {
    "dateTime": "2026-07-23T16:00:00+07:00",
    "timeZone": "Asia/Jakarta"
  },
  "html_link": "https://www.google.com/calendar/event?eid=...",
  "fields_updated": ["summary", "start"]
}
```

**Error Response (`400`):**

```json
{
  "success": false,
  "error": "Missing or invalid reminder id"
}
```

**Error Response (`404`):**

```json
{
  "success": false,
  "error": "Reminder not found"
}
```

---

### `POST /api/reminder/delete-reminder`

Deletes a reminder event from Google Calendar.

**Request Body:**

```json
{
  "id": "def456uvw",
  "candidates": []
}
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | `string` | ✅ | Event ID of the reminder to delete |

**Success Response (`200`):**

```json
{
  "success": true,
  "deleted_id": "def456uvw"
}
```

**Error Response (`400`):**

```json
{
  "success": false,
  "error": "Missing or invalid reminder id"
}
```

**Error Response (`404`):**

```json
{
  "success": false,
  "error": "Reminder not found or already deleted"
}
```

---

## Working Bot Footage

<!-- TODO: Add working bot footage/screenshots/recordings here -->
