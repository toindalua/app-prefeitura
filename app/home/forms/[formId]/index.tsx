'use client';

import axios from 'axios';
import { useLocalSearchParams } from 'expo-router'; // ✅ Corrigido
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

type QuestionOption = {
  idOption: string;
  text: string;
};

type Question = {
  idQuestion: string;
  text: string;
  type: 'MULTIPLE_CHOICE' | 'CHECKBOXES' | 'SHORT_TEXT' | 'PARAGRAPH';
  options?: QuestionOption[];
};

type FormType = {
  idForm: string;
  title: string;
  description?: string;
  questions: Question[];
};

export default function FormPage() {
  const { formId } = useLocalSearchParams<{ formId: string }>(); // ✅ Corrigido
  const [form, setForm] = useState<FormType | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<{ [key: string]: string | string[] }>({});

  useEffect(() => {
    if (!formId) return;
    axios.get(`http://192.168.0.103:4000/forms/${formId}`)
      .then(res => setForm(res.data))
      .catch(() => setForm(null))
      .finally(() => setLoading(false));
  }, [formId]);

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleCheckbox = (questionId: string, value: string) => {
    setAnswers(prev => {
      const current = Array.isArray(prev[questionId]) ? prev[questionId] : [];
      const newValues = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [questionId]: newValues };
    });
  };

  const handleSubmit = () => {
    console.log('Respostas enviadas:', answers);
    alert('Respostas registradas localmente (envio real pode ser implementado depois).');
  };

  if (loading) return <ActivityIndicator size="large" color="#b91c1c" />;

  if (!form) return <Text>Formulário não encontrado</Text>;

  return (
    <ScrollView className="p-5" keyboardShouldPersistTaps="handled"> {/* ✅ Corrigido */}
      <Text className="text-2xl font-bold mb-4">{form.title}</Text>

      {form.questions.map(q => (
        <View key={q.idQuestion} className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm">
          <Text className="font-medium mb-2">{q.text}</Text>

          {/* Múltipla escolha */}
          {q.type === 'MULTIPLE_CHOICE' && q.options?.map(opt => (
            <TouchableOpacity
              key={opt.idOption}
              onPress={() => handleAnswer(q.idQuestion, opt.idOption)}
              className="flex-row items-center mb-1"
            >
              <Text>
                {answers[q.idQuestion] === opt.idOption ? '🔘' : '⚪'} {opt.text}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Checkboxes */}
          {q.type === 'CHECKBOXES' && q.options?.map(opt => (
            <TouchableOpacity
              key={opt.idOption}
              onPress={() => handleCheckbox(q.idQuestion, opt.idOption)}
              className="flex-row items-center mb-1"
            >
              <Text>
                {Array.isArray(answers[q.idQuestion]) &&
                answers[q.idQuestion].includes(opt.idOption)
                  ? '☑️'
                  : '⬜'} {opt.text}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Resposta curta */}
          {q.type === 'SHORT_TEXT' && (
            <TextInput
              className="border border-gray-300 rounded p-2 mt-2"
              placeholder="Digite sua resposta..."
              value={answers[q.idQuestion] as string || ''}
              onChangeText={text => handleAnswer(q.idQuestion, text)}
            />
          )}

          {/* Parágrafo */}
          {q.type === 'PARAGRAPH' && (
            <TextInput
              className="border border-gray-300 rounded p-2 mt-2 h-24 text-top"
              placeholder="Digite sua resposta detalhada..."
              value={answers[q.idQuestion] as string || ''}
              multiline
              onChangeText={text => handleAnswer(q.idQuestion, text)}
            />
          )}
        </View>
      ))}

      <TouchableOpacity
        onPress={handleSubmit}
        className="bg-red-700 rounded-lg py-3 mt-4"
      >
        <Text className="text-white text-center font-bold">Enviar respostas</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
