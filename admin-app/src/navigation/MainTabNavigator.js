import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LineChart, Folder, Shirt, ShoppingBag, Settings } from 'lucide-react-native';

import DashboardScreen from '../screens/DashboardScreen';
import CollectionsScreen from '../screens/CollectionsScreen';
import ProductsScreen from '../screens/ProductsScreen';
import OrdersScreen from '../screens/OrdersScreen';
import ThemeSettingsScreen from '../screens/ThemeSettingsScreen';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: true,
                headerStyle: {
                    backgroundColor: '#1E1E1E',
                    borderBottomWidth: 1,
                    borderBottomColor: '#333'
                },
                headerTitleStyle: {
                    color: '#D4AF37',
                    fontWeight: 'bold',
                },
                tabBarActiveTintColor: '#D4AF37',
                tabBarInactiveTintColor: '#888',
                tabBarStyle: {
                    backgroundColor: '#1E1E1E',
                    borderTopWidth: 1,
                    borderTopColor: '#333',
                },
                tabBarIcon: ({ focused, color, size }) => {
                    if (route.name === 'الرئيسية') return <LineChart color={color} size={size} />;
                    if (route.name === 'المجموعات') return <Folder color={color} size={size} />;
                    if (route.name === 'المنتجات') return <Shirt color={color} size={size} />;
                    if (route.name === 'الطلبات') return <ShoppingBag color={color} size={size} />;
                    if (route.name === 'إعدادات') return <Settings color={color} size={size} />;
                },
            })}
        >
            <Tab.Screen name="الرئيسية" component={DashboardScreen} />
            <Tab.Screen name="المجموعات" component={CollectionsScreen} />
            <Tab.Screen name="المنتجات" component={ProductsScreen} />
            <Tab.Screen name="الطلبات" component={OrdersScreen} />
            <Tab.Screen name="إعدادات" component={ThemeSettingsScreen} />
        </Tab.Navigator>
    );
}
