"use client";

/**
 * Support — exact port of the Angular portal support screen
 * (wordly_portal: src/app/modules/support/support). Four "box-view" sections:
 * Knowledge Center, Email, Phone (admins only), Status. Static content.
 */

import { Card } from "@/components/ui/card";

const SUPPORT_EMAIL = "support@wordly.ai";
const SUPPORT_PHONE = "+1 (888) 779-7920";
// Angular gates the Phone section on rolePermission.isAllowedPhoneSupport().
const HAS_PHONE_ACCESS = true;

function SupportSection({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="flex flex-col gap-2 p-6">
      <div className="mb-1">
        <span className="text-lg font-semibold text-gray-900">{heading}</span>
      </div>
      {children}
    </Card>
  );
}

export default function SupportPage() {
  return (
    <div className="p-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-4">
        <SupportSection heading="Knowledge Center">
          <span className="text-sm text-gray-700">
            Before contacting our support team directly, check the Knowledge
            Center
          </span>
          <a
            className="text-sm font-medium text-primary-blue-600 hover:underline"
            href="https://help.wordly.ai"
            target="_blank"
            rel="noreferrer"
          >
            Knowledge Center
          </a>
        </SupportSection>

        <SupportSection heading="Email">
          <span className="text-sm text-gray-700">
            Feel free to send us an email with your questions to
          </span>
          <a
            className="text-sm font-medium text-primary-blue-600 hover:underline"
            href={`mailto:${SUPPORT_EMAIL}`}
            target="_blank"
            rel="noreferrer"
          >
            {SUPPORT_EMAIL}
          </a>
        </SupportSection>

        {HAS_PHONE_ACCESS ? (
          <SupportSection heading="Phone">
            <span className="text-sm text-gray-700">
              For urgent questions and issues, call us at
            </span>
            <a
              className="text-sm font-medium text-primary-blue-600 hover:underline"
              href={`tel://${SUPPORT_PHONE}`}
            >
              {SUPPORT_PHONE}
            </a>
          </SupportSection>
        ) : null}

        <SupportSection heading="Status">
          <span className="text-sm text-gray-700">
            To view the current status of the Wordly platform, please visit our
            status page
          </span>
          <a
            className="text-sm font-medium text-primary-blue-600 hover:underline"
            href="https://wordly.statuspage.io"
            target="_blank"
            rel="noreferrer"
          >
            Status Page
          </a>
        </SupportSection>
      </div>
    </div>
  );
}
