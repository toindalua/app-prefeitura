import AsyncStorage from "@react-native-async-storage/async-storage"
import React, { createContext, useContext, useEffect, useState } from "react"
import { useAlert } from "./use-alert"

type User = {
  idUser: string
  email: string
  name: string
  active: boolean
  createdAt: string
  updatedAt: string
  roleId: string | null
}

type AuthContextType = {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

//console.log("[AuthContext] inicializado")

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  //console.log("[AuthProvider] renderizado")

  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const { showAlert } = useAlert()

  // Log de mudanças de estado
  useEffect(() => {
    //console.log("[STATE] user:", user)
  }, [user])

  useEffect(() => {
    //console.log("[STATE] token:", token)
  }, [token])

  useEffect(() => {
    //console.log("[STATE] loading:", loading)
  }, [loading])

  // --- 🔄 Verifica sessão salva ---
  useEffect(() => {
    const loadSession = async () => {
      //console.log("[loadSession] Iniciando...")

      try {
        const savedToken = await AsyncStorage.getItem("authToken")
        const savedUser = await AsyncStorage.getItem("authUser")
        //console.log("[loadSession] Token salvo:", savedToken)
       // console.log("[loadSession] User salvo:", savedUser)

        if (savedToken && savedUser) {
         // console.log("[loadSession] Validando token...")
          const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/validate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: savedToken }),
          })
          //console.log("[loadSession] Resposta de validação:", response.status)

          if (response.ok) {
            const data = await response.json()
            //console.log("[loadSession] Dados da validação:", data)
            if (data.valid) {
              //console.log("[loadSession] Token válido, restaurando sessão.")
              setToken(savedToken)
              setUser(JSON.parse(savedUser))
            } else {
              //console.warn("[loadSession] Token inválido, limpando sessão.")
              await AsyncStorage.multiRemove(["authToken", "authUser"])
              setToken(null)
              setUser(null)
            }
          } else {
            //console.warn("[loadSession] Erro HTTP ao validar token:", response.status)
            await AsyncStorage.multiRemove(["authToken", "authUser"])
            setToken(null)
            setUser(null)
          }
        } else {
          //console.log("[loadSession] Nenhum token salvo encontrado.")
        }
      } catch (err) {
        //console.error("[loadSession] Erro geral:", err)
        await AsyncStorage.multiRemove(["authToken", "authUser"])
        setToken(null)
        setUser(null)
      } finally {
        //console.log("[loadSession] Finalizado")
        setLoading(false)
      }
    }

    loadSession()
  }, [])

  // --- 🔐 LOGIN ---
  const login = async (email: string, password: string) => {
   // console.log("[login] Iniciando login com:", email)

    try {
      //console.log("[login] Enviando requisição para:", `${process.env.EXPO_PUBLIC_API_URL}/auth/login`)

      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      //console.log("[login] Resposta HTTP:", response.status)

      if (response.ok) {
        const data = await response.json()
       // console.log("[login] Dados recebidos:", data)

        if (!data.access_token || !data.user) {
        //  console.warn("[login] Resposta incompleta do servidor:", data)
          showAlert("Erro: resposta inválida do servidor", "error")
          return
        }

        await AsyncStorage.setItem("authToken", data.access_token)
        await AsyncStorage.setItem("authUser", JSON.stringify(data.user))
       // console.log("[login] Dados salvos no AsyncStorage")

        setToken(data.access_token)
        setUser(data.user)
       // console.log("[login] Estado atualizado com usuário logado")

        showAlert(`Bem-vindo(a), ${data.user.name}`, "success")
      } else {
       // console.warn("[login] Falha no login. Status:", response.status)
        const errText = await response.text()
      //  console.log("[login] Corpo do erro:", errText)
        showAlert("Email ou senha inválidos", "error")
      }
    } catch (err) {
     // console.error("[login] Erro de conexão:", err)
      showAlert("Erro ao conectar ao servidor", "error")
    }
  }

  // --- 🚪 LOGOUT ---
  const logout = async () => {
  //  console.log("[logout] Saindo...")
    await AsyncStorage.multiRemove(["authToken", "authUser"])
    setToken(null)
    setUser(null)
    showAlert("Logout realizado com sucesso", "info")
  }

 // console.log("[AuthProvider] Render finalizado com valores:", { user, token, loading })

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
