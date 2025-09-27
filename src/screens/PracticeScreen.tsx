import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';
import Progress from 'react-native-progress';

const { width } = Dimensions.get('window');

interface PracticeExercise {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  instructions: string;
  starterCode: string;
  solution: string;
  hints: string[];
  testCases: TestCase[];
  points: number;
}

interface TestCase {
  input: string;
  expectedOutput: string;
  description: string;
}

interface PracticeScreenProps {
  navigation: any;
}

const PracticeScreen: React.FC<PracticeScreenProps> = ({ navigation }) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [userCode, setUserCode] = useState('');
  const [showSolution, setShowSolution] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
  const [totalPoints, setTotalPoints] = useState(0);
  const [exercises, setExercises] = useState<PracticeExercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<PracticeExercise[]>([]);
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'Beginner' | 'Intermediate' | 'Advanced'>('all');

  const allExercises: PracticeExercise[] = [
    // Beginner Exercises
    {
      id: '1',
      title: 'Hello PowerShell',
      description: 'Create your first PowerShell script',
      difficulty: 'Beginner',
      category: 'Basics',
      instructions: 'Write a PowerShell script that displays "Hello, PowerShell!" to the console.',
      starterCode: '# Write your code here\n',
      solution: 'Write-Host "Hello, PowerShell!"',
      hints: [
        'Use the Write-Host cmdlet to display text',
        'Enclose the text in double quotes',
        'Don\'t forget the semicolon at the end'
      ],
      testCases: [
        {
          input: '',
          expectedOutput: 'Hello, PowerShell!',
          description: 'Should display the greeting message'
        }
      ],
      points: 10
    },
    {
      id: '2',
      title: 'Variable Basics',
      description: 'Create and use variables in PowerShell',
      difficulty: 'Beginner',
      category: 'Variables',
      instructions: 'Create a variable called $name with your name and display it using Write-Host.',
      starterCode: '# Create a variable called $name with your name\n# Display it using Write-Host\n',
      solution: '$name = "John"\nWrite-Host "My name is: $name"',
      hints: [
        'Use $ to create a variable',
        'Assign a string value using =',
        'Use Write-Host to display the variable'
      ],
      testCases: [
        {
          input: '',
          expectedOutput: 'My name is: John',
          description: 'Should display the name variable'
        }
      ],
      points: 15
    },
    {
      id: '3',
      title: 'Simple Calculator',
      description: 'Create a basic calculator using PowerShell',
      difficulty: 'Beginner',
      category: 'Math Operations',
      instructions: 'Create variables for two numbers, add them together, and display the result.',
      starterCode: '# Create two number variables\n# Add them together\n# Display the result\n',
      solution: '$num1 = 10\n$num2 = 5\n$result = $num1 + $num2\nWrite-Host "The sum is: $result"',
      hints: [
        'Create variables for the two numbers',
        'Use + operator for addition',
        'Store the result in another variable'
      ],
      testCases: [
        {
          input: '',
          expectedOutput: 'The sum is: 15',
          description: 'Should calculate and display the sum'
        }
      ],
      points: 20
    },
    // Intermediate Exercises
    {
      id: '4',
      title: 'File Counter',
      description: 'Count files in a directory',
      difficulty: 'Intermediate',
      category: 'File Operations',
      instructions: 'Create a script that counts all files in the current directory and displays the count.',
      starterCode: '# Get all files in current directory\n# Count them\n# Display the count\n',
      solution: '$files = Get-ChildItem -File\n$count = $files.Count\nWrite-Host "Number of files: $count"',
      hints: [
        'Use Get-ChildItem to get files',
        'Use -File parameter to get only files',
        'Access the Count property'
      ],
      testCases: [
        {
          input: '',
          expectedOutput: 'Number of files: [actual count]',
          description: 'Should count files in current directory'
        }
      ],
      points: 25
    },
    {
      id: '5',
      title: 'Process Monitor',
      description: 'Find processes using high CPU',
      difficulty: 'Intermediate',
      category: 'Process Management',
      instructions: 'Find all processes that are using more than 100MB of memory and display their names.',
      starterCode: '# Get all processes\n# Filter by memory usage\n# Display process names\n',
      solution: '$processes = Get-Process | Where-Object {$_.WorkingSet -gt 100MB}\nforeach ($process in $processes) {\n    Write-Host $process.ProcessName\n}',
      hints: [
        'Use Get-Process to get all processes',
        'Use Where-Object to filter by WorkingSet',
        'Use foreach to iterate through results'
      ],
      testCases: [
        {
          input: '',
          expectedOutput: '[Process names using >100MB]',
          description: 'Should list processes using high memory'
        }
      ],
      points: 30
    },
    {
      id: '6',
      title: 'Text File Analyzer',
      description: 'Analyze a text file and count words',
      difficulty: 'Intermediate',
      category: 'Text Processing',
      instructions: 'Read a text file, count the number of words, and display the result.',
      starterCode: '# Read a text file\n# Count words\n# Display word count\n',
      solution: '$content = Get-Content -Path "sample.txt" -Raw\n$words = $content -split "\\s+" | Where-Object {$_ -ne ""}\n$wordCount = $words.Count\nWrite-Host "Word count: $wordCount"',
      hints: [
        'Use Get-Content to read the file',
        'Use -split to separate words',
        'Filter out empty strings'
      ],
      testCases: [
        {
          input: '',
          expectedOutput: 'Word count: [actual count]',
          description: 'Should count words in the file'
        }
      ],
      points: 35
    },
    // Advanced Exercises
    {
      id: '7',
      title: 'System Health Check',
      description: 'Create a comprehensive system health checker',
      difficulty: 'Advanced',
      category: 'System Administration',
      instructions: 'Create a script that checks disk space, memory usage, and running services, then generates a health report.',
      starterCode: '# Check disk space\n# Check memory usage\n# Check critical services\n# Generate report\n',
      solution: '$report = @()\n\n# Disk space check\n$disks = Get-WmiObject -Class Win32_LogicalDisk\nforeach ($disk in $disks) {\n    $freeSpace = [math]::Round($disk.FreeSpace / 1GB, 2)\n    $report += "Disk $($disk.DeviceID): $freeSpace GB free"\n}\n\n# Memory check\n$memory = Get-WmiObject -Class Win32_OperatingSystem\n$freeMemory = [math]::Round($memory.FreePhysicalMemory / 1MB, 2)\n$report += "Free Memory: $freeMemory GB"\n\n# Service check\n$services = Get-Service | Where-Object {$_.Status -eq "Stopped" -and $_.StartType -eq "Automatic"}\n$report += "Stopped Auto Services: $($services.Count)"\n\nWrite-Host "System Health Report:"\n$report | ForEach-Object { Write-Host $_ }',
      hints: [
        'Use Get-WmiObject for system information',
        'Check disk space using Win32_LogicalDisk',
        'Check memory using Win32_OperatingSystem',
        'Use Get-Service to check service status'
      ],
      testCases: [
        {
          input: '',
          expectedOutput: 'System Health Report: [various system info]',
          description: 'Should generate a comprehensive health report'
        }
      ],
      points: 50
    },
    {
      id: '8',
      title: 'Log File Parser',
      description: 'Parse and analyze log files',
      difficulty: 'Advanced',
      category: 'Log Analysis',
      instructions: 'Parse a log file, find all ERROR entries, and create a summary report with timestamps and error messages.',
      starterCode: '# Read log file\n# Find ERROR entries\n# Create summary report\n',
      solution: '$logContent = Get-Content -Path "app.log"\n$errorEntries = $logContent | Where-Object {$_ -match "ERROR"}\n\nWrite-Host "Error Summary Report:"\nWrite-Host "Total Errors: $($errorEntries.Count)"\nWrite-Host "`nError Details:"\n\nforeach ($error in $errorEntries) {\n    $timestamp = ($error -split " ")[0,1] -join " "\n    $message = $error -replace "^\\S+\\s+\\S+\\s+\\S+\\s+", ""\n    Write-Host "Time: $timestamp"\n    Write-Host "Message: $message"\n    Write-Host "---"\n}',
      hints: [
        'Use Get-Content to read the log file',
        'Use Where-Object with -match to find ERROR entries',
        'Parse timestamps and messages from log entries'
      ],
      testCases: [
        {
          input: '',
          expectedOutput: 'Error Summary Report: [error count and details]',
          description: 'Should parse and summarize error entries'
        }
      ],
      points: 60
    },
    // PowerShell 7 Specific Exercises
    {
      id: '9',
      title: 'PowerShell 7 Ternary Operator',
      description: 'Use the new ternary operator for conditional logic',
      difficulty: 'Intermediate',
      category: 'PowerShell 7',
      instructions: 'Create a script that uses the ternary operator to assign values based on conditions. Check if a number is even or odd and assign "Even" or "Odd" accordingly.',
      starterCode: '# Use ternary operator to check if number is even or odd\n$number = 42\n# Your code here\n',
      solution: '$number = 42\n$result = ($number % 2 -eq 0) ? "Even" : "Odd"\nWrite-Host "Number $number is $result"',
      hints: [
        'Use the ternary operator ? : syntax',
        'Check remainder with modulo operator %',
        'Compare with -eq 0 for even numbers'
      ],
      testCases: [
        {
          input: '',
          expectedOutput: 'Number 42 is Even',
          description: 'Should use ternary operator to determine even/odd'
        }
      ],
      points: 25
    },
    {
      id: '10',
      title: 'PowerShell 7 Null-Conditional Operator',
      description: 'Use null-conditional operator for safe property access',
      difficulty: 'Intermediate',
      category: 'PowerShell 7',
      instructions: 'Create a script that safely accesses properties of potentially null objects using the null-conditional operator.',
      starterCode: '# Use null-conditional operator for safe access\n$object = $null\n# Safely access properties\n',
      solution: '$object = $null\n$result = $object?.Property?.Method()\nWrite-Host "Result: $result"\n\n# Test with actual object\n$realObject = [PSCustomObject]@{ Property = "Value" }\n$result2 = $realObject?.Property\nWrite-Host "Real object result: $result2"',
      hints: [
        'Use ?. operator for safe property access',
        'Chain multiple ?. operators for nested properties',
        'Test with both null and real objects'
      ],
      testCases: [
        {
          input: '',
          expectedOutput: 'Result: [null or value]',
          description: 'Should safely handle null objects'
        }
      ],
      points: 30
    },
    {
      id: '11',
      title: 'PowerShell 7 Parallel Processing',
      description: 'Use ForEach-Object -Parallel for concurrent operations',
      difficulty: 'Advanced',
      category: 'PowerShell 7',
      instructions: 'Create a script that uses ForEach-Object -Parallel to process multiple items concurrently. Process a list of URLs and get their response times.',
      starterCode: '# Use ForEach-Object -Parallel for concurrent processing\n$urls = @("https://google.com", "https://github.com", "https://stackoverflow.com")\n# Process URLs in parallel\n',
      solution: '$urls = @("https://google.com", "https://github.com", "https://stackoverflow.com")\n\n$results = $urls | ForEach-Object -Parallel {\n    $url = $_\n    $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()\n    try {\n        $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 10\n        $stopwatch.Stop()\n        [PSCustomObject]@{\n            URL = $url\n            StatusCode = $response.StatusCode\n            ResponseTime = $stopwatch.ElapsedMilliseconds\n        }\n    } catch {\n        $stopwatch.Stop()\n        [PSCustomObject]@{\n            URL = $url\n            StatusCode = "Error"\n            ResponseTime = $stopwatch.ElapsedMilliseconds\n        }\n    }\n} -ThrottleLimit 3\n\n$results | Format-Table -AutoSize',
      hints: [
        'Use ForEach-Object -Parallel with -ThrottleLimit',
        'Use Invoke-WebRequest to test URLs',
        'Measure response times with Stopwatch',
        'Handle errors with try-catch'
      ],
      testCases: [
        {
          input: '',
          expectedOutput: 'URL response times and status codes',
          description: 'Should process URLs in parallel and show results'
        }
      ],
      points: 50
    },
    {
      id: '12',
      title: 'PowerShell 7 Pipeline Variables',
      description: 'Use -PipelineVariable for advanced pipeline operations',
      difficulty: 'Advanced',
      category: 'PowerShell 7',
      instructions: 'Create a script that uses -PipelineVariable to access pipeline objects in multiple cmdlets. Filter processes and then select specific properties.',
      starterCode: '# Use -PipelineVariable for pipeline operations\n# Filter processes and select properties\n',
      solution: 'Get-Process | Where-Object -PipelineVariable proc { $proc.CPU -gt 100 } | Select-Object -PipelineVariable sel { $sel.Name, $sel.CPU, $sel.WorkingSet } | ForEach-Object {\n    Write-Host "Process: $($_.Name) - CPU: $($_.CPU) - Memory: $($_.WorkingSet)"\n}',
      hints: [
        'Use -PipelineVariable with Where-Object',
        'Chain -PipelineVariable across multiple cmdlets',
        'Access the pipeline variable in subsequent operations'
      ],
      testCases: [
        {
          input: '',
          expectedOutput: 'Process information with CPU and memory',
          description: 'Should use pipeline variables effectively'
        }
      ],
      points: 40
    },
    {
      id: '13',
      title: 'PowerShell 7 JSON with Hashtables',
      description: 'Use ConvertFrom-Json -AsHashtable for better performance',
      difficulty: 'Intermediate',
      category: 'PowerShell 7',
      instructions: 'Create a script that parses JSON data using the new -AsHashtable parameter and demonstrates the performance difference.',
      starterCode: '# Use ConvertFrom-Json -AsHashtable\n$jsonData = \'{"name": "John", "age": 30, "city": "New York"}\'\n# Parse JSON as hashtable\n',
      solution: '$jsonData = \'{"name": "John", "age": 30, "city": "New York"}\'\n\n# Parse as hashtable (PowerShell 7)\n$hashtable = $jsonData | ConvertFrom-Json -AsHashtable\nWrite-Host "Name: $($hashtable.name)"\nWrite-Host "Age: $($hashtable.age)"\nWrite-Host "City: $($hashtable.city)"\n\n# Compare with traditional method\n$psObject = $jsonData | ConvertFrom-Json\nWrite-Host "Traditional method - Name: $($psObject.name)"',
      hints: [
        'Use ConvertFrom-Json -AsHashtable',
        'Access hashtable properties with dot notation',
        'Compare with traditional PSCustomObject method'
      ],
      testCases: [
        {
          input: '',
          expectedOutput: 'JSON data parsed and displayed',
          description: 'Should parse JSON as hashtable and display values'
        }
      ],
      points: 35
    },
    {
      id: '14',
      title: 'PowerShell 7 Get-Error Debugging',
      description: 'Use the new Get-Error cmdlet for comprehensive error analysis',
      difficulty: 'Intermediate',
      category: 'PowerShell 7',
      instructions: 'Create a script that intentionally generates errors and then uses Get-Error to display detailed error information.',
      starterCode: '# Generate errors and use Get-Error\n# Create some intentional errors\n',
      solution: '# Generate some intentional errors\ntry {\n    Get-Process -Name "NonExistentProcess" -ErrorAction Stop\n} catch {\n    Write-Host "Error caught, now using Get-Error:"\n    Get-Error\n}\n\n# Generate another error\ntry {\n    $null.SomeProperty\n} catch {\n    Write-Host "Another error:"\n    Get-Error\n}',
      hints: [
        'Use try-catch to generate errors',
        'Call Get-Error after catching exceptions',
        'Generate different types of errors to see various error details'
      ],
      testCases: [
        {
          input: '',
          expectedOutput: 'Detailed error information from Get-Error',
          description: 'Should display comprehensive error details'
        }
      ],
      points: 30
    },
    {
      id: '15',
      title: 'PowerShell 7 Process Security Audit',
      description: 'Use new Get-Process parameters for security auditing',
      difficulty: 'Advanced',
      category: 'PowerShell 7',
      instructions: 'Create a security audit script using the new Get-Process parameters to show usernames, paths, and command lines for all running processes.',
      starterCode: '# Security audit using new Get-Process parameters\n# Show comprehensive process information\n',
      solution: 'Write-Host "=== PowerShell 7 Security Audit ==="\nWrite-Host "Processes with Username, Path, and Command Line:"\nWrite-Host "=" * 60\n\nGet-Process -IncludeUserName -IncludePath -IncludeCommandLine | Select-Object -First 10 | Format-Table -AutoSize -Wrap\n\nWrite-Host "`nHigh CPU Processes:"\nGet-Process -IncludeUserName | Where-Object { $_.CPU -gt 100 } | Select-Object ProcessName, Id, UserName, CPU | Format-Table -AutoSize\n\nWrite-Host "`nProcesses by User:"\nGet-Process -IncludeUserName | Group-Object UserName | Sort-Object Count -Descending | Select-Object -First 5 | Format-Table -AutoSize',
      hints: [
        'Use Get-Process with -IncludeUserName, -IncludePath, -IncludeCommandLine',
        'Filter for high CPU processes',
        'Group processes by username',
        'Use Format-Table for better output'
      ],
      testCases: [
        {
          input: '',
          expectedOutput: 'Comprehensive process security information',
          description: 'Should show detailed process information for security auditing'
        }
      ],
      points: 45
    }
  ];

  useEffect(() => {
    setExercises(allExercises);
    filterExercises();
  }, []);

  useEffect(() => {
    filterExercises();
  }, [difficultyFilter]);

  const filterExercises = () => {
    if (difficultyFilter === 'all') {
      setFilteredExercises(exercises);
    } else {
      setFilteredExercises(exercises.filter(ex => ex.difficulty === difficultyFilter));
    }
    setCurrentExerciseIndex(0);
    setUserCode('');
    setShowSolution(false);
    setShowHints(false);
  };

  const loadExercise = (index: number) => {
    const exercise = filteredExercises[index];
    if (exercise) {
      setUserCode(exercise.starterCode);
      setShowSolution(false);
      setShowHints(false);
    }
  };

  useEffect(() => {
    loadExercise(currentExerciseIndex);
  }, [currentExerciseIndex, filteredExercises]);

  const runCode = () => {
    if (!userCode.trim()) {
      Alert.alert('Empty Code', 'Please write some code before running.');
      return;
    }
    
    // In a real app, this would execute the PowerShell code
    Alert.alert('Code Execution', 'Code execution would happen here in a real PowerShell environment.');
  };

  const checkSolution = () => {
    const currentExercise = filteredExercises[currentExerciseIndex];
    if (userCode.trim().toLowerCase().includes(currentExercise.solution.toLowerCase().split('\n')[0].toLowerCase())) {
      setCompletedExercises(prev => new Set([...prev, currentExercise.id]));
      setTotalPoints(prev => prev + currentExercise.points);
      Alert.alert(
        'Correct!',
        `Great job! You earned ${currentExercise.points} points.`,
        [{ text: 'Continue', onPress: nextExercise }]
      );
    } else {
      Alert.alert('Not quite right', 'Try again or check the solution for guidance.');
    }
  };

  const nextExercise = () => {
    if (currentExerciseIndex < filteredExercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      Alert.alert('Practice Complete!', 'You\'ve completed all exercises in this category.');
    }
  };

  const previousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
    }
  };

  const toggleSolution = () => {
    setShowSolution(!showSolution);
  };

  const toggleHints = () => {
    setShowHints(!showHints);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return '#4CAF50';
      case 'Intermediate': return '#FF9800';
      case 'Advanced': return '#F44336';
      default: return '#757575';
    }
  };

  const currentExercise = filteredExercises[currentExerciseIndex];

  if (filteredExercises.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Practice Exercises</Text>
          <Text style={styles.subtitle}>No exercises available for selected difficulty</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Practice Exercises</Text>
        <View style={styles.headerInfo}>
          <Text style={styles.exerciseCounter}>
            Exercise {currentExerciseIndex + 1} of {filteredExercises.length}
          </Text>
          <Text style={styles.pointsText}>Points: {totalPoints}</Text>
        </View>
        <Progress.Bar
          progress={(currentExerciseIndex + 1) / filteredExercises.length}
          width={width - 40}
          height={8}
          color="#4CAF50"
          unfilledColor="#E0E0E0"
          borderWidth={0}
        />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.exerciseContainer}>
          <View style={styles.exerciseHeader}>
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseTitle}>{currentExercise?.title}</Text>
              <Text style={styles.exerciseDescription}>{currentExercise?.description}</Text>
            </View>
            <View
              style={[
                styles.difficultyBadge,
                { backgroundColor: getDifficultyColor(currentExercise?.difficulty || '') },
              ]}
            >
              <Text style={styles.difficultyText}>{currentExercise?.difficulty}</Text>
            </View>
          </View>

          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>Instructions:</Text>
            <Text style={styles.instructionsText}>{currentExercise?.instructions}</Text>
          </View>

          <View style={styles.codeContainer}>
            <View style={styles.codeHeader}>
              <Text style={styles.codeTitle}>Your Code:</Text>
              <View style={styles.codeActions}>
                <TouchableOpacity style={styles.actionButton} onPress={runCode}>
                  <Icon name="play-arrow" size={16} color="#2196F3" />
                  <Text style={styles.actionButtonText}>Run</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={checkSolution}>
                  <Icon name="check" size={16} color="#4CAF50" />
                  <Text style={styles.actionButtonText}>Check</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.codeEditor}>
              <Text style={styles.codeText}>{userCode}</Text>
            </View>
          </View>

          <View style={styles.helpContainer}>
            <TouchableOpacity style={styles.helpButton} onPress={toggleHints}>
              <Icon name="lightbulb-outline" size={20} color="#FF9800" />
              <Text style={styles.helpButtonText}>
                {showHints ? 'Hide Hints' : 'Show Hints'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.helpButton} onPress={toggleSolution}>
              <Icon name="visibility" size={20} color="#9C27B0" />
              <Text style={styles.helpButtonText}>
                {showSolution ? 'Hide Solution' : 'Show Solution'}
              </Text>
            </TouchableOpacity>
          </View>

          {showHints && (
            <Animatable.View animation="fadeInUp" style={styles.hintsContainer}>
              <Text style={styles.hintsTitle}>Hints:</Text>
              {currentExercise?.hints.map((hint, index) => (
                <Text key={index} style={styles.hintText}>
                  {index + 1}. {hint}
                </Text>
              ))}
            </Animatable.View>
          )}

          {showSolution && (
            <Animatable.View animation="fadeInUp" style={styles.solutionContainer}>
              <Text style={styles.solutionTitle}>Solution:</Text>
              <View style={styles.solutionCode}>
                <Text style={styles.solutionText}>{currentExercise?.solution}</Text>
              </View>
            </Animatable.View>
          )}
        </View>
      </ScrollView>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, styles.previousButton]}
          onPress={previousExercise}
          disabled={currentExerciseIndex === 0}
        >
          <Icon name="chevron-left" size={20} color="#fff" />
          <Text style={styles.controlButtonText}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.nextButton]}
          onPress={nextExercise}
          disabled={currentExerciseIndex === filteredExercises.length - 1}
        >
          <Text style={styles.controlButtonText}>Next</Text>
          <Icon name="chevron-right" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
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
    marginBottom: 10,
  },
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  exerciseCounter: {
    fontSize: 16,
    color: '#e0e0e0',
  },
  pointsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  exerciseContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  exerciseDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginLeft: 15,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  instructionsContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  codeContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    marginBottom: 20,
  },
  codeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  codeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  codeActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fff',
    borderRadius: 15,
    gap: 4,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  codeEditor: {
    padding: 15,
    minHeight: 120,
  },
  codeText: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#333',
    lineHeight: 20,
  },
  helpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    gap: 8,
  },
  helpButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  hintsContainer: {
    backgroundColor: '#fff3e0',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  hintsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF9800',
    marginBottom: 10,
  },
  hintText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
    lineHeight: 20,
  },
  solutionContainer: {
    backgroundColor: '#f3e5f5',
    borderRadius: 10,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#9C27B0',
  },
  solutionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#9C27B0',
    marginBottom: 10,
  },
  solutionCode: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
  },
  solutionText: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#333',
    lineHeight: 20,
  },
  controls: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    gap: 15,
  },
  controlButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 25,
    gap: 8,
  },
  previousButton: {
    backgroundColor: '#757575',
  },
  nextButton: {
    backgroundColor: '#2196F3',
  },
  controlButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default PracticeScreen;
