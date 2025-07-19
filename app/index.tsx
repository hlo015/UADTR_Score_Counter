import { Stack } from 'expo-router';
import { Text, View, useColorScheme } from "react-native";

export default function Index() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
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

      <Text style={{ color: isDark ? "#fff" : "#000" }}>
        Edit app/index.tsx to edit this screen.
      </Text>
    </View>
  );
}
