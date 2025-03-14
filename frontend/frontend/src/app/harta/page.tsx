'use client';

import { useState } from 'react';

type Salon = {
  id: number;
  numar_salon: string;
  tip_salon: 'General' | 'Terapie Intensiva' | 'Urgenta' | 'Privat';
  capacitate: number;
  ocupat: number;
  status: 'Liber' | 'Ocupat' | 'In Mentenanta';
  etaj: number;
  sectiune: string;
};

const initialSaloane: Salon[] = [
  { id: 1, numar_salon: '101', tip_salon: 'General', capacitate: 2, ocupat: 1, status: 'Ocupat', etaj: 1, sectiune: 'A' },
  { id: 2, numar_salon: '102', tip_salon: 'Terapie Intensiva', capacitate: 1, ocupat: 0, status: 'Liber', etaj: 1, sectiune: 'A' },
  { id: 3, numar_salon: '201', tip_salon: 'Urgenta', capacitate: 3, ocupat: 2, status: 'Ocupat', etaj: 2, sectiune: 'B' },
  { id: 4, numar_salon: '202', tip_salon: 'Privat', capacitate: 1, ocupat: 0, status: 'Liber', etaj: 2, sectiune: 'B' },
];

export default function HartaSpitalului() {
  const [saloane, setSaloane] = useState<Salon[]>(initialSaloane);
  const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null);

  const handleSalonClick = (salon: Salon) => {
    setSelectedSalon(salon);
  };

  const handleCloseModal = () => {
    setSelectedSalon(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Salon) => {
    if (selectedSalon) {
      const updatedSalon = { ...selectedSalon, [field]: e.target.value };
      setSelectedSalon(updatedSalon);
      setSaloane(saloane.map(s => (s.id === updatedSalon.id ? updatedSalon : s)));
    }
  };

  return (
    <div>
      <h1>Harta Spitalului</h1>
      <div className="grid-container">
        {saloane.map(salon => (
          <div
            key={salon.id}
            className={`grid-item ${salon.status.toLowerCase()}`}
            onClick={() => handleSalonClick(salon)}
          >
            <span className="text-negru">{salon.numar_salon}</span>
          </div>
        ))}
      </div>

      {selectedSalon && (
        <div className="modal">
          <div className="modal-content">
            <h2>Detalii Salon {selectedSalon.numar_salon}</h2>
            <label>
              Etaj:
              <input
                type="number"
                value={selectedSalon.etaj}
                onChange={e => handleInputChange(e, 'etaj')}
              />
            </label>
            <label>
              Secțiune:
              <input
                type="text"
                value={selectedSalon.sectiune}
                onChange={e => handleInputChange(e, 'sectiune')}
              />
            </label>
            <label>
              Tip Salon:
              <input
                type="text"
                value={selectedSalon.tip_salon}
                onChange={e => handleInputChange(e, 'tip_salon')}
              />
            </label>
            <label>
              Status:
              <input
                type="text"
                value={selectedSalon.status}
                onChange={e => handleInputChange(e, 'status')}
              />
            </label>
            <button onClick={handleCloseModal}>Închide</button>
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
        }
        label {
          display: block;
          margin-top: 10px;
        }
        input {
          width: 100%;
          padding: 8px;
          margin-top: 5px;
        }
        button {
          margin-top: 20px;
          padding: 10px 20px;
          background-color: #4caf50;
          color: white;
          border: none;
          cursor: pointer;
        }
        .text-negru {
          color: black;
        }
      `}</style>
    </div>
  );
}
