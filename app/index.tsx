import { Stack } from 'expo-router';
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, useColorScheme } from "react-native";
import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";

export default function Index() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [rows, setRows] = useState<{ id: number; text: string; score: number }[]>([]);
  const [input, setInput] = useState("");

  const addRow = () => {
    if (input.trim() === "") return;
    setRows([...rows, { id: Date.now(), text: input, score: 0 }]);
    setInput("");
  };

  const deleteRow = (id: number) => {
    setRows(rows.filter(row => row.id !== id));
  };

  // Styles
  const styles = StyleSheet.create({
    scoreBox: {
      width: 54,
      alignItems: "center",
    },
    button: {
      width: 40,
      alignItems: "center",
      marginHorizontal: 2,
      padding: 4,
      borderRadius: 4,
    },
    minusButton: {
      backgroundColor: "#b42e2eff",
    },
    plusButton: {
      backgroundColor: "#2eb43cff",
    },
    deleteButton: {
      backgroundColor: "#808080ff",
      width: 24,
    },
    listText: {
      color: isDark ? "#fff" : "#000",
      fontSize: 30,
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
    }
  });

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
            fontSize: 30,
          },
          headerTitleAlign: 'center',
        }}
      />

      {/* Row with InputBox and AddButton */}
      <View style={{ flexDirection: "row", marginVertical: 6, justifyContent: "center", alignItems: "center" }}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Player name"
          placeholderTextColor={isDark ? "#aaa" : "#888"}
          style={{
            height: 32, // All other objects in this row should have this height
            borderWidth: 1,
            borderColor: isDark ? "#555" : "#ccc",
            color: isDark ? "#fff" : "#000",
            backgroundColor: isDark ? "#222" : "#fff",
            padding: 4,
            borderRadius: 4,
            width: 100,
            marginRight: 8,
          }}
        />
        <TouchableOpacity
          onPress={addRow}
          style={{
            height: 32,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#167db9ff",
            borderRadius: 4,
            paddingHorizontal: 6,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 16 }}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* DraggableFlatList */}
      <DraggableFlatList
        data={rows}
        keyExtractor={item => item.id.toString()}
        onDragEnd={({ data }) => setRows(data)}
        renderItem={({ item, drag, isActive }: RenderItemParams<{ id: number; text: string; score: number }>) => (
          <TouchableOpacity
            onPressIn={drag}
            disabled={isActive}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 4,
              backgroundColor: isActive
                ? (isDark ? "#444" : "#ccc")
                : (isDark ? "#222" : "#eee"),
              padding: 4,
              borderRadius: 6,
              width: "100%",
            }}
          >
            <TouchableOpacity
              onPress={() => deleteRow(item.id)}
              style={[styles.button, styles.deleteButton]}
            >
              <Text style={[styles.listText, styles.buttonText]}> X </Text>
            </TouchableOpacity>

            <Text style={[styles.listText, {flex: 1}]}>{item.text}</Text>

            <TouchableOpacity
              onPress={() => {
                setRows(rows =>
                  rows.map(row =>
                    row.id === item.id ? { ...row, score: row.score - 10 } : row
                  )
                );
              }}
              style={[styles.button, styles.minusButton]}
            >
              <Text style={[styles.listText, styles.buttonText]}>-10</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setRows(rows =>
                  rows.map(row =>
                    row.id === item.id ? { ...row, score: row.score - 1 } : row
                  )
                );
              }}
              style={[styles.button, styles.minusButton]}
            >
              <Text style={[styles.listText, styles.buttonText]}>-1</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.scoreBox]}
            >
              <Text style={[styles.listText]}>{item.score}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setRows(rows =>
                  rows.map(row =>
                    row.id === item.id ? { ...row, score: row.score + 1 } : row
                  )
                );
              }}
              style={[styles.button, styles.plusButton]}
            >
              <Text style={[styles.listText, styles.buttonText]}>+1</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setRows(rows =>
                  rows.map(row =>
                    row.id === item.id ? { ...row, score: row.score + 10 } : row
                  )
                );
              }}
              style={[styles.button, styles.plusButton]}
            >
              <Text style={[styles.listText, styles.buttonText]}>+10</Text>
            </TouchableOpacity>

          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={{ color: isDark ? "#aaa" : "#888", marginTop: 20 }}>
            No players yet.
          </Text>
        }
        style={{ width: "100%" }}
        contentContainerStyle={{ alignItems: "center" }}
      />
    </View>
  );
}
