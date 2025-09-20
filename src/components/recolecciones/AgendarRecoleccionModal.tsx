import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Card } from '../ui/Card';
import { useCreateAppointment } from '../../hook/useCreateAppointment';
import { useAuth } from '../../context/AuthContext';

interface AgendarRecoleccionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const tiposMaterial = [
  { value: 'papel', label: 'Papel' },
  { value: 'carton', label: 'Cartón' },
  { value: 'plastico', label: 'Plástico' },
  { value: 'vidrio', label: 'Vidrio' },
  { value: 'metal', label: 'Metal' },
  { value: 'electronico', label: 'Electrónico' }
];

const horasDisponibles = [
  { value: '08:00', label: '8:00 AM' },
  { value: '09:00', label: '9:00 AM' },
  { value: '10:00', label: '10:00 AM' },
  { value: '11:00', label: '11:00 AM' },
  { value: '14:00', label: '2:00 PM' },
  { value: '15:00', label: '3:00 PM' },
  { value: '16:00', label: '4:00 PM' },
  { value: '17:00', label: '5:00 PM' }
];

export const AgendarRecoleccionModal: React.FC<AgendarRecoleccionModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const initialFormState = useMemo(() => ({
    fecha: '',
    hora: '',
    direccion: '',
    tipoMaterial: [] as string[],
    descripcion: ''
  }), []);
  
  const [formData, setFormData] = useState(initialFormState);
  const { createAppointment, loading } = useCreateAppointment();
  const { user } = useAuth();

  // Efecto para limpiar el formulario cuando el modal se cierre
  useEffect(() => {
    if (!isOpen) {
      // Resetear el formulario cuando el modal se cierra
      setFormData(initialFormState);
    }
  }, [isOpen, initialFormState]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Construir fecha/hora como timestamp estilo Firestore a partir de inputs
      const isoString = `${formData.fecha}T${formData.hora}:00`;
      const date = new Date(isoString);
      const seconds = Math.floor(date.getTime() / 1000);

      // Nota: recicladorId no se selecciona en este modal actualmente.
      // Si en tu flujo ya conoces el reciclador, puedes pasarle por props o administrar su selección en el padre.
      // Por ahora, enviamos una cadena vacía para mantener compatibilidad con el payload del backend si es requerido.

    const created = await createAppointment({
      clienteId: user?.id || 'anon',
      recicladorId: '',
      fecha: { seconds, nanoseconds: 0 },
      direccion: formData.direccion,
      cantidadAproxMaterial: formData.tipoMaterial.length, // El modal no pide cantidad; ajusta si agregas este campo
      descripcion: formData.descripcion || 'Solicitud de recolección',
      estado: 'pendiente',
      materials: formData.tipoMaterial,
    });

      // Siempre limpiar el formulario y cerrar el modal si la API fue llamada
      // independientemente de la respuesta

      // Resetear el formulario
      setFormData(initialFormState);
      
      // Notificar al padre y cerrar el modal
      if (created) {
        onSubmit(created);
      } else {
        // Si no hay datos creados, al menos enviar los datos del formulario
        // para que el padre pueda manejar la situación
        onSubmit({
          ...payload,
          id: 'temp-' + Date.now(), // ID temporal
          estado: 'pendiente' as const,
        });
      }
      
      // Cerrar el modal después de todo el proceso
      setTimeout(() => {
        onClose();
      }, 100); // Pequeño timeout para asegurar que React procese los cambios de estado
    } catch (error) {
      console.error('Error al agendar recolección:', error);
      alert('Hubo un error al agendar la recolección. Por favor intenta nuevamente.');
    }
  };

  const handleMaterialChange = (material: string) => {
    setFormData(prev => ({
      ...prev,
      tipoMaterial: prev.tipoMaterial.includes(material)
        ? prev.tipoMaterial.filter(m => m !== material)
        : [...prev.tipoMaterial, material]
    }));
  };

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Agendar Recolección" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Fecha"
            type="date"
            value={formData.fecha}
            min={minDate}
            onChange={(e) => setFormData(prev => ({ ...prev, fecha: e.target.value }))}
            required
          />

          <Select
            label="Hora"
            value={formData.hora}
            onChange={(e) => setFormData(prev => ({ ...prev, hora: e.target.value }))}
            options={[{ value: '', label: 'Seleccionar hora' }, ...horasDisponibles]}
            required
          />
        </div>

        <Input
          label="Dirección"
          value={formData.direccion}
          onChange={(e) => setFormData(prev => ({ ...prev, direccion: e.target.value }))}
          placeholder="Ingresa tu dirección completa"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Tipo de Material
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {tiposMaterial.map((tipo) => (
              <Card key={tipo.value} padding="sm">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.tipoMaterial.includes(tipo.value)}
                    onChange={() => handleMaterialChange(tipo.value)}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm font-medium">{tipo.label}</span>
                </label>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción (opcional)
          </label>
          <textarea
            value={formData.descripcion}
            onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
            placeholder="Describe los materiales a recolectar..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            isLoading={loading}
            disabled={!formData.fecha || !formData.hora || !formData.direccion || formData.tipoMaterial.length === 0}
          >
            Agendar Recolección
          </Button>
        </div>
      </form>
    </Modal>
  );
};