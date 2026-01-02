'use client'

import { useAuth } from '@/hooks/use-auth'
import { FontAwesome5 } from '@expo/vector-icons'
import { router } from 'expo-router'; // ✅ IMPORTANTE
import React, { useState } from 'react'
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

export const HeaderMenu = () => {
  const { logout } = useAuth()
  const [open, setOpen] = useState(false)

  const opacity = React.useRef(new Animated.Value(0)).current
  const translateY = React.useRef(new Animated.Value(-6)).current

  const openMenu = () => {
    setOpen(true)
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 180,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 180,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start()
  }

  const closeMenu = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 140,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -6,
        duration: 140,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => setOpen(false))
  }

  return (
    <>
      {/* Botão que abre o menu */}
      <TouchableOpacity
        onPress={open ? closeMenu : openMenu}
        className="w-10 h-10 bg-white rounded-full justify-center items-center"
      >
        <FontAwesome5 name="bars" size={18} color="#000" />
      </TouchableOpacity>

      {/* Modal que contém o menu */}
      <Modal transparent visible={open} animationType="none">
        {/* fundo escuro */}
        <Pressable style={styles.backdrop} onPress={closeMenu} />

        {/* caixa do menu */}
        <View style={styles.menuWrapper}>
          <Animated.View style={[styles.menu, { opacity, transform: [{ translateY }] }]}>

            {/* 📌 BOTÃO PERFIL */}
            <TouchableOpacity
              onPress={() => {
                closeMenu();
                router.push("/home/profile");   // ✅ ROTA CORRETA
              }}
            >
              <View style={styles.item}>
                <FontAwesome5 name="user-alt" size={16} style={styles.icon} />
                <Text style={styles.text}>Meu Perfil</Text>
              </View>
            </TouchableOpacity>

            {/* CONFIGURAÇÕES */}
            <TouchableOpacity
              onPress={() => {
                console.log("Configurações")
                closeMenu()
              }}
            >
              <View style={styles.item}>
                <FontAwesome5 name="cog" size={16} style={styles.icon} />
                <Text style={styles.text}>Configurações</Text>
              </View>
            </TouchableOpacity>

            {/* SAIR */}
            <TouchableOpacity
              onPress={() => {
                closeMenu()
                logout()
              }}
            >
              <View style={styles.item}>
                <FontAwesome5 name="sign-out-alt" size={16} style={[styles.icon, { color: "#d9534f" }]} />
                <Text style={[styles.text, { color: "#d9534f" }]}>Sair</Text>
              </View>
            </TouchableOpacity>

          </Animated.View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  menuWrapper: {
    position: 'absolute',
    top: 80,
    right: 16,
  },
  menu: {
    width: 180,
    backgroundColor: 'white',
    paddingVertical: 6,
    borderRadius: 10,
    elevation: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  icon: {
    marginRight: 12,
    color: '#000',
  },
  text: {
    fontSize: 16,
    color: '#000',
  },
})
