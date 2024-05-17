import * as React from "react"
import Svg, {
    SvgProps,
    G,
    Circle,
    Path,
    Defs,
    ClipPath,
} from "react-native-svg"
const SvgComponent = ({ color, ...props }: {color : string}) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={36}
        height={35}
        fill={"#171717"}
    >
        <G stroke={color} strokeWidth={2.188} clipPath="url(#a)">
            <Circle cx={18} cy={17.5} r={16.406} />
            <Path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 18.594a1.276 1.276 0 1 0 0-2.552 1.276 1.276 0 0 0 0 2.552ZM26.932 18.594a1.276 1.276 0 1 0 0-2.552 1.276 1.276 0 0 0 0 2.552ZM9.068 18.594a1.276 1.276 0 1 0 0-2.553 1.276 1.276 0 0 0 0 2.553Z"
            />
        </G>
        <Defs>
            <ClipPath id="a">
                <Path fill="#fff" d="M.5 0h35v35H.5z" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgComponent
