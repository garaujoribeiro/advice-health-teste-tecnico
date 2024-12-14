import { forwardRef } from "react";

type SvgComponentProps = React.SVGProps<SVGSVGElement>;

const ChevronDoubleLeft = forwardRef<SVGSVGElement, SvgComponentProps>(
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
        d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"
      />
    </svg>
  )
);

ChevronDoubleLeft.displayName = "ChevronDoubleLeft";

export default ChevronDoubleLeft;
