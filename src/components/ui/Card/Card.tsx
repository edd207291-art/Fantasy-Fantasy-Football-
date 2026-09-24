import type { ReactNode } from "react";
import { View } from "react-native";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export default function Card({ children }: CardProps) {
  return (
    <View
      className={`rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-6 mb-6`}
    >
      {children}
    </View>
  );
}
