import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';

const { width } = Dimensions.get('window');

interface ReferenceItem {
  id: string;
  title: string;
  description: string;
  syntax: string;
  examples: string[];
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
}

interface ReferenceScreenProps {
  navigation: any;
}

const ReferenceScreen: React.FC<ReferenceScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const referenceItems: ReferenceItem[] = [
    // Basic Commands
    {
      id: '1',
      title: 'Get-Help',
      description: 'Displays help information about PowerShell commands and concepts',
      syntax: 'Get-Help [-Name] <String> [-Examples] [-Detailed] [-Full]',
      examples: [
        'Get-Help Get-Process',
        'Get-Help Get-Process -Examples',
        'Get-Help Get-Process -Detailed',
        'Get-Help about_Variables'
      ],
      category: 'Help',
      difficulty: 'Beginner',
      tags: ['help', 'documentation', 'basics']
    },
    {
      id: '2',
      title: 'Get-ChildItem',
      description: 'Gets the items and child items in one or more specified locations',
      syntax: 'Get-ChildItem [[-Path] <String[]>] [-Recurse] [-Force]',
      examples: [
        'Get-ChildItem',
        'Get-ChildItem C:\\Users',
        'Get-ChildItem -Recurse -Name',
        'Get-ChildItem *.txt'
      ],
      category: 'File System',
      difficulty: 'Beginner',
      tags: ['files', 'directories', 'listing']
    },
    {
      id: '3',
      title: 'Set-Location',
      description: 'Sets the current working location to a specified location',
      syntax: 'Set-Location [[-Path] <String>] [-PassThru]',
      examples: [
        'Set-Location C:\\Users',
        'Set-Location ..',
        'Set-Location -Path "C:\\Program Files"',
        'cd C:\\Windows'
      ],
      category: 'File System',
      difficulty: 'Beginner',
      tags: ['navigation', 'directory', 'cd']
    },
    {
      id: '4',
      title: 'Write-Host',
      description: 'Writes customized output to a host',
      syntax: 'Write-Host [[-Object] <Object>] [-ForegroundColor <ConsoleColor>] [-BackgroundColor <ConsoleColor>]',
      examples: [
        'Write-Host "Hello World"',
        'Write-Host "Error!" -ForegroundColor Red',
        'Write-Host "Success!" -ForegroundColor Green -BackgroundColor Black'
      ],
      category: 'Output',
      difficulty: 'Beginner',
      tags: ['output', 'display', 'console']
    },
    {
      id: '5',
      title: 'Get-Process',
      description: 'Gets the processes that are running on the local computer or a remote computer',
      syntax: 'Get-Process [[-Name] <String[]>] [-ComputerName <String[]>]',
      examples: [
        'Get-Process',
        'Get-Process -Name "notepad"',
        'Get-Process | Where-Object {$_.CPU -gt 100}',
        'Get-Process | Sort-Object CPU -Descending'
      ],
      category: 'Process Management',
      difficulty: 'Beginner',
      tags: ['processes', 'system', 'monitoring']
    },
    // Intermediate Commands
    {
      id: '6',
      title: 'Where-Object',
      description: 'Filters objects from the pipeline based on their property values',
      syntax: 'Where-Object [-Property <String>] [-Value <Object>] [-FilterScript <ScriptBlock>]',
      examples: [
        'Get-Process | Where-Object {$_.CPU -gt 100}',
        'Get-ChildItem | Where-Object {$_.Length -gt 1MB}',
        'Get-Service | Where-Object {$_.Status -eq "Running"}',
        '1..10 | Where-Object {$_ % 2 -eq 0}'
      ],
      category: 'Filtering',
      difficulty: 'Intermediate',
      tags: ['filtering', 'pipeline', 'conditions']
    },
    {
      id: '7',
      title: 'ForEach-Object',
      description: 'Performs an operation on each item in a collection of input objects',
      syntax: 'ForEach-Object [-MemberName <String>] [-InputObject <PSObject>] [-Process <ScriptBlock[]>]',
      examples: [
        'Get-Process | ForEach-Object {$_.Name}',
        '1..5 | ForEach-Object {$_ * 2}',
        'Get-ChildItem | ForEach-Object {Write-Host $_.Name}',
        'Get-Service | ForEach-Object {$_.Name, $_.Status}'
      ],
      category: 'Iteration',
      difficulty: 'Intermediate',
      tags: ['iteration', 'loops', 'pipeline']
    },
    {
      id: '8',
      title: 'Select-Object',
      description: 'Selects objects or object properties',
      syntax: 'Select-Object [[-Property] <Object[]>] [-First <Int32>] [-Last <Int32>] [-Skip <Int32>]',
      examples: [
        'Get-Process | Select-Object Name, CPU',
        'Get-Process | Select-Object -First 5',
        'Get-ChildItem | Select-Object Name, Length, LastWriteTime',
        'Get-Service | Select-Object -Last 10'
      ],
      category: 'Selection',
      difficulty: 'Intermediate',
      tags: ['selection', 'properties', 'formatting']
    },
    {
      id: '9',
      title: 'Sort-Object',
      description: 'Sorts objects by property values',
      syntax: 'Sort-Object [[-Property] <Object[]>] [-Descending] [-Unique]',
      examples: [
        'Get-Process | Sort-Object CPU',
        'Get-Process | Sort-Object CPU -Descending',
        'Get-ChildItem | Sort-Object Length -Descending',
        'Get-Service | Sort-Object Name'
      ],
      category: 'Sorting',
      difficulty: 'Intermediate',
      tags: ['sorting', 'ordering', 'data']
    },
    {
      id: '10',
      title: 'Measure-Object',
      description: 'Calculates the numeric properties of objects',
      syntax: 'Measure-Object [[-Property] <String[]>] [-Sum] [-Average] [-Maximum] [-Minimum] [-Count]',
      examples: [
        'Get-Process | Measure-Object CPU -Sum',
        'Get-ChildItem | Measure-Object Length -Sum -Average',
        '1..100 | Measure-Object -Sum -Average',
        'Get-Service | Measure-Object'
      ],
      category: 'Statistics',
      difficulty: 'Intermediate',
      tags: ['statistics', 'calculations', 'measurements']
    },
    // Advanced Commands
    {
      id: '11',
      title: 'Invoke-Command',
      description: 'Runs commands on local and remote computers',
      syntax: 'Invoke-Command [-ScriptBlock] <ScriptBlock> [-ComputerName <String[]>] [-Credential <PSCredential>]',
      examples: [
        'Invoke-Command -ScriptBlock {Get-Process}',
        'Invoke-Command -ComputerName "Server01" -ScriptBlock {Get-Service}',
        'Invoke-Command -FilePath "C:\\Scripts\\MyScript.ps1"',
        'Invoke-Command -ScriptBlock {Get-EventLog -LogName System -Newest 10}'
      ],
      category: 'Remoting',
      difficulty: 'Advanced',
      tags: ['remoting', 'remote', 'execution']
    },
    {
      id: '12',
      title: 'Start-Job',
      description: 'Starts a PowerShell background job',
      syntax: 'Start-Job [-ScriptBlock] <ScriptBlock> [-Name <String>] [-RunAs32]',
      examples: [
        'Start-Job -ScriptBlock {Get-Process}',
        'Start-Job -Name "MyJob" -ScriptBlock {Start-Sleep 10; "Done"}',
        'Start-Job -ScriptBlock {Get-ChildItem C:\\ -Recurse}',
        'Get-Job | Start-Job'
      ],
      category: 'Jobs',
      difficulty: 'Advanced',
      tags: ['jobs', 'background', 'asynchronous']
    },
    {
      id: '13',
      title: 'Register-ObjectEvent',
      description: 'Subscribes to the events generated by a Microsoft .NET Framework object',
      syntax: 'Register-ObjectEvent [-InputObject] <PSObject> [-EventName] <String> [-Action <ScriptBlock>]',
      examples: [
        'Register-ObjectEvent -InputObject $timer -EventName Elapsed -Action {Write-Host "Timer elapsed!"}',
        'Register-ObjectEvent -InputObject $fileWatcher -EventName Changed -Action {Write-Host "File changed!"}',
        'Get-EventSubscriber',
        'Unregister-Event -SourceIdentifier "TimerEvent"'
      ],
      category: 'Events',
      difficulty: 'Advanced',
      tags: ['events', 'subscription', 'monitoring']
    },
    {
      id: '14',
      title: 'New-Object',
      description: 'Creates an instance of a Microsoft .NET Framework or COM object',
      syntax: 'New-Object [-TypeName] <String> [[-ArgumentList] <Object[]>] [-Property <Hashtable>]',
      examples: [
        'New-Object System.DateTime',
        'New-Object System.DateTime 2024, 1, 1',
        'New-Object PSObject -Property @{Name="John"; Age=30}',
        'New-Object System.Collections.ArrayList'
      ],
      category: 'Objects',
      difficulty: 'Advanced',
      tags: ['objects', 'creation', 'instantiation']
    },
    {
      id: '15',
      title: 'Add-Type',
      description: 'Adds a Microsoft .NET Framework type to a PowerShell session',
      syntax: 'Add-Type [-TypeDefinition] <String> [-Language <Language>] [-AssemblyName <String[]>]',
      examples: [
        'Add-Type -AssemblyName System.Windows.Forms',
        'Add-Type -TypeDefinition "public class MyClass { public static string GetMessage() { return \\"Hello\\"; } }"',
        'Add-Type -Path "C:\\MyAssembly.dll"',
        'Add-Type -AssemblyName System.Drawing'
      ],
      category: 'Types',
      difficulty: 'Advanced',
      tags: ['types', 'assemblies', 'extensions']
    },
    // PowerShell 7 Specific Commands
    {
      id: '16',
      title: 'Get-Error',
      description: 'Displays detailed error information including stack traces and exception details',
      syntax: 'Get-Error [-Newest <Int32>] [-IncludeException]',
      examples: [
        'Get-Error',
        'Get-Error -Newest 5',
        'Get-Error -IncludeException',
        'try { risky-command } catch { Get-Error }'
      ],
      category: 'PowerShell 7',
      difficulty: 'Intermediate',
      tags: ['debugging', 'errors', 'troubleshooting']
    },
    {
      id: '17',
      title: 'ConvertFrom-Json -AsHashtable',
      description: 'Converts JSON to hashtable for better performance (PowerShell 7)',
      syntax: 'ConvertFrom-Json [-InputObject] <String> [-AsHashtable] [-Depth <Int32>]',
      examples: [
        '$json = \'{"name": "John", "age": 30}\'',
        '$hashtable = $json | ConvertFrom-Json -AsHashtable',
        '$hashtable.name  # Direct access',
        'ConvertFrom-Json -AsHashtable -InputObject $jsonString'
      ],
      category: 'PowerShell 7',
      difficulty: 'Intermediate',
      tags: ['json', 'hashtable', 'performance']
    },
    {
      id: '18',
      title: 'ForEach-Object -Parallel',
      description: 'Runs scriptblocks in parallel for improved performance (PowerShell 7)',
      syntax: 'ForEach-Object -Parallel <ScriptBlock> [-ThrottleLimit <Int32>] [-UseNewRunspace]',
      examples: [
        '1..10 | ForEach-Object -Parallel { $_ * 2 }',
        'Get-Process | ForEach-Object -Parallel { $_.CPU } -ThrottleLimit 5',
        '$urls | ForEach-Object -Parallel { Invoke-WebRequest $_ }',
        'ForEach-Object -Parallel { Start-Sleep 1; $_ } -ThrottleLimit 3'
      ],
      category: 'PowerShell 7',
      difficulty: 'Advanced',
      tags: ['parallel', 'performance', 'concurrency']
    },
    {
      id: '19',
      title: 'Get-Process -IncludeUserName',
      description: 'Shows username running each process (PowerShell 7)',
      syntax: 'Get-Process [-IncludeUserName] [-IncludePath] [-IncludeCommandLine]',
      examples: [
        'Get-Process -IncludeUserName',
        'Get-Process -IncludeUserName -IncludePath',
        'Get-Process -IncludeUserName -IncludeCommandLine',
        'Get-Process -IncludeUserName | Where-Object { $_.UserName -eq "Administrator" }'
      ],
      category: 'PowerShell 7',
      difficulty: 'Intermediate',
      tags: ['processes', 'security', 'usernames']
    },
    {
      id: '20',
      title: '-PipelineVariable',
      description: 'Stores pipeline input in a variable for access in subsequent cmdlets (PowerShell 7)',
      syntax: 'Get-Process | Where-Object -PipelineVariable <VariableName> { <Condition> }',
      examples: [
        'Get-Process | Where-Object -PipelineVariable proc { $proc.CPU -gt 100 }',
        'Get-Process | Select-Object -PipelineVariable sel { $sel.Name }',
        'Get-ChildItem | ForEach-Object -PipelineVariable item { $item.FullName }',
        'Get-Service | Where-Object -PipelineVariable svc { $svc.Status -eq "Running" }'
      ],
      category: 'PowerShell 7',
      difficulty: 'Advanced',
      tags: ['pipeline', 'variables', 'advanced']
    },
    {
      id: '21',
      title: 'Ternary Operator ? :',
      description: 'Conditional operator for inline if-else logic (PowerShell 7)',
      syntax: '$result = $condition ? $trueValue : $falseValue',
      examples: [
        '$result = ($number % 2 -eq 0) ? "Even" : "Odd"',
        '$status = ($process.Status -eq "Running") ? "Active" : "Inactive"',
        '$message = ($user.IsAdmin) ? "Admin User" : "Regular User"',
        '$color = ($value -gt 100) ? "Red" : "Green"'
      ],
      category: 'PowerShell 7',
      difficulty: 'Intermediate',
      tags: ['operators', 'conditionals', 'syntax']
    },
    {
      id: '22',
      title: 'Null-Conditional Operator ?.',
      description: 'Safely accesses properties that might be null (PowerShell 7)',
      syntax: '$result = $object?.Property?.Method()',
      examples: [
        '$result = $object?.Property',
        '$value = $config?.Database?.ConnectionString',
        '$name = $user?.Profile?.DisplayName',
        '$count = $array?.Count'
      ],
      category: 'PowerShell 7',
      difficulty: 'Intermediate',
      tags: ['null-conditional', 'safe-access', 'operators']
    },
    {
      id: '23',
      title: '$PSDefaultParameterValues',
      description: 'Sets default parameter values for cmdlets and functions (PowerShell 7)',
      syntax: '$PSDefaultParameterValues["Cmdlet:Parameter"] = "Value"',
      examples: [
        '$PSDefaultParameterValues["Get-Process:Name"] = "notepad"',
        '$PSDefaultParameterValues["Get-ChildItem:Recurse"] = $true',
        '$PSDefaultParameterValues["Write-Host:ForegroundColor"] = "Green"',
        '$PSDefaultParameterValues["*:Verbose"] = $true'
      ],
      category: 'PowerShell 7',
      difficulty: 'Advanced',
      tags: ['parameters', 'defaults', 'configuration']
    },
    {
      id: '24',
      title: '$PSNativeCommandUseErrorActionPreference',
      description: 'Controls error handling for native commands (PowerShell 7)',
      syntax: '$PSNativeCommandUseErrorActionPreference = $true',
      examples: [
        '$PSNativeCommandUseErrorActionPreference = $true',
        'git status  # Errors now caught by PowerShell',
        'npm install  # Errors handled by PowerShell error system',
        'docker ps  # Native command errors integrated'
      ],
      category: 'PowerShell 7',
      difficulty: 'Advanced',
      tags: ['native-commands', 'error-handling', 'preferences']
    },
    {
      id: '25',
      title: 'Parallel Pipeline Operator |&',
      description: 'Runs pipeline operations in parallel (PowerShell 7)',
      syntax: 'Get-Process |& ForEach-Object { <ScriptBlock> }',
      examples: [
        'Get-Process |& ForEach-Object { $_.CPU }',
        '$files |& ForEach-Object { Get-Content $_ }',
        '1..10 |& ForEach-Object { $_ * 2 }',
        'Get-Service |& ForEach-Object { $_.Status }'
      ],
      category: 'PowerShell 7',
      difficulty: 'Advanced',
      tags: ['parallel', 'pipeline', 'performance']
    }
  ];

  const categories = ['all', 'Help', 'File System', 'Output', 'Process Management', 'Filtering', 'Iteration', 'Selection', 'Sorting', 'Statistics', 'Remoting', 'Jobs', 'Events', 'Objects', 'Types', 'PowerShell 7'];
  const difficulties = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredItems = referenceItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || item.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

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
      'Help': '#2196F3',
      'File System': '#FF5722',
      'Output': '#9C27B0',
      'Process Management': '#607D8B',
      'Filtering': '#795548',
      'Iteration': '#3F51B5',
      'Selection': '#E91E63',
      'Sorting': '#FF9800',
      'Statistics': '#4CAF50',
      'Remoting': '#F44336',
      'Jobs': '#9C27B0',
      'Events': '#FF5722',
      'Objects': '#607D8B',
      'Types': '#795548'
    };
    return colors[category] || '#757575';
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.header}
      >
        <Text style={styles.title}>PowerShell Reference</Text>
        <Text style={styles.subtitle}>Quick lookup for commands and concepts</Text>
      </LinearGradient>

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Icon name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search commands, concepts, or tags..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="clear" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Category:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.filterButton,
                    selectedCategory === category && styles.filterButtonActive,
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      selectedCategory === category && styles.filterButtonTextActive,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </ScrollView>

        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Difficulty:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {difficulties.map((difficulty) => (
              <TouchableOpacity
                key={difficulty}
                style={[
                  styles.filterButton,
                  selectedDifficulty === difficulty && styles.filterButtonActive,
                ]}
                onPress={() => setSelectedDifficulty(difficulty)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    selectedDifficulty === difficulty && styles.filterButtonTextActive,
                  ]}
                >
                  {difficulty}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {filteredItems.map((item, index) => (
          <Animatable.View
            key={item.id}
            animation="fadeInUp"
            delay={index * 100}
            style={styles.referenceCard}
          >
            <TouchableOpacity
              style={styles.cardHeader}
              onPress={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
            >
              <View style={styles.cardTitleContainer}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <View style={styles.cardBadges}>
                  <View
                    style={[
                      styles.categoryBadge,
                      { backgroundColor: getCategoryColor(item.category) },
                    ]}
                  >
                    <Text style={styles.badgeText}>{item.category}</Text>
                  </View>
                  <View
                    style={[
                      styles.difficultyBadge,
                      { backgroundColor: getDifficultyColor(item.difficulty) },
                    ]}
                  >
                    <Text style={styles.badgeText}>{item.difficulty}</Text>
                  </View>
                </View>
              </View>
              <Icon
                name={expandedItem === item.id ? 'expand-less' : 'expand-more'}
                size={24}
                color="#666"
              />
            </TouchableOpacity>

            <Text style={styles.cardDescription}>{item.description}</Text>

            {expandedItem === item.id && (
              <Animatable.View animation="fadeIn" style={styles.expandedContent}>
                <View style={styles.syntaxContainer}>
                  <Text style={styles.syntaxTitle}>Syntax:</Text>
                  <View style={styles.syntaxBox}>
                    <Text style={styles.syntaxText}>{item.syntax}</Text>
                  </View>
                </View>

                <View style={styles.examplesContainer}>
                  <Text style={styles.examplesTitle}>Examples:</Text>
                  {item.examples.map((example, exampleIndex) => (
                    <View key={exampleIndex} style={styles.exampleBox}>
                      <Text style={styles.exampleText}>{example}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.tagsContainer}>
                  <Text style={styles.tagsTitle}>Tags:</Text>
                  <View style={styles.tagsList}>
                    {item.tags.map((tag, tagIndex) => (
                      <View key={tagIndex} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </Animatable.View>
            )}
          </Animatable.View>
        ))}

        {filteredItems.length === 0 && (
          <View style={styles.noResultsContainer}>
            <Icon name="search-off" size={48} color="#ccc" />
            <Text style={styles.noResultsText}>No results found</Text>
            <Text style={styles.noResultsSubtext}>
              Try adjusting your search terms or filters
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
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
    fontSize: 28,
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
  searchContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filtersContainer: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterSection: {
    marginBottom: 10,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  filterButtonActive: {
    backgroundColor: '#667eea',
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  referenceCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  cardBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  expandedContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  syntaxContainer: {
    marginBottom: 15,
  },
  syntaxTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  syntaxBox: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
  },
  syntaxText: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#333',
    lineHeight: 20,
  },
  examplesContainer: {
    marginBottom: 15,
  },
  examplesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  exampleBox: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },
  exampleText: {
    fontSize: 13,
    fontFamily: 'monospace',
    color: '#333',
    lineHeight: 18,
  },
  tagsContainer: {
    marginBottom: 10,
  },
  tagsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '500',
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 15,
    marginBottom: 5,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default ReferenceScreen;
