"use client";

/**
 * Purchase Minutes — EXACT 1:1 React port of the Angular portal purchase screen
 * (wordly_portal: src/app/modules/purchase/purchase + purchase-detail).
 *
 * Anatomy mirrored from the Angular source:
 *   - Header: "Unscheduled: <remaining>" (color-coded: green > 0, red < 0,
 *     blue == 0) + "Scheduled: <n> mins".
 *   - Sub-header: Account dropdown + "Available Minutes: <n>".
 *   - List of purchasable services (title + minutes); each row expands to a
 *     detail panel (Description / Minutes / Price / Purchase button).
 *   - Paginator with rowsPerPageOptions [25, 50, 100].
 *
 * In Angular, `remainingMinutes = reservableMinutes - scheduledMinutes` and the
 * Purchase button calls Stripe (`loadStripe` + `stripe.redirectToCheckout`).
 *
 * PROTOTYPE DIVERGENCE: real Stripe checkout cannot run in the lab, so the
 * "Purchase" / Checkout action is stubbed to a toast instead of redirecting to
 * Stripe. Everything else is replicated faithfully.
 */

import * as React from "react";
import { toast } from "sonner";
import { CreditCard, ChevronDown } from "lucide-react";

import { MainContainer } from "@/components/ui/main-container";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ---------------------------------------------------------------------------
// Mock data (mirrors the Angular Account + Purchase models)
// ---------------------------------------------------------------------------

interface MockAccount {
  id: string;
  title: string;
  reservableMinutes: number;
  scheduledMinutes: number;
  availableMinutes: number;
}

// Account.titleLabel in Angular = `${title} (${id last 5})`.
const ACCOUNTS: MockAccount[] = [
  {
    id: "acct_8f23a91c4d",
    title: "Acme Corporation",
    reservableMinutes: 12500,
    scheduledMinutes: 4200,
    availableMinutes: 8300,
  },
  {
    id: "acct_2b77e05f1a",
    title: "Globex Events",
    reservableMinutes: 1500,
    scheduledMinutes: 1500,
    availableMinutes: 0,
  },
  {
    id: "acct_5c91d3b8e2",
    title: "Initech Webinars",
    reservableMinutes: 800,
    scheduledMinutes: 3400,
    availableMinutes: 0,
  },
];

// Purchase model: { code, title, minutes, price (cents), description }.
// In Angular getSubscriptionPlans() sorts by minutes ascending and formats
// price as `$${(priceInCents / 100).toFixed(2)}`.
interface MockPurchase {
  code: string;
  title: string;
  minutes: number;
  price: number; // cents
  description: string;
}

const SERVICE_DETAILS: MockPurchase[] = [
  {
    code: "min_1000",
    title: "1,000 minutes",
    minutes: 1000,
    price: 9900,
    description: "A starter pack of translation minutes for small meetings.",
  },
  {
    code: "min_5000",
    title: "5,000 minutes",
    minutes: 5000,
    price: 39900,
    description: "Ideal for recurring sessions and small conferences.",
  },
  {
    code: "min_10000",
    title: "10,000 minutes",
    minutes: 10000,
    price: 74900,
    description: "For organizations running frequent multilingual events.",
  },
  {
    code: "min_25000",
    title: "25,000 minutes",
    minutes: 25000,
    price: 169900,
    description: "High-volume bundle for enterprise event programs.",
  },
  {
    code: "min_50000",
    title: "50,000 minutes",
    minutes: 50000,
    price: 309900,
    description: "Maximum bundle for large-scale, ongoing deployments.",
  },
].sort((a, b) => a.minutes - b.minutes);

const PAGI_LIMITS = [25, 50, 100];

// Formats minutes with thousands separators (Angular i18next timeFormat).
function fmt(n: number): string {
  return n.toLocaleString("en-US");
}

