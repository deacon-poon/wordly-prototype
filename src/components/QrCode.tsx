import React from "react";

export const QrCode: React.FC = () => {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="120" height="120" rx="4" fill="white" />

      {/* QR code pattern - simplified for illustration */}
      <g fill="#000">
        {/* Corner squares - top left */}
        <rect x="10" y="10" width="20" height="20" rx="2" />
        <rect x="15" y="15" width="10" height="10" fill="white" />

        {/* Corner squares - top right */}
        <rect x="90" y="10" width="20" height="20" rx="2" />
        <rect x="95" y="15" width="10" height="10" fill="white" />

        {/* Corner squares - bottom left */}
        <rect x="10" y="90" width="20" height="20" rx="2" />
        <rect x="15" y="95" width="10" height="10" fill="white" />

        {/* Data pattern - simplified */}
        <rect x="40" y="10" width="5" height="5" />
        <rect x="50" y="10" width="5" height="5" />
        <rect x="60" y="10" width="5" height="5" />
        <rect x="70" y="10" width="5" height="5" />

        <rect x="10" y="40" width="5" height="5" />
        <rect x="20" y="40" width="5" height="5" />
        <rect x="30" y="45" width="5" height="5" />
        <rect x="40" y="40" width="5" height="5" />

        <rect x="10" y="50" width="5" height="5" />
        <rect x="20" y="55" width="5" height="5" />
        <rect x="40" y="50" width="5" height="5" />
        <rect x="50" y="50" width="5" height="5" />

        <rect x="60" y="60" width="5" height="5" />
        <rect x="70" y="60" width="5" height="5" />
        <rect x="80" y="60" width="5" height="5" />
        <rect x="90" y="60" width="5" height="5" />

        <rect x="60" y="70" width="5" height="5" />
        <rect x="70" y="75" width="5" height="5" />
        <rect x="80" y="70" width="5" height="5" />

        <rect x="60" y="80" width="5" height="5" />
        <rect x="70" y="80" width="5" height="5" />
        <rect x="80" y="85" width="5" height="5" />
        <rect x="90" y="80" width="5" height="5" />

        <rect x="60" y="90" width="5" height="5" />
        <rect x="70" y="90" width="5" height="5" />
        <rect x="80" y="90" width="5" height="5" />
        <rect x="90" y="95" width="5" height="5" />
      </g>
    </svg>
  );
};
