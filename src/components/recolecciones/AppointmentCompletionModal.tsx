import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { useAppointmentCompletion } from '../../hook/useAppointmentCompletion';
import type { AppointmentCompletionPayload } from '../../types/appointmentCompletion.types';

interface AppointmentCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: string;
  onSuccess?: (data: any) => void;
}

export const AppointmentCompletionModal: React.FC<AppointmentCompletionModalProps> = ({
  isOpen,
  onClose,
  appointmentId,
  onSuccess,
}) => {
  const { loading, error, completeAppointment } = useAppointmentCompletion();

  const [pesoTotal, setPesoTotal] = useState<number>(0);
  const [cantidadContenedores, setCantidadContenedores] = useState<number>(0);
  const [observaciones, setObservaciones] = useState<string>('');
  const [fotosRaw, setFotosRaw] = useState<string>('https://www.envaselia.com/images_blog/que-plasticos-se-reciclan.jpg'); // CSV URLs
  const [detalleMaterial, setDetalleMaterial] = useState<Array<{ tipo: string; cantidad: number }>>([
    { tipo: '', cantidad: 0 },
  ]);

  const handleAddMaterial = () => setDetalleMaterial(prev => [...prev, { tipo: '', cantidad: 0 }]);
  const handleRemoveMaterial = (index: number) => setDetalleMaterial(prev => prev.filter((_, i) => i !== index));
  const handleMaterialChange = (index: number, field: 'tipo' | 'cantidad', value: string | number) => {
    setDetalleMaterial(prev => prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: AppointmentCompletionPayload = {
      fotos: fotosRaw
        .split(',')
        .map(s => s.trim())
        .filter(Boolean),
      pesoTotal: Number(pesoTotal) || 0,
      detalleMaterial: detalleMaterial
        .filter(m => m.tipo && Number(m.cantidad) > 0)
        .map(m => ({ tipo: m.tipo, cantidad: Number(m.cantidad) })),
      cantidadContenedores: Number(cantidadContenedores) || 0,
      observaciones: observaciones || '',
    };

    await completeAppointment(appointmentId, payload);

    if (!error) {
      onSuccess?.(payload);
      onClose();
      // reset form
      setPesoTotal(0);
      setCantidadContenedores(0);
      setObservaciones('');
      setFotosRaw('');
      setDetalleMaterial([{ tipo: '', cantidad: 0 }]);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar Finalización" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Peso total (kg)"
            type="number"
            min={0}
            step={0.1}
            value={pesoTotal as unknown as string}
            onChange={(e) => setPesoTotal(Number(e.target.value))}
            required
          />
          <Input
            label="Cantidad de contenedores"
            type="number"
            min={0}
            value={cantidadContenedores as unknown as string}
            onChange={(e) => setCantidadContenedores(Number(e.target.value))}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Detalle de materiales</label>
          <div className="space-y-3">
            {detalleMaterial.map((m, idx) => (
              <Card key={idx} padding="sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                  <Input
                    label="Tipo"
                    placeholder="plastico, papel, vidrio..."
                    value={m.tipo}
                    onChange={(e) => handleMaterialChange(idx, 'tipo', e.target.value)}
                  />
                  <Input
                    label="Cantidad (kg)"
                    type="number"
                    min={0}
                    step={0.1}
                    value={m.cantidad as unknown as string}
                    onChange={(e) => handleMaterialChange(idx, 'cantidad', Number(e.target.value))}
                  />
                  <div className="flex space-x-2">
                    <Button type="button" variant="outline" onClick={() => handleRemoveMaterial(idx)}>
                      Quitar
                    </Button>
                    {idx === detalleMaterial.length - 1 && (
                      <Button type="button" onClick={handleAddMaterial}>
                        Agregar
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Observaciones</label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            rows={3}
            placeholder="Notas adicionales..."
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm">{error.message}</div>
        )}

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={loading}>
            Registrar Finalización
          </Button>
        </div>
      </form>
    </Modal>
  );
};
