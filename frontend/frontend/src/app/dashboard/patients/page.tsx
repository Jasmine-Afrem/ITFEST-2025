/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import PatientModal from "../components/PatientModal";
import AdaugaFisa from "../../butoane/adaugafisa";
import ModificaFisa from "../../butoane/modificafisa";
import AdaugaAnaliza from "../../butoane/adaugaanaliza";
import ModificaAnaliza from "../../butoane/modificaanaliza";
import Externare from "../../butoane/externare";
import VizualizareDetaliataPacient from "../../butoane/vizualizaredetaliatapacient";
import StergePacient from "../../butoane/stergepacient";
import { useSearchParams } from 'next/navigation';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  max-width: 1500px;
  margin: auto;
  height: 100vh;
  overflow: hidden;
  position: relative;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px 20px;
  background: rgba(23, 87, 118, 0.9); /* Glass effect */
  backdrop-filter: blur(10px);
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
  position: relative;
  top: -8px;
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
  position: relative;
  top: -8px;
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
  max-height: 69vh;
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
  margin-top: 10px;
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
  background: #10b981;
  color: white;

  &:hover {
    background: #059669;
  }
`;

const BlueButton = styled(ButtonBase)`
  background: #3b82f6;
  color: white;

  &:hover {
    background: #2563eb;
  }
`;

const RedButton = styled(ButtonBase)`
  background: #ef4444;
  color: white;

  &:hover {
    background: #dc2626;
  }
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
  position: relative;
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
interface PatientData{
  firstName : string;
  lastName : string;
  birthDate : string;
  seria: string;
  nr : string;
  cnp : string;
  nationality : string;
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
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [selectedMedicalRecord, setSelectedMedicalRecord] = useState<MedicalRecord | null>(null);
  const searchParams = useSearchParams();
  console.log(searchParams)

  // State-uri pentru componentele externe
  const [showAdaugaFisa, setShowAdaugaFisa] = useState(false);
  const [showModificaFisa, setShowModificaFisa] = useState(false);
  const [showAdaugaAnaliza, setShowAdaugaAnaliza] = useState(false);
  const [showModificaAnaliza, setShowModificaAnaliza] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null);
  const [showVizualizareDetaliata, setShowVizualizareDetaliata] = useState(false);
  const [showExternare, setShowExternare] = useState(false);
  const [showStergePacient, setShowStergePacient] = useState(false);
  const [initialFormData, setInitialFormData] = useState<PatientData | null>(null);

  const refreshPatients = () => {
    axios
      .get("http://localhost:5000/patients/")
      .then((res) => setPatients(res.data))
      .catch((err) => console.error("Error fetching patients:", err));
  };

  const refreshRecords = () => {
    if (selectedPatient) {
      axios
        .get(`http://localhost:5000/medicalrecords?pacientId=${selectedPatient.id}`)
        .then((res) => setMedicalRecords(res.data))
        .catch((err) =>
          console.error("Error fetching medical records:", err)
        );
    }
  };

 // In your PatientsPage component
