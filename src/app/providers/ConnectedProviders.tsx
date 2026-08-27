import { type ComponentType, type PropsWithChildren, useMemo } from "react";
import { AuthKitProvider } from "@workos-inc/authkit-react";
import { ConvexProviderWithAuth, ConvexReactClient } from "convex/react";
import { appConfig } from "@/app/config";
import { ConnectedDataProvider } from "./ConnectedDataProvider";
import { useWorkOSConvexAuth } from "./workosAdapter";

type AuthKitProviderProps = PropsWithChildren<{
  clientId: string;
  redirectUri: string;
  apiHostname?: string;
}>;

const CompatibleAuthKitProvider = AuthKitProvider as unknown as ComponentType<AuthKitProviderProps>;

export function ConnectedProviders({ children }: PropsWithChildren) {
  const convexClient = useMemo(() => new ConvexReactClient(appConfig.convexUrl), []);

  const authKitProps: Omit<AuthKitProviderProps, "children"> = {
    clientId: appConfig.workosClientId,
    redirectUri: appConfig.workosRedirectUri,
    ...(appConfig.workosApiHostname ? { apiHostname: appConfig.workosApiHostname } : {})
  };

  return (
    <CompatibleAuthKitProvider {...authKitProps}>
      <ConvexProviderWithAuth client={convexClient} useAuth={useWorkOSConvexAuth}>
        <ConnectedDataProvider>{children}</ConnectedDataProvider>
      </ConvexProviderWithAuth>
    </CompatibleAuthKitProvider>
  );
}
