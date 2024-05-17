import * as React from "react"
        import Svg, { SvgProps, Path } from "react-native-svg"
        const SvgComponent = ({ color, ...props }: {color : string}) => (
<Svg
        xmlns="http://www.w3.org/2000/svg"
        width={36}
        height={35}
        fill="none"
        {...props}
        >
<Path
stroke={color} 
strokeLinecap="round"
strokeLinejoin="round"
strokeWidth={2.188}
        d="M31.125 21.875a2.917 2.917 0 0 1-2.917 2.917h-17.5l-5.833 5.833V7.292a2.917 2.917 0 0 1 2.917-2.917h20.416a2.917 2.917 0 0 1 2.917 2.917v14.583Z"
        />
        </Svg>
        )
        export default SvgComponent
