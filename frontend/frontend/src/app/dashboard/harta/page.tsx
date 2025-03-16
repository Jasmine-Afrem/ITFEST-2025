/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

type Salon = {
  id: number;
  numar_salon: string;
  tip_salon: 'General' | 'Terapie Intensiva' | 'Urgenta' | 'Privat';
  capacitate: number;
  ocupat: number;
  status: 'Liber' | 'Ocupat' | 'In Mentenanta';
  etaj: number;
  sectiune: string;
  isFull: number;
  ocupare: string;
  pacienti_internati: number;
};

type Patient = {
  id: number;
  nume: string;
  prenume: string;
};

interface GridItemProps {
  isFull: number;
  status: string;
}

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(23, 87, 118, 0.9);
  backdrop-filter: blur(10px);
  color: white;
  padding: 10px 20px;
  border-radius: 12px;
  box-shadow: 0px 10px 10px rgba(0,0,0,0.2);
  position: sticky;
  top: 0;
  z-index: 1000;
  margin-top: 3.2rem;
  margin-left: 10rem;
  font-size:2rem;
`;

const FloorButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
`;

const FloorButton = styled.button`
  font-size: 1.5rem;
  width: 60px;
  height: 60px;
  margin: 10px 5px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #45a049;
  }
  
  &.active {
    background-color: #333;
  }
`;

const GridItem = styled.div<GridItemProps>`
  padding: 20px;
  margin: 10px;
  text-align: center;
  cursor: pointer;
  border-radius: 10px;
  transition: background-color 0.3s ease-in-out;
  width: 150px;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ isFull, status }) => {
    if (status === 'In Mentenanta') return 'yellow';
    return isFull ? 'red' : 'green';
  }};
  color: ${({ status }) => (status === 'In Mentenanta' ? 'black' : 'white')};
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 40px;
  justify-content: center;
  align-items: center;
  padding: 100px;
  max-width: 80%;
  margin: 0 auto;
  margin-left:10rem;
  /* Limita de înălțime și scroll vertical */
  max-height: calc(100vh - 250px);
  overflow-y: auto;
`;

export default function HartaSpitalului() {
  const [saloane, setSaloane] = useState<Salon[]>([]);
  const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null);
  // Dacă selectedFloor este null, se vor afișa toate saloanele (butonul T)
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
    setShowAllPatients(false);
  };

  const handleCloseModal = () => {
    setSelectedSalon(null);
    setPatients([]);
    setShowAllPatients(false);
    setAllPatients([]);
  };

  const handleShowPatients = async () => {
    if (selectedSalon) {
      try {
        const response = await axios.get(`http://localhost:5000/patientrooms/room/${selectedSalon.id}`);
        const data: Patient[] = response.data;
        setPatients(data);
        setShowAllPatients(false);
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
      setShowAllPatients(true);
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
      const assignedPatient = allPatients.find(patient => patient.id === patientId);
      if (assignedPatient) {
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
      const dischargedPatient = patients.find(patient => patient.id === patientId);
      if (dischargedPatient) {
        setPatients(prev => prev.filter(patient => patient.id !== patientId));
        setAllPatients(prev => [...prev, dischargedPatient]);
      }
    } catch (error) {
      console.error('Error discharging patient:', error);
    }
  };

  // Dacă selectedFloor este null => afișăm toate saloanele (butonul T activ)
  const filteredSaloane = selectedFloor !== null
    ? saloane.filter(salon => salon.etaj === selectedFloor)
    : saloane;

  return (
    <div className="container">
      <Header>
        <h2>Harta Spitalului</h2>
        <FloorButtonsContainer>
          <FloorButton 
            onClick={() => setSelectedFloor(null)}
            className={selectedFloor === null ? 'active' : ''}
          >
            T
          </FloorButton>
          {[...Array(highestFloor)].map((_, i) => {
            const floorNumber = i + 1;
            return (
              <FloorButton 
                key={floorNumber} 
                onClick={() => setSelectedFloor(floorNumber)}
                className={selectedFloor === floorNumber ? 'active' : ''}
              >
                E{floorNumber}
              </FloorButton>
            );
          })}
        </FloorButtonsContainer>
      </Header>

      <GridContainer>
        {filteredSaloane.map(salon => (
          <GridItem 
            key={salon.id}
            isFull={salon.isFull}
            status={salon.status}
            onClick={() => handleSalonClick(salon)}
          >
            <span>{salon.numar_salon} - {salon.capacitate} locuri</span>
          </GridItem>
        ))}
      </GridContainer>

      {selectedSalon && (
        <div className="modal">
          <div className="modal-content">
            <h2>Detalii Salon {selectedSalon.numar_salon}</h2>
            <label>
              Secțiune: <span>{selectedSalon.sectiune}</span>
            </label>
            <label>
              Tip Salon: <span>{selectedSalon.tip_salon}</span>
            </label>
            <label>
              Capacitate: <span>{selectedSalon.capacitate} locuri</span>
            </label>
            <label>
              Status: <span>{selectedSalon.status}</span>
            </label>
            <label>
              Este full?: <span>{selectedSalon.isFull ? 'Da' : 'Nu'}</span>
            </label>
            <label>
              Cate persoane sunt internate: <span>{selectedSalon.pacienti_internati}</span>
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

            {allPatients.length > 0 && (
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
        .container {
          text-align: center;
        }
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .modal-content {
          background-color: white;
          padding: 20px;
          color: black;
          border-radius: 10px;
          width: 80%;
          max-width: 600px;
          text-align: left;
        }
        label {
          display: block;
          margin-top: 10px;
          font-size: 1.2rem;
          font-weight: bold;
        }
        button {
          margin-top: 20px;
          padding: 10px 20px;
          background-color: #4caf50;
          color: white;
          border: none;
          cursor: pointer;
        }
        .delete-button, .assign-button {
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 1.5rem;
          margin-left: 10px;
          color: red;
        }
      `}</style>
    </div>
  );
}