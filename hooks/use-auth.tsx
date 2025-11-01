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

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const { showAlert } = useAlert()

  useEffect(() => {
    // console.log("User state changed:", user);
    // console.log("Token state changed:", token);
    // console.log("Loading state changed:", loading);
  }, [user, token, loading]);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const savedToken = await AsyncStorage.getItem("authToken")
        const savedUser = await AsyncStorage.getItem("authUser")

        if (savedToken && savedUser) {
          const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/validate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: savedToken }),
          })

          if (response.ok) {
            const data = await response.json()
            if (data.valid) {
              setToken(savedToken)
              setUser(JSON.parse(savedUser))
            } else {
              await AsyncStorage.multiRemove(["authToken", "authUser"])
              setToken(null)
              setUser(null)
            }
          } else {
            await AsyncStorage.multiRemove(["authToken", "authUser"])
            setToken(null)
            setUser(null)
          }
        }
      } catch (err) {
        console.error("Erro validando token:", err)
        await AsyncStorage.multiRemove(["authToken", "authUser"])
        setToken(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    loadSession()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        setToken(data.access_token)
        setUser(data.user)
        await AsyncStorage.setItem("authToken", data.access_token)
        await AsyncStorage.setItem("authUser", JSON.stringify(data.user))
        showAlert(`Bem-vindo(a), ${data.user.name}`, "success")
      } else {
        showAlert("Email ou senha inválidos", "error")
      }
    } catch (err) {
      showAlert("Erro ao conectar ao servidor", "error")
    }
  }

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
