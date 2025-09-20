import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Recoleccion, Reciclador } from '../../types';
import { ReviewService } from '../../services/ReviewService';

interface ValoracionModalProps {
  isOpen: boolean;
  onClose: () => void;
  recoleccion: Recoleccion;
  reciclador: Reciclador;
  onSuccess: () => void;
}

export const ValoracionModal: React.FC<ValoracionModalProps> = ({
  isOpen,
  onClose,
  recoleccion,
  reciclador,
  onSuccess
}) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comentario, setComentario] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setIsLoading(true);
    
    try {
      const currentUserId = "user-123";

      await ReviewService.createReview(reciclador.id, {
        rating,
        comentario,
        usuarioId: currentUserId,
      });
      
      onSuccess();
      onClose();
      
      setRating(0);
      setHoveredRating(0);
      setComentario('');

    } catch (error) {
      console.log("Error al enviar la valoración:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStarClick = (value: number) => {
    setRating(value);
  };

  const handleStarHover = (value: number) => {
    setHoveredRating(value);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  const displayRating = hoveredRating || rating;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Valorar Recolección" size="md">
      <div className="space-y-6">
        {/* Información del reciclador */}
        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-green-600 font-semibold text-lg">
              {reciclador.name.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{reciclador.name}</h3>
            <p className="text-sm text-gray-600">
              Recolección completada el {new Date(recoleccion.fecha).toLocaleDateString('es-CO')}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sistema de estrellas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Califica el servicio
            </label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleStarClick(value)}
                  onMouseEnter={() => handleStarHover(value)}
                  onMouseLeave={handleStarLeave}
                  className="p-1 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      value <= displayRating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                {rating === 1 && 'Muy malo'}
                {rating === 2 && 'Malo'}
                {rating === 3 && 'Regular'}
                {rating === 4 && 'Bueno'}
                {rating === 5 && 'Excelente'}
              </p>
            )}
          </div>

          {/* Comentario */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comentario (opcional)
            </label>
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Comparte tu experiencia con este reciclador..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              {comentario.length}/500 caracteres
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              isLoading={isLoading}
              disabled={rating === 0}
            >
              Enviar Valoración
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};