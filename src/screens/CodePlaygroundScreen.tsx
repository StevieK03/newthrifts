import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get('window');

interface CodeTemplate {
  id: string;
  title: string;
  description: string;
  code: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface CodePlaygroundScreenProps {
  navigation: any;
}

const CodePlaygroundScreen: React.FC<CodePlaygroundScreenProps> = ({ navigation }) => {
  const [userCode, setUserCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  const codeTemplates: CodeTemplate[] = [
    {
      id: '1',
      title: 'Hello World',
      description: 'Basic PowerShell output',
      code: 'Write-Host "Hello, PowerShell!"\nWrite-Host "Welcome to the playground!"',
      category: 'Basics',
      difficulty: 'Beginner'
    },
    {
      id: '2',
      title: 'Variable Operations',
      description: 'Working with variables and math',
      code: '# Create variables\n$number1 = 10\n$number2 = 5\n\n# Perform calculations\n$sum = $number1 + $number2\n$product = $number1 * $number2\n\n# Display results\nWrite-Host "Sum: $sum"\nWrite-Host "Product: $product"',
      category: 'Variables',
      difficulty: 'Beginner'
    },
    {
      id: '3',
      title: 'File Operations',
      description: 'List and analyze files',
      code: '# Get files in current directory\n$files = Get-ChildItem -File\n\nWrite-Host "Files in current directory:"\nforeach ($file in $files) {\n    Write-Host "- $($file.Name) ($($file.Length) bytes)"\n}\n\nWrite-Host "`nTotal files: $($files.Count)"',
      category: 'File System',
      difficulty: 'Intermediate'
    },
    {
      id: '4',
      title: 'Process Monitor',
      description: 'Monitor system processes',
      code: '# Get top 5 processes by CPU usage\n$processes = Get-Process | Sort-Object CPU -Descending | Select-Object -First 5\n\nWrite-Host "Top 5 processes by CPU:"\nforeach ($process in $processes) {\n    Write-Host "$($process.ProcessName): $($process.CPU) CPU, $([math]::Round($process.WorkingSet/1MB, 2)) MB Memory"\n}',
      category: 'System',
      difficulty: 'Intermediate'
    },
    {
      id: '5',
      title: 'Text Processing',
      description: 'Analyze and manipulate text',
      code: '# Sample text\n$text = "PowerShell is a powerful scripting language for automation and configuration management."\n\n# Analyze text\n$words = $text -split "\\s+"\n$wordCount = $words.Count\n$charCount = $text.Length\n\nWrite-Host "Text: $text"\nWrite-Host "Word count: $wordCount"\nWrite-Host "Character count: $charCount"\nWrite-Host "Average word length: $([math]::Round($charCount / $wordCount, 2))"',
      category: 'Text Processing',
      difficulty: 'Intermediate'
    },
    {
      id: '6',
      title: 'System Information',
      description: 'Get comprehensive system info',
      code: '# Get system information\n$computer = Get-WmiObject -Class Win32_ComputerSystem\n$os = Get-WmiObject -Class Win32_OperatingSystem\n$memory = Get-WmiObject -Class Win32_PhysicalMemory | Measure-Object -Property Capacity -Sum\n\nWrite-Host "=== System Information ==="\nWrite-Host "Computer: $($computer.Name)"\nWrite-Host "OS: $($os.Caption) $($os.Version)"\nWrite-Host "Total Memory: $([math]::Round($memory.Sum / 1GB, 2)) GB"\nWrite-Host "Free Memory: $([math]::Round($os.FreePhysicalMemory / 1MB, 2)) GB"',
      category: 'System',
      difficulty: 'Advanced'
    },
    {
      id: '7',
      title: 'Network Information',
      description: 'Display network configuration',
      code: '# Get network adapters\n$adapters = Get-NetAdapter | Where-Object {$_.Status -eq "Up"}\n\nWrite-Host "=== Network Adapters ==="\nforeach ($adapter in $adapters) {\n    Write-Host "Name: $($adapter.Name)"\n    Write-Host "Interface: $($adapter.InterfaceDescription)"\n    Write-Host "Speed: $($adapter.LinkSpeed)"\n    Write-Host "---"\n}',
      category: 'Network',
      difficulty: 'Advanced'
    },
    {
      id: '8',
      title: 'Service Management',
      description: 'Manage Windows services',
      code: '# Get services by status\n$runningServices = Get-Service | Where-Object {$_.Status -eq "Running"} | Sort-Object Name\n$stoppedServices = Get-Service | Where-Object {$_.Status -eq "Stopped"} | Sort-Object Name\n\nWrite-Host "=== Running Services ($($runningServices.Count)) ==="\n$runningServices | Select-Object -First 10 | ForEach-Object { Write-Host "- $($_.Name)" }\n\nWrite-Host "`n=== Stopped Services ($($stoppedServices.Count)) ==="\n$stoppedServices | Select-Object -First 10 | ForEach-Object { Write-Host "- $($_.Name)" }',
      category: 'Services',
      difficulty: 'Advanced'
    },
    // PowerShell 7 Specific Templates
    {
      id: '9',
      title: 'PowerShell 7 Ternary Operator',
      description: 'Use the new ternary operator for conditional logic',
      code: '# PowerShell 7 Ternary Operator Examples\n$number = 42\n$result = ($number % 2 -eq 0) ? "Even" : "Odd"\nWrite-Host "Number $number is $result"\n\n# Multiple conditions\n$score = 85\n$grade = ($score -ge 90) ? "A" : ($score -ge 80) ? "B" : ($score -ge 70) ? "C" : "F"\nWrite-Host "Score $score gets grade $grade"\n\n# String manipulation\n$name = "John"\n$greeting = ($name.Length -gt 0) ? "Hello, $name!" : "Hello, Anonymous!"\nWrite-Host $greeting',
      category: 'PowerShell 7',
      difficulty: 'Intermediate'
    },
    {
      id: '10',
      title: 'PowerShell 7 Null-Conditional',
      description: 'Safe property access with null-conditional operator',
      code: '# PowerShell 7 Null-Conditional Operator\n$object = $null\n$result = $object?.Property?.Method()\nWrite-Host "Null object result: $result"\n\n# Test with real object\n$realObject = [PSCustomObject]@{\n    Name = "John"\n    Profile = @{\n        Email = "john@example.com"\n        Settings = @{\n            Theme = "Dark"\n        }\n    }\n}\n\n$email = $realObject?.Profile?.Email\n$theme = $realObject?.Profile?.Settings?.Theme\nWrite-Host "Email: $email"\nWrite-Host "Theme: $theme"',
      category: 'PowerShell 7',
      difficulty: 'Intermediate'
    },
    {
      id: '11',
      title: 'PowerShell 7 Parallel Processing',
      description: 'Use ForEach-Object -Parallel for concurrent operations',
      code: '# PowerShell 7 Parallel Processing\n$urls = @(\n    "https://httpbin.org/delay/1",\n    "https://httpbin.org/delay/2",\n    "https://httpbin.org/delay/1",\n    "https://httpbin.org/delay/3"\n)\n\nWrite-Host "Processing URLs in parallel..."\n$results = $urls | ForEach-Object -Parallel {\n    $url = $_\n    $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()\n    try {\n        $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 10\n        $stopwatch.Stop()\n        [PSCustomObject]@{\n            URL = $url\n            StatusCode = $response.StatusCode\n            ResponseTime = $stopwatch.ElapsedMilliseconds\n            Success = $true\n        }\n    } catch {\n        $stopwatch.Stop()\n        [PSCustomObject]@{\n            URL = $url\n            StatusCode = "Error"\n            ResponseTime = $stopwatch.ElapsedMilliseconds\n            Success = $false\n        }\n    }\n} -ThrottleLimit 2\n\n$results | Format-Table -AutoSize',
      category: 'PowerShell 7',
      difficulty: 'Advanced'
    },
    {
      id: '12',
      title: 'PowerShell 7 Pipeline Variables',
      description: 'Use -PipelineVariable for advanced pipeline operations',
      code: '# PowerShell 7 Pipeline Variables\nWrite-Host "=== Using -PipelineVariable ==="\n\n# Example 1: Process filtering with pipeline variables\nGet-Process | Where-Object -PipelineVariable proc { $proc.CPU -gt 100 } | Select-Object -PipelineVariable sel { $sel.Name, $sel.CPU, $sel.WorkingSet } | ForEach-Object {\n    Write-Host "High CPU Process: $($_.Name) - CPU: $($_.CPU) - Memory: $($_.WorkingSet)"\n}\n\nWrite-Host "`n=== File operations with pipeline variables ==="\nGet-ChildItem -Path $env:TEMP -File | Where-Object -PipelineVariable file { $file.Length -gt 1MB } | Select-Object -PipelineVariable large { $large.Name, $large.Length } | ForEach-Object {\n    $sizeMB = [math]::Round($_.Length / 1MB, 2)\n    Write-Host "Large file: $($_.Name) - Size: $sizeMB MB"\n}',
      category: 'PowerShell 7',
      difficulty: 'Advanced'
    },
    {
      id: '13',
      title: 'PowerShell 7 Get-Error Debugging',
      description: 'Use Get-Error for comprehensive error analysis',
      code: '# PowerShell 7 Get-Error Debugging\nWrite-Host "=== Error Generation and Analysis ==="\n\n# Generate some intentional errors\ntry {\n    Get-Process -Name "NonExistentProcess" -ErrorAction Stop\n} catch {\n    Write-Host "Error caught, analyzing with Get-Error:"\n    Get-Error\n}\n\nWrite-Host "`n=== Another error example ==="\ntry {\n    $null.SomeProperty\n} catch {\n    Write-Host "Null reference error:"\n    Get-Error\n}\n\nWrite-Host "`n=== Get-Error with parameters ==="\nGet-Error -Newest 3',
      category: 'PowerShell 7',
      difficulty: 'Intermediate'
    },
    {
      id: '14',
      title: 'PowerShell 7 JSON Performance',
      description: 'Use ConvertFrom-Json -AsHashtable for better performance',
      code: '# PowerShell 7 JSON Performance with -AsHashtable\n$jsonData = \'{\n    "users": [\n        {"name": "John", "age": 30, "city": "New York"},\n        {"name": "Jane", "age": 25, "city": "Los Angeles"},\n        {"name": "Bob", "age": 35, "city": "Chicago"}\n    ],\n    "settings": {\n        "theme": "dark",\n        "notifications": true\n    }\n}\'\n\n# Parse as hashtable (PowerShell 7)\n$data = $jsonData | ConvertFrom-Json -AsHashtable\n\nWrite-Host "=== Parsed as Hashtable ==="\nWrite-Host "Theme: $($data.settings.theme)"\nWrite-Host "Notifications: $($data.settings.notifications)"\nWrite-Host "User count: $($data.users.Count)"\n\nWrite-Host "`n=== Users ==="\nforeach ($user in $data.users) {\n    Write-Host "Name: $($user.name), Age: $($user.age), City: $($user.city)"\n}',
      category: 'PowerShell 7',
      difficulty: 'Intermediate'
    },
    {
      id: '15',
      title: 'PowerShell 7 Security Audit',
      description: 'Enhanced process monitoring with new Get-Process parameters',
      code: '# PowerShell 7 Security Audit\nWrite-Host "=== PowerShell 7 Security Audit ==="\nWrite-Host "Processes with comprehensive information:"\nWrite-Host "=" * 60\n\n# Get processes with all new parameters\n$processes = Get-Process -IncludeUserName -IncludePath -IncludeCommandLine | Select-Object -First 10\n$processes | Format-Table ProcessName, Id, UserName, CPU, Path -AutoSize -Wrap\n\nWrite-Host "`n=== High CPU Processes by User ==="\nGet-Process -IncludeUserName | Where-Object { $_.CPU -gt 100 } | Group-Object UserName | Sort-Object Count -Descending | Format-Table -AutoSize\n\nWrite-Host "`n=== Process Security Summary ==="\n$summary = Get-Process -IncludeUserName | Group-Object UserName | Select-Object Name, Count, @{Name="TotalCPU"; Expression={($_.Group | Measure-Object CPU -Sum).Sum}}\n$summary | Sort-Object TotalCPU -Descending | Format-Table -AutoSize',
      category: 'PowerShell 7',
      difficulty: 'Advanced'
    }
  ];

  const runCode = async () => {
    if (!userCode.trim()) {
      Alert.alert('Empty Code', 'Please write some PowerShell code before running.');
      return;
    }

    setIsRunning(true);
    setOutput('Running code...\n');

    // Simulate code execution with a delay
    setTimeout(() => {
      // In a real app, this would execute the PowerShell code
      const mockOutput = `PS C:\\> ${userCode.split('\n').join('\nPS C:\\> ')}\n\n[Simulated Output]\nCode executed successfully!\n\nNote: This is a simulated environment. In a real PowerShell environment, your code would execute and show actual results.`;
      
      setOutput(mockOutput);
      setIsRunning(false);
    }, 1500);
  };

  const clearCode = () => {
    setUserCode('');
    setOutput('');
  };

  const loadTemplate = (template: CodeTemplate) => {
    setUserCode(template.code);
    setSelectedTemplate(template.id);
    setShowTemplates(false);
    setOutput('');
  };

  const saveCode = () => {
    if (!userCode.trim()) {
      Alert.alert('Empty Code', 'Nothing to save.');
      return;
    }
    
    // In a real app, this would save the code
    Alert.alert('Code Saved', 'Your code has been saved to the playground history.');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return '#4CAF50';
      case 'Intermediate': return '#FF9800';
      case 'Advanced': return '#F44336';
      default: return '#757575';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Basics': '#2196F3',
      'Variables': '#9C27B0',
      'File System': '#FF5722',
      'System': '#607D8B',
      'Text Processing': '#795548',
      'Network': '#3F51B5',
      'Services': '#E91E63'
    };
    return colors[category] || '#757575';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Code Playground</Text>
        <Text style={styles.subtitle}>Experiment with PowerShell code</Text>
      </View>

      <View style={styles.toolbar}>
        <TouchableOpacity
          style={styles.toolbarButton}
          onPress={() => setShowTemplates(!showTemplates)}
        >
          <Icon name="code" size={20} color="#2196F3" />
          <Text style={styles.toolbarButtonText}>Templates</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toolbarButton}
          onPress={runCode}
          disabled={isRunning}
        >
          <Icon name="play-arrow" size={20} color="#4CAF50" />
          <Text style={styles.toolbarButtonText}>Run</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toolbarButton}
          onPress={clearCode}
        >
          <Icon name="clear" size={20} color="#F44336" />
          <Text style={styles.toolbarButtonText}>Clear</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toolbarButton}
          onPress={saveCode}
        >
          <Icon name="save" size={20} color="#FF9800" />
          <Text style={styles.toolbarButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      {showTemplates && (
        <Animatable.View animation="slideInDown" style={styles.templatesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {codeTemplates.map((template) => (
              <TouchableOpacity
                key={template.id}
                style={[
                  styles.templateCard,
                  selectedTemplate === template.id && styles.templateCardSelected,
                ]}
                onPress={() => loadTemplate(template)}
              >
                <View style={styles.templateHeader}>
                  <Text style={styles.templateTitle}>{template.title}</Text>
                  <View
                    style={[
                      styles.templateBadge,
                      { backgroundColor: getDifficultyColor(template.difficulty) },
                    ]}
                  >
                    <Text style={styles.templateBadgeText}>{template.difficulty}</Text>
                  </View>
                </View>
                <Text style={styles.templateDescription}>{template.description}</Text>
                <View
                  style={[
                    styles.templateCategory,
                    { backgroundColor: getCategoryColor(template.category) },
                  ]}
                >
                  <Text style={styles.templateCategoryText}>{template.category}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animatable.View>
      )}

      <View style={styles.editorContainer}>
        <View style={styles.editorHeader}>
          <Text style={styles.editorTitle}>PowerShell Code</Text>
          <View style={styles.editorControls}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => setFontSize(Math.max(12, fontSize - 2))}
            >
              <Icon name="remove" size={16} color="#666" />
            </TouchableOpacity>
            <Text style={styles.fontSizeText}>{fontSize}</Text>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => setFontSize(Math.min(20, fontSize + 2))}
            >
              <Icon name="add" size={16} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              <Icon name={theme === 'light' ? 'brightness-2' : 'brightness-7'} size={16} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={[
          styles.codeEditor,
          theme === 'dark' ? styles.darkEditor : styles.lightEditor,
        ]}>
          <TextInput
            style={[
              styles.codeInput,
              { fontSize },
              theme === 'dark' ? styles.darkText : styles.lightText,
            ]}
            value={userCode}
            onChangeText={setUserCode}
            placeholder="Enter your PowerShell code here..."
            placeholderTextColor={theme === 'dark' ? '#888' : '#999'}
            multiline
            textAlignVertical="top"
            autoCorrect={false}
            autoCapitalize="none"
          />
        </View>
      </View>

      <View style={styles.outputContainer}>
        <View style={styles.outputHeader}>
          <Text style={styles.outputTitle}>Output</Text>
          {isRunning && (
            <View style={styles.runningIndicator}>
              <Animatable.View
                animation="rotate"
                iterationCount="infinite"
                duration={1000}
              >
                <Icon name="refresh" size={16} color="#4CAF50" />
              </Animatable.View>
              <Text style={styles.runningText}>Running...</Text>
            </View>
          )}
        </View>
        
        <ScrollView style={styles.outputScroll}>
          <Text style={[
            styles.outputText,
            theme === 'dark' ? styles.darkText : styles.lightText,
          ]}>
            {output || 'Output will appear here when you run your code...'}
          </Text>
        </ScrollView>
      </View>

      <View style={styles.featuresContainer}>
        <Text style={styles.featuresTitle}>Playground Features:</Text>
        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <Icon name="code" size={16} color="#2196F3" />
            <Text style={styles.featureText}>Syntax highlighting</Text>
          </View>
          <View style={styles.featureItem}>
            <Icon name="play-arrow" size={16} color="#4CAF50" />
            <Text style={styles.featureText}>Code execution</Text>
          </View>
          <View style={styles.featureItem}>
            <Icon name="save" size={16} color="#FF9800" />
            <Text style={styles.featureText}>Save snippets</Text>
          </View>
          <View style={styles.featureItem}>
            <Icon name="code" size={16} color="#9C27B0" />
            <Text style={styles.featureText}>Code templates</Text>
          </View>
        </View>
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
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#e0e0e0',
  },
  toolbar: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    gap: 10,
  },
  toolbarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    gap: 6,
  },
  toolbarButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  templatesContainer: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  templateCard: {
    width: 200,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  templateCardSelected: {
    borderColor: '#2196F3',
    backgroundColor: '#e3f2fd',
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  templateTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  templateBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  templateBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  templateDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
    lineHeight: 16,
  },
  templateCategory: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  templateCategoryText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  editorContainer: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  editorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  editorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  editorControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  controlButton: {
    padding: 4,
  },
  fontSizeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    minWidth: 20,
    textAlign: 'center',
  },
  codeEditor: {
    flex: 1,
    padding: 15,
  },
  darkEditor: {
    backgroundColor: '#1e1e1e',
  },
  lightEditor: {
    backgroundColor: '#fff',
  },
  codeInput: {
    flex: 1,
    fontFamily: 'monospace',
    lineHeight: 20,
  },
  darkText: {
    color: '#d4d4d4',
  },
  lightText: {
    color: '#333',
  },
  outputContainer: {
    height: height * 0.25,
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  outputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  outputTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  runningIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  runningText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  outputScroll: {
    flex: 1,
    padding: 15,
  },
  outputText: {
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 18,
  },
  featuresContainer: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  featuresList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featureText: {
    fontSize: 12,
    color: '#666',
  },
});

export default CodePlaygroundScreen;
