import { Outlet } from "react-router-dom";
import { AppHeader } from "./AppHeader";
import { DisclaimerBanner } from "./DisclaimerBanner";

export function AppShell() {
  return (
    <>
      <AppHeader />
      <main className="app-main">
        <Outlet />
      </main>
      <DisclaimerBanner />
    </>
  );
}
