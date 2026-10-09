import { Platform } from "react-native";

export type TMobilePlatform = "IOS" | "ANDROID";

/**
 * Platform declared to /mobile/auth/* (the backend validates IOS|ANDROID).
 * The app only ships native builds, so any other OS is a programming error.
 */
export function getMobilePlatform(): TMobilePlatform {
  switch (Platform.OS) {
    case "ios":
      return "IOS";
    case "android":
      return "ANDROID";
    default:
      throw new Error(`Unsupported platform for mobile auth: ${Platform.OS}`);
  }
}
