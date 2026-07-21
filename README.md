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
- [Known Issues](#known-issues)

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

---

###### B.1 — `usr.reminderCreate` Branch

**Step 1.** Connect the branch to a new **Agent Assistant** node (label: `Grab Context`).

- **Embed Knowledge Base**: ❌ Disabled
- **Task for AI**:

> You are a data retrieval engine for calendar reminder requests. Extract ONLY the following fields from `{{user.message}}`. Do not generate any explanation, confirmation, or elaborating text — output structured data only.
>
> **Fields to retrieve:**
>
> | Field | Rules | Output Format |
> |-------|-------|---------------|
> | `date` | Extract user's intended date, resolve relative expressions using `{{date}}` as anchor. If not mentioned, `null`. | `yyyy-mm-dd` |
> | `start_time` | Extract the first time mentioned. Combine with resolved date. If not mentioned, `null`. | `yyyy-mm-ddThh:mm:ss` |
> | `end_time` | Default: `start_time` + 15 minutes, unless user specifies duration/end time. If `start_time` is `null`, this is also `null`. | `yyyy-mm-ddThh:mm:ss` |
> | `summary` | Extract reminder subject in title case. Strip filler/intent phrasing. Keep user's language. If no subject, `null`. | String (title case) |
> | `reference_datetime` | Always `{{datetime}}`. Not user-extracted. | `yyyy-mm-ddThh:mm:ss` |

**Step 2.** Connect to a new **Entity LLM** node (label: `Retrieve Data`).

| Field Name | Description | Example |
|------------|-------------|---------|
| `date` | Date intended by the user to set the reminder/event | `2007-06-17` |
| `start_time` | Start time defined by user | `2007-06-17 10:18:47` |
| `end_time` | End time defined by user (could be empty or null) | `2007-06-17 10:18:47` |
| `reference_datetime` | Fixed by datetime | `2007-06-17 10:18:47` |
| `summary` | Summary described by the user (goal of the reminder) | — |

**Step 3.** Connect to a new **Set User Variable** node (label: `Save Data`).

| Type | Variable Name | Value |
|------|---------------|-------|
| String | `user_date` | `{{node_output.date}}` |
| String | `start_time` | `{{node_output.start_time}}` |
| String | `end_time` | `{{node_output.end_time}}` |
| String | `reference_datetime` | `{{node_output.reference_datetime}}` |
| String | `summary` | `{{node_output.summary}}` |

**Step 4.** Connect to a new **HTTP Request** node (label: `Create API`).

- **URL**: `https://<your-domain>/api/reminder/create-reminder`
- **Body**:

```json
{
  "summary": "{{summary}}",
  "end_time": "{{end_time}}",
  "timeZone": "Asia/Jakarta",
  "start_time": "{{start_time}}"
}
```

**Step 5.** Connect to a new **Agent Assistant** node (label: `Response Formatting`).

- **Embed Knowledge Base**: ❌ Disabled
- **Task for AI**:

> You are a strict, deterministic response generator. You do NOT have creative freedom. You must follow the exact rule below with no exceptions.
>
> **INPUT:** `{{node_output.status_code}}`
>
> **RULE (follow exactly, no deviation):**
> - IF `status_code == 200` → output ONLY the fixed success message below, translated to match the user's language (`{{user.message}}`). Do not add, remove, or rephrase anything else.
> - IF `status_code != 200` → output ONLY the fixed error message below, translated to match the user's language. Do not add, remove, or rephrase anything else.
>
> **FIXED SUCCESS MESSAGE:**
> - Indonesian: "Reminder telah dibuat."
> - English: "Reminder has been created."
>
> **FIXED ERROR MESSAGE:**
> - Indonesian: "Maaf kak, ada kendala. Boleh coba ulangi lagi?"
> - English: "Sorry, something went wrong. Could you try again?"
>
> **ABSOLUTE RESTRICTIONS:**
> - Do NOT ask the user to rephrase, reformat, or clarify their original message, regardless of what the original message looked like.
> - Do NOT reference or comment on the user's original phrasing, format, or wording in any way.
> - Do NOT suggest example sentences or templates.
> - Do NOT add explanations, reasoning, apologies beyond the fixed error message, or any extra sentence.
> - Your ONLY job is to check status_code and output ONE of the two fixed messages, translated. Nothing else exists in your task.
> - If you feel the urge to add clarifying guidance, suppress it — that is not your role in this step.
>
> **OUTPUT:** One sentence only. No greeting, no elaboration, no follow-up question.

---

###### B.2 — `usr.reminderEdit` Branch

**Step 1.** Connect the branch to a new **Agent Assistant** node (label: `Grab Context`).

- **Embed Knowledge Base**: ❌ Disabled
- **Task for AI**:

> You are a data retrieval engine for calendar reminder edit requests. Match the user's message to the correct reminder from the provided list, extract its ID, and extract any new values the user wants to change. Do not generate any explanation, confirmation, or elaborating text — output structured data only.
>
> **INPUT CONTEXT:**
> - User's message: `{{user.message}}`
> - Available reminders (raw list from the system): `{{reminders_list}}`
>   Each item has: `id`, `summary`, `start`, `end`, `status`
>   IMPORTANT: the order of items in this list reflects the exact numbered order the user was shown (item 1 = first in list, item 2 = second in list, and so on).
> - Current date/time anchor: `{{datetime}}`
>
> **TASK — Step 1: Identify the target reminder**
> - Identify which reminder the user wants to edit, using ANY of the following reference types:
>   1. Positional/ordinal reference — e.g. "nomor 2", "yang kedua", "reminder ke-3", "the second one", "number 1". Use this ONLY to locate WHICH ITEM in the list the user means (by counting position) — never output the position number itself.
>   2. Content reference — matching against `summary` text (e.g. "meeting sama klien" → "Meeting Sama Klien").
>   3. Date/time reference — matching against `start`/`end` (e.g. "yang jam 8 pagi" → a reminder starting at 08:00, "yang besok" → a reminder on tomorrow's date).
>   4. Combined references — e.g. "yang kedua yang meeting itu" combines positional + content, both should point to the same item for a confident match.
>
> **CRITICAL OUTPUT RULE — READ CAREFULLY:**
> - The `id` field in your output must ALWAYS be the exact value of that item's `id` property from `{{reminders_list}}` — a long alphanumeric string (e.g. `2ksvcdivbo5ueo40ln7t53kai0`).
> - NEVER output a position number (like "1", "2", "3") as the id, even if the user referred to the reminder by its position.
> - The position/ordinal reference is only used internally to FIND the correct item — the actual `id` property of THAT item is what gets returned.
>
> **EXAMPLE:**
> Given this reminders_list:
> ```json
> [
>   {"id": "g1gguuk0tbpkhqvv83nhmo3g9c", "summary": "Test", ...},
>   {"id": "2ksvcdivbo5ueo40ln7t53kai0", "summary": "Main", ...}
> ]
> ```
> User says: "edit reminder nomor 2, ubah jadi jam 3 sore"
> → "nomor 2" refers to the 2nd item in the list
> → The 2nd item's actual id is `2ksvcdivbo5ueo40ln7t53kai0`
> → Correct id output: `2ksvcdivbo5ueo40ln7t53kai0`
> → WRONG output (do not do this): `2`
>
> **TASK — Step 2: Extract the requested changes**
> - `new_summary`: the new subject/title, only if the user explicitly wants to change what the reminder is about. Otherwise `null`.
> - `new_date`: the new date, however phrased (e.g. "besok", "next Monday"), resolved using `{{datetime}}` as anchor. Output format: `yyyy-mm-dd`. Only if user wants to change the date. Otherwise `null`.
> - `new_start_time`: the new start time, combined with `new_date` (or the reminder's existing date if `new_date` is `null`) to form a full timestamp. Output format: `yyyy-mm-ddThh:mm:ss`. Only if user wants to change the time. Otherwise `null`.
> - `new_end_time`: only if user explicitly specifies a new duration or end time. Output format: `yyyy-mm-ddThh:mm:ss`. Otherwise `null`.
>
> **RULES:**
> - If exactly one reminder clearly matches, return its ACTUAL `id` property value (never a position number). Otherwise return `id: null` and list possible matches (actual id values) in `candidates`.
> - If the user gives a positional reference that is out of range for the list (e.g. list only has 1 item but user said "nomor 3"), return `id: null` and `candidates: []`.
> - Only populate change fields (`new_summary`, `new_date`, `new_start_time`, `new_end_time`) with what the user explicitly stated. Do not infer or assume changes that weren't mentioned.
> - If the user's message contains no identifiable change at all (just identifies which reminder, without saying what to change), leave all change fields `null`.
> - Do not fabricate an `id` that isn't present in `{{reminders_list}}`.
> - No natural language response. No greeting. No confirmation message. Output data only.
>
> **OUTPUT FORMAT (strict JSON):**
> ```json
> {
>   "id": "string" | null,
>   "candidates": ["string", ...],
>   "new_summary": "string" | null,
>   "new_date": "yyyy-mm-dd" | null,
>   "new_start_time": "yyyy-mm-ddThh:mm:ss" | null,
>   "new_end_time": "yyyy-mm-ddThh:mm:ss" | null
> }
> ```

**Step 2.** Connect to a new **Entity LLM** node (label: `Retrieve Data`).

| Field Name | Description | Example |
|------------|-------------|---------|
| `new_date` | Updated date intended by the user | `2007-06-17` |
| `new_start_time` | Updated start time defined by user | `2007-06-17 10:18:47` |
| `new_end_time` | Updated end time (could be empty or null) | `2007-06-17 10:18:47` |
| `reference_datetime` | Fixed by datetime | `2007-06-17 10:18:47` |
| `new_summary` | Updated summary described by the user | — |
| `id` | Reminder ID | — |
| `candidate` | Reminder candidate(s) | — |

**Step 3.** Connect to a new **Set User Variable** node (label: `Save Data`).

| Type | Variable Name | Value |
|------|---------------|-------|
| String | `new_user_date` | `{{node_output.new_date}}` |
| String | `new_start_time` | `{{node_output.new_start_time}}` |
| String | `new_end_time` | `{{node_output.new_end_time}}` |
| String | `reference_datetime` | `{{node_output.reference_datetime}}` |
| String | `new_summary` | `{{node_output.new_summary}}` |
| String | `reminder_id` | `{{node_output.id}}` |
| String | `reminder_candidate` | `{{node_output.candidate}}` |

**Step 4.** Connect to a new **HTTP Request** node (label: `Edit API`).

- **URL**: `https://<your-domain>/api/reminder/edit-reminder`
- **Body**:

```json
{
  "id": "{{reminder_id}}",
  "new_date": "{{date}}",
  "candidates": "{{reminder_candidates}}",
  "new_summary": "{{summary}}",
  "new_end_time": "{{end_time}}",
  "new_start_time": "{{start_time}}"
}
```

**Step 5.** Connect to a new **Agent Assistant** node (label: `Response Formatting`).

- **Embed Knowledge Base**: ❌ Disabled
- **Task for AI**:

> You are a strict, deterministic response generator. You do NOT have creative freedom. You must follow the exact rule below with no exceptions.
>
> **INPUT:** `{{node_output.status_code}}`
>
> **RULE (follow exactly, no deviation):**
> - IF `status_code == 200` → output ONLY the fixed success message below, translated to match the user's language (`{{user.message}}`). Do not add, remove, or rephrase anything else.
> - IF `status_code != 200` → output ONLY the fixed error message below, translated to match the user's language. Do not add, remove, or rephrase anything else.
>
> **FIXED SUCCESS MESSAGE:**
> - Indonesian: "Reminder telah diedit."
> - English: "Reminder has been edited."
>
> **FIXED ERROR MESSAGE:**
> - Indonesian: "Maaf kak, ada kendala. Boleh coba ulangi lagi?"
> - English: "Sorry, something went wrong. Could you try again?"
>
> **ABSOLUTE RESTRICTIONS:**
> - Do NOT ask the user to rephrase, reformat, or clarify their original message, regardless of what the original message looked like.
> - Do NOT reference or comment on the user's original phrasing, format, or wording in any way.
> - Do NOT suggest example sentences or templates.
> - Do NOT add explanations, reasoning, apologies beyond the fixed error message, or any extra sentence.
> - Your ONLY job is to check status_code and output ONE of the two fixed messages, translated. Nothing else exists in your task.
> - If you feel the urge to add clarifying guidance, suppress it — that is not your role in this step.
>
> **OUTPUT:** One sentence only. No greeting, no elaboration, no follow-up question.

---

###### B.3 — `usr.reminderList` Branch

**Step 1.** Connect the branch to a new **Agent Assistant** node (label: `Grab Context`).

- **Embed Knowledge Base**: ❌ Disabled
- **Task for AI**:

> You are a data retrieval engine for calendar reminder listing requests. Extract ONLY the following fields from `{{user.message}}`. Do not generate any explanation, confirmation, or elaborating text — output structured data only.
>
> **Fields to retrieve:**
>
> | Field | Rules | Output Format |
> |-------|-------|---------------|
> | `timeMin` | Start of date range, resolved relative to `{{date}}`. Represents `00:00:00` of that day. If not mentioned, `null`. | `yyyy-mm-ddT00:00:00±hh:mm` |
> | `timeMax` | End of date range, resolved relative to `{{date}}`. Represents `23:59:59` of that day. If not mentioned, `null`. | `yyyy-mm-ddT23:59:59±hh:mm` |
> | `maxResults` | Specific count if user requests a limit. If not mentioned, `null`. | Integer |
> | `reference_datetime` | Always `{{datetime}}`. Not user-extracted. | `yyyy-mm-ddThh:mm:ss` |
>
> **Common Phrase Interpretation:**
>
> | Phrase (ID / EN) | `timeMin` | `timeMax` |
> |------------------|-----------|-----------|
> | "hari ini" / "today" | Today `00:00:00` | Today `23:59:59` |
> | "besok" / "tomorrow" | Tomorrow `00:00:00` | Tomorrow `23:59:59` |
> | "minggu ini" / "this week" | Start of current week | End of current week |
> | "bulan ini" / "this month" | First day of month | Last day of month |
> | "yang akan datang" / "upcoming" / no period | `null` | `null` |

**Step 2.** Connect to a new **Entity LLM** node (label: `Retrieve Params`).

| Field Name | Description | Example |
|------------|-------------|---------|
| `timeMin` | User's minimal time of the period (could be null) | `2007-06-17T00:00:00+07:00` |
| `timeMax` | User's maximal time of the period (could be null) | `2007-06-17T00:00:00+07:00` |
| `maxResults` | User's desirable list limit of the reminders | `20`, `10`, `5` |

**Step 3.** Connect to a new **Set User Variable** node (label: `Store Params`).

| Type | Variable Name | Value |
|------|---------------|-------|
| String | `time_min` | `{{node_output.timeMin}}` |
| String | `time_max` | `{{node_output.timeMax}}` |
| String | `max_results` | `{{node_output.maxResults}}` |

**Step 4.** Connect to a new **HTTP Request** node (label: `List API`).

- **URL**: `https://<your-domain>/api/reminder/list-reminder`
- **Body**:

```json
{
  "timeMax": "{{time_max}}",
  "timeMin": "{{time_min}}",
  "maxResults": "{{max_results}}"
}
```

**Step 5.** Connect to a new **Set User Variable** node (label: `Store List`).

| Type | Variable Name | Value | Option |
|------|---------------|-------|--------|
| String | `reminders_list` | `{{node_output}}` | Persistent |

**Step 6.** Connect to a new **Agent Assistant** node (label: `Formatting`).

- **Embed Knowledge Base**: ❌ Disabled
- **Task for AI**:

> You are a response formatter for a calendar reminder chatbot. Convert the raw JSON reminder list from `{{node_output}}` into clean, human-readable text. No JSON, no code blocks, no raw field names.
>
> **Formatting Rules:**
> 1. **Language** — Match `{{user.message}}` language and tone.
> 2. **Empty list** — If `count` is `0`, tell the user they have no upcoming reminders.
> 3. **Date/time** — Convert ISO to natural format (e.g., `"21 Juli 2026, pukul 08:00"` or `"July 21, 2026 at 8:00 AM"`). Use "hari ini"/"today" or "besok"/"tomorrow" when applicable. Omit seconds and timezone. Only show end time for longer events.
> 4. **Structure** — Number each reminder. Show summary and date/time only.
> 5. **`id` field** — NEVER display to user. Internal reference only.
> 6. **`html_link` field** — Do not include unless user explicitly asked.
> 7. **Closing** — End with a brief, natural offer to help further (e.g., edit or delete).

---

###### B.4 — `usr.reminderDelete` Branch

**Step 1.** Connect the branch to a new **Agent Assistant** node (label: `Grab Context`).

- **Embed Knowledge Base**: ❌ Disabled
- **Task for AI**:

> You are a data retrieval engine for calendar reminder deletion requests. Match the user's message to the correct reminder from the provided list, and extract its ID. Do not generate any explanation, confirmation, or elaborating text — output structured data only.
>
> **INPUT CONTEXT:**
> - User's message: `{{user.message}}`
> - Available reminders (raw list from the system): `{{reminders_list}}`
>   Each item has: `id`, `summary`, `start`, `end`, `status`
>   IMPORTANT: the order of items in this list reflects the exact numbered order the user was shown (item 1 = first in list, item 2 = second in list, and so on).
>
> **TASK:**
> - Identify which reminder the user is referring to, using ANY of the following reference types:
>   1. Positional/ordinal reference — e.g. "nomor 2", "yang kedua", "reminder ke-3", "the second one", "number 1", "the first reminder". Use this ONLY to locate WHICH ITEM in the list the user means (by counting position) — never output the position number itself.
>   2. Content reference — matching against `summary` text (e.g. "meeting sama klien" → "Meeting Sama Klien").
>   3. Date/time reference — matching against `start`/`end` (e.g. "yang jam 8 pagi" → a reminder starting at 08:00, "yang besok" → a reminder on tomorrow's date).
>   4. Combined references — e.g. "yang kedua yang meeting itu" combines positional + content, both should point to the same item for a confident match.
>
> **CRITICAL OUTPUT RULE — READ CAREFULLY:**
> - The `id` field in your output must ALWAYS be the exact value of that item's `id` property from `{{reminders_list}}` — a long alphanumeric string (e.g. `2ksvcdivbo5ueo40ln7t53kai0`).
> - NEVER output a position number (like "1", "2", "3") as the id, even if the user referred to the reminder by its position.
> - The position/ordinal reference is only used internally to FIND the correct item — the actual `id` property of THAT item is what gets returned, not the position count.
>
> **EXAMPLE:**
> Given this reminders_list:
> ```json
> [
>   {"id": "g1gguuk0tbpkhqvv83nhmo3g9c", "summary": "Test", ...},
>   {"id": "2ksvcdivbo5ueo40ln7t53kai0", "summary": "Main", ...}
> ]
> ```
> User says: "hapus reminder nomor 2"
> → Step 1: "nomor 2" refers to the 2nd item in the list (position 2)
> → Step 2: the 2nd item's actual id field is `2ksvcdivbo5ueo40ln7t53kai0`
> → Correct output: `{"id": "2ksvcdivbo5ueo40ln7t53kai0", "candidates": []}`
> → WRONG output (do not do this): `{"id": "2", "candidates": []}`
>
> **RULES:**
> - If exactly one reminder clearly matches (by any reference type above), return its ACTUAL `id` property value (never a position number).
> - If the user's message is ambiguous and could match more than one reminder, return `id: null` and list the possible matching ACTUAL id values in `candidates`.
> - If no reminder in the list matches the user's message at all, return `id: null` and `candidates: []`.
> - If the user gives a positional reference (e.g. "nomor 2") that is out of range for the list (e.g. list only has 1 item but user said "nomor 3"), return `id: null` and `candidates: []`.
> - Do not fabricate an `id` that isn't present in `{{reminders_list}}`.
> - No natural language response. No greeting. No confirmation message. Output data only.
>
> **OUTPUT FORMAT (strict JSON):**
> ```json
> {
>   "id": "string" | null,
>   "candidates": ["string", ...]
> }
> ```

**Step 2.** Connect to a new **Entity LLM** node (label: `Retrieve Params`).

| Field Name | Description | Example |
|------------|-------------|---------|
| `id` | The reminder ID | — |
| `candidate` | Reminder candidate(s) | — |

**Step 3.** Connect to a new **Set User Variable** node.

| Type | Variable Name | Value |
|------|---------------|-------|
| String | `reminder_id` | `{{node_output.id}}` |
| String | `reminder_candidate` | `{{node_output.candidate}}` |

**Step 4.** Connect to a new **HTTP Request** node (label: `Delete API`).

- **URL**: `https://<your-domain>/api/reminder/delete-reminder`
- **Body**:

```json
{
  "id": "{{reminder_id}}",
  "candidates": "{{reminder_candidate}}"
}
```

**Step 5.** Connect to a new **Agent Assistant** node (label: `Response Formatting`).

- **Embed Knowledge Base**: ❌ Disabled
- **Task for AI**:

> You are a strict, deterministic response generator. You do NOT have creative freedom. You must follow the exact rule below with no exceptions.
>
> **INPUT:** `{{node_output.status_code}}`
>
> **RULE (follow exactly, no deviation):**
> - IF `status_code == 200` → output ONLY the fixed success message below, translated to match the user's language (`{{user.message}}`). Do not add, remove, or rephrase anything else.
> - IF `status_code != 200` → output ONLY the fixed error message below, translated to match the user's language. Do not add, remove, or rephrase anything else.
>
> **FIXED SUCCESS MESSAGE:**
> - Indonesian: "Reminder telah dihapus."
> - English: "Reminder has been deleted."
>
> **FIXED ERROR MESSAGE:**
> - Indonesian: "Maaf kak, ada kendala. Boleh coba ulangi lagi?"
> - English: "Sorry, something went wrong. Could you try again?"
>
> **ABSOLUTE RESTRICTIONS:**
> - Do NOT ask the user to rephrase, reformat, or clarify their original message, regardless of what the original message looked like.
> - Do NOT reference or comment on the user's original phrasing, format, or wording in any way.
> - Do NOT suggest example sentences or templates.
> - Do NOT add explanations, reasoning, apologies beyond the fixed error message, or any extra sentence.
> - Your ONLY job is to check status_code and output ONE of the two fixed messages, translated. Nothing else exists in your task.
> - If you feel the urge to add clarifying guidance, suppress it — that is not your role in this step.
>
> **OUTPUT:** One sentence only. No greeting, no elaboration, no follow-up question.

---

###### B.5 — Fallback Branch

**Step 1.** Connect the branch to a new **Agent Assistant** node (label: `Fallback KB`).

- **Embed Knowledge Base**: ✅ Enabled
- **Task for AI**:

> Answer using user's language.

---

##### C. Global End

1. Add a new **Response Formatter** node (label: `Global Formatting`).
   - **Mode**: Default AI Text
2. Connect **all** terminal Agent Assistant nodes from every branch to this node.
3. Connect the **Response Formatter** node to a new **Auto Integration** node.
   - **Source input**: From response formatter

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

## Known Issues

- **LLM non-determinism — instruction-following failure**
  At some point, the `edit-reminder` and `delete-reminder` operations may fail when the AI fails to correctly fetch/extract the target reminder's `id`, even though the intended reminder exists in the list. This stems from inherent LLM non-determinism in the Agent Assistant / Entity LLM steps rather than a backend proxy bug.

- **`reminders_list` variable is persistence-dependent**
  The `reminders_list` variable is only populated/updated when the user goes through the `usr.reminderList` branch (i.e., explicitly lists/shows their reminders). If a user tries to directly edit or delete a reminder without listing it first, `reminders_list` may be stale, empty, or mismatched, causing the `id` matching in the Edit/Delete `Grab Context` steps to fail or resolve to the wrong reminder.

- **No API Key Setup**
  This backend proxy still does not implement any API key or authentication mechanism. All endpoints are publicly accessible once deployed. Authentication will be added in a future update.

---

## Working Bot Footage

<!-- TODO: Add working bot footage/screenshots/recordings here -->