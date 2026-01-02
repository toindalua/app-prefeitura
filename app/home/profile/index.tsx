'use client';

import { useAuth } from "@/hooks/use-auth";
import { FontAwesome5 } from "@expo/vector-icons";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const { user } = useAuth();

  return (
    <View className="flex-1 bg-blue-400">
      <SafeAreaView className="flex-1 bg-gray-50 rounded-s-3xl">
        <ScrollView contentContainerStyle={{ padding: 20 }}>

          {/* TÍTULO */}
          <Text className="text-3xl font-bold text-gray-900 mb-6">
            Meu Perfil
          </Text>

          {/* CARD DE INFORMAÇÕES */}
          <View className="bg-white rounded-2xl p-5 shadow-md">

            <View className="flex-row items-center mb-4">
              <FontAwesome5 name="user-circle" size={40} color="#218FD8" />
              <Text className="text-2xl font-bold text-gray-800 ml-3">
                {user?.name}
              </Text>
            </View>

            <View className="mt-3">
              {/* EMAIL */}
              <View className="flex-row items-center mb-3">
                <FontAwesome5 name="envelope" size={18} color="#218FD8" />
                <Text className="ml-3 text-gray-700 text-base">
                  {user?.email}
                </Text>
              </View>

              {/* CPF */}
              {user?.cpf && (
                <View className="flex-row items-center mb-3">
                  <FontAwesome5 name="id-card" size={18} color="#218FD8" />
                  <Text className="ml-3 text-gray-700 text-base">
                    {user.cpf}
                  </Text>
                </View>
              )}

              {/* STATUS ATIVO */}
              <View className="flex-row items-center mb-3">
                <FontAwesome5 name="check-circle" size={18} color="#218FD8" />
                <Text className="ml-3 text-gray-700 text-base">
                  Conta ativa: {user?.active ? "Sim" : "Não"}
                </Text>
              </View>

              {/* ID DO USUÁRIO */}
              <View className="flex-row items-center mb-1">
                <FontAwesome5 name="fingerprint" size={18} color="#218FD8" />
                <Text className="ml-3 text-gray-700 text-base">
                  ID: {user?.idUser}
                </Text>
              </View>
            </View>

          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