// `$${(priceInCents / 100).toFixed(2)}` — Angular purchase.priceString.
function priceString(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function PurchasePage() {
  const [accountId, setAccountId] = React.useState(ACCOUNTS[0].id);
  const [currentCode, setCurrentCode] = React.useState<string>(
    SERVICE_DETAILS[0]?.code ?? ""
  );
  const [pagiLimit, setPagiLimit] = React.useState(PAGI_LIMITS[0]);

  const account = ACCOUNTS.find((a) => a.id === accountId) ?? ACCOUNTS[0];

  // remainingMinutes = reservableMinutes - scheduledMinutes (Angular populateAccount()).
  const remainingMinutes = account.reservableMinutes - account.scheduledMinutes;

  // Angular: text-success > 0, text-danger < 0, text-info == 0.
  const remainingColor =
    remainingMinutes > 0
      ? "text-accent-green-600"
      : remainingMinutes < 0
        ? "text-red-600"
        : "text-blue-600";

  return (
    <MainContainer
      title="Purchase Minutes"
      description="Add translation minutes to your account."
    >
      {/* top info — Unscheduled balance + Scheduled minutes */}
      <div className="mb-6 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="text-sm text-gray-700">Unscheduled:</span>
        <span className={`text-lg font-semibold ${remainingColor}`}>
          {fmt(remainingMinutes)}
        </span>
        <span className="ml-4 text-sm text-gray-700">
          Scheduled: {fmt(account.scheduledMinutes)} mins
        </span>
      </div>

      {/* account selector sub-header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Account:</span>
          <Select
            value={accountId}
            onValueChange={(v) => {
              setAccountId(v);
              // onAccountChange(): reset selection to the first plan.
              setCurrentCode(SERVICE_DETAILS[0]?.code ?? "");
            }}
          >
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select an Account" />
            </SelectTrigger>
            <SelectContent>
              {ACCOUNTS.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.title} ({a.id.slice(-5)})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <span className="text-sm text-gray-700">
          Available Minutes: {fmt(account.availableMinutes) || "-"}
        </span>
      </div>

      {/* list of purchasable services */}
      <div className="rounded-md border border-gray-200">
        {SERVICE_DETAILS.map((service, i) => {
          const isOpen = service.code === currentCode;
          return (
            <Collapsible
              key={service.code}
              open={isOpen}
              onOpenChange={() =>
                // purchaseSelect(): toggle/select this plan.
                setCurrentCode(isOpen ? "" : service.code)
              }
            >
              {i > 0 ? <Separator /> : null}
              <CollapsibleTrigger
                className={`flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-gray-50 ${
                  isOpen ? "bg-gray-50" : ""
                }`}
              >
                <span className="text-sm font-medium text-gray-900">
                  {service.title}
                </span>
                <span className="flex items-center gap-3">
                  <span className="text-sm text-gray-700">
                    {fmt(service.minutes)} mins
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-500 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </span>
              </CollapsibleTrigger>

              {/* purchase-detail panel */}
              <CollapsibleContent>
                <div className="border-t border-gray-100 bg-gray-50/50 px-4 py-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex gap-2">
                      <span className="w-24 shrink-0 text-gray-700">
                        Description:
                      </span>
                      <span className="text-gray-900">
                        {service.description}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="w-24 shrink-0 text-gray-700">
                        Minutes:
                      </span>
                      <span className="text-gray-900">
                        {fmt(service.minutes)} minutes
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="w-24 shrink-0 text-gray-700">
                        Price:
                      </span>
                      <span className="font-semibold text-gray-900">
                        {priceString(service.price)}
                      </span>
                    </div>
                    <div className="pt-1">
                      <Button
                        onClick={() =>
                          // STRIPE STUB: production calls loadStripe() +
                          // stripe.redirectToCheckout(); the lab cannot run real
                          // Stripe checkout, so this only shows a toast.
                          toast.success("Stripe checkout (prototype)", {
                            description: `Would purchase ${service.title} for ${priceString(
                              service.price
                            )} on ${account.title}.`,
                          })
                        }
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        Checkout
                      </Button>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </div>

      {/* paginator — rowsPerPageOptions [25, 50, 100] */}
      <div className="mt-4 flex items-center justify-end gap-2">
        <span className="text-sm text-gray-700">Rows per page:</span>
        <Select
          value={String(pagiLimit)}
          onValueChange={(v) => setPagiLimit(Number(v))}
        >
          <SelectTrigger className="w-[88px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PAGI_LIMITS.map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </MainContainer>
  );
}
