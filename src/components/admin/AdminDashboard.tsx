import React, { useState } from 'react';
import { Users, Recycle, Star, TrendingUp, Calendar, MapPin, Settings, BarChart3 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { mockCiudadanos, mockRecicladores, mockRecolecciones, mockValoraciones } from '../../data/mockData';
import { AdminStats } from '../../types';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'usuarios' | 'recolecciones' | 'estadisticas'>('dashboard');

  // Calcular estadísticas
  const stats: AdminStats = {
    totalUsuarios: mockCiudadanos.length + mockRecicladores.length,
    totalCiudadanos: mockCiudadanos.length,
    totalRecicladores: mockRecicladores.length,
    totalRecolecciones: mockRecolecciones.length,
    recoleccionesCompletadas: mockRecolecciones.filter(r => r.estado === 'completada').length,
    recoleccionesPendientes: mockRecolecciones.filter(r => r.estado === 'pendiente').length,
    promedioValoraciones: mockValoraciones.reduce((acc, v) => acc + v.rating, 0) / mockValoraciones.length || 0,
    kgTotalReciclados: 156.8
  };

  if (activeTab === 'usuarios') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
            <p className="text-gray-600 mt-2">Administra ciudadanos y recicladores</p>
          </div>
          <Button variant="outline" onClick={() => setActiveTab('dashboard')}>
            Volver al Dashboard
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ciudadanos */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Ciudadanos ({mockCiudadanos.length})
            </h2>
            <div className="space-y-4">
              {mockCiudadanos.map((ciudadano) => (
                <div key={ciudadano.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{ciudadano.name}</p>
                      <p className="text-sm text-gray-600">{ciudadano.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="info" size="sm">Activo</Badge>
                    <Button variant="outline" size="sm">Ver Perfil</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recicladores */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Recicladores ({mockRecicladores.length})
            </h2>
            <div className="space-y-4">
              {mockRecicladores.map((reciclador) => (
                <div key={reciclador.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Recycle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{reciclador.name}</p>
                      <p className="text-sm text-gray-600">{reciclador.email}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-500">{reciclador.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="success" size="sm">Verificado</Badge>
                    <Button variant="outline" size="sm">Ver Perfil</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (activeTab === 'recolecciones') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Recolecciones</h1>
            <p className="text-gray-600 mt-2">Monitorea todas las recolecciones</p>
          </div>
          <Button variant="outline" onClick={() => setActiveTab('dashboard')}>
            Volver al Dashboard
          </Button>
        </div>

        <div className="space-y-6">
          {mockRecolecciones.map((recoleccion) => {
            const ciudadano = mockCiudadanos.find(c => c.id === recoleccion.ciudadanoId);
            const reciclador = recoleccion.recicladorId 
              ? mockRecicladores.find(r => r.id === recoleccion.recicladorId)
              : null;

            return (
              <Card key={recoleccion.id}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge 
                        variant={
                          recoleccion.estado === 'completada' ? 'success' :
                          recoleccion.estado === 'pendiente' ? 'warning' :
                          recoleccion.estado === 'aceptada' ? 'info' : 'default'
                        }
                      >
                        {recoleccion.estado}
                      </Badge>
                      <span className="text-sm text-gray-500">#{recoleccion.id}</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Ciudadano</p>
                        <p className="text-sm text-gray-600">{ciudadano?.name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Reciclador</p>
                        <p className="text-sm text-gray-600">{reciclador?.name || 'Sin asignar'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Fecha</p>
                        <p className="text-sm text-gray-600">
                          {new Date(recoleccion.fecha).toLocaleDateString('es-CO')} - {recoleccion.hora}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700">Dirección</p>
                      <p className="text-sm text-gray-600">{recoleccion.direccion}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <Button variant="outline" size="sm">Ver Detalles</Button>
                    <Button variant="outline" size="sm">Editar</Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  if (activeTab === 'estadisticas') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Estadísticas y Reportes</h1>
            <p className="text-gray-600 mt-2">Análisis detallado de la plataforma</p>
          </div>
          <Button variant="outline" onClick={() => setActiveTab('dashboard')}>
            Volver al Dashboard
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRecolecciones}</p>
              <p className="text-sm text-gray-600">Total Recolecciones</p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Recycle className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.kgTotalReciclados}kg</p>
              <p className="text-sm text-gray-600">Material Reciclado</p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.promedioValoraciones.toFixed(1)}</p>
              <p className="text-sm text-gray-600">Promedio Valoraciones</p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsuarios}</p>
              <p className="text-sm text-gray-600">Usuarios Registrados</p>
            </div>
          </Card>
        </div>

        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumen de Actividad</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Recolecciones Completadas</span>
              <span className="text-lg font-bold text-green-600">{stats.recoleccionesCompletadas}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Recolecciones Pendientes</span>
              <span className="text-lg font-bold text-yellow-600">{stats.recoleccionesPendientes}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Tasa de Éxito</span>
              <span className="text-lg font-bold text-blue-600">
                {((stats.recoleccionesCompletadas / stats.totalRecolecciones) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
        <p className="text-gray-600 mt-2">Gestiona la plataforma CicloVida</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsuarios}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <Recycle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Recolecciones</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRecolecciones}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Valoración Promedio</p>
              <p className="text-2xl font-bold text-gray-900">{stats.promedioValoraciones.toFixed(1)}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Kg Reciclados</p>
              <p className="text-2xl font-bold text-gray-900">{stats.kgTotalReciclados}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Gestión Rápida</h2>
          <div className="space-y-3">
            <Button className="w-full justify-start" onClick={() => setActiveTab('usuarios')}>
              <Users className="w-4 h-4 mr-2" />
              Gestionar Usuarios
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('recolecciones')}>
              <Calendar className="w-4 h-4 mr-2" />
              Ver Recolecciones
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('estadisticas')}>
              <BarChart3 className="w-4 h-4 mr-2" />
              Estadísticas y Reportes
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Settings className="w-4 h-4 mr-2" />
              Configuración del Sistema
            </Button>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Actividad Reciente</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Nueva recolección agendada</p>
                <p className="text-sm text-gray-600">Hace 2 horas</p>
              </div>
              <Badge variant="info" size="sm">Nueva</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Reciclador registrado</p>
                <p className="text-sm text-gray-600">Hace 5 horas</p>
              </div>
              <Badge variant="success" size="sm">Registro</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Recolección completada</p>
                <p className="text-sm text-gray-600">Hace 1 día</p>
              </div>
              <Badge variant="success" size="sm">Completada</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};