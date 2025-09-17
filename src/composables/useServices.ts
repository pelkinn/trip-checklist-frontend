import { AuthService } from '~/services/AuthService';
import { ChecklistService } from '~/services/ChecklistService';

export const useServices = () => {
  const { $api } = useNuxtApp();
  const runtimeConfig = useRuntimeConfig();

  return {
    auth: new AuthService($api, runtimeConfig),
    checklist: new ChecklistService($api, runtimeConfig)
  };
};
