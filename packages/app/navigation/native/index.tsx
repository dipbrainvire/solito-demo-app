import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { LoginScreen } from 'app/features/login/screen'
import { RegisterScreen } from 'app/features/register/screen'
import { ProductScreen } from 'app/features/product/screen'
import { HomeScreen } from 'app/features/home/screen'
import { AccountScreen } from 'app/features/account/screen'

const Stack = createNativeStackNavigator<{
  login: undefined
  product: undefined
  register: undefined
  home: undefined
  account: undefined
}>()

export function NativeNavigation() {
  return (
    <Stack.Navigator initialRouteName="login">
      <Stack.Screen
        name="login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="product"
        component={ProductScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="account"
        component={AccountScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}
