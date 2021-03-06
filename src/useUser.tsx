import useSWR from "swr";

import { fetcher } from "./fetcher";

type PrincipalData = {
  clientPrincipal: {
    identityProvider: string;
    userId: string;
    userDetails: string;
    userRoles: string[];
  };
};

export const useUser = (): {
  data?: PrincipalData["clientPrincipal"];
  loading: boolean;
  error: any;
} => {
  const { data, error } = useSWR<PrincipalData>("/.auth/me", fetcher);
  if (process.env.NODE_ENV === "development") {
    return {
      data: {
        identityProvider: "local",
        userId: "userId",
        userDetails: "hoge@hoge.com",
        userRoles: ["writer"],
      },
      loading: false,
      error: null,
    };
  }
  return { data: data?.clientPrincipal, loading: !data && !error, error };
};
