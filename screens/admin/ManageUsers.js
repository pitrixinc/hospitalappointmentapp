import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { collection, getDocs, doc, deleteDoc, updateDoc, query, where } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { Picker } from '@react-native-picker/picker';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [selectedTab, setSelectedTab] = useState('patient');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersList);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      await deleteDoc(doc(db, 'users', userId));
      setUsers(users.filter(user => user.id !== userId));
      Alert.alert('Success', 'User has been successfully deleted.');
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleUpdate = async (userId, updatedData) => {
    try {
      const userDoc = doc(db, 'users', userId);
      await updateDoc(userDoc, updatedData);
      setUsers(users.map(user => user.id === userId ? { ...user, ...updatedData } : user));
    //  Alert.alert('Success', 'User has been successfully updated.');
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const filteredUsers = users.filter(user => 
    user.userType === selectedTab &&
    (user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
     user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
     user.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
     user.userType.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Manage Users</Text>

      <View style={styles.searchContainer}>
        <TextInput 
          style={styles.searchInput} 
          placeholder="Search by name, email, location, or userType"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'patient' && styles.activeTab]}
          onPress={() => setSelectedTab('patient')}
        >
          <Text style={styles.tabText}>Patients</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'doctor' && styles.activeTab]}
          onPress={() => setSelectedTab('doctor')}
        >
          <Text style={styles.tabText}>Doctors</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'admin' && styles.activeTab]}
          onPress={() => setSelectedTab('admin')}
        >
          <Text style={styles.tabText}>Admins</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal style={styles.tableContainer}>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Profile Image</Text>
            <Text style={styles.tableHeaderText}>Full Name</Text>
            <Text style={styles.tableHeaderText}>Email</Text>
            <Text style={styles.tableHeaderText}>Location</Text>
            <Text style={styles.tableHeaderText}>User Type</Text>
            <Text style={styles.tableHeaderText}>Actions</Text>
          </View>

          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <View key={user.id} style={styles.tableRow}>
                <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
                <TextInput
                  style={styles.input}
                  value={user.fullName}
                  onChangeText={(text) => handleUpdate(user.id, { fullName: text })}
                />
                {/*
                <TextInput
                  style={styles.input}
                  value={user.email}
                  onChangeText={(text) => handleUpdate(user.id, { email: text })}
                 disabled
                />
                */}
                <Text style={styles.input}>{user.email}</Text>
                <TextInput
                  style={styles.input}
                  value={user.location}
                  onChangeText={(text) => handleUpdate(user.id, { location: text })}
                />
                <Picker
                  selectedValue={user.userType}
                  style={styles.picker}
                  onValueChange={(itemValue) => handleUpdate(user.id, { userType: itemValue })}
                >
                  <Picker.Item label="Patient" value="patient" />
                  <Picker.Item label="Doctor" value="doctor" />
                  <Picker.Item label="Admin" value="admin" />
                </Picker>
                <View style={styles.actionsContainer}>
                  {user.userType !== 'admin' && (
                    <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(user.id)}>
                      <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity style={styles.updateButton} onPress={() => handleUpdate(user.id, user)}>
                    <Text style={styles.buttonText}>Update</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noUsersText}>No users found for this category.</Text>
          )}
        </View>
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#32CD32',
    marginBottom: 20,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    marginHorizontal: 5,
  },
  activeTab: {
    backgroundColor: '#32CD32',
  },
  tabText: {
    fontSize: 16,
    color: '#fff',
  },
  tableContainer: {
    marginBottom: 20,
  },
  table: {
    width: 900,  // Adjust as per your needs
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#32CD32',
    padding: 10,
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    borderBottomColor: '#E0E0E0',
    borderBottomWidth: 1,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  input: {
    flex: 1,
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#f5f5f5',
    marginHorizontal: 5,
    fontSize: 16,
  },
  picker: {
    flex: 1,
    marginHorizontal: 5,
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  deleteButton: {
    backgroundColor: '#FF4B4B',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginRight: 10,
  },
  updateButton: {
    backgroundColor: '#32CD32',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  noUsersText: {
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
    color: '#777',
  },
});
