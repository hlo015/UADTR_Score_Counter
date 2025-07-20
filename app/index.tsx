import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from 'expo-router';
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, useColorScheme } from "react-native";
import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";

export default function Index() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [rows, setRows] = useState<{ id: number; text: string; score: number }[]>([]);
  const [input, setInput] = useState("");

  // Load saved rows on mount
  useEffect(() => {
    AsyncStorage.getItem("scoreRows")
      .then(data => {
        if (data) setRows(JSON.parse(data));
      });
  }, []);

  // Save rows whenever they change
  useEffect(() => {
    AsyncStorage.setItem("scoreRows", JSON.stringify(rows));
  }, [rows]);

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
      paddingVertical: 10,
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
      alignItems: "center",
      width: 20,
      height: 20,
      marginLeft: 0,
      marginRight: 6,
      borderRadius: 4,
    },
    listText: {
      color: isDark ? "#fff" : "#000",
      fontSize: 30,
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
    },
    deleteButtonText: {
      color: "#fff",
      fontSize: 14,
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
      <View style={{ flexDirection: "row", marginVertical: 6, marginHorizontal: 6, alignItems: "center" }}>
        
        <TouchableOpacity
          onLongPress={() => setRows(rows.map(row => ({ ...row, score: 0 })))}
          style={{
            height: 32,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#444",
            borderRadius: 4,
            paddingHorizontal: 6,
          }}
        >
          <Text style={{ color: "#AAA", fontSize: 16 }}>Reset scores to 0</Text>
        </TouchableOpacity>

        {/* This is to left align the above and right align the below */}
        <View style={{ flex: 1 }} />

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
            width: 120,
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
              onLongPress={() => deleteRow(item.id)}
              style={[styles.deleteButton]}
            >
              <Text style={[styles.deleteButtonText]}> x </Text>
            </TouchableOpacity>

            <Text style={[styles.listText, {flex: 1}]}>{item.text}</Text>

            <TouchableOpacity
              style={[styles.scoreBox]}
            >
              <Text style={[styles.listText]}>{item.score}</Text>
            </TouchableOpacity>

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
