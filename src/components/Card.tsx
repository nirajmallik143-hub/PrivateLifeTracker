import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type CardProps = {
  title: string;
  subtitle?: string;
  accentColor?: string;
  children: ReactNode;
};

export function Card({ title, subtitle, accentColor = '#3B82F6', children }: CardProps) {
  return (
    <View style={styles.card}>
      <View style={[styles.accent, { backgroundColor: accentColor }]} />
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 3,
  },
  accent: {
    width: 48,
    height: 4,
    borderRadius: 999,
    marginBottom: 14,
  },
  title: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    color: '#64748B',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },
  content: {
    marginTop: 16,
    gap: 12,
  },
});
