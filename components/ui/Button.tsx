import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface ButtonProps {
  onPress: () => void;
  title: string;
  style?: object;
  disabled?: boolean;
}

export default function Button({
  onPress,
  title,
  style,
  disabled,
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#272947",
    paddingHorizontal: 20,
    paddingVertical: 22,
    borderRadius: 8,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontSize: 16,
  },
});
