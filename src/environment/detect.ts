/**
 * Utilitários de detecção de ambiente
 */

/**
 * Detecta se está em ambiente de navegador
 * @returns true se estiver em navegador
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * Detecta se está em ambiente Node.js
 * @returns true se estiver em Node.js
 */
export function isNode(): boolean {
  return (
    typeof process !== 'undefined' &&
    process.versions != null &&
    process.versions.node != null
  );
}

/**
 * Detecta se está em worker
 * @returns true se estiver em worker
 */
export function isWorker(): boolean {
  return typeof self !== 'undefined' && typeof importScripts === 'function';
}

/**
 * Detecta tipo de dispositivo
 * @returns Tipo de dispositivo
 */
export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (!isBrowser()) {
    return 'desktop';
  }

  const ua = navigator.userAgent;

  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }

  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }

  return 'desktop';
}

/**
 * Detecta se é dispositivo móvel
 * @returns true se for móvel
 */
export function isMobile(): boolean {
  return getDeviceType() === 'mobile';
}

/**
 * Detecta se é tablet
 * @returns true se for tablet
 */
export function isTablet(): boolean {
  return getDeviceType() === 'tablet';
}

/**
 * Detecta se é desktop
 * @returns true se for desktop
 */
export function isDesktop(): boolean {
  return getDeviceType() === 'desktop';
}

/**
 * Detecta sistema operacional
 * @returns Sistema operacional
 */
export function getOS():
  | 'Windows'
  | 'macOS'
  | 'Linux'
  | 'iOS'
  | 'Android'
  | 'Unknown' {
  if (!isBrowser()) {
    return 'Unknown';
  }

  const ua = navigator.userAgent;

  if (/Windows/i.test(ua)) return 'Windows';
  if (/Mac OS/i.test(ua)) return 'macOS';
  if (/Linux/i.test(ua)) return 'Linux';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS';
  if (/Android/i.test(ua)) return 'Android';

  return 'Unknown';
}

/**
 * Detecta navegador
 * @returns Informações do navegador
 */
export function getBrowser(): {
  name: string;
  version: string;
} {
  if (!isBrowser()) {
    return { name: 'Unknown', version: 'Unknown' };
  }

  const ua = navigator.userAgent;
  let name = 'Unknown';
  let version = 'Unknown';

  if (/Edge\/(\d+)/.test(ua)) {
    name = 'Edge';
    version = RegExp.$1;
  } else if (/Edg\/(\d+)/.test(ua)) {
    name = 'Edge';
    version = RegExp.$1;
  } else if (/Chrome\/(\d+)/.test(ua)) {
    name = 'Chrome';
    version = RegExp.$1;
  } else if (/Firefox\/(\d+)/.test(ua)) {
    name = 'Firefox';
    version = RegExp.$1;
  } else if (/Safari\/(\d+)/.test(ua) && !/Chrome/.test(ua)) {
    name = 'Safari';
    version = RegExp.$1;
  } else if (/MSIE (\d+)|Trident.*rv:(\d+)/.test(ua)) {
    name = 'IE';
    version = RegExp.$1 || RegExp.$2;
  }

  return { name, version };
}

/**
 * Verifica se o navegador suporta uma feature
 * @param feature - Nome da feature
 * @returns true se suportar
 */
export function supportsFeature(feature: string): boolean {
  if (!isBrowser()) {
    return false;
  }

  const features: Record<string, boolean> = {
    localStorage: typeof Storage !== 'undefined' && !!window.localStorage,
    sessionStorage: typeof Storage !== 'undefined' && !!window.sessionStorage,
    webWorker: typeof Worker !== 'undefined',
    serviceWorker: 'serviceWorker' in navigator,
    webSocket: typeof WebSocket !== 'undefined',
    geolocation: 'geolocation' in navigator,
    notification: 'Notification' in window,
    webRTC: !!(
      (window as typeof window & { RTCPeerConnection?: unknown }).RTCPeerConnection ||
      (window as typeof window & { webkitRTCPeerConnection?: unknown }).webkitRTCPeerConnection
    ),
    webGL: (() => {
      try {
        const canvas = document.createElement('canvas');
        return !!(
          canvas.getContext('webgl') ||
          canvas.getContext('experimental-webgl')
        );
      } catch {
        return false;
      }
    })(),
    canvas: (() => {
      const elem = document.createElement('canvas');
      return !!(elem.getContext && elem.getContext('2d'));
    })(),
    touchEvents: 'ontouchstart' in window,
    crypto: typeof crypto !== 'undefined' && !!crypto.subtle,
  };

  return features[feature] ?? false;
}

/**
 * Detecta orientação do dispositivo
 * @returns Orientação ('portrait' ou 'landscape')
 */
export function getOrientation(): 'portrait' | 'landscape' {
  if (!isBrowser()) {
    return 'landscape';
  }

  if (window.innerHeight > window.innerWidth) {
    return 'portrait';
  }

  return 'landscape';
}

/**
 * Detecta se está em modo escuro
 * @returns true se estiver em modo escuro
 */
export function isDarkMode(): boolean {
  if (!isBrowser()) {
    return false;
  }

  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Detecta preferência de movimento reduzido
 * @returns true se preferir movimento reduzido
 */
export function prefersReducedMotion(): boolean {
  if (!isBrowser()) {
    return false;
  }

  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Detecta conexão de rede
 * @returns Informações da conexão
 */
export function getNetworkInfo(): {
  online: boolean;
  type?: string;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
} {
  if (!isBrowser()) {
    return { online: true };
  }

  const connection =
    (navigator as Navigator & {
      connection?: {
        type?: string;
        effectiveType?: string;
        downlink?: number;
        rtt?: number;
        saveData?: boolean;
      };
    }).connection;

  return {
    online: navigator.onLine,
    type: connection?.type,
    effectiveType: connection?.effectiveType,
    downlink: connection?.downlink,
    rtt: connection?.rtt,
    saveData: connection?.saveData,
  };
}

/**
 * Detecta tamanho da viewport
 * @returns Largura e altura da viewport
 */
export function getViewportSize(): { width: number; height: number } {
  if (!isBrowser()) {
    return { width: 0, height: 0 };
  }

  return {
    width: window.innerWidth || document.documentElement.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight,
  };
}

/**
 * Detecta se está em modo fullscreen
 * @returns true se estiver em fullscreen
 */
export function isFullscreen(): boolean {
  if (!isBrowser()) {
    return false;
  }

  return !!(
    document.fullscreenElement ||
    (document as Document & { webkitFullscreenElement?: Element }).webkitFullscreenElement ||
    (document as Document & { mozFullScreenElement?: Element }).mozFullScreenElement
  );
}
