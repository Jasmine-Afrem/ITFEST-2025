'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

type Salon = {
  id: number;
  numar_salon: string;
  tip_salon: 'General' | 'Terapie Intensiva' | 'Urgenta' | 'Privat';
  capacitate: number;
  ocupat: number;
  status: 'Liber' | 'Ocupat' | 'In Mentenanta';
  etaj: number;
  sectiune: string,
  isFull: number,
  ocupare: string,
  pacienti_internati: number;
};

type Patient = {
  id: number;
  nume: string;
  prenume: string;
};

export default function HartaSpitalului() {
  const [saloane, setSaloane] = useState<Salon[]>([]);
  const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [highestFloor, setHighestFloor] = useState<number>(0);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [allPatients, setAllPatients] = useState<Patient[]>([]);
  const [showAllPatients, setShowAllPatients] = useState<boolean>(false);

  useEffect(() => {
    const fetchSaloane = async () => {
      try {
        const response = await axios.get('http://localhost:5000/rooms/saloane');
        const data: Salon[] = response.data;

        setSaloane(data);
        const maxEtaj = Math.max(...data.map(salon => salon.etaj));
        setHighestFloor(maxEtaj);
      } catch (error) {
        console.error('Error fetching saloane data:', error);
      }
    };

    fetchSaloane();
  }, []);

  const handleSalonClick = (salon: Salon) => {
    setSelectedSalon(salon);
    setShowAllPatients(false); // Reset show all patients when selecting a salon
  };

  const handleCloseModal = () => {
    setSelectedSalon(null);
    setPatients([]); // Clear patients when closing the modal
    setShowAllPatients(false); // Reset view mode
    setAllPatients([]);

  };

  const handleShowPatients = async () => {
    if (selectedSalon) {
      try {
        const response = await axios.get(`http://localhost:5000/patientrooms/room/${selectedSalon.id}`);
        const data: Patient[] = response.data;
        setPatients(data);
        setShowAllPatients(false); // Ensure only salon patients are shown
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    }
  };

  const handleShowAllPatients = async () => {
    try {
      const response = await axios.get('http://localhost:5000/patients/not-in-room');
      const data: Patient[] = response.data;
      setAllPatients(data);
      setShowAllPatients(true); // Set to show all patients
    } catch (error) {
      console.error('Error fetching all patients:', error);
    }
  };

  const handleAssignPatientToRoom = async (patientId: number) => {
    if (!selectedSalon) {
      alert('Trebuie să selectezi un salon!');
      return;
    }
  
    try {
      await axios.post(`http://localhost:5000/patientrooms/assign`, {
        id_pacient: patientId,
        id_salon: selectedSalon.id
      });
  
      // Găsim pacientul mutat
      const assignedPatient = allPatients.find(patient => patient.id === patientId);
      
      if (assignedPatient) {
        // Scoatem pacientul din `allPatients` și îl adăugăm în `patients`
        setAllPatients(prev => prev.filter(patient => patient.id !== patientId));
        setPatients(prev => [...prev, assignedPatient]);
      }
  
    } catch (error) {
      console.error('Error assigning patient to room:', error);
    }
  };
 
  
  const handleDeletePatient = async (patientId: number) => {
    const confirmDelete = window.confirm('Ești sigur că vrei să scoți acest pacient din salon?');
    if (!confirmDelete) return;
  
    try {
      await axios.put(`http://localhost:5000/patientrooms/discharge/${patientId}`);
  
      // Găsim pacientul externat
      const dischargedPatient = patients.find(patient => patient.id === patientId);
      
      if (dischargedPatient) {
        // Scoatem pacientul din `patients` și îl adăugăm în `allPatients`
        setPatients(prev => prev.filter(patient => patient.id !== patientId));
        setAllPatients(prev => [...prev, dischargedPatient]);
      }
  
    } catch (error) {
      console.error('Error discharging patient:', error);
    }
  };
  



  const filteredSaloane = selectedFloor !== null
    ? saloane.filter(salon => salon.etaj === selectedFloor)
    : saloane;

    return (
      <div>
        <h1>Harta Spitalului</h1>
        <label>
        {'a'}Selecteaza Etaj:
          <select onChange={e => setSelectedFloor(e.target.value ? Number(e.target.value) : null)} value={selectedFloor ?? ''}>
            <option value="">Toate Etajele</option>
            <option value="0">Parter</option>
            {[...Array(highestFloor).keys()].map(floor => (
              <option key={floor + 1} value={floor + 1}>
                Etaj {floor + 1}
              </option>
            ))}
          </select>
        </label>
        <div className="grid-container">
          {filteredSaloane.map(salon => (
            <div
              key={salon.id}
              className={`grid-item ${salon.status.toLowerCase()}`}
              onClick={() => handleSalonClick(salon)}
            >
              <span className="text-negru">{salon.numar_salon}</span>
              <br />
              <span className="text-mic">{salon.capacitate} locuri</span>
            </div>
          ))}
        </div>
    
        {selectedSalon && (
          <div className="modal">
            <div className="modal-content">
              <h2>Detalii Salon {selectedSalon.numar_salon}</h2>
              <label>
                Secțiune:
                <span>{selectedSalon.sectiune}</span>
              </label>
              <label>
                Tip Salon:
                <span>{selectedSalon.tip_salon}</span>
              </label>
              <label>
                Capacitate:
                <span>{selectedSalon.capacitate} locuri</span>
              </label>
              <label>
                Status:
                <span>{selectedSalon.status}</span>
              </label>
              <label>
                Este full?:
                <span>{selectedSalon.isFull}</span>
              </label>
              <label>
                Cate persoane sunt internate:
                <span>{selectedSalon.pacienti_internati}</span>
              </label>
              <button onClick={handleCloseModal}>Închide</button>
              <button onClick={handleShowPatients}>Arată pacienții din salon</button>
              <button onClick={handleShowAllPatients}>Arată toți pacienții +</button>
    
              {patients.length > 0 && (
                <div>
                  <h3>Pacienți în acest salon:</h3>
                  <ul>
                    {patients.map(patient => (
                      <li key={patient.id}>
                        {patient.nume} {patient.prenume}
                        <button className="delete-button" onClick={() => handleDeletePatient(patient.id)}>
                          ❌
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
    
              {allPatients.length > 0 && selectedSalon && (
                <div>
                  <h3>Toți pacienții:</h3>
                  <ul>
                    {allPatients.map(patient => (
                      <li key={patient.id}>
                        {patient.nume} {patient.prenume}
                        <button className="assign-button" onClick={() => handleAssignPatientToRoom(patient.id)}>
                          ➕
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
    
        <style jsx>{`
          .grid-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
            gap: 10px;
            margin-top: 20px;
          }
          .grid-item {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100px;
            background-color: #f0f0f0;
            border: 1px solid #ddd;
            cursor: pointer;
          }
          .grid-item.liber {
            background-color: #c8e6c9;
          }
          .grid-item.ocupat {
            background-color: #ffcdd2;
          }
          .grid-item.in-mentenanta {
            background-color: #fff9c4;
          }
          .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .modal-content {
            background-color: black;
            padding: 20px;
            border-radius: 5px;
            width: 300px;
            color: white;
          }
          .modal-content label {
            display: block;
            margin-top: 10px;
            color: white;
          }
          .text-negru {
            color: black;
          }
          .text-mic {
            font-size: 12px;
            color: gray;
          }
          button {
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #4caf50;
            color: white;
            border: none;
            cursor: pointer;
          }
          .delete-button {
            margin-left: 10px;
            background: none;
            border: none;
            color: red;
            font-size: 16px;
            cursor: pointer;
          }
        `}</style>
      </div>
    );
  }