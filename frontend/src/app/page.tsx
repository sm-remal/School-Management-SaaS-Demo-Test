"use client";

import { FormEvent, useMemo, useState } from "react";

interface AuthUser {
  id: string;
  email: string;
  roles: string[];
}

interface SchoolAuthUser {
  id: string;
  email: string;
  role: string;
  schoolId: string;
  schoolName: string;
}

interface School {
  id: string;
  schoolName: string;
  schoolEmail: string;
  status: string;
  errorMessage: string | null;
  createdAt: string;
  tenantDatabase?: {
    databaseName: string;
    status: string;
    errorMessage: string | null;
  } | null;
}

interface SchoolAdminProfile {
  user: {
    id: string;
    email: string;
    role: string;
    status: string;
  };
  school: {
    id: string;
    name: string;
    email: string;
    databaseName: string;
  };
}

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:5000";

export default function Home() {
  const [email, setEmail] = useState("superadmin@example.com");
  const [password, setPassword] = useState("Admin@12345");
  const [loginMode, setLoginMode] = useState<"platform" | "school">(
    "platform",
  );
  const [token, setToken] = useState("");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [schoolUser, setSchoolUser] = useState<SchoolAuthUser | null>(null);
  const [schoolProfile, setSchoolProfile] =
    useState<SchoolAdminProfile | null>(null);
  const [schools, setSchools] = useState<School[]>([]);
  const [schoolName, setSchoolName] = useState("");
  const [schoolEmail, setSchoolEmail] = useState("");
  const [initialAdminPassword, setInitialAdminPassword] =
    useState("School@12345");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const activeSchools = useMemo(
    () => schools.filter((school) => school.status === "ACTIVE").length,
    [schools],
  );

  const failedSchools = useMemo(
    () => schools.filter((school) => school.status === "FAILED").length,
    [schools],
  );

  const fetchSchools = async (accessToken = token) => {
    if (!accessToken) {
      return;
    }

    const response = await fetch(`${apiBaseUrl}/api/v1/schools`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Could not load schools");
    }

    setSchools(result.data || []);
  };

  const fetchSchoolProfile = async (accessToken: string) => {
    const response = await fetch(`${apiBaseUrl}/api/v1/school-admin/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Could not load school profile");
    }

    setSchoolProfile(result.data);
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Login failed");
      }

      setToken(result.data.accessToken);
      setUser(result.data.user);
      await fetchSchools(result.data.accessToken);
      setMessage("Logged in successfully");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSchoolLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/school-auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "School login failed");
      }

      setToken(result.data.accessToken);
      setSchoolUser(result.data.user);
      await fetchSchoolProfile(result.data.accessToken);
      setMessage("Logged in successfully");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "School login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSchool = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsCreating(true);
    setMessage("");

    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/schools`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          schoolName,
          schoolEmail,
          initialAdminPassword,
        }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "School create failed");
      }

      setSchoolName("");
      setSchoolEmail("");
      setInitialAdminPassword("School@12345");
      await fetchSchools();
      setMessage("School created and activated successfully");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "School create failed",
      );
      await fetchSchools().catch(() => undefined);
    } finally {
      setIsCreating(false);
    }
  };

  const logout = () => {
    setToken("");
    setUser(null);
    setSchoolUser(null);
    setSchoolProfile(null);
    setSchools([]);
    setMessage("");
  };

  if (schoolUser) {
    return (
      <main className="min-h-screen bg-neutral-100 text-neutral-950">
        <header className="border-b border-neutral-200 bg-white">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-teal-700">
                School Admin
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                {schoolProfile?.school.name || schoolUser.schoolName}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-neutral-600">
                {schoolUser.email}
              </span>
              <button
                onClick={logout}
                className="h-10 rounded-md border border-neutral-300 bg-white px-4 text-sm font-medium hover:bg-neutral-50"
                type="button"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <section className="mx-auto w-full max-w-5xl px-4 py-6">
          <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Tenant Login Verified</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-600">
              This account was authenticated from the school tenant database,
              and the details below were loaded from that same tenant database.
            </p>
            <dl className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-neutral-200 p-4">
                <dt className="text-xs font-medium uppercase text-neutral-500">
                  Role
                </dt>
                <dd className="mt-2 text-sm font-semibold">
                  {schoolProfile?.user.role || schoolUser.role}
                </dd>
              </div>
              <div className="rounded-lg border border-neutral-200 p-4">
                <dt className="text-xs font-medium uppercase text-neutral-500">
                  Account Status
                </dt>
                <dd className="mt-2 text-sm font-semibold">
                  {schoolProfile?.user.status || "ACTIVE"}
                </dd>
              </div>
              <div className="rounded-lg border border-neutral-200 p-4">
                <dt className="text-xs font-medium uppercase text-neutral-500">
                  Tenant Database
                </dt>
                <dd className="mt-2 break-all font-mono text-xs">
                  {schoolProfile?.school.databaseName || "Loading..."}
                </dd>
              </div>
            </dl>
            <div className="mt-5 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
              <p className="text-xs font-medium uppercase text-neutral-500">
                School Settings
              </p>
              <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                <p>
                  <span className="font-medium">Name:</span>{" "}
                  {schoolProfile?.school.name || schoolUser.schoolName}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {schoolProfile?.school.email || schoolUser.email}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-neutral-100 px-4 py-8 text-neutral-950">
        <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md flex-col justify-center">
          <div className="mb-8">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-teal-700">
              {loginMode === "platform"
                ? "Platform Control Plane"
                : "School Tenant"}
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
              School Management Demo
            </h1>
            <p className="mt-3 text-sm leading-6 text-neutral-600">
              {loginMode === "platform"
                ? "Sign in as Super Admin to create schools and provision separate tenant databases."
                : "Sign in with the school email and initial admin password created during provisioning."}
            </p>
          </div>

          <form
            onSubmit={loginMode === "platform" ? handleLogin : handleSchoolLogin}
            className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm"
          >
            <div className="mb-5 grid grid-cols-2 gap-2 rounded-md bg-neutral-100 p-1">
              <button
                className={`h-10 rounded text-sm font-semibold ${
                  loginMode === "platform"
                    ? "bg-white text-teal-700 shadow-sm"
                    : "text-neutral-600"
                }`}
                onClick={() => {
                  setLoginMode("platform");
                  setEmail("superadmin@example.com");
                  setPassword("Admin@12345");
                  setMessage("");
                }}
                type="button"
              >
                Platform
              </button>
              <button
                className={`h-10 rounded text-sm font-semibold ${
                  loginMode === "school"
                    ? "bg-white text-teal-700 shadow-sm"
                    : "text-neutral-600"
                }`}
                onClick={() => {
                  setLoginMode("school");
                  setEmail("");
                  setPassword("");
                  setMessage("");
                }}
                type="button"
              >
                School
              </button>
            </div>
            <label className="block text-sm font-medium text-neutral-700">
              Email
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 h-11 w-full rounded-md border border-neutral-300 px-3 text-sm outline-none focus:border-teal-700"
                type="email"
                required
              />
            </label>
            <label className="mt-4 block text-sm font-medium text-neutral-700">
              Password
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 h-11 w-full rounded-md border border-neutral-300 px-3 text-sm outline-none focus:border-teal-700"
                type="password"
                required
              />
            </label>
            <button
              className="mt-5 h-11 w-full rounded-md bg-teal-700 px-4 text-sm font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
              disabled={isLoading}
              type="submit"
            >
              {isLoading
                ? "Signing in..."
                : loginMode === "platform"
                  ? "Sign in as Platform Admin"
                  : "Sign in as School Admin"}
            </button>
            {message ? (
              <p className="mt-4 text-sm text-neutral-700">{message}</p>
            ) : null}
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-100 text-neutral-950">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-teal-700">
              Platform Super Admin
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">
              School Provisioning Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-600">{user.email}</span>
            <button
              onClick={logout}
              className="h-10 rounded-md border border-neutral-300 bg-white px-4 text-sm font-medium hover:bg-neutral-50"
              type="button"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-6xl gap-5 px-4 py-6 lg:grid-cols-[360px_1fr]">
        <aside className="space-y-5">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-neutral-200 bg-white p-4">
              <p className="text-xs font-medium uppercase text-neutral-500">
                Total
              </p>
              <p className="mt-2 text-2xl font-semibold">{schools.length}</p>
            </div>
            <div className="rounded-lg border border-neutral-200 bg-white p-4">
              <p className="text-xs font-medium uppercase text-neutral-500">
                Active
              </p>
              <p className="mt-2 text-2xl font-semibold text-teal-700">
                {activeSchools}
              </p>
            </div>
            <div className="rounded-lg border border-neutral-200 bg-white p-4">
              <p className="text-xs font-medium uppercase text-neutral-500">
                Failed
              </p>
              <p className="mt-2 text-2xl font-semibold text-red-700">
                {failedSchools}
              </p>
            </div>
          </div>

          <form
            onSubmit={handleCreateSchool}
            className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm"
          >
            <h2 className="text-lg font-semibold">Create School</h2>
            <label className="mt-5 block text-sm font-medium text-neutral-700">
              School Name
              <input
                value={schoolName}
                onChange={(event) => setSchoolName(event.target.value)}
                className="mt-2 h-11 w-full rounded-md border border-neutral-300 px-3 text-sm outline-none focus:border-teal-700"
                required
              />
            </label>
            <label className="mt-4 block text-sm font-medium text-neutral-700">
              School Email
              <input
                value={schoolEmail}
                onChange={(event) => setSchoolEmail(event.target.value)}
                className="mt-2 h-11 w-full rounded-md border border-neutral-300 px-3 text-sm outline-none focus:border-teal-700"
                type="email"
                required
              />
            </label>
            <label className="mt-4 block text-sm font-medium text-neutral-700">
              Initial Admin Password
              <input
                value={initialAdminPassword}
                onChange={(event) =>
                  setInitialAdminPassword(event.target.value)
                }
                className="mt-2 h-11 w-full rounded-md border border-neutral-300 px-3 text-sm outline-none focus:border-teal-700"
                minLength={8}
                type="password"
                required
              />
            </label>
            <button
              className="mt-5 h-11 w-full rounded-md bg-teal-700 px-4 text-sm font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
              disabled={isCreating}
              type="submit"
            >
              {isCreating ? "Provisioning..." : "Create and Provision"}
            </button>
            {message ? (
              <p className="mt-4 text-sm text-neutral-700">{message}</p>
            ) : null}
          </form>
        </aside>

        <section className="rounded-lg border border-neutral-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-neutral-200 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Schools</h2>
              <p className="mt-1 text-sm text-neutral-600">
                Central registry records with tenant database status.
              </p>
            </div>
            <button
              onClick={() =>
                fetchSchools().catch((error) => setMessage(error.message))
              }
              className="h-10 rounded-md border border-neutral-300 bg-white px-4 text-sm font-medium hover:bg-neutral-50"
              type="button"
            >
              Refresh
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50 text-neutral-600">
                  <th className="px-5 py-3 font-medium">School</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Database</th>
                  <th className="px-5 py-3 font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {schools.length === 0 ? (
                  <tr>
                    <td
                      className="px-5 py-10 text-center text-neutral-500"
                      colSpan={4}
                    >
                      No schools yet.
                    </td>
                  </tr>
                ) : (
                  schools.map((school) => (
                    <tr
                      className="border-b border-neutral-100 last:border-0"
                      key={school.id}
                    >
                      <td className="px-5 py-4">
                        <p className="font-medium">{school.schoolName}</p>
                        <p className="mt-1 text-neutral-500">
                          {school.schoolEmail}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            school.status === "ACTIVE"
                              ? "bg-teal-50 text-teal-700"
                              : school.status === "FAILED"
                                ? "bg-red-50 text-red-700"
                                : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {school.status}
                        </span>
                        {school.errorMessage ? (
                          <p className="mt-2 max-w-xs text-xs text-red-700">
                            {school.errorMessage}
                          </p>
                        ) : null}
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-mono text-xs">
                          {school.tenantDatabase?.databaseName || "-"}
                        </p>
                        <p className="mt-1 text-xs text-neutral-500">
                          {school.tenantDatabase?.status || "-"}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-neutral-600">
                        {new Date(school.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}
