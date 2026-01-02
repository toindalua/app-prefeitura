'use client'

import { api } from '@/api/config'
import { useLocalSearchParams } from 'expo-router'
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
            const res = await api.get(`/forms/${formId}`)
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

            const payload = {
                answers: Object.entries(answers).map(([questionId, value]) => ({
                    questionId,
                    value
                }))
            }

            await api.post(`/forms/${formId}/responses`, payload)

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
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" />
            </View>
        )
    }

    if (!form) {
        return (
            <View className="p-4">
                <Text className="text-blue-600 text-lg">
                    Erro ao carregar o formulário.
                </Text>
            </View>
        )
    }

    return (
        <ScrollView className="p-4 bg-white">

            {/* TÍTULO */}
            <Text className="text-2xl font-bold mb-3 text-black">
                {form.title}
            </Text>

            {/* DESCRIÇÃO */}
            {form.description && (
                <Text className="text-gray-800 mb-4">
                    {form.description}
                </Text>
            )}

            {/* PERGUNTAS */}
            {form.questions.map((q: any, index: number) => (
                <View key={q.idQuestion} className="mb-6">
                    <Text className="text-lg font-semibold mb-2 text-black">
                        {index + 1}. {q.text}
                    </Text>

                    {/* MULTIPLE CHOICE */}
                    {q.type === "MULTIPLE_CHOICE" && q.options?.map((op: any) => (
                        <TouchableOpacity
                            key={op.idOption}
                            onPress={() =>
                                setAnswers({ ...answers, [q.idQuestion]: op.text })
                            }
                            className="p-3 rounded-lg mb-2"
                            style={{
                                borderWidth: 2,
                                borderColor: "#007bff",
                                backgroundColor:
                                    answers[q.idQuestion] === op.text ? "#cce5ff" : "white"
                            }}
                        >
                            <Text className="text-black">{op.text}</Text>
                        </TouchableOpacity>
                    ))}

                </View>
            ))}

            {/* BOTÃO ENVIAR */}
            <TouchableOpacity
                onPress={sendAnswers}
                disabled={sending}
                className="p-4 rounded-lg mt-4"
                style={{
                    backgroundColor: "#007bff"
                }}
            >
                <Text className="text-white text-center font-bold">
                    {sending ? "Enviando..." : "Enviar respostas"}
                </Text>
            </TouchableOpacity>

        </ScrollView>
    )
}
