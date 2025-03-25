import { COLORS } from "@/constants/colors";
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
    backgroundColor: COLORS.button.background,
    paddingHorizontal: 20,
    paddingVertical: 22,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  disabledButton: {
    backgroundColor: COLORS.button.disabled,
  },
  disabledText: {
    color: COLORS.button.textDisabled,
  },
  errorButton: {
    backgroundColor: COLORS.button.error.background,
    borderWidth: 1,
    borderColor: COLORS.button.error.border,
  },
  errorText: {
    color: COLORS.button.error.text,
    textAlign: "center",
  },
});
