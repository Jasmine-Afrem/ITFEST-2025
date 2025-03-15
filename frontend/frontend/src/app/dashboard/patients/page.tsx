/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import PatientModal from "../components/PatientModal";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  max-width: 1400px;
  margin: auto;
  height: 100vh;
  overflow: hidden;
  position: relative; /* Important pentru poziționarea overlay-ului */
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px 20px;
  background: #175676;
  color: white;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  position: sticky;
  top: 0;
  z-index: 1000;
  font-size: 25px;
  margin-top: 1.6rem;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
`;

const AddPatientButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #3b82f6;
  color: white;
  font-size: 30px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, background 0.3s ease;

  &:hover {
    background: #2563eb;
    transform: scale(1.1);
  }
`;

const EditPatientsButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #f59e0b;
  color: white;
  font-size: 24px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, background 0.3s ease;

  &:hover {
    background: #d97706;
    transform: scale(1.1);
  }
`;

const MainContent = styled.div`
  display: flex;
  width: 100%;
  position: relative;
`;

const PatientsContainer = styled.div`
  flex-grow: 1;
  margin-top: 25px;
  background: #f3f4f6;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  height: calc(100vh - 100px);
  overflow-y: auto;
  max-height: 72vh;
  margin-right: 3rem;
`;

const PatientCard = styled.div`
  background: white;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 15px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  position: relative;
  transition: transform 0.2s ease-in-out;
  color: black;

  &:hover {
    transform: translateY(-3px);
  }
`;

const FilterSidebar = styled.div`
  width: 250px;
  background: white;
  box-shadow: -3px 0 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  color: black;
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  border-radius: 12px 0 0 12px;
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
  margin-top: 10px;
`;

const FilterInput = styled.input`
  width: 100%;
  padding: 8px;
  margin-top: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const PatientButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const ButtonBase = styled.button`
  padding: 12px 20px;
  border-radius: 6px;
  font-size: 16px;
  border: none;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.05);
  }
`;

const OrangeButton = styled(ButtonBase)`
  background: #f59e0b;
  color: white;

  &:hover {
    background: #d97706;
  }
`;

const GreenButton = styled(ButtonBase)`
  background: gr;
  color: white;

  &:hover {
    background: #d97706;
  }
`;



const BlueButton = styled(ButtonBase)`
  background: #3b82f6;
  color: white;

  &:hover {
    background: #2563eb;
  }
`;

const FormPopup = styled.div`
  color: black;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  width: 500px;
  height: 500px;
  overflow-y: auto;
`;

const FormTitle = styled.h3`
  margin-bottom: 20px;
`;

const FormInput = styled.input`
  color: black;
  width: 100%;
  padding: 8px;
  margin-top: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const FormButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const Overlay = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: ${(props) => (props.isVisible ? "block" : "none")};
`;

/* Noi componente pentru afișarea fișelor medicale și a analizelor */
const MedicalRecordsContainer = styled.div`
  margin-top: 20px;
  width: 100%;
  background: #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  max-height: 50vh;
  overflow-y: auto;
`;

const MedicalRecordCard = styled.div`
  background: white;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 15px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
`;

const AnalysisCard = styled.div`
  background: #f9fafb;
  padding: 10px;
  border-radius: 8px;
  margin-top: 10px;
  border: 1px solid #d1d5db;
`;

interface Patient {
  id: number;
  nume: string;
  prenume: string;
  data_nasterii: string;
  gen: string;
  telefon: string;
  email: string;
}

interface MedicalRecord {
  id: number;
  id_pacient: number;
  id_medic: number;
  diagnostic: string;
  tratament: string;
  reteta: string;
  analyses?: Analysis[];
}

interface Analysis {
  id: number;
  id_fisa_medicala: number;
  tip_analiza: string;
  rezultat: string;
  data_analiza: string;
}

