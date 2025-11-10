'use client';

import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import { Link } from 'expo-router'; // Link do Expo Router
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type FormType = {
  idForm: string;
  title: string;
  description?: string;
  updatedAt: string;
  responses: number;
};

// Dados para os ícones de Acesso Rápido
const quickAccessItems = [
  { icon: 'plus', label: 'Queixas' },
  { icon: 'calendar-alt', label: 'Agendar' },
  { icon: 'clock', label: 'Retorno' },
  { icon: 'pills', label: 'Remédios' },
];

const HomeScreen = () => {
  const [forms, setForms] = useState<FormType[]>([]);
  const [loadingForms, setLoadingForms] = useState(true);

  useEffect(() => {
    axios
      .get<FormType[]>('http://192.168.0.103:4000/forms')
      .then(res => setForms(res.data))
      .catch(err => {
        console.error('Erro ao buscar formulários:', err);
        setForms([]);
      })
      .finally(() => setLoadingForms(false));
  }, []);

  return (
    <View className="bg-red-700 flex-1">
      <SafeAreaView className="flex-1 bg-gray-50 rounded-s-3xl">
        <StatusBar barStyle="light-content" backgroundColor="#b91c1c" />
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
          <View className="px-5">

            {/* Card: Acesso Rápido */}
            <View>
              <Text className="text-lg font-bold text-gray-800 mb-4">Acesso Rápido</Text>
              <View className="flex-row justify-around">
                {quickAccessItems.map(item => (
                  <TouchableOpacity key={item.label} className="items-center">
                    <View className="bg-red-50 w-16 h-16 rounded-full justify-center items-center relative">
                      <FontAwesome5 name={item.icon as any} size={24} color="#c53030" />
                      <View className="absolute top-0">
                        <Text className="text-xs text-red-600 font-bold">Em breve</Text>
                      </View>
                    </View>
                    <Text className="mt-2 text-sm text-gray-600 font-medium">{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Seção: Formulários */}
            <View className="mt-8">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-lg font-bold text-gray-800">Formulários</Text>
                <TouchableOpacity>
                  <Text className="text-red-700 font-semibold">Ver todos</Text>
                </TouchableOpacity>
              </View>

              {loadingForms ? (
                <ActivityIndicator size="large" color="#b91c1c" style={{ marginTop: 20 }} />
              ) : forms.length === 0 ? (
                <Text>Nenhum formulário encontrado.</Text>
              ) : (
                forms.map(form => (
                  <View key={form.idForm} className="bg-white rounded-xl p-5 shadow-md mb-4">
                    <View className="flex-row justify-between items-start">
                      <Text className="text-lg font-bold text-gray-900 flex-1 pr-2">
                        {form.title}
                      </Text>
                      <Text className="text-md text-gray-500">
                        {new Date(form.updatedAt).toLocaleDateString()}
                      </Text>
                    </View>
                    {form.description ? (
                      <Text className="text-gray-600 mt-2">{form.description}</Text>
                    ) : null}

                        <Link href={`/home/forms/${form.idForm}` as any} asChild>
                        <TouchableOpacity className="bg-red-700 rounded-lg py-3 mt-4">
                       <Text className="text-white text-center font-bold">Iniciar</Text>
                       </TouchableOpacity>
                        </Link>


 
                  </View>
                ))
              )}
            </View>

            {/* Botão: Agendar uma consulta */}
            <TouchableOpacity className="bg-gray-200 rounded-2xl p-4 mt-6 flex-row items-center justify-center shadow-sm">
              <FontAwesome5 name="calendar-alt" size={22} color="#4A5568" />
              <Text className="text-gray-700 font-bold text-base ml-3">Agendar uma consulta</Text>
            </TouchableOpacity>

            {/* Seção: Acompanhamentos */}
            <View className="mt-8">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-lg font-bold text-gray-800">Acompanhamentos</Text>
                <TouchableOpacity>
                  <Text className="text-red-700 font-semibold">Ver todos</Text>
                </TouchableOpacity>
              </View>
              <View className="bg-white rounded-2xl p-4 shadow-md h-32">
                {/* Conteúdo dos acompanhamentos viria aqui */}
              </View>
            </View>

          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default HomeScreen;
