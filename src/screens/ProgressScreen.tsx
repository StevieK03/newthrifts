import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';
import Progress from 'react-native-progress';

const { width } = Dimensions.get('window');

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
  points: number;
}

interface ProgressStats {
  totalPoints: number;
  flashcardsStudied: number;
  quizzesCompleted: number;
  exercisesCompleted: number;
  daysActive: number;
  currentStreak: number;
  longestStreak: number;
  level: number;
  xpToNextLevel: number;
}

interface ProgressScreenProps {
  navigation: any;
}

const ProgressScreen: React.FC<ProgressScreenProps> = ({ navigation }) => {
  const [stats, setStats] = useState<ProgressStats>({
    totalPoints: 1250,
    flashcardsStudied: 45,
    quizzesCompleted: 8,
    exercisesCompleted: 12,
    daysActive: 15,
    currentStreak: 7,
    longestStreak: 12,
    level: 3,
    xpToNextLevel: 250,
  });

  const [achievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first lesson',
      icon: 'school',
      unlocked: true,
      unlockedDate: '2024-01-15',
      points: 50,
    },
    {
      id: '2',
      title: 'Flashcard Master',
      description: 'Study 50 flashcards',
      icon: 'style',
      unlocked: false,
      points: 100,
    },
    {
      id: '3',
      title: 'Quiz Champion',
      description: 'Score 90% or higher on 5 quizzes',
      icon: 'emoji-events',
      unlocked: true,
      unlockedDate: '2024-01-20',
      points: 150,
    },
    {
      id: '4',
      title: 'Code Warrior',
      description: 'Complete 20 practice exercises',
      icon: 'code',
      unlocked: false,
      points: 200,
    },
    {
      id: '5',
      title: 'Streak Master',
      description: 'Maintain a 30-day learning streak',
      icon: 'local-fire-department',
      unlocked: false,
      points: 300,
    },
    {
      id: '6',
      title: 'PowerShell Pro',
      description: 'Complete all advanced exercises',
      icon: 'star',
      unlocked: false,
      points: 500,
    },
    {
      id: '7',
      title: 'Speed Learner',
      description: 'Complete 10 exercises in one day',
      icon: 'speed',
      unlocked: true,
      unlockedDate: '2024-01-18',
      points: 100,
    },
    {
      id: '8',
      title: 'Perfect Score',
      description: 'Get 100% on a quiz',
      icon: 'check-circle',
      unlocked: false,
      points: 75,
    },
  ]);

  const getLevelProgress = () => {
    const currentLevelXP = stats.level * 500;
    const nextLevelXP = (stats.level + 1) * 500;
    const progress = (stats.totalPoints - currentLevelXP) / (nextLevelXP - currentLevelXP);
    return Math.min(1, Math.max(0, progress));
  };

  const getUnlockedAchievements = () => {
    return achievements.filter(achievement => achievement.unlocked);
  };

  const getLockedAchievements = () => {
    return achievements.filter(achievement => !achievement.unlocked);
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.header}
      >
        <Text style={styles.title}>Your Progress</Text>
        <Text style={styles.subtitle}>Track your PowerShell learning journey</Text>
      </LinearGradient>

      <View style={styles.statsContainer}>
        <View style={styles.levelCard}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.levelGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.levelContent}>
              <Icon name="star" size={40} color="#fff" />
              <View style={styles.levelInfo}>
                <Text style={styles.levelText}>Level {stats.level}</Text>
                <Text style={styles.xpText}>{stats.totalPoints} XP</Text>
              </View>
            </View>
            <Progress.Bar
              progress={getLevelProgress()}
              width={width - 60}
              height={8}
              color="#FFD700"
              unfilledColor="rgba(255, 255, 255, 0.3)"
              borderWidth={0}
            />
            <Text style={styles.nextLevelText}>
              {stats.xpToNextLevel} XP to Level {stats.level + 1}
            </Text>
          </LinearGradient>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Icon name="style" size={24} color="#667eea" />
            <Text style={styles.statNumber}>{stats.flashcardsStudied}</Text>
            <Text style={styles.statLabel}>Flashcards</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="quiz" size={24} color="#4CAF50" />
            <Text style={styles.statNumber}>{stats.quizzesCompleted}</Text>
            <Text style={styles.statLabel}>Quizzes</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="code" size={24} color="#FF9800" />
            <Text style={styles.statNumber}>{stats.exercisesCompleted}</Text>
            <Text style={styles.statLabel}>Exercises</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="local-fire-department" size={24} color="#F44336" />
            <Text style={styles.statNumber}>{stats.currentStreak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
        </View>

        <View style={styles.streakContainer}>
          <Text style={styles.sectionTitle}>Learning Streak</Text>
          <View style={styles.streakCard}>
            <View style={styles.streakInfo}>
              <Text style={styles.streakNumber}>{stats.currentStreak}</Text>
              <Text style={styles.streakLabel}>Current Streak</Text>
            </View>
            <View style={styles.streakInfo}>
              <Text style={styles.streakNumber}>{stats.longestStreak}</Text>
              <Text style={styles.streakLabel}>Best Streak</Text>
            </View>
            <View style={styles.streakInfo}>
              <Text style={styles.streakNumber}>{stats.daysActive}</Text>
              <Text style={styles.streakLabel}>Total Days</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.achievementsContainer}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        
        <View style={styles.achievementsSection}>
          <Text style={styles.achievementsSubtitle}>Unlocked ({getUnlockedAchievements().length})</Text>
          {getUnlockedAchievements().map((achievement, index) => (
            <Animatable.View
              key={achievement.id}
              animation="fadeInUp"
              delay={index * 100}
              style={styles.achievementCard}
            >
              <LinearGradient
                colors={['#4CAF50', '#45a049']}
                style={styles.achievementGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.achievementContent}>
                  <Icon name={achievement.icon} size={24} color="#fff" />
                  <View style={styles.achievementInfo}>
                    <Text style={styles.achievementTitle}>{achievement.title}</Text>
                    <Text style={styles.achievementDescription}>{achievement.description}</Text>
                    <Text style={styles.achievementDate}>
                      Unlocked: {achievement.unlockedDate}
                    </Text>
                  </View>
                  <View style={styles.achievementPoints}>
                    <Text style={styles.pointsText}>+{achievement.points}</Text>
                  </View>
                </View>
              </LinearGradient>
            </Animatable.View>
          ))}
        </View>

        <View style={styles.achievementsSection}>
          <Text style={styles.achievementsSubtitle}>Locked ({getLockedAchievements().length})</Text>
          {getLockedAchievements().map((achievement, index) => (
            <Animatable.View
              key={achievement.id}
              animation="fadeInUp"
              delay={(getUnlockedAchievements().length + index) * 100}
              style={styles.achievementCard}
            >
              <View style={styles.lockedAchievement}>
                <View style={styles.achievementContent}>
                  <Icon name={achievement.icon} size={24} color="#ccc" />
                  <View style={styles.achievementInfo}>
                    <Text style={styles.lockedAchievementTitle}>{achievement.title}</Text>
                    <Text style={styles.lockedAchievementDescription}>{achievement.description}</Text>
                  </View>
                  <View style={styles.achievementPoints}>
                    <Text style={styles.lockedPointsText}>+{achievement.points}</Text>
                  </View>
                </View>
                <View style={styles.lockOverlay}>
                  <Icon name="lock" size={20} color="#fff" />
                </View>
              </View>
            </Animatable.View>
          ))}
        </View>
      </View>

      <View style={styles.motivationContainer}>
        <LinearGradient
          colors={['#ffecd2', '#fcb69f']}
          style={styles.motivationCard}
        >
          <Icon name="trending-up" size={32} color="#FF6B35" />
          <Text style={styles.motivationTitle}>Keep Going!</Text>
          <Text style={styles.motivationText}>
            You're making great progress in your PowerShell journey. 
            {stats.currentStreak > 0 && ` Your ${stats.currentStreak}-day streak is impressive!`}
          </Text>
        </LinearGradient>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 30,
    paddingTop: 50,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#e0e0e0',
    textAlign: 'center',
    lineHeight: 24,
  },
  statsContainer: {
    padding: 20,
  },
  levelCard: {
    borderRadius: 20,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  levelGradient: {
    padding: 25,
    borderRadius: 20,
  },
  levelContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  levelInfo: {
    marginLeft: 15,
  },
  levelText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  xpText: {
    fontSize: 16,
    color: '#f0f0f0',
  },
  nextLevelText: {
    fontSize: 14,
    color: '#f0f0f0',
    textAlign: 'center',
    marginTop: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    minWidth: (width - 55) / 2,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  streakContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  streakCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  streakInfo: {
    alignItems: 'center',
  },
  streakNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F44336',
    marginBottom: 5,
  },
  streakLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  achievementsContainer: {
    padding: 20,
  },
  achievementsSection: {
    marginBottom: 20,
  },
  achievementsSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  achievementCard: {
    marginBottom: 10,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  achievementGradient: {
    borderRadius: 15,
    padding: 15,
  },
  lockedAchievement: {
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    padding: 15,
    position: 'relative',
  },
  achievementContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementInfo: {
    flex: 1,
    marginLeft: 15,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  lockedAchievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#999',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#f0f0f0',
    marginBottom: 4,
  },
  lockedAchievementDescription: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  achievementDate: {
    fontSize: 12,
    color: '#e0e0e0',
  },
  achievementPoints: {
    alignItems: 'center',
  },
  pointsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  lockedPointsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ccc',
  },
  lockOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 15,
    padding: 5,
  },
  motivationContainer: {
    padding: 20,
  },
  motivationCard: {
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  motivationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginTop: 10,
    marginBottom: 10,
  },
  motivationText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default ProgressScreen;
