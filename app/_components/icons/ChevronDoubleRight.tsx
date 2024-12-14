import { forwardRef } from "react";

type SvgComponentProps = React.SVGProps<SVGSVGElement>;

const ChevronDoubleRight = forwardRef<SVGSVGElement, SvgComponentProps>(
  (props, ref) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      ref={ref}
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
      />
    </svg>
  )
);
ChevronDoubleRight.displayName = "ChevronDoubleRight";

export default ChevronDoubleRight;
