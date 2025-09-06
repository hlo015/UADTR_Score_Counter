import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from 'expo-router';
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, useColorScheme } from "react-native";
import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";

export default function Index() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [rows, setRows] = useState<{ id: number; text: string; score: number; guessed: number; result: number }[]>([]);
  const [input, setInput] = useState("");

  // Load saved rows on mount
  useEffect(() => {
    AsyncStorage.getItem("scoreRows")
      .then(data => {
        if (data) {
          const parsed = JSON.parse(data);
          // Ensure guessed and result are numbers for each row
          const fixedRows = parsed.map((row: any) => ({
            ...row,
            guessed: typeof row.guessed === "number" ? row.guessed : 0,
            result: typeof row.result === "number" ? row.result : 0,
          }));
          setRows(fixedRows);
        }
      });
  }, []);

  // Save rows whenever they change
  useEffect(() => {
    AsyncStorage.setItem("scoreRows", JSON.stringify(rows));
  }, [rows]);

  const addRow = () => {
    if (input.trim() === "") return;
    setRows([...rows, { id: Date.now(), text: input, score: 0, guessed: 0, result: 0 }]);
    setInput("");
  };

  const deleteRow = (id: number) => {
    setRows(rows.filter(row => row.id !== id));
  };

  const incrementGuessed = (id: number) => {
    setRows(rows.map(row =>
      row.id === id ? { ...row, guessed: row.guessed + 1 } : row
    ));
  };

  const decrementGuessed = (id: number) => {
    setRows(rows.map(row =>
      row.id === id
        ? { ...row, guessed: Math.max(0, row.guessed - 1) }
        : row
    ));
  };

  const incrementResult = (id: number) => {
    setRows(rows.map(row =>
      row.id === id ? { ...row, result: row.result + 1 } : row
    ));
  };

  const decrementResult = (id: number) => {
    setRows(rows.map(row =>
      row.id === id
        ? { ...row, result: Math.max(0, row.result - 1) }
        : row
    ));
  };

  // Styles
  const styles = StyleSheet.create({
    scoreBox: {
      width: 54,
      alignItems: "center",
    },
    button: {
      width: 30,
      alignItems: "center",
      marginHorizontal: 2,
      paddingVertical: 6,
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
    headerText: {
      color: isDark ? "#aaa" : "#888",
      fontSize: 20,
      width: 70,
    },
    largeText: {
      color: isDark ? "#fff" : "#000",
      fontSize: 30,
    },
    smallText: {
      color: isDark ? "#fff" : "#000",
      fontSize: 20,
      width: 14,
      textAlign: "center",
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
        ListHeaderComponent={
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
              width: "100%",
              marginBottom: -6,
            }}
          >
            <Text style={[styles.headerText]}>Guess</Text>
            <View style={{ width: 16 }} /> {/* Spacer */}
            <Text style={[styles.headerText]}>Result</Text>
            <View style={{ width: 6 }} /> {/* Spacer */}
          </View>
        }
        renderItem={({ item, drag, isActive }: RenderItemParams<{ id: number; text: string; score: number; guessed: number; result: number }>) => (
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

            <Text style={[styles.largeText, {flex: 1}]}>{item.text}</Text>

            {/* Score display */}
            <TouchableOpacity style={[styles.scoreBox]}>
              <Text style={[styles.largeText]}>{item.score}</Text>
            </TouchableOpacity>

            {/* Guessed number controls */}
            <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 8 }}>
              <TouchableOpacity
                onPress={() => decrementGuessed(item.id)}
                style={[styles.button, styles.minusButton]}
              >
                <Text style={styles.buttonText}>−</Text>
              </TouchableOpacity>
              <Text style={[styles.smallText]}>{item.guessed}</Text>
              <TouchableOpacity
                onPress={() => incrementGuessed(item.id)}
                style={[styles.button, styles.plusButton]}
              >
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
            </View>

            {/* Result number controls */}
            <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 8 }}>
              <TouchableOpacity
                onPress={() => decrementResult(item.id)}
                style={[styles.button, styles.minusButton]}
              >
                <Text style={styles.buttonText}>−</Text>
              </TouchableOpacity>
              <Text style={[styles.smallText]}>{item.result}</Text>
              <TouchableOpacity
                onPress={() => incrementResult(item.id)}
                style={[styles.button, styles.plusButton]}
              >
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
            </View>
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

      {/* Apply button at the bottom */}
      <View style={{ position: "absolute", bottom: 24, left: 0, right: 0, alignItems: "center" }}>
        <TouchableOpacity
          style={{
            backgroundColor: "#167db9ff",
            borderRadius: 8,
            paddingVertical: 12,
            paddingHorizontal: 32,
          }}
          onPress={() => {
            // Update scores based on Guessed and Result
            setRows(rows.map(row => {
              if (row.guessed === row.result) {
                return { ...row, score: row.score + (10 + row.guessed) };
              } else {
                return { ...row, score: row.score - (10 + Math.abs(row.guessed - row.result)) };
              }
            }));
          }}
        >
          <Text style={{ color: "#fff", fontSize: 20 }}>Apply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
