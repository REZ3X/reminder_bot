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
  - [Chatbot Workflow JSON](#chatbot-workflow-json)
- [Webchat Bot Example](#webchat-bot-example)
- [API Reference](#api-reference)
- [Known Issues](#known-issues)
- [Solved Issues](#solved-issues)

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

#### Chatbot Workflow JSON

```json
{"nodes":[{"id":"r1ar0myld0","type":"agent-assistant","position":{"x":50,"y":45},"next":{"main":[{"type":"continue","target_node":"iw44zl2vty"}]},"properties":{"label":"Grab Context","model":"botika/llm-medium","tools":[],"bot_id":"{{bot.id}}","handle":{"source":[{"id":"bottom-out","position":"bottom"}],"target":[{"id":"top-in","position":"top"}]},"description":"Answers questions automatically based on a persona, knowledge base and instructions.","input_to_ai":"{{user.message}}","json_schema":"","output_type":"text","save_errors":null,"task_for_ai":"You are a data retrieval engine for calendar reminder requests. Extract ONLY the following fields from {{user.message}}. Do not generate any explanation, confirmation, or elaborating text — output structured data only.\n\nFIELDS TO RETRIEVE:\n\n1. date\n   - Extract user's intended date, however phrased (e.g. \"tomorrow\", \"besok\", \"next Monday\", \"14 August 2026\").\n   - Resolve relative expressions using {{date}} as the current date anchor.\n   - Output format: \"yyyy-mm-dd\"\n   - If not mentioned by user, leave null.\n\n2. start_time\n   - Extract the first time mentioned by the user (e.g. \"8 AM\", \"14:00\", \"jam 8 pagi\").\n   - Combine with resolved `date` to form a full timestamp.\n   - Output format: \"yyyy-mm-ddThh:mm:ss\"\n   - Use {{date}} context to resolve timezone offset if not explicitly stated by user.\n   - If not mentioned by user, leave null.\n\n3. end_time\n   - Default: start_time + 15 minutes, UNLESS user explicitly specifies a duration or end time.\n   - Output format: \"yyyy-mm-ddThh:mm:ss\"\n   - If start_time is null, end_time is also null (cannot compute default).\n\n4. summary\n   - Extract what the reminder is about, based on what the user says they want to be reminded of (e.g. \"minum obat\" → \"Minum Obat\", \"call mom\" → \"Call Mom\", \"meeting sama klien\" → \"Meeting Sama Klien\").\n   - Strip filler/intent phrasing (e.g. \"ingetin aku buat...\", \"remind me to...\", \"set a reminder for...\") — keep only the core subject.\n   - Capitalize the first letter of each main word (title case), do not alter the user's language (keep Indonesian as Indonesian, English as English).\n   - If the user gives no discernible subject/topic at all, leave null (do NOT invent one).\n\n5. reference_datetime\n   - Always defaults to {{datetime}}.\n   - This is NOT user-extracted — always populate with {{datetime}} regardless of what user said.\n   - Used only as the anchor for resolving relative date/time expressions in fields 1–3.\n\nRULES:\n- Only extract what is explicitly present or derivable from {{user.message}}. Do not infer, assume, or hallucinate values not present in the message (except end_time default and reference_datetime, which follow fixed default logic above).\n- If date, start_time, end_time, or summary are not provided/derivable from the user's message, return them as null — do not fabricate placeholder values.\n- No natural language response. No greeting. No confirmation message. Output data only.","tool_choice":"none","embed_memory":true,"llm_provider":"botika","has_save_error":false,"connectedHandles":{"bottom-out":true},"advanced_settings":false,"validation_errors":[],"input_to_ai_setting":{"type":"variable","source":"user"},"validation_warnings":[],"embed_knowledge_base":false,"enable_json_structured_output":false,"process_tool_execution_result":false}},{"id":"iw44zl2vty","type":"entity-llm","position":{"x":-113.48817834306391,"y":49.14459037752313},"next":{"main":[{"type":"continue","target_node":"jeghdbjd1u"}]},"properties":{"label":"Retrieve Data","model":"botika/llm-medium","handle":{"source":[{"id":"bottom-out","position":"bottom"}],"target":[{"id":"top-in","position":"top"}]},"description":"","save_errors":null,"llm_provider":"botika","text_message":"{{node_output}}","has_save_error":false,"entities_schema":[{"name":"date","example":["2007-06-17"],"description":"Date intended by the user to set the reminder/event"},{"name":"start_time","example":["2025-12-29 10:18:47"],"description":"Start time defined by user"},{"name":"end_time","example":["2026-12-29 10:18:47"],"description":"End time defined by user, could be empty or null"},{"name":"reference_datetime","example":["2025-12-29 10:18:47"],"description":"Fixed by datetime"},{"name":"summary","example":[],"description":"Summary described by the user, like goal of the reminder"}],"connectedHandles":{"bottom-out":true},"validation_errors":[],"validation_warnings":[]}},{"id":"jeghdbjd1u","type":"set-user-var","position":{"x":-252.55826170837634,"y":51.22243298351901},"next":{"main":[{"type":"continue","target_node":"3kinqih22g"}]},"properties":{"label":"Save Data","handle":{"source":[{"id":"bottom-out","position":"bottom"}],"target":[{"id":"top-in","position":"top"}]},"variables":[{"var_key":"user_date","data_type":"string","persist":false,"var_value":"{{node_output.date}}"},{"var_key":"start_time","data_type":"string","persist":false,"var_value":"{{node_output.start_time}}"},{"var_key":"end_time","data_type":"string","persist":false,"var_value":"{{node_output.end_time}}"},{"var_key":"reference_datetime","data_type":"string","persist":false,"var_value":"{{node_output.reference_datetime}}"},{"var_key":"summary","data_type":"string","persist":false,"var_value":"{{node_output.summary}}"}],"decription":"","description":"","save_errors":null,"has_save_error":false,"connectedHandles":{"bottom-out":true}}},{"id":"3kinqih22g","type":"http-request","position":{"x":-259.47471168695614,"y":108.69861394033194},"next":{"main":[{"type":"continue","target_node":"y1jnucrdjc"}]},"properties":{"url":"https://domain.com/api/reminder/create-reminder","body":{"summary":"{{summary}}","end_time":"{{end_time}}","timeZone":"Asia/Jakarta","start_time":"{{start_time}}"},"label":"Create API","handle":{"source":[{"id":"bottom-out","position":"bottom"}],"target":[{"id":"top-in","position":"top"}]},"method":"POST","headers":{"Content-Type":"application/json"},"description":"POST","save_errors":null,"handle_error":true,"has_save_error":false,"connectedHandles":{"bottom-out":true}}},{"id":"e2f8ixfskt","type":"auto-integration","position":{"x":349.85750339602254,"y":724.0163799456838},"next":[],"properties":{"text":"{{node_output}}","label":"Auto Integration","handle":{"source":[{"id":"bottom-out","position":"bottom"}],"target":[{"id":"top-in","position":"top"}]},"operation":"send_message","description":"An auto integration node from all integrations.","save_errors":null,"save_chatlog":true,"source_input":"previous_node_response_formatter_output","has_save_error":false,"connectedHandles":{"bottom-out":false},"save_as_history_message":true}},{"id":"mj00wuttp1","type":"intent-classification","position":{"x":312.67370749850494,"y":-66.21474326425181},"next":{"main":[{"type":"continue","target_node":"mq4rhfrxr2"}]},"properties":{"lang":"id-ID","label":"Intent Classification","handle":{"source":[{"id":"bottom-out","position":"bottom"}],"target":[{"id":"top-in","position":"top"}]},"message":"{{node_output}}","train_id":"rulerwc9fd77wv","decription":"","description":"","save_errors":null,"has_save_error":false,"connectedHandles":{"bottom-out":true}}},{"id":"mq4rhfrxr2","type":"switch","position":{"x":263.54425806180103,"y":15.90663884362727},"next":{"0":[{"type":"continue","target_node":"r1ar0myld0"}],"1":[{"type":"continue","target_node":"ywp8150w4w"}],"2":[{"type":"continue","target_node":"p1p21wxdin"}],"3":[{"type":"continue","target_node":"ou3theiz6e"}],"4":[{"type":"continue","target_node":"jkw61ge94j"}]},"properties":{"data":[],"label":"Switch","rules":[{"combinator":"and","conditions":[{"operator":{"type":"string","operation":"equals","case_sensitive":false},"source_value":"{{node_output.intent}}","compared_value":"usr.reminderCreate"}]},{"combinator":"and","conditions":[{"operator":{"type":"string","operation":"equals","case_sensitive":false},"source_value":"{{node_output.intent}}","compared_value":"usr.reminderEdit"}]},{"combinator":"and","conditions":[{"operator":{"type":"string","operation":"equals","case_sensitive":false},"source_value":"{{node_output.intent}}","compared_value":"usr.reminderList"}]},{"combinator":"and","conditions":[{"operator":{"type":"string","operation":"equals","case_sensitive":false},"source_value":"{{node_output.intent}}","compared_value":"usr.reminderDelete"}]},{"combinator":"and","conditions":[{"operator":{"type":"string","operation":"not_equals","case_sensitive":false,"single_value_check":true},"source_value":"{{node_output}}","compared_value":""}]}],"handle":{"source":[{"id":"right-out-0","position":"right","nodeId":null,"type":"source"},{"id":"right-out-1","position":"right","nodeId":null,"type":"source"},{"id":"right-out-2","position":"right","nodeId":null,"type":"source"},{"id":"right-out-3","position":"right","nodeId":null,"type":"source"},{"id":"right-out-fallback","position":"right","nodeId":null,"type":"source"}],"target":[{"id":"top-in","position":"top"}]},"description":"If condition is true, the flow will be switched to the next step.","save_errors":null,"has_save_error":false,"fallback_target":4,"connectedHandles":{"right-out-0":true,"right-out-1":true,"right-out-2":true,"right-out-3":true,"right-out-fallback":true}}},{"id":"cmvxnrzjf1","type":"response-formatter","position":{"x":349.34452500096194,"y":617.5298490030639},"next":{"main":[{"type":"continue","target_node":"e2f8ixfskt"}]},"properties":{"label":"Global Format","handle":{"source":[{"id":"bottom-out","position":"bottom"}],"target":[{"id":"top-in","position":"top"}]},"description":"Format the response output.","save_errors":null,"has_save_error":false,"response_format":{"default":[{"mode":"use_ai","type":"text","is_active":true},{"mode":"manual_setup","type":"text","text":"{{reminders_list}}","text_setting":{"type":"text","source":"previous_node"}}]},"connectedHandles":{"bottom-out":true}}},{"id":"ah3yv26adn","type":"agent-assistant","position":{"x":831.3325025266707,"y":107.35090146539483},"next":{"main":[{"type":"continue","target_node":"cmvxnrzjf1"}]},"properties":{"label":"Formatting","model":"botika/llm-medium","tools":[],"bot_id":"{{bot.id}}","handle":{"source":[{"id":"bottom-out","position":"bottom"}],"target":[{"id":"top-in","position":"top"}]},"description":"Answers questions automatically based on a persona, knowledge base and instructions.","input_to_ai":"{{user.message}}","json_schema":"","output_type":"text","save_errors":null,"task_for_ai":"You are a response formatter for a calendar reminder chatbot. Take the raw JSON reminder list data from {{node_output}} and convert it into a clean, human-readable message for the user. Do not output JSON, code blocks, or raw field names — output natural conversational text only.\n\nCRITICAL: {{node_output}} is a single field named \"reminders_list\", containing a JSON-STRINGIFIED array (not an object with success/count). You must parse this string as JSON to get the array of reminder objects. Example of what {{node_output}} looks like:\n{\n  \"reminders_list\": \"[{\\\"id\\\": \\\"abc123\\\", \\\"summary\\\": \\\"Test\\\", \\\"start\\\": \\\"2026-07-22T10:00:00+07:00\\\", \\\"end\\\": \\\"2026-07-22T12:00:00+07:00\\\", \\\"timeZone\\\": \\\"Asia/Jakarta\\\", \\\"status\\\": \\\"confirmed\\\", \\\"html_link\\\": \\\"...\\\"}]\"\n}\n\nCRITICAL — IGNORE CONVERSATION HISTORY FOR THIS TASK:\n- Use ONLY the reminders present in THIS EXACT {{node_output}} value for this response.\n- Do NOT reference, recall, or include any reminder mentioned earlier in this conversation that is not present in the current {{node_output}}.\n- If a reminder existed in an earlier turn but is missing now (e.g. it was deleted), treat it as gone — do not mention it.\n- Each time this prompt runs, treat {{node_output}} as the complete and only source of truth, fully replacing any memory of previous lists.\n\nEACH REMINDER OBJECT HAS: id, summary, start, end, timeZone, status, html_link\n\nFORMATTING RULES:\n\n1. Language\n   - Match the language of {{user.message}} (Indonesian or English).\n   - Match the tone/formality of {{user.message}} (formal or casual).\n\n2. Empty list handling\n   - If the parsed array is empty ([]), tell the user they have no upcoming reminders. Do not list anything.\n\n3. Date/time formatting\n   - Convert each \"start\" and \"end\" from ISO format into a natural, readable format.\n     Example: \"2026-07-21T08:00:00+07:00\" → \"21 Juli 2026, pukul 08:00\" (Indonesian) or \"July 21, 2026 at 8:00 AM\" (English).\n   - If the reminder is happening today or tomorrow relative to {{reference_datetime}}, say \"hari ini\" / \"besok\" or \"today\" / \"tomorrow\" instead of the full date.\n   - Do not show seconds. Do not show timezone abbreviation unless the user asks.\n   - Only show the end time if it adds useful information; for short/default 15-minute reminders, showing just the start time is enough.\n\n4. Numbering and structure\n   - List each reminder as a separate, numbered item, in the exact order they appear in the parsed array.\n   - The count of items you list must exactly match the number of items in the parsed array — never more, never fewer.\n   - Each item should show: the reminder's subject (summary) and its date/time — nothing more, unless explicitly relevant.\n\n5. The \"id\" field\n   - NEVER display the raw \"id\" value to the user directly — it is an internal reference only.\n   - Do not mention \"id\", \"event id\", or any technical field names in the output.\n\n6. The \"html_link\" field\n   - Do not include the raw link unless the user has asked to see/open the event.\n\n7. Closing\n   - End with a short, natural offer to help further, matching the user's tone. One sentence only.\n\nOUTPUT: Plain conversational text only. No JSON. No markdown code blocks. No field labels.","tool_choice":"none","embed_memory":true,"llm_provider":"botika","has_save_error":false,"connectedHandles":{"bottom-out":true},"advanced_settings":false,"validation_errors":[],"input_to_ai_setting":{"type":"variable","source":"user"},"validation_warnings":[],"embed_knowledge_base":false,"enable_json_structured_output":false,"process_tool_execution_result":false}},{"id":"bew5ayj783","type":"http-request","position":{"x":1018.968524959196,"y":30.15096246165742},"next":{"main":[{"type":"continue","target_node":"8fy08afvqy"}]},"properties":{"url":"https://domain.com/api/reminder/list-reminder","body":{"timeMax":"{{time_max}}","timeMin":"{{time_min}}","maxResults":"{{max_results}}"},"label":"List API","handle":{"source":[{"id":"bottom-out","position":"bottom"}],"target":[{"id":"top-in","position":"top"}]},"method":"POST","headers":{"Content-Type":"application/json"},"description":"POST","save_errors":null,"handle_error":true,"has_save_error":false,"connectedHandles":{"bottom-out":true}}},{"id":"ou3theiz6e","type":"agent-assistant","position":{"x":533.1856231115206,"y":289.6876040808609},"next":{"main":[{"type":"continue","target_node":"7s52w1xo28"}]},"properties":{"label":"Grab Context","model":"botika/llm-medium","tools":[],"bot_id":"{{bot.id}}","handle":{"source":[{"id":"bottom-out","position":"bottom"}],"target":[{"id":"top-in","position":"top"}]},"description":"Answers questions automatically based on a persona, knowledge base and instructions.","input_to_ai":"{{user.message}}","json_schema":"","output_type":"text","save_errors":null,"task_for_ai":"You are a data retrieval engine for calendar reminder deletion requests. Match the user's message to the correct reminder from the provided list, and extract its ID. Do not generate any explanation, confirmation, or elaborating text — output structured data only.\n\nINPUT CONTEXT:\n- User's message: {{user.message}}\n- Available reminders (raw list from the system): {{reminders_list}}\n  Each item has: id, summary, start, end, status\n  IMPORTANT: the order of items in this list reflects the exact numbered order the user was shown (item 1 = first in list, item 2 = second in list, and so on).\n\nTASK:\n- Identify which reminder the user is referring to, using ANY of the following reference types:\n  1. Positional/ordinal reference — e.g. \"nomor 2\", \"yang kedua\", \"reminder ke-3\", \"the second one\", \"number 1\", \"the first reminder\". Use this ONLY to locate WHICH ITEM in the list the user means (by counting position) — never output the position number itself.\n  2. Content reference — matching against \"summary\" text (e.g. \"meeting sama klien\" → \"Meeting Sama Klien\").\n  3. Date/time reference — matching against \"start\"/\"end\" (e.g. \"yang jam 8 pagi\" → a reminder starting at 08:00, \"yang besok\" → a reminder on tomorrow's date).\n  4. Combined references — e.g. \"yang kedua yang meeting itu\" combines positional + content, both should point to the same item for a confident match.\n\nCRITICAL OUTPUT RULE — READ CAREFULLY:\n- The \"id\" field in your output must ALWAYS be the exact value of that item's \"id\" property from {{reminders_list}} — a long alphanumeric string (e.g. \"2ksvcdivbo5ueo40ln7t53kai0\").\n- NEVER output a position number (like \"1\", \"2\", \"3\") as the id, even if the user referred to the reminder by its position.\n- The position/ordinal reference is only used internally to FIND the correct item — the actual \"id\" property of THAT item is what gets returned, not the position count.\n\nEXAMPLE:\nGiven this reminders_list:\n[\n  {\"id\": \"g1gguuk0tbpkhqvv83nhmo3g9c\", \"summary\": \"Test\", ...},\n  {\"id\": \"2ksvcdivbo5ueo40ln7t53kai0\", \"summary\": \"Main\", ...}\n]\n\nUser says: \"hapus reminder nomor 2\"\n→ Step 1: \"nomor 2\" refers to the 2nd item in the list (position 2)\n→ Step 2: the 2nd item's actual id field is \"2ksvcdivbo5ueo40ln7t53kai0\"\n→ Correct output: {\"id\": \"2ksvcdivbo5ueo40ln7t53kai0\", \"candidates\": []}\n→ WRONG output (do not do this): {\"id\": \"2\", \"candidates\": []}\n\nRULES:\n- If exactly one reminder clearly matches (by any reference type above), return its ACTUAL \"id\" property value (never a position number).\n- If the user's message is ambiguous and could match more than one reminder, return \"id\": null and list the possible matching ACTUAL id values in \"candidates\".\n- If no reminder in the list matches the user's message at all, return \"id\": null and \"candidates\": [].\n- If the user gives a positional reference (e.g. \"nomor 2\") that is out of range for the list (e.g. list only has 1 item but user said \"nomor 3\"), return \"id\": null and \"candidates\": [].\n- Do not fabricate an id that isn't present in {{reminders_list}}.\n- No natural language response. No greeting. No confirmation message. Output data only.\n\nOUTPUT FORMAT (strict JSON):\n{\n  \"id\": \"string\" | null,\n  \"candidates\": [\"string\", ...]\n}","tool_choice":"none","embed_memory":true,"llm_provider":"botika","has_save_error":false,"connectedHandles":{"bottom-out":true},"advanced_settings":false,"validation_errors":[],"input_to_ai_setting":{"type":"variable","source":"user"},"validation_warnings":[],"embed_knowledge_base":true,"enable_json_structured_output":false,"process_tool_execution_result":false}},{"id":"uuyom6994z","type":"http-request","position":{"x":876.7536580604587,"y":360.78396594048024},"next":{"main":[{"type":"continue","target_node":"z4chyheq1n"}]},"properties":{"url":"https://domain.com/api/reminder/delete-reminder","body":{"id":"{{reminder_id}}","candidates":"{{reminder_candidate}}"},"label":"Delete API","handle":{"source":[{"id":"bottom-out","position":"bottom"}],"target":[{"id":"top-in","position":"top"}]},"method":"POST","headers":{"Content-Type":"application/json"},"description":"POST","save_errors":null,"handle_error":true,"has_save_error":false,"connectedHandles":{"bottom-out":true}}},{"id":"8fy08afvqy","type":"set-user-var","position":{"x":674.8865431276758,"y":110.88707303036655},"next":{"main":[{"type":"continue","target_node":"ah3yv26adn"}]},"properties":{"label":"Store List","handle":{"source":[{"id":"bottom-out","position":"bottom"}],"target":[{"id":"top-in","position":"top"}]},"variables":[{"var_key":"reminders_list","data_type":"string","persist":true,"var_value":"{{node_output.response_body.reminders}}"}],"decription":"","description":"","save_errors":null,"has_save_error":false,"connectedHandles":{"bottom-out":true}}},{"id":"p1p21wxdin","type":"agent-assistant","position":{"x":532.0098673759529,"y":24.083807365421478},"next":{"main":[{"type":"continue","target_node":"qw263xu2ic"}]},"properties":{"label":"Grab Context","model":"botika/llm-medium","tools":[],"bot_id":"{{bot.id}}","handle":{"source":[{"id":"bottom-out","position":"bottom"}],"target":[{"id":"top-in","position":"top"}]},"description":"Answers questions automatically based on a persona, knowledge base and instructions.","input_to_ai":"{{user.message}}","json_schema":"","output_type":"text","save_errors":null,"task_for_ai":"You are a data retrieval engine for calendar reminder listing requests. Extract ONLY the following fields from {{user.message}}. Do not generate any explanation, confirmation, or elaborating text — output structured data only.\n\nFIELDS TO RETRIEVE:\n\n1. timeMin\n   - Extract the start of the date range the user wants to see reminders for, however phrased (e.g. \"besok\", \"minggu ini\", \"starting next Monday\", \"from August 1st\").\n   - Resolve relative expressions using {{date}} as the current date anchor.\n   - Represents the beginning of the day for that date, at 00:00:00.\n   - Output format: \"yyyy-mm-ddT00:00:00±hh:mm\" (include the user's timezone offset if known, otherwise omit offset and leave timezone resolution to the system).\n   - If the user does not mention any starting point, leave null (the system will default to \"now\").\n\n2. timeMax\n   - Extract the end of the date range the user wants to see reminders for, however phrased (e.g. \"sampai akhir bulan\", \"until next Friday\", \"for the next 2 weeks\").\n   - Resolve relative expressions using {{date}} as the current date anchor.\n   - Represents the end of the day for that date, at 23:59:59.\n   - Output format: \"yyyy-mm-ddT23:59:59±hh:mm\"\n   - If the user does not mention any ending point, leave null (the system will show all upcoming reminders with no upper bound).\n\n3. maxResults\n   - Extract a specific number if the user asks for a limited count (e.g. \"5 pengingat terakhir\", \"show me the next 3 reminders\", \"just the top 10\").\n   - Output format: integer\n   - If not mentioned, leave null (the system will apply its own default).\n\n4. reference_datetime\n   - Always defaults to {{datetime}}.\n   - This is NOT user-extracted — always populate with {{datetime}} regardless of what user said.\n   - Used only as the anchor for resolving relative date expressions in fields 1–2.\n\nINTERPRETATION GUIDE FOR COMMON PHRASES:\n- \"hari ini\" / \"today\" → timeMin = today 00:00:00, timeMax = today 23:59:59\n- \"besok\" / \"tomorrow\" → timeMin = tomorrow 00:00:00, timeMax = tomorrow 23:59:59\n- \"minggu ini\" / \"this week\" → timeMin = start of current week, timeMax = end of current week (use {{date}} to determine week boundaries)\n- \"bulan ini\" / \"this month\" → timeMin = first day of current month, timeMax = last day of current month\n- \"yang akan datang\" / \"upcoming\" / no period mentioned at all → leave both timeMin and timeMax null\n\nRULES:\n- Only extract what is explicitly present or derivable from {{user.message}}. Do not infer, assume, or hallucinate a date range that wasn't implied.\n- If the user's message contains no time-period reference at all (e.g. \"reminder aku apa aja\" / \"what are my reminders\"), return timeMin and timeMax as null — this means \"show all upcoming reminders\" and is a valid, common case, not a missing-data error.\n- No natural language response. No greeting. No confirmation message. Output data only.\nFIELDS TO RETRIEVE:\n\n1. date\n   - Extract user's intended date, however phrased (e.g. \"tomorrow\", \"besok\", \"next Monday\", \"14 August 2026\").\n   - Resolve relative expressions using {{date}} as the current date anchor.\n   - Output format: \"yyyy-mm-dd\"\n   - If not mentioned by user, leave null.\n\n2. start_time\n   - Extract the first time mentioned by the user (e.g. \"8 AM\", \"14:00\", \"jam 8 pagi\").\n   - Combine with resolved `date` to form a full timestamp.\n   - Output format: \"yyyy-mm-ddThh:mm:ss\"\n   - Use {{date}} context to resolve timezone offset if not explicitly stated by user.\n   - If not mentioned by user, leave null.\n\n3. end_time\n   - Default: start_time + 15 minutes, UNLESS user explicitly specifies a duration or end time.\n   - Output format: \"yyyy-mm-ddThh:mm:ss\"\n   - If start_time is null, end_time is also null (cannot compute default).\n\n4. summary\n   - Extract what the reminder is about, based on what the user says they want to be reminded of (e.g. \"minum obat\" → \"Minum Obat\", \"call mom\" → \"Call Mom\", \"meeting sama klien\" → \"Meeting Sama Klien\").\n   - Strip filler/intent phrasing (e.g. \"ingetin aku buat...\", \"remind me to...\", \"set a reminder for...\") — keep only the core subject.\n   - Capitalize the first letter of each main word (title case), do not alter the user's language (keep Indonesian as Indonesian, English as English).\n   - If the user gives no discernible subject/topic at all, leave null (do NOT invent one).\n\n5. reference_datetime\n   - Always defaults to {{datetime}}.\n   - This is NOT user-extracted — always populate with {{datetime}} regardless of what user said.\n   - Used only as the anchor for resolving relative date/time expressions in fields 1–3.\n\nRULES:\n- Only extract what is explicitly present or derivable from {{user.message}}. Do not infer, assume, or hallucinate values not present in the message (except end_time default and reference_datetime, which follow fixed default logic above).\n- If date, start_time, end_time, or summary are not provided/derivable from the user's message, return them as null — do not fabricate placeholder values.\n- No natural language response. No greeting. No confirmation message. Output data only.","tool_choice":"none","embed_memory":true,"llm_provider":"botika","has_save_error":false,"connectedHandles":{"bottom-out":true},"advanced_settings":false,"validation_errors":[],"input_to_ai_setting":{"type":"variable","source":"user"},"validation_warnings":[],"embed_knowledge_base":false,"enable_json_structured_output":false,"process_tool_execution_result":false}},{"id":"qw263xu2ic","type":"entity-llm","position":{"x":688.8022334510322,"y":34.24765311899879},"next":{"main":[{"type":"continue","target_node":"rwepi2u9zf"}]},"properties":{"label":"Retrieve Params","model":"botika/llm-medium","handle":{"source":[{"id":"bottom-out","position":"bottom"}],"target":[{"id":"top-in","position":"top"}]},"description":"","save_errors":null,"llm_provider":"botika","text_message":"{{node_output}}","has_save_error":false,"entities_schema":[{"name":"timeMin","example":["2026-07-20T00:00:00+07:00"],"description":"user's minimal time of the period, could be null if no data present"},{"name":"timeMax","example":["2026-07-20T00:00:00+07:00"],"description":"user's maximal time of the period, could be null if no data present"},{"name":"maxResults","example":["20","10","5"],"description":"user's desireable list limit of the reminders"}],"connectedHandles":{"bottom-out":true},"validation_errors":[],"validation_warnings":[]}},{"id":"rwepi2u9zf","type":"set-user-var","position":{"x":855.4745419438774,"y":37.47694120361743},"next":{"main":[{"type":"continue","target_node":"bew5ayj783"}]},"properties":{"label":"Store Param.","handle":{"source":[{"id":"bottom-out","position":"bottom"}],"target":[{"id":"top-in","position":"top"}]},"variables":[{"var_key":"time_min","data_type":"string","persist":false,"var_value":"{{node_output.timeMin}}"},{"var_key":"time_max","data_type":"string","persist":false,"var_value":"{{node_output.timeMax}}"},{"var_key":"max_results","data_type":"string","persist":false,"var_value":"{{node_output.maxResults}}"}],"decription":"","description":"","save_errors":null,"has_save_error":false,"connectedHandles":{"bottom-out":true}}},{"id":"7s52w1xo28","type":"entity-llm","position":{"x":700.8325084674026,"y":291.89146902851616},"next":{"main":[{"type":"continue","target_node":"67s2ojy2vl"}]},"properties":{"label":"Retrieve Param","model":"botika/llm-medium","handle":{"source":[{"id":"bottom-out","position":"bottom"}],"target":[{"id":"top-in","position":"top"}]},"description":"","save_errors":null,"llm_provider":"botika","text_message":"{{node_output}}","has_save_error":false,"entities_schema":[{"name":"id","example":[],"description":"the reminder id"},{"name":"candidate","example":[],"description":""}],"connectedHandles":{"bottom-out":true},"validation_errors":[],"validation_warnings":[]}},{"id":"67s2ojy2vl","type":"set-user-var","position":{"x":864.3739322981653,"y":292.9498532569742},"next":{"main":[{"type":"continue","target_node":"uuyom6994z"}]},"properties":{"label":"Set User Variable","handle":{"source":[{"id":"bottom-out","position":"bottom"}],"target":[{"id":"top-in","position":"top"}]},"variables":[{"var_key":"reminder_id","data_type":"string","persist":false,"var_value":"{{node_output.id}}"},{"var_key":"reminder_candidate","data_type":"string","persist":false,"var_value":"{{node_output.candidate}}"}],"decription":"","description":"","save_errors":null,"has_save_error":false,"connectedHandles":{"bottom-out":true}}},{"id":"ywp8150w4w","type":"agent-assistant","position":{"x":96.18995870576657,"y":235.2653838192856},"next":{"main":[{"type":"continue","target_node":"gpevfyuxz0"}]},"properties":{"label":"Grab Context","model":"botika/llm-medium","tools":[],"bot_id":"{{bot.id}}","handle":{"source":[{"id":"bottom-out","position":"bottom"}],"target":[{"id":"top-in","position":"top"}]},"description":"Answers questions automatically based on a persona, knowledge base and instructions.","input_to_ai":"{{user.message}}","json_schema":"","output_type":"text","save_errors":null,"task_for_ai":"You are a data retrieval engine for calendar reminder edit requests. Match the user's message to the correct reminder from the provided list, extract its ID, and extract any new values the user wants to change. Do not generate any explanation, confirmation, or elaborating text — output structured data only.\n\nINPUT CONTEXT:\n- User's message: {{user.message}}\n- Available reminders (raw list from the system): {{reminders_list}}\n  Each item has: id, summary, start, end, status\n  IMPORTANT: the order of items in this list reflects the exact numbered order the user was shown (item 1 = first in list, item 2 = second in list, and so on).\n- Current date/time anchor: {{datetime}}\n\nTASK — Step 1: Identify the target reminder\n- Identify which reminder the user wants to edit, using ANY of the following reference types:\n  1. Positional/ordinal reference — e.g. \"nomor 2\", \"yang kedua\", \"reminder ke-3\", \"the second one\", \"number 1\". Use this ONLY to locate WHICH ITEM in the list the user means (by counting position) — never output the position number itself.\n  2. Content reference — matching against \"summary\" text (e.g. \"meeting sama klien\" → \"Meeting Sama Klien\").\n  3. Date/time reference — matching against \"start\"/\"end\" (e.g. \"yang jam 8 pagi\" → a reminder starting at 08:00, \"yang besok\" → a reminder on tomorrow's date).\n  4. Combined references — e.g. \"yang kedua yang meeting itu\" combines positional + content, both should point to the same item for a confident match.\n\nCRITICAL OUTPUT RULE — READ CAREFULLY:\n- The \"id\" field in your output must ALWAYS be the exact value of that item's \"id\" property from {{reminders_list}} — a long alphanumeric string (e.g. \"2ksvcdivbo5ueo40ln7t53kai0\").\n- NEVER output a position number (like \"1\", \"2\", \"3\") as the id, even if the user referred to the reminder by its position.\n- The position/ordinal reference is only used internally to FIND the correct item — the actual \"id\" property of THAT item is what gets returned.\n\nEXAMPLE:\nGiven this reminders_list:\n[\n  {\"id\": \"g1gguuk0tbpkhqvv83nhmo3g9c\", \"summary\": \"Test\", ...},\n  {\"id\": \"2ksvcdivbo5ueo40ln7t53kai0\", \"summary\": \"Main\", ...}\n]\nUser says: \"edit reminder nomor 2, ubah jadi jam 3 sore\"\n→ \"nomor 2\" refers to the 2nd item in the list\n→ The 2nd item's actual id is \"2ksvcdivbo5ueo40ln7t53kai0\"\n→ Correct id output: \"2ksvcdivbo5ueo40ln7t53kai0\"\n→ WRONG output (do not do this): \"2\"\n\nTASK — Step 2: Extract the requested changes\n- new_summary: the new subject/title, only if the user explicitly wants to change what the reminder is about. Otherwise null.\n- new_date: the new date, however phrased (e.g. \"besok\", \"next Monday\"), resolved using {{datetime}} as anchor. Output format: \"yyyy-mm-dd\". Only if user wants to change the date. Otherwise null.\n- new_start_time: the new start time, combined with new_date (or the reminder's existing date if new_date is null) to form a full timestamp. Output format: \"yyyy-mm-ddThh:mm:ss\". Only if user wants to change the time. Otherwise null.\n- new_end_time: only if user explicitly specifies a new duration or end time. Output format: \"yyyy-mm-ddThh:mm:ss\". Otherwise null.\n\nRULES:\n- If exactly one reminder clearly matches, return its ACTUAL \"id\" property value (never a position number). Otherwise return \"id\": null and list possible matches (actual id values) in \"candidates\".\n- If the user gives a positional reference that is out of range for the list (e.g. list only has 1 item but user said \"nomor 3\"), return \"id\": null and \"candidates\": [].\n- Only populate change fields (new_summary, new_date, new_start_time, new_end_time) with what the user explicitly stated. Do not infer or assume changes that weren't mentioned.\n- If the user's message contains no identifiable change at all (just identifies which reminder, without saying what to change), leave all change fields null.\n- Do not fabricate an id that isn't present in {{reminders_list}}.\n- No natural language response. No greeting. No confirmation message. Output data only.\n\nOUTPUT FORMAT (strict JSON):\n{\n  \"id\": \"string\" | null,\n  \"candidates\": [\"string\", ...],\n  \"new_summary\": \"string\" | null,\n  \"new_date\": \"yyyy-mm-dd\" | null,\n  \"new_start_time\": \"yyyy-mm-ddThh:mm:ss\" | null,\n  \"new_end_time\": \"yyyy-mm-ddThh:mm:ss\" | null\n}","tool_choice":"none","embed_memory":true,"llm_provider":"botika","has_save_error":false,"connectedHandles":{"bottom-out":true},"advanced_settings":false,"validation_errors":[],"input_to_ai_setting":{"type":"variable","source":"user"},"validation_warnings":[],"embed_knowledge_base":true,"enable_json_structured_output":false,"process_tool_execution_result":false}},{"id":"gpevfyuxz0","type":"entity-llm","position":{"x":-64.41226878785659,"y":235.90997620684303},"next":{"main":[{"type":"continue","target_node":"79ebg7zcjk"}]},"properties":{"label":"Retrieve Data","model":"botika/llm-medium","handle":{"source":[{"id":"bottom-out","position":"bottom"}],"target":[{"id":"top-in","position":"top"}]},"description":"","save_errors":null,"llm_provider":"botika","text_message":"{{node_output}}","has_save_error":false,"entities_schema":[{"name":"new_date","example":["2007-06-17"],"description":"Updated date intended by the user to set the reminder/event"},{"name":"new_start_time","example":["2025-12-29 10:18:47"],"description":"Updated start time defined by user"},{"name":"new_end_time","example":["2026-12-29 10:18:47"],"description":"Updated end time defined by user, could be empty or null"},{"name":"reference_datetime","example":["2025-12-29 10:18:47"],"description":"Fixed by datetime"},{"name":"new_summary","example":[],"description":"Updated summary described by the user, like goal of the reminder"},{"name":"id","example":[],"description":"Reminder ID"},{"name":"candidate","example":[],"description":"reminder candidate"}],"connectedHandles":{"bottom-out":true},"validation_errors":[],"validation_warnings":[]}},{"id":"79ebg7zcjk","type":"set-user-var","position":{"x":-213.64734704588875,"y":237.98781881283892},"next":{"main":[{"type":"continue","target_node":"tps6b37z5q"}]},"properties":{"label":"Save Data","handle":{"source":[{"id":"bottom-out","position":"bottom"}],"target":[{"id":"top-in","position":"top"}]},"variables":[{"var_key":"user_date","data_type":"string","persist":false,"var_value":"{{node_output.new_date}}"},{"var_key":"start_time","data_type":"string","persist":false,"var_value":"{{node_output.new_start_time}}"},{"var_key":"end_time","data_type":"string","persist":false,"var_value":"{{node_output.new_end_time}}"},{"var_key":"reference_datetime","data_type":"string","persist":false,"var_value":"{{node_output.reference_datetime}}"},{"var_key":"summary","data_type":"string","persist":false,"var_value":"{{node_output.new_summary}}"},{"var_key":"reminder_id","data_type":"string","persist":false,"var_value":"{{node_output.id}}"},{"var_key":"reminder_candidates","data_type":"string","persist":false,"var_value":"{{node_output.candidate}}"}],"decription":"","description":"","save_errors":null,"has_save_error":false,"connectedHandles":{"bottom-out":true}}},{"id":"tps6b37z5q","type":"http-request","position":{"x":-214.09516391091964,"y":308.40126599674966},"next":{"main":[{"type":"continue","target_node":"w6u6odc7r7"}]},"properties":{"url":"https://domain.com/api/reminder/edit-reminder","body":{"id":"{{reminder_id}}","new_date":"{{date}}","candidates":"{{reminder_candidates}}","new_summary":"{{summary}}","new_end_time":"{{end_time}}","new_start_time":"{{start_time}}"},"label":"Edit API","handle":{"source":[{"id":"bottom-out","position":"bottom"}],"target":[{"id":"top-in","position":"top"}]},"method":"POST","headers":{"Content-Type":"application/json"},"description":"POST","save_errors":null,"handle_error":true,"has_save_error":false,"connectedHandles":{"bottom-out":true}}},{"id":"w6u6odc7r7","type":"agent-assistant","position":{"x":-82.56716690192705,"y":310.57062355988313},"next":{"main":[{"type":"continue","target_node":"cmvxnrzjf1"}]},"properties":{"label":"Response Format","model":"botika/llm-medium","tools":[],"bot_id":"{{bot.id}}","handle":{"source":[{"id":"bottom-out","position":"bottom"}],"target":[{"id":"top-in","position":"top"}]},"description":"Answers questions automatically based on a persona, knowledge base and instructions.","input_to_ai":"{{user.message}}","json_schema":"","output_type":"text","save_errors":null,"task_for_ai":"You are a strict, deterministic response generator. You do NOT have creative freedom. You must follow the exact rule below with no exceptions.\n\nINPUT: {{node_output.status_code}}\n\nRULE (follow exactly, no deviation):\n- IF status_code == 200 → output ONLY the fixed success message below, translated to match the user's language ({{user.message}}). Do not add, remove, or rephrase anything else.\n- IF status_code != 200 → output ONLY the fixed error message below, translated to match the user's language. Do not add, remove, or rephrase anything else.\n\nFIXED SUCCESS MESSAGE:\nIndonesian: \"Reminder telah diedit.\"\nEnglish: \"Reminder has been edited.\"\n\nFIXED ERROR MESSAGE:\nIndonesian: \"Maaf kak, ada kendala. Boleh coba ulangi lagi?\"\nEnglish: \"Sorry, something went wrong. Could you try again?\"\n\nABSOLUTE RESTRICTIONS:\n- Do NOT ask the user to rephrase, reformat, or clarify their original message, regardless of what the original message looked like.\n- Do NOT reference or comment on the user's original phrasing, format, or wording in any way.\n- Do NOT suggest example sentences or templates.\n- Do NOT add explanations, reasoning, apologies beyond the fixed error message, or any extra sentence.\n- Your ONLY job is to check status_code and output ONE of the two fixed messages, translated. Nothing else exists in your task.\n- If you feel the urge to add clarifying guidance, suppress it — that is not your role in this step.\n\nOUTPUT: One sentence only. No greeting, no elaboration, no follow-up question.","tool_choice":"none","embed_memory":true,"llm_provider":"botika","has_save_error":false,"connectedHandles":{"bottom-out":true},"advanced_settings":false,"validation_errors":[],"input_to_ai_setting":{"type":"variable","source":"user"},"validation_warnings":[],"embed_knowledge_base":true,"enable_json_structured_output":false,"process_tool_execution_result":false}},{"id":"jkw61ge94j","type":"agent-assistant","position":{"x":521.7113413383775,"y":456.3963728669316},"next":{"main":[{"type":"continue","target_node":"cmvxnrzjf1"}]},"properties":{"label":"Fallback KB&Persona","model":"botika/llm-medium","tools":[],"bot_id":"{{bot.id}}","handle":{"source":[{"id":"bottom-out","position":"bottom"}],"target":[{"id":"top-in","position":"top"}]},"description":"Answers questions automatically based on a persona, knowledge base and instructions.","input_to_ai":"{{user.message}}","json_schema":"","output_type":"text","save_errors":null,"task_for_ai":"Answer using user's language","tool_choice":"none","embed_memory":true,"llm_provider":"botika","has_save_error":false,"connectedHandles":{"bottom-out":true},"advanced_settings":false,"validation_errors":[],"input_to_ai_setting":{"type":"variable","source":"user"},"validation_warnings":[],"embed_knowledge_base":true,"enable_json_structured_output":false,"process_tool_execution_result":false}},{"id":"z4chyheq1n","type":"agent-assistant","position":{"x":712.7981665310945,"y":363.72005454621984},"next":{"main":[{"type":"continue","target_node":"cmvxnrzjf1"}]},"properties":{"label":"Response Format","model":"botika/llm-medium","tools":[],"bot_id":"{{bot.id}}","handle":{"source":[{"id":"bottom-out","position":"bottom"}],"target":[{"id":"top-in","position":"top"}]},"description":"Answers questions automatically based on a persona, knowledge base and instructions.","input_to_ai":"{{user.message}}","json_schema":"","output_type":"text","save_errors":null,"task_for_ai":"You are a strict, deterministic response generator. You do NOT have creative freedom. You must follow the exact rule below with no exceptions.\n\nINPUT: {{node_output.status_code}}\n\nRULE (follow exactly, no deviation):\n- IF status_code == 200 → output ONLY the fixed success message below, translated to match the user's language ({{user.message}}). Do not add, remove, or rephrase anything else.\n- IF status_code != 200 → output ONLY the fixed error message below, translated to match the user's language. Do not add, remove, or rephrase anything else.\n\nFIXED SUCCESS MESSAGE:\nIndonesian: \"Reminder telah dihapus.\"\nEnglish: \"Reminder has been deleted.\"\n\nFIXED ERROR MESSAGE:\nIndonesian: \"Maaf kak, ada kendala. Boleh coba ulangi lagi?\"\nEnglish: \"Sorry, something went wrong. Could you try again?\"\n\nABSOLUTE RESTRICTIONS:\n- Do NOT ask the user to rephrase, reformat, or clarify their original message, regardless of what the original message looked like.\n- Do NOT reference or comment on the user's original phrasing, format, or wording in any way.\n- Do NOT suggest example sentences or templates.\n- Do NOT add explanations, reasoning, apologies beyond the fixed error message, or any extra sentence.\n- Your ONLY job is to check status_code and output ONE of the two fixed messages, translated. Nothing else exists in your task.\n- If you feel the urge to add clarifying guidance, suppress it — that is not your role in this step.\n\nOUTPUT: One sentence only. No greeting, no elaboration, no follow-up question.","tool_choice":"none","embed_memory":true,"llm_provider":"botika","has_save_error":false,"connectedHandles":{"bottom-out":true},"advanced_settings":false,"validation_errors":[],"input_to_ai_setting":{"type":"variable","source":"user"},"validation_warnings":[],"embed_knowledge_base":true,"enable_json_structured_output":false,"process_tool_execution_result":false}},{"id":"y1jnucrdjc","type":"agent-assistant","position":{"x":-111.43138475953748,"y":109.27505920033781},"next":{"main":[{"type":"continue","target_node":"cmvxnrzjf1"}]},"properties":{"label":"Response Format","model":"botika/llm-medium","tools":[],"bot_id":"{{bot.id}}","handle":{"source":[{"id":"bottom-out","position":"bottom"}],"target":[{"id":"top-in","position":"top"}]},"description":"Answers questions automatically based on a persona, knowledge base and instructions.","input_to_ai":"{{user.message}}","json_schema":"","output_type":"text","save_errors":null,"task_for_ai":"You are a strict, deterministic response generator. You do NOT have creative freedom. You must follow the exact rule below with no exceptions.\n\nINPUT: {{node_output.status_code}}\n\nRULE (follow exactly, no deviation):\n- IF status_code == 200 → output ONLY the fixed success message below, translated to match the user's language ({{user.message}}). Do not add, remove, or rephrase anything else.\n- IF status_code != 200 → output ONLY the fixed error message below, translated to match the user's language. Do not add, remove, or rephrase anything else.\n\nFIXED SUCCESS MESSAGE:\nIndonesian: \"Reminder telah dibuat.\"\nEnglish: \"Reminder has been created.\"\n\nFIXED ERROR MESSAGE:\nIndonesian: \"Maaf kak, ada kendala. Boleh coba ulangi lagi?\"\nEnglish: \"Sorry, something went wrong. Could you try again?\"\n\nABSOLUTE RESTRICTIONS:\n- Do NOT ask the user to rephrase, reformat, or clarify their original message, regardless of what the original message looked like.\n- Do NOT reference or comment on the user's original phrasing, format, or wording in any way.\n- Do NOT suggest example sentences or templates.\n- Do NOT add explanations, reasoning, apologies beyond the fixed error message, or any extra sentence.\n- Your ONLY job is to check status_code and output ONE of the two fixed messages, translated. Nothing else exists in your task.\n- If you feel the urge to add clarifying guidance, suppress it — that is not your role in this step.\n\nOUTPUT: One sentence only. No greeting, no elaboration, no follow-up question.","tool_choice":"none","embed_memory":true,"llm_provider":"botika","has_save_error":false,"connectedHandles":{"bottom-out":true},"advanced_settings":false,"validation_errors":[],"input_to_ai_setting":{"type":"variable","source":"user"},"validation_warnings":[],"embed_knowledge_base":false,"enable_json_structured_output":false,"process_tool_execution_result":false}}]}
```

### 6.5 Testing & Integration

1. Test your workflow directly using the **"Test Workflow"** feature in the Agentic Platform.
2. *(Optional)* Integrate with **Botika Webchat**:
   - Click the **"+"** button on the Start node and configure your webchat settings.
   - The webchat URL can be found under the **"Integration"** tab → **"Webchat"**.
   - Open the Webchat URL (e.g., `https://chat.botika.online/v3/<id>`) to test your bot.

---

## Webchat Bot Example

You can try out a live example of the reminder bot running on Botika Webchat:

🔗 **[https://chat.botika.online/v3/vfwAFYw](https://chat.botika.online/v3/vfwAFYw)**

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

- **`reminders_list` variable is persistence-dependent**
  The `reminders_list` variable is only populated/updated when the user goes through the `usr.reminderList` branch (i.e., explicitly lists/shows their reminders). If a user tries to directly edit or delete a reminder without listing it first, `reminders_list` may be stale, empty, or mismatched, causing the `id` matching in the Edit/Delete `Grab Context` steps to fail or resolve to the wrong reminder.

- **No API Key Setup**
  This backend proxy still does not implement any API key or authentication mechanism. All endpoints are publicly accessible once deployed. Authentication will be added in a future update.

---

## Solved Issues

- **LLM non-determinism — instruction-following failure**
  At some point, the `edit-reminder` and `delete-reminder` operations may fail when the AI fails to correctly fetch/extract the target reminder's `id`, even though the intended reminder exists in the list. This stems from inherent LLM non-determinism in the Agent Assistant / Entity LLM steps rather than a backend proxy bug.
  **Solved (22 July 2026):** Resolved by using a different LLM model for the Agent Assistant, specifically OpenAI GPT-4o.

---

## Working Bot Footage

- **Listing Reminder**
![Listing Reminder in Webchat](public/chatbot/images/listc.png)
![Google Calendar View](public/chatbot/images/listg.png)

- **Create Reminder**
![Create Reminder in Webchat](public/chatbot/images/createc.png)
![Google Calendar View](public/chatbot/images/createg.png)

- **Edit Reminder**
![Edit Reminder in Webchat](public/chatbot/images/editc.png)
![Google Calendar View](public/chatbot/images/editg.png)

- **Delete Reminder**
![Delete Reminder in Webchat](public/chatbot/images/deletec.png)
![Google Calendar View](public/chatbot/images/deleteg.png)
