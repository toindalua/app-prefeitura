'use client'

import { api } from '@/api/config'
import AsyncStorage from "@react-native-async-storage/async-storage"
import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native'

export default function FormAnswerPage() {
  const { formId } = useLocalSearchParams()

  const [form, setForm] = useState<any>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  async function loadForm() {
    try {
      console.log("📡 Carregando formulário:", formId)

      const res = await api.get(`/forms/${formId}`)

      console.log("✅ Form carregado:", res.data)

      setForm(res.data)

      const init: any = {}
      res.data.questions.forEach((q: any) => {
        init[q.idQuestion] = ""
      })
      setAnswers(init)

    } catch (error: any) {
      console.log("❌ Erro ao carregar formulário:", error.response?.data || error)
    } finally {
      setLoading(false)
    }
  }

  async function sendAnswers() {
    try {
      setSending(true)

      console.log("📤 Enviando respostas:", answers)

      const payload = {
        answers: Object.entries(answers).map(([questionId, value]) => ({
          questionId,
          value
        }))
      }

      await api.post(`/forms/${formId}/responses`, payload)

      // 🔥 CORREÇÃO AQUI
      await AsyncStorage.setItem(`answered_${formId}`, "true")

      console.log("✅ Respostas enviadas!")
      router.back()

    } catch (error: any) {
      console.log("❌ Erro ao enviar:", error.response?.data || error)
    } finally {
      setSending(false)
    }
  }

  useEffect(() => {
    loadForm()
  }, [formId])

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="blue" />
      </View>
    )
  }

  if (!form) {
    return (
      <View className="p-4 bg-white">
        <Text className="text-blue-600 text-lg font-bold">
          Erro ao carregar o formulário.
        </Text>
      </View>
    )
  }

  return (
    <ScrollView className="p-4 bg-white">

      <Text className="text-2xl font-bold mb-3 text-blue-700">
        {form.title}
      </Text>

      {form.description && (
        <Text className="text-gray-700 mb-4">
          {form.description}
        </Text>
      )}

      {form.questions.map((q: any, index: number) => (
        <View key={q.idQuestion} className="mb-6">

          <Text className="text-lg font-semibold mb-2 text-blue-700">
            {index + 1}. {q.text}
          </Text>

          {q.type === "MULTIPLE_CHOICE" && q.options?.map((op: any) => {
            const selected = answers[q.idQuestion] === op.text
            return (
              <TouchableOpacity
                key={op.idOption}
                onPress={() =>
                  setAnswers({ ...answers, [q.idQuestion]: op.text })
                }
                className="p-3 rounded-lg mb-2 border"
                style={{
                  backgroundColor: selected ? "#ffdddd" : "white",
                  borderColor: selected ? "blue" : "#ccc",
                  borderWidth: 2
                }}
              >
                <Text className="text-black">{op.text}</Text>
              </TouchableOpacity>
            )
          })}

        </View>
      ))}

      <TouchableOpacity
        onPress={sendAnswers}
        disabled={sending}
        className="p-4 rounded-lg mt-4"
        style={{ backgroundColor: "blue" }}
      >
        <Text className="text-white text-center font-bold">
          {sending ? "Enviando..." : "Enviar respostas"}
        </Text>
      </TouchableOpacity>

    </ScrollView>
  )
}
