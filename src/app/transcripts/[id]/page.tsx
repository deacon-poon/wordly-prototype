"use client";

import { useState } from "react";
import { TranscriptDetailView } from "@/components/transcripts/transcript-detail-view";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, Share, Star } from "lucide-react";
import Link from "next/link";

// Mock data
const mockSession = {
  id: "ssod-5071",
  name: "SSOD-5071",
  datetime: "May 7, 2025 8:57 PM",
  timezone: "(GMT-5)",
};

const mockTranscripts = [
  {
    id: "transcript-original",
    language: "original", // Special case for original
    type: "original" as const,
    content: [
      "Hello, hello, hello.",
      "I am naughty boy deacon.",
      "Hello.",
      "Hello.",
      "你好，她是信使，你們喜歡明我講什麽?",
      "हिंदी",
      "And this is another line of text for the transcript.",
      "We can add more content here to demonstrate scrolling.",
      "The transcript should be able to display multiple paragraphs.",
    ],
  },
  {
    id: "transcript-en",
    language: "en-US",
    type: "translation" as const,
    content: [
      "Hello, hello, hello.",
      "I am naughty boy deacon.",
      "Hello.",
      "Hello.",
      "Hello, she is the messenger, what would you like me to talk about?",
      "Hindi",
      "And this is another line of text for the transcript.",
      "We can add more content here to demonstrate scrolling.",
      "The transcript should be able to display multiple paragraphs.",
    ],
  },
  {
    id: "transcript-es",
    language: "es-MX",
    type: "translation" as const,
    content: [
      "Hola, hola, hola.",
      "Soy un chico travieso diácono.",
      "Hola.",
      "Hola.",
      "Hola, ella es la mensajera, ¿de qué les gustaría que hablara?",
      "Hindi",
      "Y esta es otra línea de texto para la transcripción.",
      "Podemos agregar más contenido aquí para demostrar el desplazamiento.",
      "La transcripción debería poder mostrar múltiples párrafos.",
    ],
  },
  {
    id: "summary-en",
    language: "en-US",
    type: "summary" as const,
    content: [
      "The conversation begins with greetings.",
      "The speaker introduces himself as 'naughty boy deacon'.",
      "The speaker then starts speaking in different languages including Chinese and Hindi.",
      "There are multiple lines of text to demonstrate how a transcript would appear with various paragraphs and content.",
    ],
  },
  {
    id: "summary-es",
    language: "es-MX",
    type: "summary" as const,
    content: [
      "La conversación comienza con saludos.",
      "El hablante se presenta como 'travieso diácono'.",
      "Luego, el hablante comienza a hablar en diferentes idiomas, incluidos el chino y el hindi.",
      "Hay varias líneas de texto para demostrar cómo aparecería una transcripción con varios párrafos y contenido.",
    ],
  },
];

const availableLanguages = [
  { code: "en-US", name: "English (US)" },
  { code: "es-MX", name: "Spanish (Mexico)" },
  { code: "fr-FR", name: "French (France)" },
  { code: "de-DE", name: "German" },
  { code: "zh-CN", name: "Chinese (Simplified)" },
  { code: "ja-JP", name: "Japanese" },
  { code: "ko-KR", name: "Korean" },
  { code: "ru-RU", name: "Russian" },
  { code: "ar-SA", name: "Arabic" },
  { code: "hi-IN", name: "Hindi" },
];

export default function TranscriptDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [transcripts, setTranscripts] = useState(mockTranscripts);

  // Handlers
  const handleTranslate = (language: string) => {
    console.log(`Translating to ${language}`);
    // Here you would typically call an API to generate a translation
    alert(`Translation to ${language} would be initiated here`);
  };

  const handleDownload = (options: {
    languages: string[];
    types: string[];
  }) => {
    console.log("Downloading:", options);
    alert(
      `Downloading ${options.types.join(", ")} in ${options.languages.join(
        ", "
      )}`
    );
  };

  const handleDelete = () => {
    console.log("Deleting transcript");
    alert("Transcript would be deleted here");
  };

  const handleEdit = (transcriptId: string) => {
    console.log("Editing transcript:", transcriptId);
    alert(`Editing transcript ${transcriptId}`);
  };

  const handleGenerateSummary = (language: string) => {
    console.log(`Generating summary for ${language}`);
    alert(`Summary for ${language} would be generated here`);
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex items-center mb-4">
        <Link href="/transcripts">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Transcripts
          </Button>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Star className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <div className="flex-1">
        <TranscriptDetailView
          session={mockSession}
          transcripts={transcripts}
          availableLanguages={availableLanguages}
          onTranslate={handleTranslate}
          onDownload={handleDownload}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onGenerateSummary={handleGenerateSummary}
        />
      </div>
    </div>
  );
}
