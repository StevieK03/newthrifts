import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get('window');

interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
}

interface FlashcardsScreenProps {
  navigation: any;
}

const FlashcardsScreen: React.FC<FlashcardsScreenProps> = ({ navigation }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyMode, setStudyMode] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [filteredCards, setFilteredCards] = useState<Flashcard[]>([]);
  const [knownCards, setKnownCards] = useState<Set<string>>(new Set());

  const flashcards: Flashcard[] = [
    // Beginner Cards
    {
      id: '1',
      front: 'What is PowerShell?',
      back: 'PowerShell is a cross-platform task automation and configuration management framework, consisting of a command-line shell and scripting language.',
      category: 'Fundamentals',
      difficulty: 'Beginner',
      tags: ['basics', 'introduction'],
    },
    {
      id: '1a',
      front: 'What are PowerShell Arrays?',
      back: 'Arrays in PowerShell are collections of items that can be accessed by index. Created using @() or comma-separated values: $array = @(1,2,3) or $array = 1,2,3',
      category: 'Arrays',
      difficulty: 'Beginner',
      tags: ['arrays', 'collections', 'data-structures'],
    },
    {
      id: '1b',
      front: 'How do you create a ForEach loop?',
      back: 'ForEach loops iterate through collections: foreach ($item in $collection) { # code } or $collection | ForEach-Object { # code }',
      category: 'Loops',
      difficulty: 'Beginner',
      tags: ['loops', 'iteration', 'foreach'],
    },
    {
      id: '1c',
      front: 'What is a Switch Statement?',
      back: 'Switch statements provide multiple conditional branches: switch ($value) { "option1" { # code } "option2" { # code } default { # code } }',
      category: 'Control Structures',
      difficulty: 'Beginner',
      tags: ['switch', 'conditionals', 'control-flow'],
    },
    {
      id: '1d',
      front: 'How do you work with Strings?',
      back: 'Strings in PowerShell support interpolation with $, concatenation with +, and methods like .Length, .ToUpper(), .Split(), .Replace()',
      category: 'Strings',
      difficulty: 'Beginner',
      tags: ['strings', 'text', 'manipulation'],
    },
    {
      id: '1e',
      front: 'What is Write-Host used for?',
      back: 'Write-Host displays output directly to the console and bypasses the pipeline. Use for user-facing messages and colored output.',
      category: 'Output',
      difficulty: 'Beginner',
      tags: ['output', 'console', 'display'],
    },
    {
      id: '1f',
      front: 'How do you handle If-Else statements?',
      back: 'If-Else provides conditional logic: if ($condition) { # true code } elseif ($other) { # other code } else { # false code }',
      category: 'Control Structures',
      difficulty: 'Beginner',
      tags: ['conditionals', 'if-else', 'logic'],
    },
    {
      id: '1g',
      front: 'What is Verbose output?',
      back: 'Verbose provides detailed information during script execution. Use -Verbose parameter or Write-Verbose cmdlet for debugging and progress information.',
      category: 'Debugging',
      difficulty: 'Beginner',
      tags: ['verbose', 'debugging', 'output'],
    },
    {
      id: '2',
      front: 'How do you get help for a PowerShell cmdlet?',
      back: 'Use Get-Help cmdlet-name or Get-Help cmdlet-name -Examples for examples. You can also use cmdlet-name -? for quick help.',
      category: 'Help System',
      difficulty: 'Beginner',
      tags: ['help', 'documentation'],
    },
    {
      id: '3',
      front: 'What is the difference between Get-ChildItem and dir?',
      back: 'Get-ChildItem is the PowerShell cmdlet, while dir is an alias for Get-ChildItem. Both do the same thing, but Get-ChildItem is the proper PowerShell way.',
      category: 'Commands',
      difficulty: 'Beginner',
      tags: ['aliases', 'commands'],
    },
    {
      id: '4',
      front: 'How do you create a variable in PowerShell?',
      back: 'Use $variableName = value. For example: $name = "John" or $number = 42. Variables are loosely typed.',
      category: 'Variables',
      difficulty: 'Beginner',
      tags: ['variables', 'syntax'],
    },
    {
      id: '5',
      front: 'What is the PowerShell pipeline?',
      back: 'The pipeline (|) passes output from one cmdlet as input to another. For example: Get-Process | Where-Object {$_.CPU -gt 100}.',
      category: 'Pipeline',
      difficulty: 'Beginner',
      tags: ['pipeline', 'filtering'],
    },
    // Intermediate Cards
    {
      id: '6',
      front: 'How do you create a function in PowerShell?',
      back: 'Use the function keyword: function Get-MyFunction { param($param1) # function body return $result }',
      category: 'Functions',
      difficulty: 'Intermediate',
      tags: ['functions', 'parameters'],
    },
    {
      id: '7',
      front: 'What is the difference between -eq and -like operators?',
      back: '-eq is for exact equality comparison, while -like supports wildcards (* and ?). For example: $name -like "John*" matches "John" and "Johnny".',
      category: 'Operators',
      difficulty: 'Intermediate',
      tags: ['operators', 'comparison'],
    },
    {
      id: '8',
      front: 'How do you handle errors in PowerShell?',
      back: 'Use try-catch-finally blocks: try { risky-command } catch { Write-Error "Error occurred" } finally { cleanup-code }',
      category: 'Error Handling',
      difficulty: 'Intermediate',
      tags: ['error-handling', 'exceptions'],
    },
    {
      id: '9',
      front: 'What is the difference between Write-Host and Write-Output?',
      back: 'Write-Host writes directly to the console and bypasses the pipeline. Write-Output sends objects to the pipeline for further processing.',
      category: 'Output',
      difficulty: 'Intermediate',
      tags: ['output', 'pipeline'],
    },
    {
      id: '10',
      front: 'How do you create a PowerShell module?',
      back: 'Create a .psm1 file with your functions, then use Export-ModuleMember to expose functions. Import with Import-Module.',
      category: 'Modules',
      difficulty: 'Intermediate',
      tags: ['modules', 'reusability'],
    },
    // Advanced Cards
    {
      id: '11',
      front: 'What is PowerShell DSC (Desired State Configuration)?',
      back: 'DSC is a management platform that enables you to manage your IT and development infrastructure with configuration as code.',
      category: 'DSC',
      difficulty: 'Advanced',
      tags: ['dsc', 'configuration-management'],
    },
    {
      id: '12',
      front: 'How do you create a custom PowerShell provider?',
      back: 'Create a class that inherits from CmdletProvider and implement methods like GetChildItems, SetItem, etc. Register with Register-PSProvider.',
      category: 'Providers',
      difficulty: 'Advanced',
      tags: ['providers', 'extensibility'],
    },
    {
      id: '13',
      front: 'What is PowerShell remoting and how do you enable it?',
      back: 'PowerShell remoting allows you to run commands on remote computers. Enable with Enable-PSRemoting and use Enter-PSSession or Invoke-Command.',
      category: 'Remoting',
      difficulty: 'Advanced',
      tags: ['remoting', 'remote-execution'],
    },
    {
      id: '14',
      front: 'How do you create a PowerShell class?',
      back: 'Use the class keyword: class MyClass { [string]$Property; MyClass([string]$value) { $this.Property = $value } }',
      category: 'Classes',
      difficulty: 'Advanced',
      tags: ['classes', 'object-oriented'],
    },
    {
      id: '15',
      front: 'What is PowerShell Just Enough Administration (JEA)?',
      back: 'JEA is a security technology that enables delegated administration for anything managed by PowerShell. It creates constrained endpoints with limited capabilities.',
      category: 'Security',
      difficulty: 'Advanced',
      tags: ['security', 'delegation', 'jea'],
    },
    // Additional Topics from User's Materials
    {
      id: '16',
      front: 'How do you work with JSON data?',
      back: 'Use ConvertFrom-Json to parse JSON strings into objects and ConvertTo-Json to convert objects to JSON format.',
      category: 'Data Formats',
      difficulty: 'Intermediate',
      tags: ['json', 'data', 'parsing'],
    },
    {
      id: '17',
      front: 'How do you work with XML in PowerShell?',
      back: 'Use [xml] type accelerator to parse XML, or Get-Content with -Raw, then access elements with dot notation or XPath.',
      category: 'Data Formats',
      difficulty: 'Intermediate',
      tags: ['xml', 'data', 'parsing'],
    },
    {
      id: '18',
      front: 'How do you handle file permissions?',
      back: 'Use Get-Acl and Set-Acl to read and modify file permissions. Use icacls.exe for advanced permission management.',
      category: 'File Management',
      difficulty: 'Advanced',
      tags: ['permissions', 'security', 'files'],
    },
    {
      id: '19',
      front: 'What are PowerShell networking cmdlets?',
      back: 'Test-NetConnection, Get-NetAdapter, Get-NetIPAddress, Get-NetRoute, and Invoke-WebRequest for network operations.',
      category: 'Networking',
      difficulty: 'Intermediate',
      tags: ['networking', 'connectivity', 'tcp'],
    },
    {
      id: '20',
      front: 'How do you create scheduled jobs?',
      back: 'Use Register-ScheduledJob to create background jobs that run on a schedule, and Get-ScheduledJob to view them.',
      category: 'Automation',
      difficulty: 'Advanced',
      tags: ['scheduling', 'jobs', 'automation'],
    },
    {
      id: '21',
      front: 'How do you work with scheduled tasks?',
      back: 'Use Register-ScheduledTask to create Windows scheduled tasks, and Get-ScheduledTask to view existing tasks.',
      category: 'Automation',
      difficulty: 'Advanced',
      tags: ['tasks', 'scheduling', 'windows'],
    },
    {
      id: '22',
      front: 'How do you export data to CSV?',
      back: 'Use Export-Csv cmdlet: Get-Process | Export-Csv -Path "processes.csv" -NoTypeInformation',
      category: 'Data Export',
      difficulty: 'Beginner',
      tags: ['csv', 'export', 'data'],
    },
    {
      id: '23',
      front: 'How do you copy files with PowerShell?',
      back: 'Use Copy-Item cmdlet: Copy-Item -Path "source.txt" -Destination "destination.txt" -Recurse for directories.',
      category: 'File Management',
      difficulty: 'Beginner',
      tags: ['files', 'copy', 'management'],
    },
    {
      id: '24',
      front: 'What are PowerShell functions?',
      back: 'Functions are reusable code blocks: function Get-MyFunction { param($param1) # code return $result }',
      category: 'Functions',
      difficulty: 'Intermediate',
      tags: ['functions', 'reusability', 'code'],
    },
    {
      id: '25',
      front: 'How do you handle file operations?',
      back: 'Use Get-ChildItem, Copy-Item, Move-Item, Remove-Item, New-Item for comprehensive file management operations.',
      category: 'File Management',
      difficulty: 'Beginner',
      tags: ['files', 'operations', 'management'],
    },
    // PowerShell 7 Specific Content
    {
      id: '26',
      front: 'What is PowerShell 7 and how is it different?',
      back: 'PowerShell 7 is the cross-platform successor to Windows PowerShell 5.1. It\'s built on .NET Core/.NET 5+ and runs on Windows, macOS, and Linux.',
      category: 'PowerShell 7',
      difficulty: 'Beginner',
      tags: ['powershell7', 'cross-platform', 'net-core'],
    },
    {
      id: '27',
      front: 'How do you install PowerShell 7?',
      back: 'Use winget install Microsoft.PowerShell on Windows, brew install powershell on macOS, or download from GitHub releases for Linux.',
      category: 'PowerShell 7',
      difficulty: 'Beginner',
      tags: ['installation', 'winget', 'brew'],
    },
    {
      id: '28',
      front: 'What is the new ternary operator in PowerShell 7?',
      back: 'The ternary operator ? : allows conditional expressions: $result = $condition ? "true" : "false" - equivalent to if-else in a single line.',
      category: 'PowerShell 7',
      difficulty: 'Intermediate',
      tags: ['ternary', 'operators', 'syntax'],
    },
    {
      id: '29',
      front: 'What are PowerShell 7 pipeline parallel operators?',
      back: 'Use |& for parallel pipeline execution: Get-Process |& ForEach-Object { $_.CPU } - allows multiple processes to run simultaneously.',
      category: 'PowerShell 7',
      difficulty: 'Advanced',
      tags: ['parallel', 'pipeline', 'performance'],
    },
    {
      id: '30',
      front: 'What is the new null-conditional operator in PowerShell 7?',
      back: 'Use ?. to safely access properties: $result = $object?.Property?.Method() - returns null if any part of the chain is null.',
      category: 'PowerShell 7',
      difficulty: 'Intermediate',
      tags: ['null-conditional', 'safe-access', 'operators'],
    },
    {
      id: '31',
      front: 'How do you use the new ForEach-Object -Parallel in PowerShell 7?',
      back: 'ForEach-Object -Parallel { scriptblock } -ThrottleLimit 5 - runs scriptblock in parallel with configurable concurrency limits.',
      category: 'PowerShell 7',
      difficulty: 'Advanced',
      tags: ['parallel', 'foreach', 'performance'],
    },
    {
      id: '32',
      front: 'What is the new Get-Error cmdlet in PowerShell 7?',
      back: 'Get-Error displays detailed error information including stack traces, exception details, and error context for better debugging.',
      category: 'PowerShell 7',
      difficulty: 'Intermediate',
      tags: ['debugging', 'errors', 'troubleshooting'],
    },
    {
      id: '33',
      front: 'How do you use the new ConvertFrom-Json -AsHashtable in PowerShell 7?',
      back: 'ConvertFrom-Json -AsHashtable converts JSON directly to hashtable instead of PSCustomObject, providing better performance and easier access.',
      category: 'PowerShell 7',
      difficulty: 'Intermediate',
      tags: ['json', 'hashtable', 'performance'],
    },
    {
      id: '34',
      front: 'What is the new $PSNativeCommandUseErrorActionPreference in PowerShell 7?',
      back: 'This preference variable controls error handling for native commands. When $true, native command errors are caught by PowerShell error handling.',
      category: 'PowerShell 7',
      difficulty: 'Advanced',
      tags: ['native-commands', 'error-handling', 'preferences'],
    },
    {
      id: '35',
      front: 'How do you use the new -PipelineVariable in PowerShell 7?',
      back: 'Use -PipelineVariable to store pipeline input in a variable: Get-Process | Where-Object -PipelineVariable proc { $proc.CPU -gt 100 }',
      category: 'PowerShell 7',
      difficulty: 'Advanced',
      tags: ['pipeline', 'variables', 'advanced'],
    },
    {
      id: '36',
      front: 'What is the new Get-Process -IncludeUserName in PowerShell 7?',
      back: 'Get-Process -IncludeUserName shows the username running each process, useful for security auditing and process management.',
      category: 'PowerShell 7',
      difficulty: 'Intermediate',
      tags: ['processes', 'security', 'usernames'],
    },
    {
      id: '37',
      front: 'How do you use the new -OutVariable in PowerShell 7?',
      back: 'Use -OutVariable to capture output in a variable: Get-Process -OutVariable processes; $processes contains the output array.',
      category: 'PowerShell 7',
      difficulty: 'Intermediate',
      tags: ['output', 'variables', 'capture'],
    },
    {
      id: '38',
      front: 'What is the new $PSDefaultParameterValues in PowerShell 7?',
      back: 'Set default parameter values: $PSDefaultParameterValues["Get-Process:Name"] = "notepad" - automatically applies parameters to cmdlets.',
      category: 'PowerShell 7',
      difficulty: 'Advanced',
      tags: ['parameters', 'defaults', 'configuration'],
    },
    {
      id: '39',
      front: 'How do you use the new -PipelineVariable with multiple cmdlets?',
      back: 'Chain -PipelineVariable across cmdlets: Get-Process | Where-Object -PipelineVariable proc { $proc.CPU -gt 100 } | Select-Object -PipelineVariable sel { $sel.Name }',
      category: 'PowerShell 7',
      difficulty: 'Advanced',
      tags: ['pipeline', 'chaining', 'variables'],
    },
    {
      id: '40',
      front: 'What is the new Get-Process -IncludeUserName -IncludePath in PowerShell 7?',
      back: 'Combines username and executable path information: Get-Process -IncludeUserName -IncludePath shows who is running what and from where.',
      category: 'PowerShell 7',
      difficulty: 'Intermediate',
      tags: ['processes', 'security', 'paths'],
    },
    {
      id: '41',
      front: 'How do you use the new -PipelineVariable with ForEach-Object?',
      back: 'ForEach-Object -PipelineVariable item { $item.Property } - allows access to the current pipeline item within the scriptblock.',
      category: 'PowerShell 7',
      difficulty: 'Advanced',
      tags: ['foreach', 'pipeline', 'variables'],
    },
    {
      id: '42',
      front: 'What is the new $PSNativeCommandArgumentPassing in PowerShell 7?',
      back: 'Controls how arguments are passed to native commands. "Legacy" uses Windows-style, "Standard" uses cross-platform style.',
      category: 'PowerShell 7',
      difficulty: 'Advanced',
      tags: ['native-commands', 'arguments', 'cross-platform'],
    },
    {
      id: '43',
      front: 'How do you use the new -PipelineVariable with Where-Object?',
      back: 'Where-Object -PipelineVariable item { $item.Property -eq "value" } - provides access to the current item being filtered.',
      category: 'PowerShell 7',
      difficulty: 'Advanced',
      tags: ['where-object', 'pipeline', 'filtering'],
    },
    {
      id: '44',
      front: 'What is the new Get-Process -IncludeUserName -IncludePath -IncludeCommandLine in PowerShell 7?',
      back: 'Shows username, executable path, and full command line arguments for comprehensive process information and security auditing.',
      category: 'PowerShell 7',
      difficulty: 'Advanced',
      tags: ['processes', 'security', 'command-line'],
    },
    {
      id: '45',
      front: 'How do you use the new -PipelineVariable with Select-Object?',
      back: 'Select-Object -PipelineVariable item { $item.Property } - allows access to the current object being selected in the pipeline.',
      category: 'PowerShell 7',
      difficulty: 'Advanced',
      tags: ['select-object', 'pipeline', 'selection'],
    },
  ];

  useEffect(() => {
    filterCards();
  }, [studyMode]);

  const filterCards = () => {
    if (studyMode === 'all') {
      setFilteredCards(flashcards);
    } else {
      setFilteredCards(flashcards.filter(card => card.difficulty.toLowerCase() === studyMode));
    }
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const nextCard = () => {
    if (currentCardIndex < filteredCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    } else {
      Alert.alert('Study Complete!', 'You\'ve finished all cards in this category.');
    }
  };

  const previousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  const markAsKnown = () => {
    const currentCard = filteredCards[currentCardIndex];
    if (currentCard) {
      setKnownCards(prev => new Set([...prev, currentCard.id]));
      nextCard();
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return '#4CAF50';
      case 'Intermediate': return '#FF9800';
      case 'Advanced': return '#F44336';
      default: return '#757575';
    }
  };

  const currentCard = filteredCards[currentCardIndex];

  if (filteredCards.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Flashcards</Text>
          <Text style={styles.subtitle}>No cards available for selected difficulty</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Flashcards</Text>
        <Text style={styles.subtitle}>
          {currentCardIndex + 1} of {filteredCards.length} cards
        </Text>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['all', 'beginner', 'intermediate', 'advanced'].map((mode) => (
            <TouchableOpacity
              key={mode}
              style={[
                styles.filterButton,
                studyMode === mode && styles.filterButtonActive,
              ]}
              onPress={() => setStudyMode(mode as any)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  studyMode === mode && styles.filterButtonTextActive,
                ]}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={flipCard}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={isFlipped ? ['#667eea', '#764ba2'] : ['#f093fb', '#f5576c']}
            style={styles.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardCategory}>{currentCard?.category}</Text>
                <View
                  style={[
                    styles.difficultyBadge,
                    { backgroundColor: getDifficultyColor(currentCard?.difficulty || '') },
                  ]}
                >
                  <Text style={styles.difficultyText}>{currentCard?.difficulty}</Text>
                </View>
              </View>
              
              <Animatable.View
                animation={isFlipped ? 'flipInY' : 'flipInX'}
                duration={600}
                style={styles.cardTextContainer}
              >
                <Text style={styles.cardText}>
                  {isFlipped ? currentCard?.back : currentCard?.front}
                </Text>
              </Animatable.View>

              <View style={styles.cardFooter}>
                <Text style={styles.flipHint}>
                  {isFlipped ? 'Tap to see question' : 'Tap to see answer'}
                </Text>
                <Icon
                  name={isFlipped ? 'question-answer' : 'visibility'}
                  size={20}
                  color="#fff"
                />
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, styles.previousButton]}
          onPress={previousCard}
          disabled={currentCardIndex === 0}
        >
          <Icon name="chevron-left" size={24} color="#fff" />
          <Text style={styles.controlButtonText}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.knowButton]}
          onPress={markAsKnown}
        >
          <Icon name="check" size={24} color="#fff" />
          <Text style={styles.controlButtonText}>I Know This</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.nextButton]}
          onPress={nextCard}
          disabled={currentCardIndex === filteredCards.length - 1}
        >
          <Text style={styles.controlButtonText}>Next</Text>
          <Icon name="chevron-right" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentCardIndex + 1) / filteredCards.length) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {Math.round(((currentCardIndex + 1) / filteredCards.length) * 100)}% Complete
        </Text>
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
  filterContainer: {
    padding: 15,
    backgroundColor: '#fff',
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
  },
  filterButtonActive: {
    backgroundColor: '#667eea',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  cardContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    height: height * 0.5,
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  cardGradient: {
    flex: 1,
    borderRadius: 20,
    padding: 25,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardCategory: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    opacity: 0.9,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  cardText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 28,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  flipHint: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    gap: 10,
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
  knowButton: {
    backgroundColor: '#4CAF50',
  },
  nextButton: {
    backgroundColor: '#2196F3',
  },
  controlButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  progressContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default FlashcardsScreen;
