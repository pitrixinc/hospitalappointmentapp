import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../../firebase/firebaseConfig';

export default function MedicalRecords() {
  const [greeting, setGreeting] = useState('');
  const [firstName, setFirstName] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [ambulanceRequests, setAmbulanceRequests] = useState([]);
  const [appointmentTab, setAppointmentTab] = useState('pending');
  const [ambulanceTab, setAmbulanceTab] = useState('pending');

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const nameParts = user.displayName ? user.displayName.split(' ') : user.email.split('@');
      setFirstName(nameParts[0]);

      const fetchUserData = async () => {
        try {
          const appointmentsRef = collection(db, 'appointments');
          const ambulanceRequestsRef = collection(db, 'ambulanceRequests');

          const appointmentsQuery = query(appointmentsRef, where('userId', '==', user.uid));
          const ambulanceRequestsQuery = query(ambulanceRequestsRef, where('userId', '==', user.uid));

          const appointmentsSnapshot = await getDocs(appointmentsQuery);
          const ambulanceRequestsSnapshot = await getDocs(ambulanceRequestsQuery);

          const fetchedAppointments = [];
          const fetchedAmbulanceRequests = [];

          appointmentsSnapshot.forEach((doc) => {
            fetchedAppointments.push({ id: doc.id, ...doc.data() });
          });

          ambulanceRequestsSnapshot.forEach((doc) => {
            fetchedAmbulanceRequests.push({ id: doc.id, ...doc.data() });
          });

          setAppointments(fetchedAppointments);
          setAmbulanceRequests(fetchedAmbulanceRequests);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      fetchUserData();
    }
  }, []);

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting('Good Morning');
    else if (hours < 18) setGreeting('Good Afternoon');
    else if (hours < 21) setGreeting('Good Evening');
    else setGreeting('Good Night');
  }, []);

  const filterAppointments = (status) => {
    return appointments.filter(appointment => appointment.status === status);
  };

  const filterAmbulanceRequests = (status) => {
    return ambulanceRequests.filter(request => request.status === status);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.greeting}>{greeting}, {firstName}!</Text>
      <Text style={styles.welcomeMessage}>
        Welcome to your Medical Records. Here you can view a summary of your recent appointments and ambulance requests.
      </Text>
      
      {/* Appointment Summary Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appointment Summary</Text>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, appointmentTab === 'pending' && styles.activeTabButton]}
            onPress={() => setAppointmentTab('pending')}
          >
            <Text style={styles.tabButtonText}>Pending</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, appointmentTab === 'granted' && styles.activeTabButton]}
            onPress={() => setAppointmentTab('granted')}
          >
            <Text style={styles.tabButtonText}>Granted</Text>
          </TouchableOpacity>
        </View>
        {filterAppointments(appointmentTab).length > 0 ? (
          filterAppointments(appointmentTab).map((appointment) => (
            <View key={appointment.id} style={styles.item}>
              <Text style={styles.itemText}>Date: {appointment.createdAt}</Text>
              <Text style={styles.itemText}>Doctor: {appointment.doctorName}</Text>
              <Text style={styles.itemText}>Status: {appointment.status}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noItemText}>No {appointmentTab} appointments found.</Text>
        )}
      </View>

      {/* Ambulance Request Summary Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ambulance Request Summary</Text>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, ambulanceTab === 'pending' && styles.activeTabButton]}
            onPress={() => setAmbulanceTab('pending')}
          >
            <Text style={styles.tabButtonText}>Pending</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, ambulanceTab === 'granted' && styles.activeTabButton]}
            onPress={() => setAmbulanceTab('granted')}
          >
            <Text style={styles.tabButtonText}>Granted</Text>
          </TouchableOpacity>
        </View>
        {filterAmbulanceRequests(ambulanceTab).length > 0 ? (
          filterAmbulanceRequests(ambulanceTab).map((request) => (
            <View key={request.id} style={styles.item}>
              <Text style={styles.itemText}>Requested At: {request.createdAt}</Text>
              <Text style={styles.itemText}>Status: {request.status}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noItemText}>No {ambulanceTab} requests found.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f0f0f5',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2d3436',
  },
  welcomeMessage: {
    fontSize: 18,
    color: '#636e72',
    marginBottom: 20,
    lineHeight: 26,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0984e3',
    marginBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#0984e3',
    paddingBottom: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#dfe6e9',
  },
  activeTabButton: {
    backgroundColor: '#0984e3',
  },
  tabButtonText: {
    fontSize: 16,
    color: '#2d3436',
  },
  item: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemText: {
    fontSize: 16,
    color: '#2d3436',
  },
  noItemText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#b2bec3',
    marginTop: 20,
  },
});
