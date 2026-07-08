import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setHasUnsavedChanges } from '../store/uiSlice';
import type { AdminDispatch } from '../store';

export function useUnsavedChanges(isDirty: boolean) {
  const dispatch = useDispatch<AdminDispatch>();

  useEffect(() => {
    dispatch(setHasUnsavedChanges(isDirty));
  }, [dispatch, isDirty]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDirty) {
        event.preventDefault();
        event.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);
}
