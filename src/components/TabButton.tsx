import { Pressable, StyleSheet, Text } from 'react-native';

type TabButtonProps = {
  icon: string;
  label: string;
  active: boolean;
  onPress: () => void;
};

export function TabButton({ icon, label, active, onPress }: TabButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, active ? styles.activeButton : null]}
      accessibilityRole="button"
    >
      <Text style={[styles.icon, active ? styles.activeText : null]}>{icon}</Text>
      <Text style={[styles.label, active ? styles.activeText : null]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  activeButton: {
    backgroundColor: '#DBEAFE',
  },
  icon: {
    color: '#64748B',
    fontSize: 13,
    marginBottom: 4,
  },
  label: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '700',
  },
  activeText: {
    color: '#1D4ED8',
  },
});
