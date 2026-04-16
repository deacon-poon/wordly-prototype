import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <div className="flex items-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/wordly-logo.svg`} alt="Wordly" className="h-5" />
        <span className="text-sm font-medium text-fd-muted-foreground">
          Design System
        </span>
      </div>
    ),
  },
};
