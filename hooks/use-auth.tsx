import AsyncStorage from "@react-native-async-storage/async-storage"
import React, { createContext, useContext, useEffect, useState } from "react"
import { useAlert } from "./use-alert"

type Form = {
  id: string
  title: string
  date: string
}

type User = {
  idUser: string
  email: string
  name: string
  cpf?: string
  active: boolean
  createdAt: string
  updatedAt: string
  roleId: string | null
  forms?: Form[]
}

type AuthContextType = {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const { showAlert } = useAlert()

  // -------------------------------------------------
  // 🔄 Carrega sessão salva
  // -------------------------------------------------
  useEffect(() => {
    const loadSession = async () => {
      try {
        const savedToken = await AsyncStorage.getItem("authToken")
        const savedUser = await AsyncStorage.getItem("authUser")

        if (savedToken && savedUser) {
          const response = await fetch(
            `${process.env.EXPO_PUBLIC_API_URL}/auth/validate`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ token: savedToken }),
            }
          )

          if (response.ok) {
            const data = await response.json()

            if (data.valid) {
              const parsed = JSON.parse(savedUser)

              setToken(savedToken)
              setUser({
                ...parsed,
                cpf: parsed.cpf ?? null,
                forms: parsed.forms ?? [],
              })
            } else {
              await AsyncStorage.multiRemove(["authToken", "authUser"])
              setToken(null)
              setUser(null)
            }
          } else {
            await AsyncStorage.multiRemove(["authToken", "authUser"])
          }
        }
      } catch (err) {
        await AsyncStorage.multiRemove(["authToken", "authUser"])
        setToken(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    loadSession()
  }, [])

  // -------------------------------------------------
  // 🔐 LOGIN
  // -------------------------------------------------
  const login = async (email: string, password: string) => {
    try {
      const url = `${process.env.EXPO_PUBLIC_API_URL}/auth/login`

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()

        if (!data.access_token || !data.user) {
          showAlert("Erro: resposta inválida do servidor", "error")
          return
        }

        const normalizedUser: User = {
          ...data.user,
          cpf: data.user.cpf ?? null,
          forms: data.user.forms ?? [],
        }

        await AsyncStorage.setItem("authToken", data.access_token)
        await AsyncStorage.setItem("authUser", JSON.stringify(normalizedUser))

        setToken(data.access_token)
        setUser(normalizedUser)

        showAlert(`Bem-vindo(a), ${normalizedUser.name}`, "success")
      } else {
        showAlert("Email ou senha inválidos", "error")
      }
    } catch (err) {
      showAlert("Erro ao conectar ao servidor", "error")
    }
  }

  // -------------------------------------------------
  // 🚪 LOGOUT
  // -------------------------------------------------
  const logout = async () => {
    await AsyncStorage.multiRemove(["authToken", "authUser"])
    setToken(null)
    setUser(null)
    showAlert("Logout realizado com sucesso", "info")
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
