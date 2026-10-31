import { createRootRoute, Outlet } from "@tanstack/react-router";
import Navbar from "../components/Navbar";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <>
      <header className="mb-8">
        <Navbar />
        <h1 className="px-6 py-4 text-3xl font-bold">MeteoDash</h1>
      </header>
      <main className="px-6">
        <Outlet />
      </main>
    </>
  );
}
