import * as XLSX from "xlsx";
import type { UploadedSession } from "@/components/events/BulkUploadReviewModal";

// Language name to code mapping
const LANGUAGE_MAP: Record<string, string> = {
  "english (us)": "en-US",
  "english": "en-US",
  "spanish": "es",
  "french": "fr",
  "german": "de",
  "italian": "it",
  "portuguese": "pt",
  "chinese": "zh",
  "japanese": "ja",
  "korean": "ko",
};

// Voice pack name to ID mapping
const VOICE_PACK_MAP: Record<string, string> = {
  "feminine voice": "feminine",
  "feminine": "feminine",
  "masculine voice": "masculine",
  "masculine": "masculine",
};

/**
 * Parse an Excel or CSV file containing event schedule data.
 * Returns an array of UploadedSession objects for review.
 */
export async function parseScheduleFile(
  file: File,
  defaultTimezone: string = "America/Los_Angeles"
): Promise<UploadedSession[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "array" });

        // Get the first sheet
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convert to JSON with headers
        const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, {
          raw: false, // Convert dates to strings
          defval: "", // Default value for empty cells
        });

        console.log("Parsed rows:", jsonData.length);

        // Map to UploadedSession format
        const sessions: UploadedSession[] = jsonData
          .filter((row) => {
            // Skip empty rows
            const title = row["Title"] || row["title"] || "";
            return title.trim() !== "";
          })
          .map((row, index) => {
            // Handle column name variations (Room is primary, Location for backward compatibility)
            const room =
              row["Room"] || row["room"] || row["Location"] || row["location"] || "Main Room";
            const title =
              row["Title"] || row["title"] || row["Session Title"] || "";
            const presenter =
              row["Presenter"] ||
              row["presenter"] ||
              row["Presenters"] ||
              row["Speaker"] ||
              "";
            const dateRaw = row["Date"] || row["date"] || "";
            const date = parseDate(dateRaw);
            const startTimeRaw = row["Start Time"] || row["start time"] || row["Time"] || row["time"] || "";
            const endTimeRaw = row["End Time"] || row["End time"] || row["end time"] || "";
            const durationRaw = row["Duration"] || row["duration"] || "";
            const duration = durationRaw ? parseInt(durationRaw) : 60;
            const timezone =
              row["Timezone"] || row["timezone"] || defaultTimezone;
            const glossaryRaw = row["Glossary"] || row["glossary"] || "";
            const glossary = glossaryRaw || "none";
            const accountRaw = row["Account"] || row["account"] || "";
            const account = accountRaw || "";
            const voicePackRaw =
              row["Voice Pack"] || row["voicePack"] || row["Voice"] || "feminine";
            const voicePack = VOICE_PACK_MAP[voicePackRaw.toLowerCase()] || voicePackRaw;
            const languageRaw =
              row["Language"] || row["language"] || "en-US";
            const language = LANGUAGE_MAP[languageRaw.toLowerCase()] || languageRaw;
            const label = row["Label"] || row["label"] || "";

            // Parse start time, and use explicit end time if provided, otherwise calculate from duration
            const { startTime, endTime } = parseTimeRange(startTimeRaw, endTimeRaw, duration);

            console.log(`Row ${index + 1}:`, { title, date, startTime, endTime, room });

            return {
              id: `session-${Date.now()}-${index}`,
              rowNumber: index + 1,
              room,
              title,
              presenter,
              date,
              startTime,
              endTime,
              timezone,
              duration,
              glossary,
              account,
              voicePack,
              language,
              label,
              isValid: true,
              errors: [],
            };
          });

        console.log("Processed sessions:", sessions.length);
        resolve(sessions);
      } catch (error) {
        console.error("Error parsing file:", error);
        reject(new Error("Failed to parse the schedule file. Please check the format."));
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read the file."));
    };

    reader.readAsArrayBuffer(file);
  });
}

/**
 * Parse date string or Excel serial number to YYYY-MM-DD format
 */
function parseDate(dateValue: any): string {
  if (!dateValue) return new Date().toISOString().split("T")[0];

  const currentYear = new Date().getFullYear();

  // If it's already a string in a reasonable format
  if (typeof dateValue === "string") {
    const trimmed = dateValue.trim();
    
    // Handle MM/DD/YYYY format
    const mdyMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (mdyMatch) {
      const [, month, day, year] = mdyMatch;
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }

    // Handle MM/DD/YY format
    const mdyShortMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2})$/);
    if (mdyShortMatch) {
      const [, month, day, shortYear] = mdyShortMatch;
      const year = parseInt(shortYear) > 50 ? `19${shortYear}` : `20${shortYear}`;
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }

    // Handle MM/DD format (no year - assume current or next year)
    const mdMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})$/);
    if (mdMatch) {
      const [, month, day] = mdMatch;
      // If the date is in the past this year, assume next year
      const testDate = new Date(currentYear, parseInt(month) - 1, parseInt(day));
      const year = testDate < new Date() ? currentYear + 1 : currentYear;
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }

    // Handle YYYY-MM-DD format
    const ymdMatch = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (ymdMatch) {
      const [, year, month, day] = ymdMatch;
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }

    // Try to parse as date
    const parsed = new Date(trimmed);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString().split("T")[0];
    }
  }

  // Handle Excel serial number
  if (typeof dateValue === "number") {
    const excelEpoch = new Date(1899, 11, 30);
    const date = new Date(excelEpoch.getTime() + dateValue * 86400000);
    return date.toISOString().split("T")[0];
  }

  return new Date().toISOString().split("T")[0];
}

/**
 * Parse a single time value to HH:MM format
 */
function parseTimeValue(timeValue: any): string | null {
  if (!timeValue) return null;

  const strValue = String(timeValue).trim();

  // Handle "HH:MM AM/PM" format
  const ampmMatch = strValue.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (ampmMatch) {
    let hours = parseInt(ampmMatch[1]);
    const minutes = ampmMatch[2];
    const meridiem = ampmMatch[3]?.toUpperCase();

    if (meridiem === "PM" && hours !== 12) {
      hours += 12;
    } else if (meridiem === "AM" && hours === 12) {
      hours = 0;
    }

    return `${hours.toString().padStart(2, "0")}:${minutes}`;
  }

  // Handle "HH:MM" 24-hour format
  if (/^\d{1,2}:\d{2}$/.test(strValue)) {
    const [hours, minutes] = strValue.split(":");
    return `${hours.padStart(2, "0")}:${minutes}`;
  }

  // Handle Excel decimal time (e.g., 0.5 = 12:00 PM)
  if (typeof timeValue === "number" && timeValue < 1) {
    const totalMinutes = Math.round(timeValue * 24 * 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  }

  return null;
}

/**
 * Parse start and end time, or calculate end time from duration
 */
function parseTimeRange(
  startTimeValue: any,
  endTimeValue: any,
  durationMinutes: number
): { startTime: string; endTime: string } {
  const startTime = parseTimeValue(startTimeValue) || "09:00";
  
  // Use explicit end time if provided
  const parsedEndTime = parseTimeValue(endTimeValue);
  if (parsedEndTime) {
    return { startTime, endTime: parsedEndTime };
  }

  // Calculate end time from duration
  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const totalStartMinutes = startHours * 60 + startMinutes;
  const totalEndMinutes = totalStartMinutes + (durationMinutes || 60);
  const endHours = Math.floor(totalEndMinutes / 60) % 24;
  const endMinutes = totalEndMinutes % 60;
  const endTime = `${endHours.toString().padStart(2, "0")}:${endMinutes.toString().padStart(2, "0")}`;

  return { startTime, endTime };
}