export default function PatientsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [filterType, setFilterType] = useState<keyof Patient>("nume");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showForm, setShowForm] = useState(false); // Pentru crearea fișei medicale
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [showAnalysisForm, setShowAnalysisForm] = useState(false);
  const [selectedMedicalRecord, setSelectedMedicalRecord] = useState<MedicalRecord | null>(null);

  // Preia toți pacienții
  useEffect(() => {
    axios
      .get("http://localhost:5000/patients/")
      .then((res) => setPatients(res.data))
      .catch((err) => console.error("Error fetching patients:", err));
  }, []);

  // Când se selectează un pacient, preia fișele medicale aferente
  useEffect(() => {
    if (selectedPatient) {
      axios
        .get(`http://localhost:5000/medicalrecords?pacientId=${selectedPatient.id}`)
        .then((res) => setMedicalRecords(res.data))
        .catch((err) => console.error("Error fetching medical records:", err));
    }
  }, [selectedPatient]);

  const filteredPatients = patients.filter((p) => {
    const searchField = filterType === "nume" ? `${p.nume} ${p.prenume}` : p[filterType];
    return searchField.toLowerCase().includes(filter.toLowerCase());
  });

  const handlePatientClick = (patient: Patient) => {
    setSelectedPatient(patient);
  };

  // Formular pentru crearea fișei medicale
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const medicalRecord = {
      id_pacient: selectedPatient?.id,
      id_medic: 5, // Se presupune că ID-ul medicului logat este 3
      diagnostic: (e.target as any).diagnostic.value,
      tratament: (e.target as any).tratament.value,
      reteta: (e.target as any).reteta.value,
    };

    axios
      .post("http://localhost:5000/medicalrecords/add", medicalRecord)
      .then((res) => {
        alert(res.data.message);
        setShowForm(false);
        // Reîmprospătăm fișele medicale
        if (selectedPatient) {
          axios
            .get(`http://localhost:5000/medicalrecords/?pacientId=${selectedPatient.id}`)
            .then((res) => setMedicalRecords(res.data))
            .catch((err) => console.error("Error fetching medical records:", err));
        }
      })
      .catch((err) => console.error("Error adding medical record:", err));
  };

  // Formular pentru adăugarea unei analize la o fișă medicală
  const handleAnalysisSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMedicalRecord) return;
    const analysisData = {
      id_fisa_medicala: selectedMedicalRecord.id,
      tip_analiza: (e.target as any).tip_analiza.value,
      rezultat: (e.target as any).rezultat.value,
      data_analiza: (e.target as any).data_analiza.value,
    };

    axios
      .post("http://localhost:5000/medicalrecords/analize/add", analysisData)
      .then((res) => {
        alert(res.data.message);
        setShowAnalysisForm(false);
        // Reîmprospătăm fișele medicale pentru a actualiza analizele
        if (selectedPatient) {
          axios
            .get(`http://localhost:5000/medicalrecords?pacientId=${selectedPatient.id}`)
            .then((res) => setMedicalRecords(res.data))
            .catch((err) => console.error("Error fetching medical records:", err));
        }
      })
      .catch((err) => console.error("Error adding analysis:", err));
  };

  return (
    <PageContainer>
      <Header>
        <h2>Listă Pacienți</h2>
        <ButtonsContainer>
          <AddPatientButton onClick={() => setModalOpen(true)}>+</AddPatientButton>
          <EditPatientsButton onClick={() => setFilterOpen(!filterOpen)}>📝</EditPatientsButton>
        </ButtonsContainer>
      </Header>

      <MainContent>
        <PatientsContainer>
          {filteredPatients.map((patient) => (
            <PatientCard key={patient.id} onClick={() => handlePatientClick(patient)}>
              <h3>
                {patient.nume} {patient.prenume}
              </h3>
              <p>📅 Data Nașterii: {patient.data_nasterii}</p>
              <p>⚧ Sex: {patient.gen}</p>
              <p>📞 Telefon: {patient.telefon}</p>
              <p>✉ Email: {patient.email}</p>
              {selectedPatient?.id === patient.id && (
                <PatientButtonsContainer>
                  <OrangeButton onClick={() => setShowForm(true)}>
                    ✏️ Creare Fişă Nouă
                  </OrangeButton>
                </PatientButtonsContainer>
              )}
            </PatientCard>
          ))}
        </PatientsContainer>

        {filterOpen && (
          <FilterSidebar>
            <h3>Filtrare Pacienți</h3>
            <FilterSelect
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as keyof Patient)}
            >
              <option value="nume">Nume</option>
              <option value="telefon">Telefon</option>
              <option value="email">Email</option>
              <option value="gen">Sex</option>
            </FilterSelect>
            <FilterInput
              type="text"
              placeholder="Caută pacient..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </FilterSidebar>
        )}
      </MainContent>

      {/* Afișăm fișele medicale și analizele aferente dacă avem un pacient selectat */}
      {selectedPatient && (
        <MedicalRecordsContainer>
          <h3>
            Fişe Medicale pentru {selectedPatient.nume} {selectedPatient.prenume}
          </h3>
          {medicalRecords.map((record) => (
            <MedicalRecordCard key={record.id}>
              <p>
                <strong>Diagnostic:</strong> {record.diagnostic}
              </p>
              <p>
                <strong>Tratament:</strong> {record.tratament}
              </p>
              <p>
                <strong>Reţetă:</strong> {record.reteta}
              </p>
              <BlueButton
                onClick={() => {
                  setSelectedMedicalRecord(record);
                  setShowAnalysisForm(true);
                }}
              >
                ➕ Adaugă Analiză
              </BlueButton>
              {record.analyses && record.analyses.length > 0 && (
                <div>
                  <h4>Analize:</h4>
                  {record.analyses.map((analysis) => (
                    <AnalysisCard key={analysis.id}>
                      <p>
                        <strong>Tip Analiză:</strong> {analysis.tip_analiza}
                      </p>
                      <p>
                        <strong>Rezultat:</strong> {analysis.rezultat}
                      </p>
                      <p>
                        <strong>Data Analiză:</strong> {analysis.data_analiza}
                      </p>
                    </AnalysisCard>
                  ))}
                </div>
              )}
            </MedicalRecordCard>
          ))}
        </MedicalRecordsContainer>
      )}

      {/* Overlay comun pentru formulare */}
      <Overlay
        isVisible={showForm || showAnalysisForm}
        onClick={() => {
          setShowForm(false);
          setShowAnalysisForm(false);
        }}
      />

      {/* Formular pentru crearea fișei medicale */}
      {showForm && (
        <FormPopup>
          <FormTitle>Creare Fişă Medicală</FormTitle>
          <form onSubmit={handleFormSubmit}>
            <label>Diagnostic:</label>
            <FormInput name="diagnostic" required />
            <label>Tratament:</label>
            <FormInput name="tratament" required />
            <label>Reţetă:</label>
            <FormInput name="reteta" required />
            <FormButtonsContainer>
              <BlueButton type="submit">Salvează Fișa</BlueButton>
              <OrangeButton type="button" onClick={() => setShowForm(false)}>
                Anulează
              </OrangeButton>
            </FormButtonsContainer>
          </form>
        </FormPopup>
      )}

      {/* Formular pentru adăugarea unei analize la o fișă medicală */}
      {showAnalysisForm && (
        <FormPopup>
          <FormTitle>Adaugă Analiză</FormTitle>
          <form onSubmit={handleAnalysisSubmit}>
            <label>Tip Analiză:</label>
            <FormInput name="tip_analiza" required />
            <label>Rezultat:</label>
            <FormInput name="rezultat" required />
            <label>Data Analiză:</label>
            <FormInput name="data_analiza" type="date" required />
            <FormButtonsContainer>
              <BlueButton type="submit">Salvează Analiza</BlueButton>
              <OrangeButton type="button" onClick={() => setShowAnalysisForm(false)}>
                Anulează
              </OrangeButton>
            </FormButtonsContainer>
          </form>
        </FormPopup>
      )}

      {modalOpen && <PatientModal onClose={() => setModalOpen(false)} />}
    </PageContainer>
  );
}