useEffect(() => {
  const showModalParam = searchParams.get('showModal');
  
  if (showModalParam) {
    const [modalFlag, ...paramsArray] = showModalParam.split('/');
    
    if (modalFlag === 'true') {
      const [
        firstName,
        lastName,
        birthDate,
        seria,
        nr,
        cnp,
        nationality
      ] = paramsArray;

      setInitialFormData({
        firstName: firstName || '', // Map firstName to prenume
        lastName: lastName || '',     // Map lastName to nume
        birthDate: birthDate || '',
        seria: seria ,
        nr: nr || '',
        cnp: cnp || '',
        nationality: nationality || '',
      });

      setModalOpen(true);
    }
  }
  refreshPatients();
}, [searchParams]);


  const filteredPatients = patients.filter((p) => {
    const searchField =
      filterType === "nume" ? `${p.nume} ${p.prenume}` : p[filterType];
    return searchField.toLowerCase().includes(filter.toLowerCase());
  });

  const handlePatientClick = (patient: Patient) => {
    setSelectedPatient(patient);
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
              <p>🗓️ Data Nașterii: {patient.data_nasterii}</p>
              <p>⚧ Sex: {patient.gen}</p>
              <p>📞 Telefon: {patient.telefon}</p>
              <p>✉️ Email: {patient.email}</p>
              {selectedPatient?.id === patient.id && (
                <PatientButtonsContainer>
                  <OrangeButton onClick={() => setShowAdaugaFisa(true)}>
                  📝 Creare Fișă Nouă
                  </OrangeButton>
                  <BlueButton onClick={() => setShowVizualizareDetaliata(true)}>
                    🔍 Vizualizare
                  </BlueButton>
                  <GreenButton onClick={() => setShowExternare(true)}>
                    🚪 Externare
                  </GreenButton>
                  <RedButton onClick={() => setShowStergePacient(true)}>
                    🗑 Ștergere
                  </RedButton>
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

     
      <Overlay
        isVisible={
          showAdaugaFisa ||
          showModificaFisa ||
          showAdaugaAnaliza ||
          showModificaAnaliza ||
          showVizualizareDetaliata ||
          showExternare ||
          showStergePacient
        }
        onClick={() => {
          setShowAdaugaFisa(false);
          setShowModificaFisa(false);
          setShowAdaugaAnaliza(false);
          setShowModificaAnaliza(false);
          setShowVizualizareDetaliata(false);
          setShowExternare(false);
          setShowStergePacient(false);
        }}
      />

      {/* Componente externe */}
      {showAdaugaFisa && selectedPatient && (
        <AdaugaFisa
          selectedPatient={selectedPatient}
          onClose={() => setShowAdaugaFisa(false)}
          refreshRecords={refreshRecords}
        />
      )}

      {showModificaFisa && selectedMedicalRecord && (
        <ModificaFisa
          medicalRecord={selectedMedicalRecord}
          onClose={() => setShowModificaFisa(false)}
          refreshRecords={refreshRecords}
        />
      )}

      {showAdaugaAnaliza && selectedMedicalRecord && (
        <AdaugaAnaliza
          id_fisa_medicala={selectedMedicalRecord.id}
          onClose={() => setShowAdaugaAnaliza(false)}
          refreshAnalyses={refreshRecords}
        />
      )}

      {showModificaAnaliza && selectedAnalysis && (
        <ModificaAnaliza
          analysis={selectedAnalysis}
          onClose={() => setShowModificaAnaliza(false)}
          refreshAnalyses={refreshRecords}
        />
      )}

      {showVizualizareDetaliata && selectedPatient && (
        <VizualizareDetaliataPacient
          patientId={selectedPatient.id}
          onClose={() => setShowVizualizareDetaliata(false)}
        />
      )}

      {showExternare && selectedPatient && (
        <Externare
          patient={selectedPatient}
          onClose={() => setShowExternare(false)}
          refreshPatient={refreshPatients}
        />
      )}

      {showStergePacient && selectedPatient && (
        <StergePacient
          patient={selectedPatient}
          onClose={() => setShowStergePacient(false)}
          refreshPatients={refreshPatients}
        />
      )}v



{modalOpen && (
  <PatientModal 
    closeModal={() => setModalOpen(false)} 
    refreshPatients={refreshPatients}
    initialValues={{
      prenume: initialFormData?.firstName || '',
      nume: initialFormData?.lastName || '',
      data_nasterii: initialFormData?.birthDate || '',
      serie_numar_buletin: `${initialFormData?.seria || ''} ${initialFormData?.nr || ''}`.trim(),
      cnp: initialFormData?.cnp || '',
      cetatenie: initialFormData?.nationality || ''
    }}
  />
)}
    </PageContainer>
  );
}
