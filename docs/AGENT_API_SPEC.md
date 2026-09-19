# TOOLVERSE - Agent & Admin Backend API Specification

This specification documents the server-side Management API for the **TOOLVERSE** project (`PROJECT_ID = TOOLVERSE`), designed for future Agent and Admin panel interactions.

---

## 1. Core Architecture & Security

- **Project Identifier**: `TOOLVERSE` (constant project name/ID, not a secret key).
- **Authentication Method**: Server-side Secret Token.
  - Required Environment Variable: `TOOLVERSE_AGENT_SECRET`
  - **Zero Frontend Leakage**: This secret is stored exclusively on the server (`process.env.TOOLVERSE_AGENT_SECRET`) and is never included in client-side bundles or browser environments.
- **Accepted Request Headers**:
  - `X-Toolverse-Secret: <YOUR_TOOLVERSE_AGENT_SECRET>`
  - Or `Authorization: Bearer <YOUR_TOOLVERSE_AGENT_SECRET>`
- **Security Features**:
  - Timing-safe secret verification (`crypto.timingSafeEqual`).
  - Strict Operation Allowlist (unapproved endpoints are rejected with `403 Forbidden`).
  - In-memory rate limiting (`180 requests/min`).
  - Immutable Audit Logging (`data/audit_log.json`).
  - Accidental Deletion Protection on all destructive endpoints.

---

## 2. Operation Allowlist

Only the following operations are permitted by system policy:

| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/public/tools` | Fetch active tools for public website | No |
| `GET` | `/api/public/categories` | Fetch active categories for public website | No |
| `GET` | `/api/public/meta` | Public project metadata and health | No |
| `GET` | `/api/agent/v1/meta` | System status, allowlist, and database counts | **Yes** |
| `GET` | `/api/agent/v1/tools` | List all tools (including inactive/draft) | **Yes** |
| `GET` | `/api/agent/v1/tools/:id` | Get single tool by ID or slug | **Yes** |
| `POST` | `/api/agent/v1/tools` | Add a new tool | **Yes** |
| `PUT` | `/api/agent/v1/tools/:id` | Update tool fields | **Yes** |
| `DELETE` | `/api/agent/v1/tools/:id` | Delete tool (Requires confirmation) | **Yes** |
| `GET` | `/api/agent/v1/categories` | List all categories | **Yes** |
| `GET` | `/api/agent/v1/categories/:id` | Get category by ID or slug | **Yes** |
| `POST` | `/api/agent/v1/categories` | Add a new category | **Yes** |
| `PUT` | `/api/agent/v1/categories/:id` | Update category fields | **Yes** |
| `DELETE` | `/api/agent/v1/categories/:id` | Delete category (Requires confirmation & 0 tools) | **Yes** |
| `GET` | `/api/agent/v1/audit-log` | Inspect recent audit records | **Yes** |

---

## 3. Accidental Deletion Protection

To prevent inadvertent destruction of tools:
1. `DELETE /api/agent/v1/tools/:id` **must** supply `{ "confirm": true }` in JSON body or `?confirm=true` as query param. Requests without confirmation return `400 Bad Request`.
2. Tools with `deletionProtected: true` cannot be deleted unless `{ "confirm": true, "forceUnlock": true }` is provided.
3. Categories with active tools assigned cannot be deleted until tools are reassigned or removed.

---

## 4. Audit Log Schema

Every management action records an audit log entry:
```json
{
  "id": "audit_1742000000000_abc12",
  "timestamp": "2026-09-19T14:30:00.000Z",
  "operation": "POST /api/agent/v1/tools",
  "source": "agent",
  "targetType": "tool",
  "targetId": "new-tool-id",
  "success": true,
  "message": "Created new tool: Tool Name (new-tool-id)",
  "ipHash": "a1b2c3d4e5f6"
}
```

---

## 5. Sample Usage (cURL)

### A. Inspect Agent Meta & Allowlist
```bash
curl -X GET https://<YOUR_APP_URL>/api/agent/v1/meta \
  -H "X-Toolverse-Secret: <YOUR_TOOLVERSE_AGENT_SECRET>"
```

### B. Add a New Tool
```bash
curl -X POST https://<YOUR_APP_URL>/api/agent/v1/tools \
  -H "Content-Type: application/json" \
  -H "X-Toolverse-Secret: <YOUR_TOOLVERSE_AGENT_SECRET>" \
  -d '{
    "id": "gemini-flash",
    "name": "Gemini Flash",
    "slug": "gemini-flash",
    "nameAr": "جيميني فلاش",
    "nameEn": "Gemini Flash",
    "descriptionAr": "نموذج ذكاء اصطناعي فائق السرعة من Google للتحليل السريع.",
    "descriptionEn": "High-speed multimodal AI model by Google optimized for low latency.",
    "category": "ai-chat",
    "subcategory": "Multimodal LLM",
    "pricing": "Freemium",
    "officialUrl": "https://aistudio.google.com",
    "icon": "Sparkles",
    "brandColor": "#4285F4",
    "features": {
      "ar": ["سرعة استجابة فائقة", "نافذة سياق ضخمة"],
      "en": ["Sub-second latency", "Expansive context window"]
    },
    "keywords": ["google", "gemini", "ai"],
    "tags": ["llm", "speed", "multimodal"],
    "featured": false,
    "isNew": true,
    "isActive": true
  }'
```

### C. Update a Tool
```bash
curl -X PUT https://<YOUR_APP_URL>/api/agent/v1/tools/gemini-flash \
  -H "Content-Type: application/json" \
  -H "X-Toolverse-Secret: <YOUR_TOOLVERSE_AGENT_SECRET>" \
  -d '{
    "featured": true,
    "popularityScore": 95
  }'
```

### D. Delete a Tool (With Required Protection Confirmation)
```bash
curl -X DELETE https://<YOUR_APP_URL>/api/agent/v1/tools/gemini-flash \
  -H "Content-Type: application/json" \
  -H "X-Toolverse-Secret: <YOUR_TOOLVERSE_AGENT_SECRET>" \
  -d '{ "confirm": true }'
```

---

## 6. How to Deploy the Secret

When deploying the applet or running in production:
1. Open the Cloud Run / AI Studio Settings menu.
2. Under **Environment Variables / Secrets**, add:
   - Key: `TOOLVERSE_AGENT_SECRET`
   - Value: `[Your strong random secret string]`
3. The server will automatically pick up `process.env.TOOLVERSE_AGENT_SECRET` on initialization.
