---
name: gemini-to-notion
description: Parse a pasted Gemini/Google Meet meeting note into a structured row in the Notion "Meeting Notes" database. Trigger when the user pastes meeting notes and wants them filed in Notion, or runs /gemini-to-notion.
---

# Gemini → Notion Meeting Notes Skill

## Description
Takes raw Gemini (Google Meet) meeting-note text and files it as a structured, scannable row in the Notion **Meeting Notes** database — title, date, attendees, decisions, action items as checkboxes, and collapsible detail toggles.

## Invocation
`/gemini-to-notion` then paste the note, or `/gemini-to-notion "<pasted note text>"`.

## Target database
- **Database:** Meeting Notes — https://www.notion.so/83b91936f52444e5a5f4d1a21ea5710c
- **Data source ID:** `812e1845-2843-4252-a3b0-3a6fd4d44104`
- **Properties (exact names + types):**
  - `Meeting` (title) — meeting name only, no date (e.g. "Deacon <> Justin")
  - `date:Date:start` (date) — ISO `YYYY-MM-DD`; also set `date:Date:is_datetime` = 0
  - `Attendees` (multi_select) — JSON array string, options: "Deacon Poon", "Justin Cepelak", "Graham" (add new options if needed)
  - `Source` (select) — set to "Gemini"
  - `Status` (status) — set to "Not started" for a fresh note
  - `Action Items` (number) — count of action items found
  - `Summary` (text) — one-line summary

## Workflow

### Step 1: Load tools + spec
Ensure these Notion tools are loaded (via ToolSearch if deferred):
`notion-create-pages`, `notion-fetch`. Read the markdown spec resource `notion://docs/enhanced-markdown-spec` if unsure of block syntax (toggles use `<details><summary>`, checkboxes use `- [ ]`, date mentions use `<mention-date start="YYYY-MM-DD"/>`).

### Step 2: Parse the raw note
Extract and normalize, dropping survey/rating cruft ("Rate this Summary", "Helpful or Not Helpful", footer links):
- **Meeting title** + **date** (from the header line)
- **Attendees** (from "Invited" / attendees line)
- **Summary** → condense to 3 themed bullets + a one-line summary for the property
- **Decisions** → preserve ALIGNED/status badges; render as bullets with a green **ALIGNED** span
- **Next steps** → render as `- [ ]` checkboxes; append *(Owner: Name)*; count them for the `Action Items` property
- **Details** → one collapsible `<details>` toggle per discussion point

### Step 3: Create the row
Call `notion-create-pages` with `parent: { type: "data_source_id", data_source_id: "812e1845-2843-4252-a3b0-3a6fd4d44104" }`, the properties from Step 1 (note the expanded `date:Date:start` form and the JSON-array string for `Attendees`), and the page body using this structure:

```
<callout icon="📅" color="gray_bg">
	**Date:** <mention-date start="YYYY-MM-DD"/>  ·  **Attendees:** ...  ·  **Source:** Gemini meeting notes
</callout>

## Summary
<3 themed bullets>

## Decisions
- <span color="green">**ALIGNED**</span> · **<decision title>** — <detail>

## Action items
- [ ] **<action>** — <detail> *(Owner: Name)*

## Details
<details><summary><topic></summary><detail></details>
```

### Step 4: Confirm
Report the new page URL and a one-line summary of what was filed (title, # decisions, # action items).

## Notes
- If an attendee isn't an existing `Attendees` option, the create call will reject it — add the option first via `update_data_source`, or omit and mention it.
- Keep details as toggles so the database row stays scannable.
- This skill is the **manual-paste** path. Fully automated ingestion from Google (Calendar/Docs/Gmail) is blocked until a Google Docs/Drive/Gmail integration with read scope is connected — see the note in the repo discussion / project memory.
