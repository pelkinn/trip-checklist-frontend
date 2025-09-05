import type { Component } from 'vue';
import type { VDialog } from 'vuetify/components/VDialog';
import type { ExtractProps } from '~/types/common';

type Listeners = Record<string, (...args: any[]) => void>;

interface Dialog<C extends Component> {
  component: C;
  props?: ExtractProps<C>;
  listeners?: Listeners;
  dialogProps?: ExtractProps<typeof VDialog>;
  dialogListeners?: Listeners;
}

let id = 0;
const dialogs = ref(new Map<number, Dialog<Component>>());
const dialogsOpened = ref(new Map<number, boolean>());

export const useDialog = () => {
  const openDialog = <C extends Component>(dialog: Dialog<C>) => {
    const currentId = id++;
    dialogs.value.set(currentId, markRaw(dialog));
    dialogsOpened.value.set(currentId, true);
  };

  const closeDialog = (key: number) => {
    dialogsOpened.value.set(key, false);
    setTimeout(() => {
      dialogs.value.get(key)?.dialogListeners?.close?.();
      dialogs.value.delete(key);
      dialogsOpened.value.delete(key);
    }, 350);
  };

  return { dialogs, dialogsOpened, openDialog, closeDialog };
};
