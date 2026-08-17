import React, { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { View, Dimensions } from "react-native";
import Svg, { Path } from "react-native-svg";

interface TurnWaveBorderProps {
  color: string;
  visible: boolean;
}

const SCREEN_WIDTH = Dimensions.get("window").width;

function generateWavePath(
  width: number,
  viewHeight: number,
  amplitude: number,
  frequency: number,
): string {
  const centerY = viewHeight / 2;
  let path = `M 0,${centerY} `;
  const step = 4;
  for (let x = 0; x <= width + step; x += step) {
    const y =
      centerY +
      Math.sin((x / width) * Math.PI * 2 * frequency) * amplitude;
    path += `L ${x},${y} `;
  }
  path += `L ${width},${viewHeight} L 0,${viewHeight} Z`;
  return path;
}

interface WaveLayer {
  height: number;
  amplitude: number;
  frequency: number;
  opacity: number;
  duration: number;
}

const WAVE_LAYERS: WaveLayer[] = [
  { height: 60, amplitude: 24, frequency: 2, opacity: 0.4, duration: 3000 },
  { height: 40, amplitude: 16, frequency: 2.5, opacity: 0.25, duration: 4000 },
  { height: 20, amplitude: 8, frequency: 3, opacity: 0.15, duration: 5000 },
];

function WaveStrip({
  layer,
  color,
  inverted,
}: {
  layer: WaveLayer;
  color: string;
  inverted: boolean;
}) {
  const offset = useSharedValue(0);

  useEffect(() => {
    offset.value = withRepeat(
      withTiming(SCREEN_WIDTH, {
        duration: layer.duration,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
  }, [layer.duration, offset]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: inverted
          ? -SCREEN_WIDTH + offset.value
          : -offset.value,
      },
    ],
  }));

  const path1 = generateWavePath(
    SCREEN_WIDTH,
    layer.height,
    layer.amplitude,
    layer.frequency,
  );
  const path2 = generateWavePath(
    SCREEN_WIDTH,
    layer.height,
    layer.amplitude,
    layer.frequency,
  );

  return (
    <View
      style={{
        height: layer.height,
        width: SCREEN_WIDTH,
      }}
    >
      <Animated.View style={animatedStyle}>
        <View style={{ flexDirection: "row" }}>
          <Svg
            width={SCREEN_WIDTH}
            height={layer.height}
            style={{ transform: inverted ? [{ scaleY: -1 }] : [] }}
          >
            <Path
              d={path1}
              fill={color}
              opacity={layer.opacity}
            />
          </Svg>
          <Svg
            width={SCREEN_WIDTH}
            height={layer.height}
            style={{ transform: inverted ? [{ scaleY: -1 }] : [] }}
          >
            <Path
              d={path2}
              fill={color}
              opacity={layer.opacity}
            />
          </Svg>
        </View>
      </Animated.View>
    </View>
  );
}

export default function TurnWaveBorder({
  color,
  visible,
}: TurnWaveBorderProps) {
  if (!visible) return null;

  return (
    <View
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 10 }}
    >
      <View className="absolute top-0 left-0 right-0">
        {WAVE_LAYERS.map((layer, i) => (
          <WaveStrip key={`top-${i}`} layer={layer} color={color} inverted />
        ))}
      </View>
      <View className="absolute bottom-0 left-0 right-0">
        {WAVE_LAYERS.map((layer, i) => (
          <WaveStrip
            key={`bottom-${i}`}
            layer={layer}
            color={color}
            inverted={false}
          />
        ))}
      </View>
    </View>
  );
}
