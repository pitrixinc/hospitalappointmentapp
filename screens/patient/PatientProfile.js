import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Image, StyleSheet } from 'react-native';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebaseConfig'; // Import Firebase config

export default function PatientProfile() {
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    location: '',
    profileImage: '',
  });

  const user = auth.currentUser;

  useEffect(() => {
    const fetchProfile = async () => {
      const userDoc = await getDoc(doc(db, 'users', user.uid)); // Assuming user data is stored under 'users' collection
      if (userDoc.exists()) {
        setProfile(userDoc.data());
      }
    };
    fetchProfile();
  }, [user]);

  const handleUpdate = async () => {
    await updateDoc(doc(db, 'users', user.uid), profile);
    alert('Profile updated successfully!');
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: profile.profileImage }}
        style={styles.profileImage}
      />
      <TextInput
        style={styles.input}
        value={profile.fullName}
        onChangeText={(text) => setProfile({ ...profile, fullName: text })}
        placeholder="Full Name"
      />
      <TextInput
        style={styles.input}
        value={profile.email}
        onChangeText={(text) => setProfile({ ...profile, email: text })}
        placeholder="Email"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        value={profile.location}
        onChangeText={(text) => setProfile({ ...profile, location: text })}
        placeholder="Location"
      />
      <Button title="Update Profile" onPress={handleUpdate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    alignSelf: 'center',
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 20,
    padding: 10,
  },
});
