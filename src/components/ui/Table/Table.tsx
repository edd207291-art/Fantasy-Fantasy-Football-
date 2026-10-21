import { ReactNode } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export type TableColumn = {
  key: string;
  label: string;
  width: number;
};

type TableProps<T> = {
  columns: TableColumn[];
  data: T[];
  emptyMessage?: string;
  getRowKey: (row: T, index: number) => string;
  renderCell: (row: T, column: TableColumn) => ReactNode;
  onRowPress?: (row: T) => void;
  verticalScroll?: boolean;
};

export default function Table<T>({
  columns,
  data,
  emptyMessage = "No records available.",
  getRowKey,
  renderCell,
  onRowPress,
  verticalScroll = true,
}: TableProps<T>) {
  const tableWidth =
    columns.reduce((total, column) => total + column.width, 0) + 32;

  if (data.length === 0) {
    return (
      <Text className="text-center text-base text-slate-400">
        {emptyMessage}
      </Text>
    );
  }

  const table = (
    <ScrollView
      horizontal
      className="w-full pb-4"
      showsHorizontalScrollIndicator={true}
      contentContainerStyle={{
        alignItems: "flex-start",
        flexGrow: 1,
        justifyContent: "center",
      }}
    >
      <View
        className="overflow-hidden rounded-lg border border-slate-700"
        style={{ minWidth: tableWidth }}
      >
        <View className="flex-row border-b border-slate-700 bg-slate-800 px-4 py-3">
          {columns.map((column) => (
            <Text
              key={column.key}
              className="font-semibold text-slate-300"
              style={{ width: column.width }}
            >
              {column.label}
            </Text>
          ))}
        </View>

        {data.map((row, index) => (
          <Pressable
            key={getRowKey(row, index)}
            onPress={onRowPress ? () => onRowPress(row) : undefined}
            className="flex-row border-b border-slate-800 px-4 py-3 last:border-b-0"
          >
            {columns.map((column) => (
              <View key={column.key} style={{ width: column.width }}>
                {renderCell(row, column)}
              </View>
            ))}
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );

  return (
    <View className="w-full items-center">
      {verticalScroll ? (
        <ScrollView
          style={{ maxHeight: 500, width: "100%" }}
          contentContainerStyle={{ alignItems: "center", paddingBottom: 16 }}
          showsVerticalScrollIndicator={true}
        >
          {table}
        </ScrollView>
      ) : (
        table
      )}
    </View>
  );
}
