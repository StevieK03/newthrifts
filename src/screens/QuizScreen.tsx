import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';
import Progress from 'react-native-progress';

const { width } = Dimensions.get('window');

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  codeExample?: string;
}

interface QuizScreenProps {
  navigation: any;
}

const QuizScreen: React.FC<QuizScreenProps> = ({ navigation }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizMode, setQuizMode] = useState<'practice' | 'timed' | 'challenge'>('practice');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes for timed mode
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);

  const allQuestions: Question[] = [
    // Beginner Questions
    {
      id: '1',
      question: 'What is the correct way to create a variable in PowerShell?',
      options: [
        'var name = "John"',
        '$name = "John"',
        'let name = "John"',
        'const name = "John"'
      ],
      correctAnswer: 1,
      explanation: 'PowerShell uses $ prefix for variables. The correct syntax is $name = "John".',
      difficulty: 'Beginner',
      category: 'Variables',
    },
    {
      id: '2',
      question: 'Which cmdlet is used to get help information in PowerShell?',
      options: [
        'Get-Help',
        'Help',
        'Show-Help',
        'Display-Help'
      ],
      correctAnswer: 0,
      explanation: 'Get-Help is the PowerShell cmdlet for displaying help information about commands and concepts.',
      difficulty: 'Beginner',
      category: 'Help System',
    },
    {
      id: '3',
      question: 'What does the pipeline operator (|) do in PowerShell?',
      options: [
        'Performs mathematical operations',
        'Passes output from one cmdlet to another',
        'Creates conditional statements',
        'Defines function parameters'
      ],
      correctAnswer: 1,
      explanation: 'The pipeline operator passes the output of one cmdlet as input to the next cmdlet in the pipeline.',
      difficulty: 'Beginner',
      category: 'Pipeline',
    },
    {
      id: '4',
      question: 'Which of the following is NOT a PowerShell alias?',
      options: [
        'dir',
        'ls',
        'cd',
        'pwd'
      ],
      correctAnswer: 3,
      explanation: 'pwd is not a PowerShell alias. The correct PowerShell cmdlet for current directory is Get-Location.',
      difficulty: 'Beginner',
      category: 'Aliases',
    },
    {
      id: '5',
      question: 'What is the purpose of the -WhatIf parameter?',
      options: [
        'Shows what would happen without actually executing',
        'Executes the command in verbose mode',
        'Prompts for confirmation before execution',
        'Shows detailed error information'
      ],
      correctAnswer: 0,
      explanation: 'The -WhatIf parameter shows what would happen if the command were executed, without actually performing the action.',
      difficulty: 'Beginner',
      category: 'Parameters',
    },
    // Intermediate Questions
    {
      id: '6',
      question: 'How do you create a function with parameters in PowerShell?',
      options: [
        'function Get-Name($param1) { return $param1 }',
        'function Get-Name { param($param1) return $param1 }',
        'function Get-Name($param1) { param($param1) return $param1 }',
        'function Get-Name { $param1 return $param1 }'
      ],
      correctAnswer: 1,
      explanation: 'PowerShell functions use the param() block to define parameters. The correct syntax is: function Get-Name { param($param1) return $param1 }',
      difficulty: 'Intermediate',
      category: 'Functions',
      codeExample: 'function Get-Name {\n    param($param1)\n    return $param1\n}',
    },
    {
      id: '7',
      question: 'What is the difference between -eq and -like operators?',
      options: [
        'No difference, they are the same',
        '-eq is for exact match, -like supports wildcards',
        '-like is for exact match, -eq supports wildcards',
        'Both support wildcards but work differently'
      ],
      correctAnswer: 1,
      explanation: '-eq performs exact equality comparison, while -like supports wildcard patterns with * and ? characters.',
      difficulty: 'Intermediate',
      category: 'Operators',
    },
    {
      id: '8',
      question: 'Which cmdlet is used to create a new PowerShell module?',
      options: [
        'New-Module',
        'Create-Module',
        'Build-Module',
        'Generate-Module'
      ],
      correctAnswer: 0,
      explanation: 'New-Module is used to create a new PowerShell module dynamically in memory.',
      difficulty: 'Intermediate',
      category: 'Modules',
    },
    {
      id: '9',
      question: 'What is the purpose of try-catch-finally in PowerShell?',
      options: [
        'To create loops',
        'To handle errors and exceptions',
        'To define functions',
        'To import modules'
      ],
      correctAnswer: 1,
      explanation: 'try-catch-finally blocks are used for error handling and exception management in PowerShell.',
      difficulty: 'Intermediate',
      category: 'Error Handling',
    },
    {
      id: '10',
      question: 'Which operator is used for pattern matching in PowerShell?',
      options: [
        '-match',
        '-contains',
        '-in',
        '-eq'
      ],
      correctAnswer: 0,
      explanation: '-match is used for regular expression pattern matching in PowerShell.',
      difficulty: 'Intermediate',
      category: 'Operators',
    },
    // Advanced Questions
    {
      id: '11',
      question: 'What is PowerShell DSC (Desired State Configuration)?',
      options: [
        'A debugging tool',
        'A configuration management platform',
        'A performance monitoring tool',
        'A security scanning tool'
      ],
      correctAnswer: 1,
      explanation: 'PowerShell DSC is a management platform that enables configuration as code for IT infrastructure.',
      difficulty: 'Advanced',
      category: 'DSC',
    },
    {
      id: '12',
      question: 'How do you create a custom PowerShell provider?',
      options: [
        'Inherit from CmdletProvider class',
        'Use New-Provider cmdlet',
        'Create a .ps1 file',
        'Use Register-Provider cmdlet'
      ],
      correctAnswer: 0,
      explanation: 'Custom PowerShell providers are created by inheriting from the CmdletProvider base class and implementing required methods.',
      difficulty: 'Advanced',
      category: 'Providers',
    },
    {
      id: '13',
      question: 'What is PowerShell Just Enough Administration (JEA)?',
      options: [
        'A performance optimization tool',
        'A security technology for delegated administration',
        'A debugging framework',
        'A module management system'
      ],
      correctAnswer: 1,
      explanation: 'JEA is a security technology that enables delegated administration with constrained endpoints and limited capabilities.',
      difficulty: 'Advanced',
      category: 'Security',
    },
    {
      id: '14',
      question: 'Which cmdlet is used for PowerShell remoting?',
      options: [
        'Enter-PSSession',
        'Start-RemoteSession',
        'Connect-Remote',
        'Open-RemoteConnection'
      ],
      correctAnswer: 0,
      explanation: 'Enter-PSSession is used to start an interactive remote PowerShell session with another computer.',
      difficulty: 'Advanced',
      category: 'Remoting',
    },
    {
      id: '15',
      question: 'What is the purpose of the -AsJob parameter?',
      options: [
        'To run commands in the background',
        'To create a new job',
        'To schedule commands',
        'To run commands asynchronously'
      ],
      correctAnswer: 3,
      explanation: 'The -AsJob parameter runs commands asynchronously in the background, returning a job object immediately.',
      difficulty: 'Advanced',
      category: 'Jobs',
    },
    // PowerShell 7 Questions
    {
      id: '16',
      question: 'What is the main difference between PowerShell 5.1 and PowerShell 7?',
      options: [
        'PowerShell 7 is faster',
        'PowerShell 7 is cross-platform and built on .NET Core',
        'PowerShell 7 has more cmdlets',
        'PowerShell 7 is only for Windows'
      ],
      correctAnswer: 1,
      explanation: 'PowerShell 7 is the cross-platform successor built on .NET Core/.NET 5+, running on Windows, macOS, and Linux.',
      difficulty: 'Beginner',
      category: 'PowerShell 7',
    },
    {
      id: '17',
      question: 'What is the new ternary operator in PowerShell 7?',
      options: [
        'if-else',
        '? :',
        'switch-case',
        'try-catch'
      ],
      correctAnswer: 1,
      explanation: 'The ternary operator ? : allows conditional expressions: $result = $condition ? "true" : "false"',
      difficulty: 'Intermediate',
      category: 'PowerShell 7',
    },
    {
      id: '18',
      question: 'How do you use the new null-conditional operator in PowerShell 7?',
      options: [
        '$object.Property',
        '$object?.Property',
        '$object::Property',
        '$object->Property'
      ],
      correctAnswer: 1,
      explanation: 'Use ?. to safely access properties: $result = $object?.Property?.Method() - returns null if any part is null.',
      difficulty: 'Intermediate',
      category: 'PowerShell 7',
    },
    {
      id: '19',
      question: 'What is the new ForEach-Object -Parallel parameter in PowerShell 7?',
      options: [
        'Runs scriptblocks in parallel',
        'Runs scriptblocks sequentially',
        'Runs scriptblocks in background',
        'Runs scriptblocks with delays'
      ],
      correctAnswer: 0,
      explanation: 'ForEach-Object -Parallel runs scriptblocks in parallel with configurable concurrency limits for better performance.',
      difficulty: 'Advanced',
      category: 'PowerShell 7',
    },
    {
      id: '20',
      question: 'What is the new Get-Error cmdlet in PowerShell 7?',
      options: [
        'Gets error messages',
        'Displays detailed error information and stack traces',
        'Gets error codes',
        'Gets error counts'
      ],
      correctAnswer: 1,
      explanation: 'Get-Error displays comprehensive error information including stack traces, exception details, and error context.',
      difficulty: 'Intermediate',
      category: 'PowerShell 7',
    },
    {
      id: '21',
      question: 'How do you use the new -PipelineVariable parameter in PowerShell 7?',
      options: [
        'Get-Process -PipelineVariable proc',
        'Get-Process -PipelineVariable $proc',
        'Get-Process -PipelineVariable "proc"',
        'Get-Process -PipelineVariable {proc}'
      ],
      correctAnswer: 0,
      explanation: 'Use -PipelineVariable to store pipeline input in a variable: Get-Process | Where-Object -PipelineVariable proc { $proc.CPU -gt 100 }',
      difficulty: 'Advanced',
      category: 'PowerShell 7',
    },
    {
      id: '22',
      question: 'What is the new ConvertFrom-Json -AsHashtable parameter in PowerShell 7?',
      options: [
        'Converts JSON to PSCustomObject',
        'Converts JSON directly to hashtable for better performance',
        'Converts JSON to array',
        'Converts JSON to string'
      ],
      correctAnswer: 1,
      explanation: 'ConvertFrom-Json -AsHashtable converts JSON directly to hashtable instead of PSCustomObject, providing better performance.',
      difficulty: 'Intermediate',
      category: 'PowerShell 7',
    },
    {
      id: '23',
      question: 'What is the new Get-Process -IncludeUserName parameter in PowerShell 7?',
      options: [
        'Shows process names',
        'Shows the username running each process',
        'Shows process IDs',
        'Shows process paths'
      ],
      correctAnswer: 1,
      explanation: 'Get-Process -IncludeUserName shows the username running each process, useful for security auditing.',
      difficulty: 'Intermediate',
      category: 'PowerShell 7',
    },
    {
      id: '24',
      question: 'What is the new $PSDefaultParameterValues preference variable in PowerShell 7?',
      options: [
        'Sets default parameter values for cmdlets',
        'Sets default parameter values for functions',
        'Sets default parameter values for scripts',
        'All of the above'
      ],
      correctAnswer: 3,
      explanation: '$PSDefaultParameterValues allows setting default parameter values for cmdlets, functions, and scripts.',
      difficulty: 'Advanced',
      category: 'PowerShell 7',
    },
    {
      id: '25',
      question: 'What is the new $PSNativeCommandUseErrorActionPreference in PowerShell 7?',
      options: [
        'Controls error handling for native commands',
        'Controls error handling for PowerShell cmdlets',
        'Controls error handling for functions',
        'Controls error handling for scripts'
      ],
      correctAnswer: 0,
      explanation: 'This preference variable controls error handling for native commands, allowing PowerShell error handling to catch native command errors.',
      difficulty: 'Advanced',
      category: 'PowerShell 7',
    },
  ];

  useEffect(() => {
    setQuestions(allQuestions);
    setFilteredQuestions(allQuestions);
  }, []);

  useEffect(() => {
    if (quizMode === 'timed' && timeLeft > 0 && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (quizMode === 'timed' && timeLeft === 0) {
      finishQuiz();
    }
  }, [timeLeft, quizMode, quizCompleted]);

  const selectAnswer = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const submitAnswer = () => {
    if (selectedAnswer === null) {
      Alert.alert('Please select an answer', 'Choose an option before submitting.');
      return;
    }

    setShowResult(true);
    const currentQuestion = filteredQuestions[currentQuestionIndex];
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setQuizCompleted(true);
    const percentage = Math.round((score / filteredQuestions.length) * 100);
    Alert.alert(
      'Quiz Complete!',
      `Your score: ${score}/${filteredQuestions.length} (${percentage}%)\n\n${
        percentage >= 80 ? 'Excellent work!' : 
        percentage >= 60 ? 'Good job!' : 
        'Keep practicing!'
      }`
    );
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizCompleted(false);
    setTimeLeft(300);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return '#4CAF50';
      case 'Intermediate': return '#FF9800';
      case 'Advanced': return '#F44336';
      default: return '#757575';
    }
  };

  const getAnswerColor = (index: number) => {
    if (!showResult) {
      return selectedAnswer === index ? '#2196F3' : '#f0f0f0';
    }
    
    const currentQuestion = filteredQuestions[currentQuestionIndex];
    if (index === currentQuestion.correctAnswer) {
      return '#4CAF50';
    } else if (index === selectedAnswer && index !== currentQuestion.correctAnswer) {
      return '#F44336';
    }
    return '#f0f0f0';
  };

  const currentQuestion = filteredQuestions[currentQuestionIndex];

  if (quizCompleted) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.completionContainer}
        >
          <Animatable.View animation="bounceIn" style={styles.completionContent}>
            <Icon name="emoji-events" size={80} color="#fff" />
            <Text style={styles.completionTitle}>Quiz Complete!</Text>
            <Text style={styles.completionScore}>
              {score}/{filteredQuestions.length} ({Math.round((score / filteredQuestions.length) * 100)}%)
            </Text>
            <TouchableOpacity style={styles.resetButton} onPress={resetQuiz}>
              <Text style={styles.resetButtonText}>Take Another Quiz</Text>
            </TouchableOpacity>
          </Animatable.View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>PowerShell Quiz</Text>
        <View style={styles.headerInfo}>
          <Text style={styles.questionCounter}>
            Question {currentQuestionIndex + 1} of {filteredQuestions.length}
          </Text>
          {quizMode === 'timed' && (
            <Text style={styles.timer}>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </Text>
          )}
        </View>
        <Progress.Bar
          progress={(currentQuestionIndex + 1) / filteredQuestions.length}
          width={width - 40}
          height={8}
          color="#4CAF50"
          unfilledColor="#E0E0E0"
          borderWidth={0}
        />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.questionContainer}>
          <View style={styles.questionHeader}>
            <Text style={styles.category}>{currentQuestion?.category}</Text>
            <View
              style={[
                styles.difficultyBadge,
                { backgroundColor: getDifficultyColor(currentQuestion?.difficulty || '') },
              ]}
            >
              <Text style={styles.difficultyText}>{currentQuestion?.difficulty}</Text>
            </View>
          </View>
          
          <Text style={styles.questionText}>{currentQuestion?.question}</Text>
          
          {currentQuestion?.codeExample && (
            <View style={styles.codeContainer}>
              <Text style={styles.codeText}>{currentQuestion.codeExample}</Text>
            </View>
          )}
        </View>

        <View style={styles.optionsContainer}>
          {currentQuestion?.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                { backgroundColor: getAnswerColor(index) },
                showResult && index === currentQuestion.correctAnswer && styles.correctAnswer,
                showResult && index === selectedAnswer && index !== currentQuestion.correctAnswer && styles.wrongAnswer,
              ]}
              onPress={() => selectAnswer(index)}
              disabled={showResult}
            >
              <Text style={[
                styles.optionText,
                (selectedAnswer === index || (showResult && index === currentQuestion.correctAnswer)) && styles.optionTextSelected,
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {showResult && (
          <Animatable.View animation="fadeInUp" style={styles.explanationContainer}>
            <Text style={styles.explanationTitle}>Explanation:</Text>
            <Text style={styles.explanationText}>{currentQuestion?.explanation}</Text>
          </Animatable.View>
        )}
      </ScrollView>

      <View style={styles.controls}>
        {!showResult ? (
          <TouchableOpacity
            style={[styles.submitButton, selectedAnswer === null && styles.submitButtonDisabled]}
            onPress={submitAnswer}
            disabled={selectedAnswer === null}
          >
            <Text style={styles.submitButtonText}>Submit Answer</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.nextButton} onPress={nextQuestion}>
            <Text style={styles.nextButtonText}>
              {currentQuestionIndex < filteredQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </Text>
            <Icon name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        )}
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
  questionCounter: {
    fontSize: 16,
    color: '#e0e0e0',
  },
  timer: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  questionContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  category: {
    fontSize: 14,
    fontWeight: '600',
    color: '#667eea',
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
  questionText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    lineHeight: 26,
    marginBottom: 15,
  },
  codeContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
  },
  codeText: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#333',
    lineHeight: 20,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  correctAnswer: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  wrongAnswer: {
    backgroundColor: '#F44336',
    borderColor: '#F44336',
  },
  explanationContainer: {
    backgroundColor: '#e8f5e8',
    borderRadius: 12,
    padding: 15,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 14,
    color: '#2e7d32',
    lineHeight: 20,
  },
  controls: {
    padding: 20,
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  nextButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  completionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completionContent: {
    alignItems: 'center',
    padding: 40,
  },
  completionTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
  },
  completionScore: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 30,
  },
  resetButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default QuizScreen;
