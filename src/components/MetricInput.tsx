import { KeyboardTypeOptions, StyleSheet, Text, TextInput, View } from 'react-native';

type MetricInputProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
};

export function MetricInput({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'numeric',
  multiline = false,
}: MetricInputProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline ? styles.multilineInput : null]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        keyboardType={keyboardType}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  label: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0F172A',
  },
  multilineInput: {
    minHeight: 92,
  },
});
