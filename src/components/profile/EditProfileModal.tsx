import React, { useState } from 'react';
import { User, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { useAuth } from '../../context/AuthContext';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const areasCobertura = [
  { value: 'chapinero', label: 'Chapinero' },
  { value: 'zona_rosa', label: 'Zona Rosa' },
  { value: 'la_candelaria', label: 'La Candelaria' },
  { value: 'suba', label: 'Suba' },
  { value: 'engativa', label: 'Engativá' },
  { value: 'fontibon', label: 'Fontibón' }
];

const horasTrabajo = [
  { value: '06:00', label: '6:00 AM' },
  { value: '07:00', label: '7:00 AM' },
  { value: '08:00', label: '8:00 AM' },
  { value: '09:00', label: '9:00 AM' },
  { value: '14:00', label: '2:00 PM' },
  { value: '15:00', label: '3:00 PM' },
  { value: '16:00', label: '4:00 PM' },
  { value: '17:00', label: '5:00 PM' },
  { value: '18:00', label: '6:00 PM' }
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose
}) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: '',
    description: '',
    coverageAreas: [] as string[],
    workingHours: { start: '07:00', end: '17:00' }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simular actualización
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    onClose();
  };

  const handleCoverageAreaChange = (area: string) => {
    setFormData(prev => ({
      ...prev,
      coverageAreas: prev.coverageAreas.includes(area)
        ? prev.coverageAreas.filter(a => a !== area)
        : [...prev.coverageAreas, area]
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Perfil" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nombre completo"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
          
          <Input
            label="Teléfono"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            required
          />
        </div>

        <Input
          label="Correo electrónico"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          required
          disabled
        />

        {user?.type === 'ciudadano' && (
          <Input
            label="Dirección"
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            placeholder="Tu dirección completa"
          />
        )}

        {user?.type === 'reciclador' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe tu experiencia y servicios..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Áreas de Cobertura
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {areasCobertura.map((area) => (
                  <label key={area.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.coverageAreas.includes(area.value)}
                      onChange={() => handleCoverageAreaChange(area.value)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm">{area.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Hora de inicio"
                value={formData.workingHours.start}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  workingHours: { ...prev.workingHours, start: e.target.value }
                }))}
                options={horasTrabajo}
              />
              
              <Select
                label="Hora de fin"
                value={formData.workingHours.end}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  workingHours: { ...prev.workingHours, end: e.target.value }
                }))}
                options={horasTrabajo}
              />
            </div>
          </>
        )}

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Guardar Cambios
          </Button>
        </div>
      </form>
    </Modal>
  );
};