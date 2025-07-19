import { Stack } from 'expo-router';
import React, { useState } from "react";
import { Button, Text, TextInput, TouchableOpacity, View, useColorScheme } from "react-native";
import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";

export default function Index() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [rows, setRows] = useState<{ id: number; text: string }[]>([]);
  const [input, setInput] = useState("");

  const addRow = () => {
    if (input.trim() === "") return;
    setRows([...rows, { id: Date.now(), text: input }]);
    setInput("");
  };

  const deleteRow = (id: number) => {
    setRows(rows.filter(row => row.id !== id));
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDark ? "#121212" : "#fff",
      }}
    >
      <Stack.Screen
        options={{
          title: 'Score Counter',
          headerStyle: { backgroundColor: isDark ? "#333333" : "#fff" },
          headerTintColor: isDark ? "#fff" : "#000" ,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 30,
          },
          headerTitleAlign: 'center',
        }}
      />

      {/* Spacer to push content below the header */}
      <View style={{ height: 10 }} />

      {/* Input and Add Button */}
      <View style={{ flexDirection: "row", marginBottom: 20, justifyContent: "center", alignItems: "center" }}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Enter row text"
          placeholderTextColor={isDark ? "#aaa" : "#888"}
          style={{
            borderWidth: 1,
            borderColor: isDark ? "#555" : "#ccc",
            color: isDark ? "#fff" : "#000",
            backgroundColor: isDark ? "#222" : "#fff",
            padding: 8,
            borderRadius: 4,
            width: 180,
            marginRight: 8,
          }}
        />
        <Button title="Add" onPress={addRow} />
      </View>

      {/* DraggableFlatList */}
      <DraggableFlatList
        data={rows}
        keyExtractor={item => item.id.toString()}
        onDragEnd={({ data }) => setRows(data)}
        renderItem={({ item, drag, isActive }: RenderItemParams<{ id: number; text: string }>) => (
          <TouchableOpacity
            onPressIn={drag}
            disabled={isActive}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
              backgroundColor: isActive
                ? (isDark ? "#444" : "#ccc")
                : (isDark ? "#222" : "#eee"),
              padding: 10,
              borderRadius: 6,
              minWidth: 250,
            }}
          >
            <Text style={{ color: isDark ? "#fff" : "#000", flex: 1 }}>{item.text}</Text>
            <TouchableOpacity
              onPress={() => deleteRow(item.id)}
              style={{
                marginLeft: 10,
                backgroundColor: "#e74c3c",
                padding: 6,
                borderRadius: 4,
              }}
            >
              <Text style={{ color: "#fff" }}>Delete</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={{ color: isDark ? "#aaa" : "#888", marginTop: 20 }}>
            No rows yet.
          </Text>
        }
        style={{ width: "100%", paddingHorizontal: 40 }}
        contentContainerStyle={{ alignItems: "center" }}
      />
    </View>
  );
}
