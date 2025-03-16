import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
} from 'react-native';

interface FisaMedicala {
  id: number;
  id_pacient: number;
  id_medic: number;
  diagnostic: string;
  tratament: string;
  reteta: string;
  data_creare?: string;
}

const API_BASE_URL = '192.168.168.60/medicalrecords'; // Change this to your backend URL if needed

const App: React.FC = () => {
  const [patientId, setPatientId] = useState<string>('');
  const [fiseMedicale, setFiseMedicale] = useState<FisaMedicala[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const fetchFiseMedicale = async () => {
    if (!patientId) {
      setError('Please enter a valid Patient ID.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        `${API_BASE_URL}/patient/${patientId}`
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: FisaMedicala[] = await response.json();
      setFiseMedicale(data);
    } catch (err: any) {
      setError('Error fetching data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Enter Patient ID</Text>
      <TextInput
        style={styles.input}
        placeholder="Patient ID"
        placeholderTextColor="gray"
        value={patientId}
        onChangeText={setPatientId}
        keyboardType="numeric"
      />
      <View style={styles.buttonContainer}>
        <Button title="Fetch Medical Records" onPress={fetchFiseMedicale} />
      </View>
      {loading && <Text style={styles.loading}>Loading...</Text>}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <ScrollView style={styles.resultsContainer}>
        {fiseMedicale.map((fisa) => (
          <View key={fisa.id} style={styles.fisaCard}>
            <Text style={styles.fisaText}>Fisa ID: {fisa.id}</Text>
            <Text style={styles.fisaText}>Medic ID: {fisa.id_medic}</Text>
            <Text style={styles.fisaText}>
              Diagnostic: {fisa.diagnostic}
            </Text>
            <Text style={styles.fisaText}>
              Tratament: {fisa.tratament}
            </Text>
            <Text style={styles.fisaText}>Reteta: {fisa.reteta}</Text>
            {fisa.data_creare && (
              <Text style={styles.fisaText}>
                Data Creare: {fisa.data_creare}
              </Text>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black', // Background set to black
    padding: 16,
  },
  title: {
    fontSize: 24,
    color: 'white', // Title text is white
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    color: 'white', // Input text is white
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  loading: {
    color: 'white',
    textAlign: 'center',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 16,
  },
  resultsContainer: {
    flex: 1,
    marginTop: 16,
  },
  fisaCard: {
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 5,
    marginBottom: 12,
  },
  fisaText: {
    color: 'white',
    fontSize: 16,
  },
});
