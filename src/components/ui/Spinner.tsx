import { ActivityIndicator, Modal, Text, View } from "react-native";

interface IProps {
  visible: boolean;
  mainText: string;
  subText: string;
}

export const Spinner = ({ visible, mainText, subText }: IProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => undefined}
    >
      <View className="flex-1 items-center justify-center bg-slate-950/90">
        <ActivityIndicator size="large" color="#60a5fa" />
        <Text className="mt-5 text-lg font-semibold text-white">
          {mainText}
        </Text>
        <Text className="mt-2 text-sm text-slate-400">{subText}</Text>
      </View>
    </Modal>
  );
};
