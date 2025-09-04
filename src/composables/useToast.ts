import type { ExtractProps } from '~/types/common';
import type { BaseToast } from '#components';
type BaseToastProps = ExtractProps<typeof BaseToast>;

let id = 0;
const toasts = ref(new Map<number, BaseToastProps>());

const showToast = (props: BaseToastProps) => {
  const currentId = id++;
  toasts.value.set(currentId, props);
  setTimeout(() => {
    toasts.value.delete(currentId);
  }, 4000);
};

const hideToast = (id: number) => {
  toasts.value.delete(id);
};

const showSuccessToast = (text: string) => showToast({ type: 'success', text });
const showErrorToast = (text: string) => showToast({ type: 'error', text });
const showWarningToast = (text: string) => showToast({ type: 'warning', text });
const showInfoToast = (text: string) => showToast({ type: 'info', text });

export const useToast = () => {
  return { toasts, showToast, hideToast, showSuccessToast, showErrorToast, showWarningToast, showInfoToast };
};
