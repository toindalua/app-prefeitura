'use client'

import { api } from '@/api/config';
import { useAuth } from '@/hooks/use-auth';
import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type FormType = {
  idForm: string;
  title: string;
  description?: string;
  updatedAt: string;
};

const quickAccessItems = [
  { icon: 'plus', label: 'Queixas' },
  { icon: 'calendar-alt', label: 'Agendar' },
  { icon: 'clock', label: 'Retorno' },
  { icon: 'pills', label: 'Remédios' },
];

export default function HomeScreen() {
  const [forms, setForms] = useState<FormType[]>([]);
  const [loadingForms, setLoadingForms] = useState(true);
  const [answered, setAnswered] = useState<Record<string, boolean>>({});
  const { token } = useAuth();

  // 🔵 Carrega o status "respondido" salvo no AsyncStorage
  async function loadAnsweredStatus(formList: FormType[]) {
    const status: Record<string, boolean> = {};

    for (const f of formList) {
      const key = `answered_${f.idForm}`;
      const saved = await AsyncStorage.getItem(key);
      status[f.idForm] = saved === 'true';
    }

    setAnswered(status);
  }

  // 🔵 Busca formulários do backend
  async function fetchForms() {
    if (!token) return;

    setLoadingForms(true);
    try {
      const res = await api.get('/forms/user/my');

      const data = Array.isArray(res.data.fromAssigned) ? res.data.fromAssigned : [];

      const mappedForms: FormType[] = data.map((f: any) => ({
        idForm: f.idForm,
        title: f.title,
        description: f.description,
        updatedAt: f.updatedAt || f.createdAt,
      }));

      setForms(mappedForms);

      await loadAnsweredStatus(mappedForms);
    } catch (err) {
      console.error('Erro ao buscar formulários:', err);
      setForms([]);
    } finally {
      setLoadingForms(false);
    }
  }

  // 🔵 Carrega formulários ao abrir o app
  useEffect(() => {
    fetchForms();
  }, [token]);

  // 🔥 Atualiza ao voltar para HOME (após responder)
  useFocusEffect(
    useCallback(() => {
      if (forms.length > 0) {
        loadAnsweredStatus(forms);
      }
    }, [forms])
  );

  return (
    <View className="bg-blue-400 flex-1">
      <SafeAreaView className="flex-1 bg-gray-50 rounded-s-3xl">
        <StatusBar barStyle="light-content" backgroundColor="rgba(33, 143, 216, 1)" />
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
          <View className="px-5">

            {/* Acesso rápido */}
            <View>
              <Text className="text-lg font-bold text-gray-800 mb-4">Acesso Rápido</Text>
              <View className="flex-row justify-around">
                {quickAccessItems.map(item => (
                  <TouchableOpacity key={item.label} className="items-center">
                    <View className="bg-blue-50 w-16 h-16 rounded-full justify-center items-center relative">
                      <FontAwesome5 name={item.icon as any} size={24} color="rgba(33, 143, 216, 1)" />
                      <View className="absolute top-0">
                        <Text className="text-xs text-black-600 font-bold">Em breve</Text>
                      </View>
                    </View>
                    <Text className="mt-2 text-sm text-gray-600 font-medium">{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Lista */}
            <View className="mt-8">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-lg font-bold text-gray-800">Formulários</Text>
              </View>

              {loadingForms ? (
                <ActivityIndicator size="large" color="rgba(33, 143, 216, 1)" style={{ marginTop: 20 }} />
              ) : forms.length === 0 ? (
                <Text>Nenhum formulário encontrado.</Text>
              ) : (
                forms.map(form => {
                  const alreadyAnswered = answered[form.idForm];

                  return (
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

                      {/* BOTÕES */}
                      {alreadyAnswered ? (
                        <TouchableOpacity
                          disabled
                          className="bg-gray-400 rounded-lg py-3 mt-4"
                        >
                          <Text className="text-white text-center font-bold">Respondido</Text>
                        </TouchableOpacity>
                      ) : (
                        <Link href={`/home/forms/${form.idForm}`} asChild>
                          <TouchableOpacity className="bg-blue-500 rounded-lg py-3 mt-4">
                            <Text className="text-white text-center font-bold">Iniciar</Text>
                          </TouchableOpacity>
                        </Link>
                      )}
                    </View>
                  );
                })
              )}
            </View>

          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
