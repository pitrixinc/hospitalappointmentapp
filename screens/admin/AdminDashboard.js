// /screens/admin/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebaseConfig'; // Import Firebase config
import AdminProfile from './AdminProfile'
import ManageAmbulanceRequests from './ManageAmbulanceRequests';
import ManageAppointments from './ManageAppointments'
import ManageMedications from './ManageMedications';
import ManageUsers from './ManageUsers';
import ManageMedicationAlert from './ManageMedicationAlert';


const Tab = createBottomTabNavigator();

export default function AdminDashboard() {
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchProfileImage = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid)); 
        if (userDoc.exists()) {
          setProfileImage(userDoc.data().profileImage);
        }
      }
    };

    fetchProfileImage();
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Profile' && profileImage) {
            return (
              <Image
                source={{ uri: profileImage }}
                style={{ width: size, height: size, borderRadius: size / 2 }}
              />
            );
          }

          let iconName;
          switch (route.name) {
            case 'Manage Users':
              iconName = 'accessibility-outline';
              break;
            case 'Manage Appointments':
              iconName = 'calendar-outline';
              break;
            case 'Manage Ambulance Requests':
              iconName = 'car-outline';
              break;
              case 'Manage Medication Reminder':
              iconName = 'medkit-outline';
              break;
            case 'Manage Patients Questions':
              iconName = 'person-outline';
              break;
            default:
              iconName = 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007BFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Manage Users" component={ManageUsers} />
      <Tab.Screen name="Manage Appointments" component={ManageAppointments} />
      <Tab.Screen name="Manage Ambulance Requests" component={ManageAmbulanceRequests} />
      <Tab.Screen name="Manage Medication Reminder" component={ManageMedicationAlert} />
      <Tab.Screen name="Manage Patients Questions" component={ManageMedications} />
      <Tab.Screen name="Profile" component={AdminProfile} />
    </Tab.Navigator>
  );
}
