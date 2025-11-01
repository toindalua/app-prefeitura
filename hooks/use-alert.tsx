import { Alert, AlertIcon, AlertText } from '@/components/ui/alert';
import { AlertCircleIcon, CheckCircleIcon, InfoIcon } from '@/components/ui/icon';
import React, { createContext, ReactNode, useContext, useState } from 'react';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

type AlertType = 'success' | 'error' | 'warning' | 'info'

interface AlertData {
  message: string
  type: AlertType
}

interface AlertContextProps {
  showAlert: (message: string, type?: AlertType) => void
}

const AlertContext = createContext<AlertContextProps>({
  showAlert: () => { },
})

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alert, setAlert] = useState<AlertData | null>(null)
  const [visible, setVisible] = useState(false)
  const fadeAnim = useSharedValue(0)

  const showAlert = (message: string, type: AlertType = 'info') => {
    setAlert({ message, type })
    setVisible(true)
    fadeAnim.value = withTiming(1, { duration: 200 })

    setTimeout(() => {
      fadeAnim.value = withTiming(0, { duration: 200 }, () => {
        runOnJS(setVisible)(false)
        runOnJS(setAlert)(null)
      })
    }, 3000)
  }

  const getIcon = () => {
    switch (alert?.type) {
      case 'success':
        return CheckCircleIcon
      case 'error':
        return AlertCircleIcon
      case 'warning':
        return AlertCircleIcon
      default:
        return InfoIcon
    }
  }

  const getColor = () => {
    switch (alert?.type) {
      case 'success':
        return 'green'
      case 'error':
        return 'red'
      case 'warning':
        return 'yellow'
      default:
        return 'blue'
    }
  }

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
  }))

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {visible && alert && (
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: 40,
              left: 20,
              right: 20,
              zIndex: 999,
            },
            animatedStyle,
          ]}
        >
          <Alert
            action={alert.type}
            variant="outline"
          >
            <AlertIcon as={getIcon()} color={getColor()} />
            <AlertText bold >{alert.message}</AlertText>
          </Alert>
        </Animated.View>
      )}
    </AlertContext.Provider>
  )
}

export const useAlert = () => useContext(AlertContext)
