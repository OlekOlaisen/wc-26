import { Outlet } from "react-router-dom";
import { BottomNav } from "./BottomNav";
import { Header } from "./Header";

export function AppShell() {
  return (
    <div className="min-h-dvh pb-20">
      <Header />
      <main className="mx-auto max-w-lg px-4 py-4">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
