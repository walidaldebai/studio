
import * as React from 'react';

export function ShoulderIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 18V14" />
      <path d="M12 18V10" />
      <path d="M16 18V14" />
      <path d="M12 4v2" />
      <path d="M12 20h.01" />
    </svg>
  );
}
