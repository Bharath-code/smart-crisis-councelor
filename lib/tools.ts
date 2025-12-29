import { Location } from '@/types';

export async function getLocation(): Promise<Location | null> {
  const options: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 10000, // Increased timeout to 10 seconds
    maximumAge: 0
  };

  const getPosition = (opts: PositionOptions): Promise<Location> => {
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
          reject(error);
        },
        opts
      );
    });
  };

  try {
    return await getPosition(options);
  } catch (error) {
    // If high accuracy failed or timed out, try one more time with lower accuracy
    if (error instanceof GeolocationPositionError &&
      (error.code === error.POSITION_UNAVAILABLE || error.code === error.TIMEOUT)) {
      try {
        console.warn('High accuracy location failed, retrying with low accuracy...');
        return await getPosition({ ...options, enableHighAccuracy: false });
      } catch (retryError) {
        throw new Error(getGeolocationErrorMessage(retryError as GeolocationPositionError));
      }
    }
    throw new Error(getGeolocationErrorMessage(error as GeolocationPositionError));
  }
}

function getGeolocationErrorMessage(error: GeolocationPositionError): string {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return 'Location permission denied';
    case error.POSITION_UNAVAILABLE:
      return 'Location information is unavailable';
    case error.TIMEOUT:
      return 'Location request timed out';
    default:
      return 'An unknown error occurred getting location';
  }
}

export async function alertEmergencyServices(_priority: 'high' | 'medium', autoCall: boolean = true): Promise<{ success: boolean; location?: Location; called?: boolean }> {
  let location: Location | undefined;

  try {
    const loc = await getLocation();
    if (loc) location = loc;
  } catch (error) {
    console.warn('Could not retrieve location for emergency services:', error);
  }

  const result: { success: boolean; location?: Location; called: boolean } = {
    success: true,
    called: false
  };

  if (location) {
    result.location = location;
  }

  if (autoCall) {
    window.location.href = "tel:911";
    result.called = true;
  }

  return result;
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
