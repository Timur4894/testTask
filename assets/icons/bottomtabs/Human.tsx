import * as React from "react"
        import Svg, { SvgProps, G, Path, Defs, ClipPath } from "react-native-svg"

        const SvgComponent = ({ color, ...props }: {color : string}) => (
<Svg
        xmlns="http://www.w3.org/2000/svg"
        width={36}
        height={35}
        fill="none"
        {...props}
        >
<G
stroke={color}
strokeLinecap="round"
strokeLinejoin="round"
strokeWidth={2.188}
        clipPath="url(#a)"
        >
<Path d="M29.667 30.625v-2.917a5.834 5.834 0 0 0-5.834-5.833H12.168a5.833 5.833 0 0 0-5.833 5.833v2.917M18 16.042a5.833 5.833 0 1 0 0-11.667 5.833 5.833 0 0 0 0 11.667Z" />
        </G>
<Defs>
<ClipPath id="a">
    <Path fill="#fff" d="M.5 0h35v35H.5z" />
</ClipPath>
</Defs>
        </Svg>
        )
        export default SvgComponent
