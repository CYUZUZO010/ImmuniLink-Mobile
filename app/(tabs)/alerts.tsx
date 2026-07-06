import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { 
  Bell, 
  ChevronRight, 
  Info, 
  Calendar, 
  ShieldAlert, 
  FileText,
  EyeOff,
  Sparkles,
  ArrowRight
} from 'lucide-react-native';
import { Colors, Radius, Spacing } from '@/constants/theme';

const { width } = Dimensions.get('window');

const categories = ['All', 'Urgent', 'Upcoming', 'Info'];

const alerts = [
  {
    id: 1,
    type: 'urgent',
    title: 'AI Reminder: Upcoming Vaccine',
    description: "Baby's Pentavalent 3 dose is due in 2 days. An SMS has been sent to your registered phone for offline access.",
    time: 'Just now',
    action: 'Book Appointment',
    icon: Sparkles,
    color: Colors.primary,
  },
  {
    id: 2,
    type: 'urgent',
    title: 'Missed Dose: Polio (OPV2)',
    description: 'Baby Ethan missed his scheduled dose at Kimironko Clinic. Immediate catch-up recommended.',
    time: '2 hours ago',
    action: 'Schedule Now',
    icon: ShieldAlert,
    color: '#EF4444',
  },
  {
    id: 3,
    type: 'info',
    title: 'AI Insight: Immunization Goal',
    description: 'Ethan is 95% caught up! Complete the Measles dose to achieve full protection.',
    time: '5 hours ago',
    action: 'View Report',
    icon: Sparkles,
    color: Colors.primary,
  },
  {
    id: 4,
    type: 'upcoming',
    title: 'Upcoming: Measles-Rubella',
    description: 'The second dose is due in 3 days. We recommend booking your morning slot now.',
    time: '1 day ago',
    action: 'Book Slot',
    icon: Calendar,
    color: '#F97316',
  },
];

export default function AlertsScreen() {
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.miniLogo}>
             <Image 
                source={require('../../assets/images/icon.png')} 
                style={styles.miniLogoImage}
                contentFit="contain"
              />
          </View>
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>
        <View style={styles.headerRight}>
           <TouchableOpacity style={styles.headerIcon}>
             <EyeOff size={24} color="#71717A" />
           </TouchableOpacity>
           <TouchableOpacity>
             <Image
               source="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&h=100&auto=format&fit=crop"
               style={styles.profilePic}
             />
           </TouchableOpacity>
        </View>
      </View>

      <View style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChip,
                activeCategory === cat && styles.categoryChipActive,
              ]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[
                styles.categoryText,
                activeCategory === cat && styles.categoryTextActive
              ]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeader}>
           <View>
              <Text style={styles.sectionTitle}>Health Alerts</Text>
              <Text style={styles.sectionSubtitle}>Stay updated on Ethan's schedule</Text>
           </View>
           <TouchableOpacity style={styles.bellButton}>
              <Bell size={20} color="#1A1A1A" />
           </TouchableOpacity>
        </View>

        {alerts.map((alert) => (
          <View key={alert.id} style={[styles.alertCard, { borderLeftColor: alert.color }]}>
            <View style={styles.alertHeader}>
               <View style={[styles.alertIconContainer, { backgroundColor: `${alert.color}10` }]}>
                 <alert.icon size={20} color={alert.color} />
               </View>
               <View style={styles.alertTypeBadge}>
                  <Text style={[styles.alertTypeText, { color: alert.color }]}>{alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}</Text>
               </View>
               <Text style={styles.alertTime}>{alert.time}</Text>
            </View>
            
            <View style={styles.alertContent}>
               <Text style={styles.alertTitle}>{alert.title}</Text>
               <Text style={styles.alertDescription}>{alert.description}</Text>
            </View>

            <View style={styles.alertFooter}>
               <TouchableOpacity style={styles.actionButton}>
                  <Text style={[styles.actionText, { color: alert.color }]}>{alert.action}</Text>
                  <ArrowRight size={16} color={alert.color} style={{ marginLeft: 4 }} />
               </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={styles.aiInsightCard}>
           <View style={styles.aiHeader}>
              <Sparkles size={20} color="#FFFFFF" />
              <Text style={styles.aiTitle}>AI Health Insight</Text>
           </View>
           <Text style={styles.aiDescription}>
             Ethan is 95% caught up! Complete the Measles dose to achieve full protection for this age group.
           </Text>
           <View style={styles.aiDecoration} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F4F4F5',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniLogo: {
    width: 32,
    height: 32,
    backgroundColor: '#1A1A1A',
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  miniLogoImage: {
    width: 20,
    height: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: Spacing.md,
  },
  profilePic: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  categoryContainer: {
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F4F4F5',
  },
  categoryScroll: {
    paddingHorizontal: Spacing.lg,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: '#F4F4F5',
    marginRight: Spacing.sm,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#71717A',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#71717A',
  },
  bellButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F4F4F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    borderLeftWidth: 4,
    marginBottom: Spacing.md,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  alertIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  alertTypeBadge: {
    flex: 1,
  },
  alertTypeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  alertTime: {
    fontSize: 12,
    color: '#A1A1AA',
  },
  alertContent: {
    marginBottom: Spacing.md,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  alertDescription: {
    fontSize: 14,
    color: '#71717A',
    lineHeight: 20,
  },
  alertFooter: {
    borderTopWidth: 1,
    borderTopColor: '#F4F4F5',
    paddingTop: Spacing.sm,
    alignItems: 'flex-end',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  aiInsightCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
    position: 'relative',
    overflow: 'hidden',
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  aiTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  aiDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    lineHeight: 22,
  },
  aiDecoration: {
    position: 'absolute',
    right: -20,
    bottom: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
});
