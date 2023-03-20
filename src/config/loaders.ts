import { envsLoader } from '@ghii/envs-loader';
import packageJsonLoader from '@ghii/package-json-loader';
import yamlLoader from '@ghii/yaml-loader';
import { PackageJson } from 'type-fest';

function loaders({
  envs,
  app,
}: {
  envs: NodeJS.ProcessEnv;
  app: Pick<PackageJson, 'name' | 'version' | 'description'>;
}) {
  const rcFile = envs.GHII_CONFIG_PATH
    ? [envs.GHII_CONFIG_PATH]
    : [process.cwd(), `${app.name}rs.yaml`];

  return [
    //envsLoader({ envs /* prefix: 'APP_NAME*/ }),
    yamlLoader(...rcFile),
  ];
}

export { envsLoader, packageJsonLoader, yamlLoader };
export default loaders;
