'use client';

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';

export default function FormQuestionsPage({ params }: { params: { form: string } }) {
  const { form } = params; // pega o id do formulário da URL
  const [formData, setFormData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`https://sua-api.com/forms/${form}`) // substituir pela URL real
      .then(res => setFormData(res.data))
      .catch(() => setFormData(null))
      .finally(() => setLoading(false));
  }, [form]);

  if (loading) return <ActivityIndicator size="large" color="#b91c1c" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />;

  if (!formData) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text>Formulário não encontrado</Text>
    </View>
  );

  return (
    <ScrollView className="p-5">
      <Text className="text-2xl font-bold text-gray-800 mb-6">{formData.title}</Text>
      {formData.questions.map((q: any) => (
        <View key={q.idQuestion} className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm">
          <Text className="text-gray-800 font-medium">{q.text}</Text>
          {q.type === 'MULTIPLE_CHOICE' && q.options?.length ? (
            <View className="mt-2">
              {q.options.map((opt: any) => (
                <Text key={opt.idOption} className="text-gray-700 ml-2">• {opt.text}</Text>
              ))}
            </View>
          ) : null}
          {q.type === 'CHECKBOXES' && q.options?.length ? (
            <View className="mt-2">
              {q.options.map((opt: any) => (
                <Text key={opt.idOption} className="text-gray-700 ml-2">☐ {opt.text}</Text>
              ))}
            </View>
          ) : null}
        </View>
      ))}
    </ScrollView>
  );
}
