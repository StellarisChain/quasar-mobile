import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// Screens
import WalletScreen from './src/screens/WalletScreen';
import SendScreen from './src/screens/SendScreen';
import ReceiveScreen from './src/screens/ReceiveScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import CreateWalletScreen from './src/screens/CreateWalletScreen';
import ImportWalletScreen from './src/screens/ImportWalletScreen';

// Providers
import { WalletProvider } from './src/contexts/WalletContext';
import { ThemeProvider } from './src/contexts/ThemeContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap;

                    if (route.name === 'Wallet') {
                        iconName = focused ? 'wallet' : 'wallet-outline';
                    } else if (route.name === 'Send') {
                        iconName = focused ? 'send' : 'send-outline';
                    } else if (route.name === 'Receive') {
                        iconName = focused ? 'download' : 'download-outline';
                    } else if (route.name === 'Settings') {
                        iconName = focused ? 'settings' : 'settings-outline';
                    } else {
                        iconName = 'help-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#6366f1',
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: {
                    backgroundColor: '#1a1a1a',
                    borderTopColor: '#333',
                },
                headerStyle: {
                    backgroundColor: '#1a1a1a',
                },
                headerTintColor: '#fff',
            })}
        >
            <Tab.Screen name="Wallet" component={WalletScreen} />
            <Tab.Screen name="Send" component={SendScreen} />
            <Tab.Screen name="Receive" component={ReceiveScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
}

export default function App() {
    return (
        <ThemeProvider>
            <WalletProvider>
                <NavigationContainer>
                    <StatusBar style="light" />
                    <Stack.Navigator
                        screenOptions={{
                            headerStyle: {
                                backgroundColor: '#1a1a1a',
                            },
                            headerTintColor: '#fff',
                            headerTitleStyle: {
                                fontWeight: 'bold',
                            },
                        }}
                    >
                        <Stack.Screen
                            name="Welcome"
                            component={WelcomeScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="CreateWallet"
                            component={CreateWalletScreen}
                            options={{ title: 'Create Wallet' }}
                        />
                        <Stack.Screen
                            name="ImportWallet"
                            component={ImportWalletScreen}
                            options={{ title: 'Import Wallet' }}
                        />
                        <Stack.Screen
                            name="Main"
                            component={MainTabs}
                            options={{ headerShown: false }}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            </WalletProvider>
        </ThemeProvider>
    );
}
