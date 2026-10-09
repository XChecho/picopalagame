import { useState, useEffect, useCallback, useRef } from "react";

interface UseSecretNumberSelectionOptions {
  onComplete: (secretNumber: string) => void;
  onExpire: () => void;
  timeoutSeconds?: number;
  /** Server clock (epoch ms). When set it replaces the local countdown. */
  deadlineAt?: number;
}

export function useSecretNumberSelection({
  onComplete,
  onExpire,
  timeoutSeconds = 30,
  deadlineAt,
}: UseSecretNumberSelectionOptions) {
  const [selectedDigits, setSelectedDigits] = useState<number[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(timeoutSeconds);
  const [isExpired, setIsExpired] = useState(false);
  const deadlineRef = useRef<number>(Date.now() + timeoutSeconds * 1000);
  const serverDeadlineRef = useRef(deadlineAt);
  const onCompleteRef = useRef(onComplete);
  const onExpireRef = useRef(onExpire);

  onCompleteRef.current = onComplete;
  onExpireRef.current = onExpire;

  useEffect(() => {
    serverDeadlineRef.current = deadlineAt;
  }, [deadlineAt]);

  useEffect(() => {
    const interval = setInterval(() => {
      const deadline = serverDeadlineRef.current ?? deadlineRef.current;
      const remaining = Math.max(0, deadline - Date.now());
      const seconds = Math.ceil(remaining / 1000);
      setTimeRemaining(seconds);

      if (remaining <= 0) {
        setIsExpired(true);
        onExpireRef.current();
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleDigitPress = useCallback(
    (digit: number) => {
      if (isExpired) return;

      setSelectedDigits((prev) => {
        if (prev.includes(digit)) {
          return prev;
        }
        if (prev.length >= 4) {
          return prev;
        }
        return [...prev, digit];
      });
    },
    [isExpired],
  );

  const handleBackspace = useCallback(() => {
    if (isExpired) return;

    setSelectedDigits((prev) => prev.slice(0, -1));
  }, [isExpired]);

  const handleSubmit = useCallback(() => {
    if (selectedDigits.length === 4 && !isExpired) {
      const secretNumber = selectedDigits.join("");
      onCompleteRef.current(secretNumber);
    }
  }, [selectedDigits, isExpired]);

  const reset = useCallback(() => {
    setSelectedDigits([]);
    setIsExpired(false);
    deadlineRef.current = Date.now() + timeoutSeconds * 1000;
    setTimeRemaining(timeoutSeconds);
  }, [timeoutSeconds]);

  return {
    selectedDigits,
    timeRemaining,
    isExpired,
    handleDigitPress,
    handleBackspace,
    handleSubmit,
    reset,
    canSubmit: selectedDigits.length === 4 && !isExpired,
  };
}
