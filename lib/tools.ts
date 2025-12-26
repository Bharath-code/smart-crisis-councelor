import { Location } from '@/types';

export async function getLocation(): Promise<Location | null> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error('Location permission denied'));
            break;
          case error.POSITION_UNAVAILABLE:
            reject(new Error('Location information is unavailable'));
            break;
          case error.TIMEOUT:
            reject(new Error('Location request timed out'));
            break;
          default:
            reject(new Error('An unknown error occurred getting location'));
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  });
}

export async function alertEmergencyServices(_priority: 'high' | 'medium', autoCall: boolean = true): Promise<{ success: boolean; location?: Location; called?: boolean }> {
  try {
    const location = await getLocation();
    
    const result: { success: boolean; location?: Location; called: boolean } = {
      success: true,
      called: false
    };

    if (location) {
      result.location = location;
    }

    if (autoCall && location) {
      window.location.href = "tel:911";
      result.called = true;
    }

    return result;
  } catch (error) {
    console.error('Failed to alert emergency services:', error);
    return {
      success: false,
      called: false
    };
  }
}

export async function provideLocalResource(type: 'mental_health' | 'poison_control') {
  const resources: Record<string, { phone: string; name: string; description: string }> = {
    mental_health: {
      phone: '988',
      name: 'National Suicide Prevention Lifeline',
      description: '24/7 crisis support'
    },
    poison_control: {
      phone: '1-800-222-1222',
      name: 'Poison Control',
      description: '24/7 poison emergency hotline'
    }
  };

  return resources[type] || null;
}

export function formatPhoneNumber(phone: string): string {
  if (phone === '911' || phone === '741741') {
    return phone;
  }
  
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  return phone;
}

export function callPhoneNumber(phone: string): void {
  window.location.href = `tel:${phone}`;
}
