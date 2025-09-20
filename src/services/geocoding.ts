// src/services/geocoding.ts
export interface GeocodingResult {
    lat: number;
    lng: number;
    address: string;
  }
  
  export const geocodeAddress = async (address: string): Promise<GeocodingResult> => {
    try {
      const geocoder = new window.google.maps.Geocoder();
      const response = await geocoder.geocode({ address });
      
      if (response.results.length === 0) {
        throw new Error('No se encontró la dirección');
      }
  
      const { lat, lng } = response.results[0].geometry.location;
      return {
        lat: lat(),
        lng: lng(),
        address: response.results[0].formatted_address
      };
    } catch (error) {
      console.error('Error en geocodificación:', error);
      throw error;
    }
  };