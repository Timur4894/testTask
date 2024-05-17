import * as React from "react"
import Svg, { SvgProps, G, Path, Defs, ClipPath } from "react-native-svg"
interface CustomSvgProps extends SvgProps {
        color?: string;
}
        const SvgComponent = ({ color, ...props }: CustomSvgProps) => (
<Svg
        xmlns="http://www.w3.org/2000/svg"
        width={35}
        height={35}
        fill="none"
        {...props}
        >
<G clipPath="url(#a)">
<Path
        fill={color}
        fillRule="evenodd"
        d="M3.254 12.961a14.94 14.94 0 0 0-.702 4.54c0 7.887 6.11 14.348 13.854 14.908V23.23a5.835 5.835 0 0 1-4.587-7.058l-8.565-3.212Zm15.34 10.27v9.178c7.745-.56 13.854-7.021 13.854-14.909 0-1.582-.246-3.107-.701-4.539l-8.565 3.212a5.835 5.835 0 0 1-4.588 7.058ZM17.5 2.552c5.899 0 11 3.417 13.43 8.379l-8.64 3.24a5.827 5.827 0 0 0-4.79-2.504c-1.984 0-3.737.99-4.79 2.504l-8.64-3.24C6.5 5.969 11.601 2.552 17.5 2.552Zm0 11.302c1.036 0 1.97.432 2.634 1.126l-.101.038.768 2.048.304-.114a3.646 3.646 0 1 1-7.21 0l.305.114.768-2.048-.102-.038a3.635 3.635 0 0 1 2.634-1.126ZM.365 17.5C.365 8.037 8.037.365 17.5.365c9.464 0 17.136 7.672 17.136 17.135 0 9.464-7.672 17.136-17.136 17.136C8.037 34.636.365 26.964.365 17.5Z"
        clipRule="evenodd"
/>
</G>
<Defs>
<ClipPath id="a">
    <Path fill="#fff" d="M0 0h35v35H0z" />
</ClipPath>
</Defs>
        </Svg>
        )
        export default SvgComponent
