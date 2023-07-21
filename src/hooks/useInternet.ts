import { useState, useEffect, useMemo } from 'react';
import { useSnackbar } from 'notistack';

export const useInternet = () => {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const onlineHandler = () => {
      setIsOnline(true);
      enqueueSnackbar('Internet connection regained', { variant: 'success' });
    };

    const offlineHandler = () => {
      setIsOnline(false);
      enqueueSnackbar('Internet connection lost', { variant: 'error' });
    };

    window.addEventListener('online', onlineHandler);
    window.addEventListener('offline', offlineHandler);

    return () => {
      window.removeEventListener('online', onlineHandler);
      window.removeEventListener('offline', offlineHandler);
    };
  }, [enqueueSnackbar]);

  return useMemo(() => isOnline, [isOnline]);
};
