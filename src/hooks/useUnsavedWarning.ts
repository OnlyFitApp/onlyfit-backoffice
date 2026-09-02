import { useEffect } from 'react';

export function useUnsavedWarning(when: boolean) {
  useEffect(() => {
    if (!when) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [when]);
}
