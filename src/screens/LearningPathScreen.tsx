import React, { useState } from 'react';
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
import Progress from 'react-native-progress';

const { width } = Dimensions.get('window');

interface LearningPathScreenProps {
  navigation: any;
}

interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  progress: number;
  lessons: Lesson[];
  color: string[];
}

interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  type: 'video' | 'reading' | 'exercise' | 'quiz';
}

const LearningPathScreen: React.FC<LearningPathScreenProps> = ({ navigation }) => {
  const [modules] = useState<Module[]>([
    {
      id: '1',
      title: 'PowerShell Fundamentals',
      description: 'Learn the basics of PowerShell, commands, and syntax',
      duration: '2-3 hours',
      difficulty: 'Beginner',
      progress: 0,
      color: ['#667eea', '#764ba2'],
      lessons: [
        { id: '1-1', title: 'What is PowerShell?', duration: '15 min', completed: false, type: 'video' },
        { id: '1-2', title: 'PowerShell vs Command Prompt', duration: '10 min', completed: false, type: 'reading' },
        { id: '1-3', title: 'Basic Commands and Syntax', duration: '20 min', completed: false, type: 'video' },
        { id: '1-4', title: 'Practice: First Commands', duration: '15 min', completed: false, type: 'exercise' },
        { id: '1-5', title: 'Quiz: Fundamentals', duration: '10 min', completed: false, type: 'quiz' },
      ],
    },
    {
      id: '2',
      title: 'Variables and Data Types',
      description: 'Understanding PowerShell variables, data types, and operators',
      duration: '2-3 hours',
      difficulty: 'Beginner',
      progress: 0,
      color: ['#f093fb', '#f5576c'],
      lessons: [
        { id: '2-1', title: 'Creating Variables', duration: '15 min', completed: false, type: 'video' },
        { id: '2-2', title: 'Data Types in PowerShell', duration: '20 min', completed: false, type: 'reading' },
        { id: '2-3', title: 'String Manipulation', duration: '25 min', completed: false, type: 'video' },
        { id: '2-4', title: 'Practice: Variables', duration: '20 min', completed: false, type: 'exercise' },
        { id: '2-5', title: 'Quiz: Variables', duration: '10 min', completed: false, type: 'quiz' },
      ],
    },
    {
      id: '3',
      title: 'Control Structures',
      description: 'If statements, loops, and conditional logic',
      duration: '3-4 hours',
      difficulty: 'Beginner',
      progress: 0,
      color: ['#4facfe', '#00f2fe'],
      lessons: [
        { id: '3-1', title: 'If-Else Statements', duration: '20 min', completed: false, type: 'video' },
        { id: '3-2', title: 'Switch Statements', duration: '15 min', completed: false, type: 'video' },
        { id: '3-3', title: 'For and While Loops', duration: '25 min', completed: false, type: 'video' },
        { id: '3-4', title: 'Practice: Control Structures', duration: '30 min', completed: false, type: 'exercise' },
        { id: '3-5', title: 'Quiz: Control Structures', duration: '15 min', completed: false, type: 'quiz' },
      ],
    },
    {
      id: '4',
      title: 'Functions and Modules',
      description: 'Creating reusable code with functions and modules',
      duration: '4-5 hours',
      difficulty: 'Intermediate',
      progress: 0,
      color: ['#43e97b', '#38f9d7'],
      lessons: [
        { id: '4-1', title: 'Creating Functions', duration: '25 min', completed: false, type: 'video' },
        { id: '4-2', title: 'Parameters and Return Values', duration: '20 min', completed: false, type: 'video' },
        { id: '4-3', title: 'PowerShell Modules', duration: '30 min', completed: false, type: 'reading' },
        { id: '4-4', title: 'Practice: Functions', duration: '40 min', completed: false, type: 'exercise' },
        { id: '4-5', title: 'Quiz: Functions', duration: '15 min', completed: false, type: 'quiz' },
      ],
    },
    {
      id: '5',
      title: 'File and Directory Operations',
      description: 'Working with files, directories, and file systems',
      duration: '3-4 hours',
      difficulty: 'Intermediate',
      progress: 0,
      color: ['#fa709a', '#fee140'],
      lessons: [
        { id: '5-1', title: 'File System Navigation', duration: '20 min', completed: false, type: 'video' },
        { id: '5-2', title: 'File Operations', duration: '25 min', completed: false, type: 'video' },
        { id: '5-3', title: 'Directory Management', duration: '20 min', completed: false, type: 'video' },
        { id: '5-4', title: 'Practice: File Operations', duration: '35 min', completed: false, type: 'exercise' },
        { id: '5-5', title: 'Quiz: File Operations', duration: '15 min', completed: false, type: 'quiz' },
      ],
    },
    {
      id: '6',
      title: 'Advanced Scripting',
      description: 'Error handling, debugging, and advanced techniques',
      duration: '5-6 hours',
      difficulty: 'Advanced',
      progress: 0,
      color: ['#a8edea', '#fed6e3'],
      lessons: [
        { id: '6-1', title: 'Error Handling', duration: '30 min', completed: false, type: 'video' },
        { id: '6-2', title: 'Debugging Techniques', duration: '25 min', completed: false, type: 'video' },
        { id: '6-3', title: 'Performance Optimization', duration: '20 min', completed: false, type: 'reading' },
        { id: '6-4', title: 'Practice: Advanced Scripting', duration: '45 min', completed: false, type: 'exercise' },
        { id: '6-5', title: 'Quiz: Advanced Concepts', duration: '20 min', completed: false, type: 'quiz' },
      ],
    },
    {
      id: '7',
      title: 'Data Formats & Export',
      description: 'Working with JSON, XML, CSV, and data export techniques',
      duration: '3-4 hours',
      difficulty: 'Intermediate',
      progress: 0,
      color: ['#ff9a9e', '#fecfef'],
      lessons: [
        { id: '7-1', title: 'JSON Data Handling', duration: '25 min', completed: false, type: 'video' },
        { id: '7-2', title: 'XML Processing', duration: '20 min', completed: false, type: 'video' },
        { id: '7-3', title: 'CSV Export/Import', duration: '15 min', completed: false, type: 'video' },
        { id: '7-4', title: 'Practice: Data Formats', duration: '30 min', completed: false, type: 'exercise' },
        { id: '7-5', title: 'Quiz: Data Handling', duration: '15 min', completed: false, type: 'quiz' },
      ],
    },
    {
      id: '8',
      title: 'System Administration',
      description: 'File permissions, networking, and system management',
      duration: '4-5 hours',
      difficulty: 'Advanced',
      progress: 0,
      color: ['#a8c0ff', '#3f2b96'],
      lessons: [
        { id: '8-1', title: 'File Permissions', duration: '30 min', completed: false, type: 'video' },
        { id: '8-2', title: 'PowerShell Networking', duration: '25 min', completed: false, type: 'video' },
        { id: '8-3', title: 'Scheduled Jobs & Tasks', duration: '35 min', completed: false, type: 'video' },
        { id: '8-4', title: 'Practice: System Admin', duration: '40 min', completed: false, type: 'exercise' },
        { id: '8-5', title: 'Quiz: System Management', duration: '20 min', completed: false, type: 'quiz' },
      ],
    },
    {
      id: '9',
      title: 'PowerShell 7 Fundamentals',
      description: 'Introduction to PowerShell 7 and its new features',
      duration: '3-4 hours',
      difficulty: 'Intermediate',
      progress: 0,
      color: ['#667eea', '#764ba2'],
      lessons: [
        { id: '9-1', title: 'What is PowerShell 7?', duration: '20 min', completed: false, type: 'video' },
        { id: '9-2', title: 'Installing PowerShell 7', duration: '15 min', completed: false, type: 'video' },
        { id: '9-3', title: 'New Operators: Ternary & Null-Conditional', duration: '25 min', completed: false, type: 'video' },
        { id: '9-4', title: 'Practice: PowerShell 7 Basics', duration: '30 min', completed: false, type: 'exercise' },
        { id: '9-5', title: 'Quiz: PowerShell 7 Fundamentals', duration: '15 min', completed: false, type: 'quiz' },
      ],
    },
    {
      id: '10',
      title: 'PowerShell 7 Advanced Features',
      description: 'Parallel processing, pipeline variables, and performance optimization',
      duration: '4-5 hours',
      difficulty: 'Advanced',
      progress: 0,
      color: ['#f093fb', '#f5576c'],
      lessons: [
        { id: '10-1', title: 'ForEach-Object -Parallel', duration: '30 min', completed: false, type: 'video' },
        { id: '10-2', title: 'Pipeline Variables (-PipelineVariable)', duration: '25 min', completed: false, type: 'video' },
        { id: '10-3', title: 'Get-Error & Enhanced Debugging', duration: '20 min', completed: false, type: 'video' },
        { id: '10-4', title: 'JSON Performance with -AsHashtable', duration: '15 min', completed: false, type: 'video' },
        { id: '10-5', title: 'Practice: Advanced PowerShell 7', duration: '45 min', completed: false, type: 'exercise' },
        { id: '10-6', title: 'Quiz: PowerShell 7 Advanced', duration: '20 min', completed: false, type: 'quiz' },
      ],
    },
    {
      id: '11',
      title: 'PowerShell 7 Security & Process Management',
      description: 'Enhanced process monitoring and security features',
      duration: '3-4 hours',
      difficulty: 'Advanced',
      progress: 0,
      color: ['#4facfe', '#00f2fe'],
      lessons: [
        { id: '11-1', title: 'Get-Process Enhanced Parameters', duration: '25 min', completed: false, type: 'video' },
        { id: '11-2', title: 'Security Auditing with PowerShell 7', duration: '30 min', completed: false, type: 'video' },
        { id: '11-3', title: 'Native Command Error Handling', duration: '20 min', completed: false, type: 'video' },
        { id: '11-4', title: 'Practice: Security & Process Management', duration: '35 min', completed: false, type: 'exercise' },
        { id: '11-5', title: 'Quiz: PowerShell 7 Security', duration: '15 min', completed: false, type: 'quiz' },
      ],
    },
  ]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return '#4CAF50';
      case 'Intermediate': return '#FF9800';
      case 'Advanced': return '#F44336';
      default: return '#757575';
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video': return 'play-circle-outline';
      case 'reading': return 'book';
      case 'exercise': return 'code';
      case 'quiz': return 'quiz';
      default: return 'circle';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Learning Path</Text>
        <Text style={styles.subtitle}>
          Master PowerShell through our structured curriculum
        </Text>
      </View>

      {modules.map((module) => (
        <View key={module.id} style={styles.moduleContainer}>
          <LinearGradient
            colors={module.color}
            style={styles.moduleHeader}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.moduleHeaderContent}>
              <View style={styles.moduleInfo}>
                <Text style={styles.moduleTitle}>{module.title}</Text>
                <Text style={styles.moduleDescription}>{module.description}</Text>
                <View style={styles.moduleMeta}>
                  <View style={styles.metaItem}>
                    <Icon name="schedule" size={16} color="#fff" />
                    <Text style={styles.metaText}>{module.duration}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Icon name="flag" size={16} color="#fff" />
                    <Text style={styles.metaText}>{module.difficulty}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity style={styles.startButton}>
                <Icon name="play-arrow" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Progress</Text>
              <Text style={styles.progressText}>{module.progress}%</Text>
            </View>
            <Progress.Bar
              progress={module.progress / 100}
              width={width - 40}
              height={8}
              color="#4CAF50"
              unfilledColor="#E0E0E0"
              borderWidth={0}
            />
          </View>

          <View style={styles.lessonsContainer}>
            {module.lessons.map((lesson, index) => (
              <TouchableOpacity
                key={lesson.id}
                style={[
                  styles.lessonItem,
                  lesson.completed && styles.lessonCompleted,
                ]}
                activeOpacity={0.7}
              >
                <View style={styles.lessonContent}>
                  <Icon
                    name={getLessonIcon(lesson.type)}
                    size={20}
                    color={lesson.completed ? '#4CAF50' : '#757575'}
                  />
                  <View style={styles.lessonInfo}>
                    <Text
                      style={[
                        styles.lessonTitle,
                        lesson.completed && styles.lessonTitleCompleted,
                      ]}
                    >
                      {lesson.title}
                    </Text>
                    <Text style={styles.lessonDuration}>{lesson.duration}</Text>
                  </View>
                  {lesson.completed && (
                    <Icon name="check-circle" size={20} color="#4CAF50" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#1a1a2e',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#e0e0e0',
    lineHeight: 22,
  },
  moduleContainer: {
    margin: 15,
    backgroundColor: '#fff',
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  moduleHeader: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 20,
  },
  moduleHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moduleInfo: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  moduleDescription: {
    fontSize: 14,
    color: '#f0f0f0',
    marginBottom: 12,
    lineHeight: 20,
  },
  moduleMeta: {
    flexDirection: 'row',
    gap: 15,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  startButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    padding: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  lessonsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  lessonItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  lessonCompleted: {
    backgroundColor: '#f8fff8',
  },
  lessonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  lessonTitleCompleted: {
    color: '#4CAF50',
    textDecorationLine: 'line-through',
  },
  lessonDuration: {
    fontSize: 12,
    color: '#757575',
  },
});

export default LearningPathScreen;
