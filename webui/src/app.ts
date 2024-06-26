import { defineAppConfig, history, defineDataLoader } from 'ice';
import { fetchUserInfo } from './services/user';
import { defineAuthConfig } from '@ice/plugin-auth/types';
import { defineStoreConfig } from '@ice/plugin-store/types';
import { defineRequestConfig } from '@ice/plugin-request/types';
import { definePageConfig } from 'ice';

// App config, see https://v3.ice.work/docs/guide/basic/app
export default defineAppConfig(() => ({
  router: {
    type: 'hash',
  }
}));

export const authConfig = defineAuthConfig(async (appData) => {
  const { userInfo = {} } = appData;
  if (userInfo.error) {
    history?.push(`/login?redirect=${window.location.pathname}`);
  }
  return {
    initialAuth: {
      login: false,
    },
  };
});

export const storeConfig = defineStoreConfig(async (appData) => {
  const { userInfo = {} } = appData;
  return {
    initialStates: {
      user: {
        currentUser: userInfo,
      },
    },
  };
});

export const requestConfig = defineRequestConfig({
  baseURL: '/api',
});

export const dataLoader = defineDataLoader(async () => {
  const userInfo = await getUserInfo();
  return {
    userInfo,
  };
});

async function getUserInfo() {
  try {
    const userInfo = await fetchUserInfo();
    return userInfo;
  } catch (error) {
    return {
      error,
    };
  }
}
