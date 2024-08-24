// /screens/admin/AdminDashboard.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AdminProfile from './AdminProfile';
import ManageAppointments from './ManageAppointments';

const Tab = createBottomTabNavigator();

export default function AdminDashboard() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Profile" component={AdminProfile} />
      <Tab.Screen name="Manage Appointments" component={ManageAppointments} />
    </Tab.Navigator>
  );
}
