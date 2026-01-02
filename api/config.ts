import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"

// ⚙️ Cria instância principal do Axios
export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL, // vem do .env
  timeout: 10000,
})

// 🧠 Intercepta requisições para adicionar o token automaticamente
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("authToken")

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 🔁 Intercepta respostas para tratar expiração do token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn("Token expirado ou inválido — é preciso fazer login novamente.")
      // aqui você pode, futuramente, chamar o refresh token ou deslogar o usuário
    }
    return Promise.reject(error)
  }
)
