import { useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

export type DropdownOption<Value extends string | number> = {
  label: string;
  value: Value;
};

type DropdownProps<Value extends string | number> = {
  label?: string;
  options: DropdownOption<Value>[];
  selectedValue: Value | "";
  placeholder?: string;
  onChange: (value: Value | "") => void;
};

export default function Dropdown<Value extends string | number>({
  label,
  options,
  selectedValue,
  placeholder = "Select an option",
  onChange,
}: DropdownProps<Value>) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(
    (option) => option.value === selectedValue,
  );
  const displayValue =
    selectedValue === "" ? placeholder : (selectedOption?.label ?? placeholder);

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label ?? placeholder}
        accessibilityValue={{ text: displayValue }}
        onPress={() => setIsOpen(true)}
        className="min-h-16 flex-row items-center justify-between gap-4 rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 active:border-blue-500"
      >
        <View className="min-w-0 flex-1">
          {label ? (
            <Text className="mb-1 text-xs font-semibold uppercase text-slate-500">
              {label}
            </Text>
          ) : null}
          <Text
            numberOfLines={1}
            className={`text-base font-medium ${
              selectedValue === "" ? "text-slate-500" : "text-white"
            }`}
          >
            {displayValue}
          </Text>
        </View>
        <View className="mr-1 h-2 w-2 rotate-45 border-b-2 border-r-2 border-slate-400" />
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <View className="flex-1 justify-center bg-black/70 px-5">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Dismiss options"
            onPress={() => setIsOpen(false)}
            className="absolute inset-0"
          />
          <View className="w-full max-w-md self-center rounded-lg border border-slate-700 bg-slate-900 p-4">
            <Text className="mb-3 text-lg font-semibold text-white">
              {label ?? placeholder}
            </Text>
            <ScrollView style={{ maxHeight: 420 }}>
              <Pressable
                onPress={() => {
                  onChange("");
                  setIsOpen(false);
                }}
                className={`mb-2 rounded-md border px-3 py-3 ${
                  selectedValue === ""
                    ? "border-blue-500 bg-blue-950"
                    : "border-slate-700 bg-slate-950"
                }`}
              >
                <Text
                  className={`text-base ${
                    selectedValue === ""
                      ? "font-semibold text-blue-200"
                      : "text-slate-400"
                  }`}
                >
                  {placeholder}
                </Text>
              </Pressable>
              {options.map((option) => {
                const isSelected = option.value === selectedValue;

                return (
                  <Pressable
                    key={String(option.value)}
                    onPress={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`mb-2 rounded-md border px-3 py-3 ${
                      isSelected
                        ? "border-emerald-700 bg-emerald-950"
                        : "border-slate-700 bg-slate-950"
                    }`}
                  >
                    <Text
                      numberOfLines={1}
                      className={`text-base ${
                        isSelected
                          ? "font-semibold text-emerald-100"
                          : "text-slate-200"
                      }`}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}
