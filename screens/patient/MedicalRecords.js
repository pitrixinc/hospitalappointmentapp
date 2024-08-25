import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase/firebaseConfig';
import { MaterialIcons, FontAwesome5, FontAwesome } from '@expo/vector-icons';


export default function MedicalRecords() {
  const [greeting, setGreeting] = useState('');
  const [firstName, setFirstName] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [ambulanceRequests, setAmbulanceRequests] = useState([]);
  const [appointmentTab, setAppointmentTab] = useState('pending');
  const [ambulanceTab, setAmbulanceTab] = useState('pending');
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserDetails(userDoc.data());
        }
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const nameParts = userDetails.fullName ? userDetails.fullName.split(' ') : user.email.split('@');
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
     <View style={styles.greetingView}>
      <Text style={styles.greeting}>{greeting}, {firstName}!</Text>
      <Text style={styles.welcomeMessage}>
        Welcome to your Medical Records. Here you can view a summary of your recent appointments and ambulance requests.
      </Text>
      </View>

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
            <View key={appointment.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.dateText}>Created on: {appointment.createdAt}</Text>
            </View>
            
            <View style={styles.cardBody}>
              <View style={styles.row}>
                <MaterialIcons name="event-note" size={16} color="#2980B9" style={styles.icon} />
                <Text style={styles.label}>Reason:</Text>
                <Text style={styles.value}>{appointment.reason}</Text>
              </View>

              <View style={styles.row}>
                <FontAwesome5 name="calendar-alt" size={16} color="#2980B9" style={styles.icon} />
                <Text style={styles.label}>Preferred Date:</Text>
                <Text style={styles.value}>{appointment.appointmentDateString}</Text>
              </View>
              
              <View style={styles.row}>
                <MaterialIcons name="schedule" size={16} color="#2980B9" style={styles.icon} />
                <Text style={styles.label}>Preferred Time:</Text>
                <Text style={styles.value}>{appointment.appointmentTime}</Text>
              </View>

              <View style={styles.row}>
                <FontAwesome5 name="clinic-medical" size={16} color="#2980B9" style={styles.icon} />
                <Text style={styles.label}>Preferred Branch:</Text>
                <Text style={styles.value}>{appointment.branch}</Text>
              </View>

              <View style={styles.row}>
                <MaterialIcons name="local-hospital" size={16} color="#2980B9" style={styles.icon} />
                <Text style={styles.label}>Medical Condition:</Text>
                <Text style={styles.value}>{appointment.medicalConditions}</Text>
              </View>

              <View style={styles.row}>
                <MaterialIcons name="schedule" size={16} color="#2980B9" style={styles.icon} />
                <Text style={styles.label}>Status:</Text>
                <Text style={styles.value}>{appointment.status}</Text>
              </View>
            </View>
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
            <View key={request.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.dateText}>Created on: {request.createdAt}</Text>
            </View>
            
            <View style={styles.cardBody}>
              <View style={styles.row}>
                <MaterialIcons name="event-note" size={16} color="#2980B9" style={styles.icon} />
                <Text style={styles.label}>Description:</Text>
                <Text style={styles.value}>{request.description}</Text>
              </View>

              <View style={styles.row}>
                <FontAwesome5 name="calendar-alt" size={16} color="#2980B9" style={styles.icon} />
                <Text style={styles.label}>Arrival Date:</Text>
                <Text style={styles.value}>{request.arrivalDateString}</Text>
              </View>
              
              <View style={styles.row}>
                <MaterialIcons name="schedule" size={16} color="#2980B9" style={styles.icon} />
                <Text style={styles.label}>Arrival Time:</Text>
                <Text style={styles.value}>{request.arrivalTime}</Text>
              </View>

              <View style={styles.row}>
                <FontAwesome5 name="clinic-medical" size={16} color="#2980B9" style={styles.icon} />
                <Text style={styles.label}>Pickup Branch:</Text>
                <Text style={styles.value}>{request.branch}</Text>
              </View>

              <View style={styles.row}>
                <MaterialIcons name="local-hospital" size={16} color="#2980B9" style={styles.icon} />
                <Text style={styles.label}>Medical Condition:</Text>
                <Text style={styles.value}>{request.medicalCondition}</Text>
              </View>

              <View style={styles.row}>
                <FontAwesome name="ambulance" size={16} color="#2980B9" style={styles.icon} />
                <Text style={styles.label}>Ambulance Type</Text>
                <Text style={styles.value}>{request.ambulanceType}</Text>
              </View>

              <View style={styles.row}>
                <MaterialIcons name="schedule" size={16} color="#2980B9" style={styles.icon} />
                <Text style={styles.label}>Status:</Text>
                <Text style={styles.value}>{request.status}</Text>
              </View>
            </View>
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
  greetingView: {
    backgroundColor: '#0984e3',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    fontWeight: '600',
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2d3436',
  },
  welcomeMessage: {
    fontSize: 14,
    color: 'white',
    marginBottom: 20,
    lineHeight: 26,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
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
    color: '#555555',
    marginTop: 20,
  },


  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 10,
    marginBottom: 10,
  },
  dateText: {
    fontSize: 14,
    color: '#888888',
    fontWeight: 'bold',
  },
  cardBody: {
    flexDirection: 'column',
    justifyContent: 'space-between',
   // borderBottomWidth: 1,
   // borderBottomColor: '#E0E0E0',
    paddingBottom: 10,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingTop: 15,
    paddingBottom: 15,
  },
  icon: {
    marginRight: 8,
  },
  label: {
    fontSize: 14,
    color: '#555555',
    fontWeight: '600',
  },
  value: {
    fontSize: 14,
    color: '#333333',
    flex: 1,
    textAlign: 'right',
  },
});
