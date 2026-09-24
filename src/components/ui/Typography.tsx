import type { ReactNode } from "react";
import { Text } from "react-native";

type TypographyProps = {
  children: ReactNode;
  className?: string;
};

export function Heading({ children, className = "" }: TypographyProps) {
  return (
    <Text className={`text-xl font-bold text-white ${className}`}>
      {children}
    </Text>
  );
}

export function PageHeading({ children, className = "" }: TypographyProps) {
  return (
    <Text className={`text-3xl font-bold text-white ${className}`}>
      {children}
    </Text>
  );
}

export function Subheading({ children, className = "" }: TypographyProps) {
  return (
    <Text className={`mt-1 text-sm text-slate-500 ${className}`}>
      {children}
    </Text>
  );
}

export function SectionLabel({ children, className = "" }: TypographyProps) {
  return (
    <Text
      className={`mb-1 text-xs font-semibold uppercase tracking-widest text-slate-500 ${className}`}
    >
      {children}
    </Text>
  );
}

export function BodyText({ children, className = "" }: TypographyProps) {
  return (
    <Text className={`text-base text-slate-300 ${className}`}>
      {children}
    </Text>
  );
}

export function MutedText({ children, className = "" }: TypographyProps) {
  return (
    <Text className={`text-base text-slate-400 ${className}`}>
      {children}
    </Text>
  );
}

export function ButtonText({ children, className = "" }: TypographyProps) {
  return (
    <Text className={`text-sm font-medium text-white ${className}`}>
      {children}
    </Text>
  );
}
