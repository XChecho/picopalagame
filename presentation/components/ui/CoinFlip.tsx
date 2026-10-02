import React, { useEffect, useRef, useState } from "react";
import { View, Text, Animated, Image, StyleSheet } from "react-native";

type CoinSide = "PLAYER" | "OPPONENT";

type CoinFlipProps = {
  visible: boolean;
  resultSide: CoinSide;
  decidingLabel: string;
  duration?: number;
  onAnimationEnd?: () => void;
};

const COIN_SIZE = 140;

export default function CoinFlip({
  visible,
  resultSide,
  decidingLabel,
  duration = 2500,
  onAnimationEnd,
}: CoinFlipProps) {
  const scaleXAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [showPlayerSide, setShowPlayerSide] = useState(true);
  const showPlayerSideRef = useRef(showPlayerSide);
  showPlayerSideRef.current = showPlayerSide;

  useEffect(() => {
    if (!visible) {
      scaleXAnim.setValue(1);
      opacityAnim.setValue(0);
      setShowPlayerSide(true);
      return;
    }

    let cancelled = false;
    let hideTimeout: ReturnType<typeof setTimeout> | undefined;
    const running: Animated.CompositeAnimation[] = [];

    const fadeIn = Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    });
    running.push(fadeIn);
    fadeIn.start(({ finished }) => {
      if (!finished || cancelled) return;
      const numFlips = 6;
      const flipDuration = duration / numFlips;
      const animations: Animated.CompositeAnimation[] = [];

      for (let i = 0; i < numFlips; i++) {
        const isLast = i === numFlips - 1;
        const targetScale = isLast ? (resultSide === "PLAYER" ? 1 : -1) : (i % 2 === 0 ? -1 : 1);
        const animDuration = isLast ? flipDuration * 1.5 : flipDuration;

        animations.push(
          Animated.timing(scaleXAnim, {
            toValue: targetScale,
            duration: animDuration,
            useNativeDriver: true,
          })
        );
      }

      const flips = Animated.sequence(animations);
      running.push(flips);
      flips.start(({ finished: flipsFinished }) => {
        if (!flipsFinished || cancelled) return;
        setShowPlayerSide(resultSide === "PLAYER");
        hideTimeout = setTimeout(() => {
          const fadeOut = Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          });
          running.push(fadeOut);
          fadeOut.start(({ finished: fadeFinished }) => {
            if (fadeFinished && !cancelled) onAnimationEnd?.();
          });
        }, 800);
      });
    });

    return () => {
      cancelled = true;
      if (hideTimeout) clearTimeout(hideTimeout);
      running.forEach((anim) => anim.stop());
    };
  }, [visible, duration, resultSide]);

  useEffect(() => {
    if (!visible) return;

    const listener = scaleXAnim.addListener(({ value }) => {
      if (value < 0 && showPlayerSideRef.current) {
        setShowPlayerSide(false);
      } else if (value > 0 && !showPlayerSideRef.current) {
        setShowPlayerSide(true);
      }
    });

    return () => {
      scaleXAnim.removeListener(listener);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: opacityAnim },
      ]}
    >
      <Animated.View
        style={[
          styles.coinWrapper,
          {
            transform: [{ scaleX: scaleXAnim }],
          },
        ]}
      >
        <Image
          source={
            showPlayerSide
              ? require("@assets/images/coin/coin-player.png")
              : require("@assets/images/coin/coin-opponent.png")
          }
          style={styles.coin}
          resizeMode="contain"
        />
      </Animated.View>

      <View style={styles.textContainer}>
        <Text style={styles.decidingText}>{decidingLabel}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 48,
  },
  coinWrapper: {
    width: COIN_SIZE,
    height: COIN_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
  coin: {
    width: COIN_SIZE,
    height: COIN_SIZE,
  },
  textContainer: {
    marginTop: 24,
    alignItems: "center",
    gap: 8,
  },
  decidingText: {
    color: "#94959B",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
