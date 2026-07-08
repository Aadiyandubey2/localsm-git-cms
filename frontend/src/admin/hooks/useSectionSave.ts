import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { getApiErrorMessage } from '../services/api';
import { setHasUnsavedChanges, setSaveStatus } from '../store/uiSlice';
import type { AdminDispatch } from '../store';

export function useSectionSave() {
  const dispatch = useDispatch<AdminDispatch>();

  return async (action: () => Promise<void>, successMessage = 'Saved successfully') => {
    dispatch(setSaveStatus('saving'));

    try {
      await action();
      dispatch(setSaveStatus('saved'));
      dispatch(setHasUnsavedChanges(false));
      toast.success(successMessage);
      window.setTimeout(() => dispatch(setSaveStatus('idle')), 2000);
    } catch (error) {
      dispatch(setSaveStatus('error'));
      toast.error(getApiErrorMessage(error, 'Failed to save changes'));
      throw error;
    }
  };
}
