import { NavigationContainer } from '@react-navigation/native'
import * as Linking from 'expo-linking'
import { useMemo } from 'react'

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const linking = useMemo(
    () => ({
      prefixes: [Linking.createURL('/')],
      config: {
        initialRouteName: 'login',
        screens: {
          login: 'login',
          product: 'product',
          register: 'register',
          home: 'home',
          account: 'account',
        },
      },
    }),
    []
  )

  return <NavigationContainer linking={linking}>{children}</NavigationContainer>
}
