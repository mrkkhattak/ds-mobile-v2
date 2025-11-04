import React from "react";
import { TouchableOpacity } from "react-native";
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from "react-native-svg";

interface MainButtonProps {
  onPress?: () => void;
}

export const MainButton: React.FC<MainButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{ alignSelf: "center", marginTop: 24 }}
    >
      <Svg width={328} height={50} viewBox="0 0 328 50" fill="none">
        <Rect
          width="328"
          height="50"
          rx="25"
          fill="url(#paint0_linear_48_112)"
        />
        <Path
          d="M153.238 20.3182V30.5H151.379L146.949 24.0916H146.874V30.5H144.722V20.3182H146.611L151.006 26.7216H151.095V20.3182H153.238ZM155.717 30.5V20.3182H162.577V22.093H157.869V24.5192H162.224V26.294H157.869V28.7251H162.597V30.5H155.717ZM167.007 20.3182L169.061 23.7884H169.14L171.203 20.3182H173.634L170.527 25.4091L173.704 30.5H171.228L169.14 27.0249H169.061L166.973 30.5H164.507L167.693 25.4091L164.566 20.3182H167.007ZM175.309 22.093V20.3182H183.671V22.093H180.554V30.5H178.426V22.093H175.309Z"
          fill="white"
        />
        <Defs>
          <LinearGradient
            id="paint0_linear_48_112"
            x1="20.4377"
            y1="10.4167"
            x2="208.447"
            y2="175.061"
            gradientUnits="userSpaceOnUse"
          >
            <Stop stopColor="#16C5E0" />
            <Stop offset="1" stopColor="#8DE016" />
          </LinearGradient>
        </Defs>
      </Svg>
    </TouchableOpacity>
  );
};
