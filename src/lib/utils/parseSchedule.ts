import * as XLSX from "xlsx";
import type { UploadedSession } from "@/components/events/BulkUploadReviewModal";

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

        // Map to UploadedSession format
        const sessions: UploadedSession[] = jsonData.map((row, index) => {
          // Handle column name variations
          const location =
            row["Location"] || row["location"] || row["Room"] || "Main Room";
          const title =
            row["Title"] || row["title"] || row["Session Title"] || "";
          const presenter =
            row["Presenter"] ||
            row["presenter"] ||
            row["Presenters"] ||
            row["Speaker"] ||
            "";
          const date = parseDate(row["Date"] || row["date"]);
          const time = row["Time"] || row["time"] || row["Start Time"] || "";
          const duration = parseInt(row["Duration"] || row["duration"] || "60");
          const timezone =
            row["Timezone"] || row["timezone"] || defaultTimezone;
          const glossary =
            row["Glossary"] || row["glossary"] || "none";
          const account =
            row["Account"] || row["account"] || "";
          const voicePack =
            row["Voice Pack"] || row["voicePack"] || row["Voice"] || "feminine";
          const language =
            row["Language"] || row["language"] || "en-US";
          const label = row["Label"] || row["label"] || "";

          // Parse time and calculate end time
          const { startTime, endTime } = parseTimeAndDuration(time, duration);

          return {
            id: `session-${Date.now()}-${index}`,
            rowNumber: index + 1,
            location,
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

  // If it's already a string in a reasonable format
  if (typeof dateValue === "string") {
    // Handle MM/DD/YYYY format
    const mdyMatch = dateValue.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (mdyMatch) {
      const [, month, day, year] = mdyMatch;
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }

    // Handle YYYY-MM-DD format
    const ymdMatch = dateValue.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (ymdMatch) {
      return dateValue;
    }

    // Try to parse as date
    const parsed = new Date(dateValue);
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
 * Parse time string and calculate end time based on duration
 */
function parseTimeAndDuration(
  timeValue: any,
  durationMinutes: number
): { startTime: string; endTime: string } {
  let startTime = "09:00";

  if (timeValue) {
    // Handle "HH:MM AM/PM" format
    const ampmMatch = String(timeValue).match(
      /^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i
    );
    if (ampmMatch) {
      let hours = parseInt(ampmMatch[1]);
      const minutes = ampmMatch[2];
      const meridiem = ampmMatch[3]?.toUpperCase();

      if (meridiem === "PM" && hours !== 12) {
        hours += 12;
      } else if (meridiem === "AM" && hours === 12) {
        hours = 0;
      }

      startTime = `${hours.toString().padStart(2, "0")}:${minutes}`;
    }
    // Handle "HH:MM" 24-hour format
    else if (/^\d{1,2}:\d{2}$/.test(String(timeValue))) {
      const [hours, minutes] = String(timeValue).split(":");
      startTime = `${hours.padStart(2, "0")}:${minutes}`;
    }
    // Handle Excel decimal time (e.g., 0.5 = 12:00 PM)
    else if (typeof timeValue === "number" && timeValue < 1) {
      const totalMinutes = Math.round(timeValue * 24 * 60);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      startTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    }
  }

  // Calculate end time
  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const totalStartMinutes = startHours * 60 + startMinutes;
  const totalEndMinutes = totalStartMinutes + (durationMinutes || 60);
  const endHours = Math.floor(totalEndMinutes / 60) % 24;
  const endMinutes = totalEndMinutes % 60;
  const endTime = `${endHours.toString().padStart(2, "0")}:${endMinutes.toString().padStart(2, "0")}`;

  return { startTime, endTime };
}
