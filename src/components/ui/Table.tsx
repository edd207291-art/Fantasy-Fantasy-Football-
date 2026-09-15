import { ReactNode } from "react";
import { ScrollView, Text, View } from "react-native";

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
};

export default function Table<T>({
  columns,
  data,
  emptyMessage = "No records available.",
  getRowKey,
  renderCell,
}: TableProps<T>) {
  const tableWidth = columns.reduce((total, column) => total + column.width, 0);

  if (data.length === 0) {
    return <Text className="text-base text-slate-400">{emptyMessage}</Text>;
  }

  return (
    <ScrollView className="min-h-0 w-full flex-1">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
            <View
              key={getRowKey(row, index)}
              className="flex-row border-b border-slate-800 px-4 py-3 last:border-b-0"
            >
              {columns.map((column) => (
                <View key={column.key} style={{ width: column.width }}>
                  {renderCell(row, column)}
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </ScrollView>
  );
}
