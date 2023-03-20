import  Mount  from './Mount';

export type KaoOpsConfig = { enabled: boolean };

let enabled = false;

const mountPoint: Mount<KaoOpsConfig> = {
  init: async ({ enabled: on }) => {
    enabled = on;
  },
  validator: j => j.object<KaoOpsConfig>({
    enabled: j.boolean().required(),
  }),
  defaults: {
    enabled: false,
  }
};

export default mountPoint;
