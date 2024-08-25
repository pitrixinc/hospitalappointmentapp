// /screens/admin/ManageAppointments.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Image, StyleSheet, Alert } from 'react-native';
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig'; // Import your Firebase configuration

export default function ManageAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'appointments'));
        const appointmentsData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setAppointments(appointmentsData);
      } catch (error) {
        console.log('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, []);

  const handleUpdateAppointment = async (id, status) => {
    try {
      await updateDoc(doc(db, 'appointments', id), { status });
      Alert.alert('Success', 'Appointment updated successfully');
      setAppointments(prev => prev.map(appt => appt.id === id ? { ...appt, status } : appt));
    } catch (error) {
      console.log('Error updating appointment:', error);
    }
  };

  const handleDeleteAppointment = async id => {
    try {
      await deleteDoc(doc(db, 'appointments', id));
      Alert.alert('Success', 'Appointment deleted successfully');
      setAppointments(prev => prev.filter(appt => appt.id !== id));
    } catch (error) {
      console.log('Error deleting appointment:', error);
    }
  };

  const renderAppointments = () => {
    const filteredAppointments = appointments.filter(appt => appt.status === activeTab);
    if (filteredAppointments.length === 0) {
      return <Text style={styles.noAppointmentsText}>No {activeTab === 'pending' ? 'Pending' : 'Granted'} Appointments</Text>;
    }

    return filteredAppointments.map(appointment => (
      <View key={appointment.id} style={styles.card}>
        <Image source={{ uri: appointment.userImage }} style={styles.userImage} />
        <TextInput style={styles.input} value={appointment.reason} editable={false} />
        <TextInput style={styles.input} value={appointment.date} editable={false} />
        <TextInput style={styles.input} value={appointment.time} editable={false} />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.updateButton}
            onPress={() => handleUpdateAppointment(appointment.id, activeTab === 'pending' ? 'granted' : 'pending')}
          >
            <Text style={styles.buttonText}>{activeTab === 'pending' ? 'Grant' : 'Revoke'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteAppointment(appointment.id)}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    ));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
          onPress={() => setActiveTab('pending')}
        >
          <Text style={styles.tabText}>Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'granted' && styles.activeTab]}
          onPress={() => setActiveTab('granted')}
        >
          <Text style={styles.tabText}>Granted</Text>
        </TouchableOpacity>
      </View>
      {renderAppointments()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: '#007BFF',
  },
  tabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  userImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  updateButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noAppointmentsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#555',
  },
});
