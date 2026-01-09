import { AuthService } from '~/services/AuthService';
import { ChecklistService } from '~/services/ChecklistService';
import { FeedbackService } from '~/services/FeedbackService';

export const useServices = () => {
  const { $api } = useNuxtApp();
  const runtimeConfig = useRuntimeConfig();

  return {
    auth: new AuthService($api, runtimeConfig),
    checklist: new ChecklistService($api, runtimeConfig),
    feedback: new FeedbackService($api, runtimeConfig)
  };
};
