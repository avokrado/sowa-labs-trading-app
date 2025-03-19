import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

interface ButtonProps {
  onPress: () => void;
  title: string;
  disabled?: boolean;
  error?: string;
}

export default function Button({
  onPress,
  title,
  disabled,
  error,
}: ButtonProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          disabled && styles.disabledButton,
          error && styles.errorButton,
        ]}
        onPress={onPress}
        disabled={disabled}
      >
        <Text
          style={[
            styles.text,
            disabled && styles.disabledText,
            error && styles.errorText,
          ]}
        >
          {title}
        </Text>
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
  },
  button: {
    backgroundColor: "#272947",
    paddingHorizontal: 20,
    paddingVertical: 22,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  disabledButton: {
    backgroundColor: "#27294750",
  },
  disabledText: {
    color: "#ffffff80",
  },
  errorButton: {
    backgroundColor: "#ff000020",
    borderWidth: 1,
    borderColor: "red",
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
});
