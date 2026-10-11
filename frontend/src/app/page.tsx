"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import SchoolLoginPanel from "../components/SchoolLoginPanel";
import {
  BarChart3,
  Archive,
  Activity,
  AlertTriangle,
  Bell,
  BookOpen,
  Briefcase,
  Building2,
  Bus,
  CalendarDays,
  CheckSquare,
  ChevronDown,
  CirclePlay,
  ClipboardCheck,
  CheckCircle2,
  Database,
  Eye,
  EyeOff,
  FileBadge,
  FileCheck2,
  FileText,
  ExternalLink,
  GraduationCap,
  Home as HomeIcon,
  IdCard,
  Landmark,
  LayoutDashboard,
  Library,
  LucideIcon,
  LogOut,
  Package,
  PanelLeft,
  Plus,
  Power,
  Receipt,
  RefreshCw,
  Settings,
  ShieldCheck,
  UserCheck,
  UserCog,
  Users,
  Video,
  WalletCards,
  Trash2,
} from "lucide-react";

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

interface AuditLog {
  id: string;
  action: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  actor: {
    id: string;
    email: string;
  } | null;
  school: {
    id: string;
    schoolName: string;
    schoolEmail: string;
    status: string;
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

const sessionStorageKey = "school-management-demo-session";
const auditLogsPerPage = 10;

type SidebarItem = {
  label: string;
  muted?: boolean;
};

type SidebarGroup = {
  label: string;
  icon: LucideIcon;
  items?: SidebarItem[];
};

const schoolSidebarGroups: SidebarGroup[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  {
    label: "Users",
    icon: UserCog,
    items: [
      { label: "Admin" },
      { label: "Student" },
      { label: "Admission" },
      { label: "Teacher" },
      { label: "Teacher permission" },
      { label: "Parent" },
      { label: "Accountant" },
      { label: "Librarian" },
    ],
  },
  {
    label: "Alumni",
    icon: GraduationCap,
    items: [
      { label: "Alumni list" },
      { label: "Alumni events" },
      { label: "Alumni gallery" },
    ],
  },
  {
    label: "Academic",
    icon: Building2,
    items: [
      { label: "Daily attendance" },
      { label: "Biometric attendance" },
      { label: "Class routine" },
      { label: "Subject" },
      { label: "Syllabus" },
      { label: "Class" },
      { label: "Class room" },
      { label: "Department" },
      { label: "Event calender" },
      { label: "Students" },
      { label: "Teachers" },
      { label: "Classes & Subjects" },
      { label: "Lesson plans & diary" },
      { label: "Hostel" },
      { label: "Face Attendance" },
      { label: "Teacher Attendance" },
      { label: "Homework" },
      { label: "Library" },
      { label: "Transport" },
      { label: "Academic Calendar" },
    ],
  },
  {
    label: "Live class",
    icon: Video,
    items: [
      { label: "Live classes" },
      { label: "Class recordings" },
      { label: "Meeting links" },
    ],
  },
  {
    label: "Examination",
    icon: ClipboardCheck,
    items: [
      { label: "Marks" },
      { label: "Examination" },
      { label: "Grades" },
      { label: "Promotion" },
      { label: "Send exam marks" },
      { label: "Results" },
      { label: "OMR Scanner" },
      { label: "NCF Assessment" },
      { label: "Online tests" },
      { label: "Seat Plan" },
      { label: "Certificates" },
      { label: "Marksheets" },
      { label: "Document verification" },
      { label: "Admit Cards" },
      { label: "Merit List" },
      { label: "Teacher Evaluation" },
    ],
  },
  {
    label: "Accounting",
    icon: Landmark,
    items: [
      { label: "Fee Collection" },
      { label: "Fee Status" },
      { label: "WhatsApp Reminders" },
      { label: "Receipts" },
      { label: "Expenses" },
      { label: "Cash Book & Funds" },
      { label: "Financial Statements" },
      { label: "Government reports" },
      { label: "Salaries" },
      { label: "Leave Applications" },
      { label: "Reports" },
      { label: "Fee Payment (QR)" },
      { label: "Billing & Subscription", muted: true },
    ],
  },
  {
    label: "Back office",
    icon: Briefcase,
    items: [
      { label: "Hostel" },
      { label: "Transport" },
      { label: "Library" },
      { label: "Inventory" },
      { label: "Visitors" },
      { label: "Tasks" },
    ],
  },
  {
    label: "Online courses",
    icon: CirclePlay,
    items: [
      { label: "Courses" },
      { label: "Lessons" },
      { label: "Enrollments" },
      { label: "Progress" },
    ],
  },
  {
    label: "Settings",
    icon: Settings,
    items: [
      { label: "School settings" },
      { label: "Website Settings" },
      { label: "Domain" },
      { label: "Users" },
      { label: "Import / Export" },
      { label: "Support" },
    ],
  },
  {
    label: "Communication",
    icon: Bell,
    items: [
      { label: "Notices" },
      { label: "SMS Manager" },
      { label: "Events" },
      { label: "Meetings" },
      { label: "HR" },
      { label: "Tasks" },
      { label: "Visitors" },
      { label: "Performance" },
      { label: "Gallery" },
    ],
  },
  {
    label: "Administration",
    icon: Archive,
    items: [
      { label: "Admission CRM" },
      { label: "Online Admission" },
      { label: "ID Cards" },
      { label: "AI Reports" },
      { label: "Buy Supplies" },
    ],
  },
];

const schoolMetricCards = [
  {
    label: "Students",
    value: "12",
    helper: "Total number of student",
    icon: Users,
  },
  {
    label: "Teachers",
    value: "5",
    helper: "Total number of teacher",
    icon: GraduationCap,
  },
  {
    label: "Parents",
    value: "7",
    helper: "Total number of parent",
    icon: UserCheck,
  },
  {
    label: "Staff",
    value: "6",
    helper: "Total number of staff",
    icon: UserCog,
  },
];

const quickModules = [
  { label: "Attendance", icon: CheckSquare, color: "bg-emerald-50 text-emerald-700" },
  { label: "Routine", icon: CalendarDays, color: "bg-sky-50 text-sky-700" },
  { label: "Library", icon: Library, color: "bg-amber-50 text-amber-700" },
  { label: "Transport", icon: Bus, color: "bg-indigo-50 text-indigo-700" },
  { label: "Receipts", icon: Receipt, color: "bg-rose-50 text-rose-700" },
  { label: "Certificates", icon: FileBadge, color: "bg-violet-50 text-violet-700" },
];

type StoredSession =
  | {
      mode: "platform";
      token: string;
      user: AuthUser;
    }
  | {
      mode: "school";
      token: string;
      user: SchoolAuthUser;
    };

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
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [schoolName, setSchoolName] = useState("");
  const [schoolEmail, setSchoolEmail] = useState("");
  const [initialAdminPassword, setInitialAdminPassword] =
    useState("School@12345");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [openSidebarGroup, setOpenSidebarGroup] = useState<string | null>(null);
  const [mutatingSchoolId, setMutatingSchoolId] = useState<string | null>(null);
  const [deletingSchool, setDeletingSchool] = useState<School | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [showInitialAdminPassword, setShowInitialAdminPassword] =
    useState(false);
  const [auditLogPage, setAuditLogPage] = useState(1);

  const activeSchools = useMemo(
    () => schools.filter((school) => school.status === "ACTIVE").length,
    [schools],
  );

  const failedSchools = useMemo(
    () => schools.filter((school) => school.status === "FAILED").length,
    [schools],
  );

  const auditLogPageCount = Math.max(
    1,
    Math.ceil(auditLogs.length / auditLogsPerPage),
  );
  const currentAuditLogPage = Math.min(auditLogPage, auditLogPageCount);
  const paginatedAuditLogs = useMemo(() => {
    const startIndex = (currentAuditLogPage - 1) * auditLogsPerPage;
    return auditLogs.slice(startIndex, startIndex + auditLogsPerPage);
  }, [currentAuditLogPage, auditLogs]);

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

  const fetchAuditLogs = async (accessToken = token) => {
    if (!accessToken) {
      return;
    }

    const response = await fetch(`${apiBaseUrl}/api/v1/audit-logs`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Could not load audit logs");
    }

    setAuditLogs(result.data || []);
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

  useEffect(() => {
    const restoreSession = async () => {
      const rawSession = window.localStorage.getItem(sessionStorageKey);

      if (!rawSession) {
        return;
      }

      try {
        const session = JSON.parse(rawSession) as StoredSession;

        setIsLoading(true);
        setToken(session.token);

        if (session.mode === "platform") {
          setLoginMode("platform");
          setUser(session.user);

          const [schoolsResponse, auditResponse] = await Promise.all([
            fetch(`${apiBaseUrl}/api/v1/schools`, {
              headers: {
                Authorization: `Bearer ${session.token}`,
              },
            }),
            fetch(`${apiBaseUrl}/api/v1/audit-logs`, {
              headers: {
                Authorization: `Bearer ${session.token}`,
              },
            }),
          ]);
          const [schoolsResult, auditResult] = await Promise.all([
            schoolsResponse.json(),
            auditResponse.json(),
          ]);

          if (
            !schoolsResponse.ok ||
            !schoolsResult.success ||
            !auditResponse.ok ||
            !auditResult.success
          ) {
            throw new Error("Could not restore platform session");
          }

          setSchools(schoolsResult.data || []);
          setAuditLogs(auditResult.data || []);
        } else {
          setLoginMode("school");
          setSchoolUser(session.user);

          const profileResponse = await fetch(
            `${apiBaseUrl}/api/v1/school-admin/me`,
            {
              headers: {
                Authorization: `Bearer ${session.token}`,
              },
            },
          );
          const profileResult = await profileResponse.json();

          if (!profileResponse.ok || !profileResult.success) {
            throw new Error("Could not restore school session");
          }

          setSchoolProfile(profileResult.data);
        }
      } catch {
        window.localStorage.removeItem(sessionStorageKey);
        setToken("");
        setUser(null);
        setSchoolUser(null);
        setSchoolProfile(null);
        setSchools([]);
        setAuditLogs([]);
        setMessage("Saved session expired. Please sign in again.");
      } finally {
        setIsLoading(false);
      }
    };

    void restoreSession();
  }, []);

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
      window.localStorage.setItem(
        sessionStorageKey,
        JSON.stringify({
          mode: "platform",
          token: result.data.accessToken,
          user: result.data.user,
        } satisfies StoredSession),
      );
      await fetchSchools(result.data.accessToken);
      await fetchAuditLogs(result.data.accessToken);
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
      window.localStorage.setItem(
        sessionStorageKey,
        JSON.stringify({
          mode: "school",
          token: result.data.accessToken,
          user: result.data.user,
        } satisfies StoredSession),
      );
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
      await fetchAuditLogs();
      await Swal.fire({
        title: "School created!",
        text: `${result.data.schoolName} is active and the tenant database ${result.data.tenantDatabase?.databaseName || "has been created"} is ready.`,
        icon: "success",
        draggable: true,
        confirmButtonText: "Great",
      });
      setMessage("School created and activated successfully");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "School create failed",
      );
      await fetchSchools().catch(() => undefined);
      await fetchAuditLogs().catch(() => undefined);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSchoolLifecycleAction = async (
    schoolId: string,
    action: "activate" | "deactivate",
  ) => {
    setMutatingSchoolId(schoolId);
    setMessage("");

    try {
      const response = await fetch(
        `${apiBaseUrl}/api/v1/schools/${schoolId}/${action}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "School update failed");
      }

      await fetchSchools();
      await fetchAuditLogs();
      setMessage(result.message || "School updated successfully");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "School update failed");
    } finally {
      setMutatingSchoolId(null);
    }
  };

  const handlePermanentDeleteSchool = async () => {
    if (!deletingSchool) {
      return;
    }

    setMutatingSchoolId(deletingSchool.id);
    setMessage("");

    try {
      const response = await fetch(
        `${apiBaseUrl}/api/v1/schools/${deletingSchool.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ schoolName: deleteConfirmation }),
        },
      );
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "School delete failed");
      }

      setDeletingSchool(null);
      setDeleteConfirmation("");
      await fetchSchools();
      await fetchAuditLogs();
      setMessage(result.message || "School permanently deleted successfully");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "School delete failed");
    } finally {
      setMutatingSchoolId(null);
    }
  };

  const logout = () => {
    window.localStorage.removeItem(sessionStorageKey);
    setToken("");
    setUser(null);
    setSchoolUser(null);
    setSchoolProfile(null);
    setSchools([]);
    setAuditLogs([]);
    setMessage("");
  };

  if (schoolUser) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-950">
        <div className="flex min-h-screen">
          <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white lg:block">
            <div className="sticky top-0 flex h-screen flex-col">
              <div className="border-b border-slate-200 px-5 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-600 text-white">
                    <HomeIcon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {schoolProfile?.school.name || schoolUser.schoolName}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      School Admin
                    </p>
                  </div>
                </div>
              </div>

              <nav className="flex-1 overflow-y-auto px-3 py-4">
                <div className="space-y-1">
                  {schoolSidebarGroups.map((group) => {
                    const Icon = group.icon;
                    const isOpen = openSidebarGroup === group.label;
                    return (
                      <div key={group.label}>
                        <button
                          aria-expanded={group.items ? isOpen : undefined}
                          className={`flex h-10 w-full items-center justify-between rounded-md px-3 text-left text-sm transition ${
                            group.label === "Dashboard"
                              ? "bg-blue-50 font-semibold text-blue-700"
                              : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                          }`}
                          onClick={() => {
                            if (!group.items) {
                              setOpenSidebarGroup(null);
                              return;
                            }

                            setOpenSidebarGroup(isOpen ? null : group.label);
                          }}
                          type="button"
                        >
                          <span className="flex min-w-0 items-center gap-3">
                            <Icon className="h-4 w-4 shrink-0" />
                            <span className="truncate">{group.label}</span>
                          </span>
                          {group.items ? (
                            <ChevronDown
                              className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-500 ease-in-out ${
                                isOpen ? "rotate-180" : ""
                              }`}
                            />
                          ) : null}
                        </button>
                        {group.items ? (
                          <div
                            className={`ml-10 grid overflow-hidden transition-[grid-template-rows,opacity,margin,padding] duration-500 ease-in-out ${
                              isOpen
                                ? "mt-1 grid-rows-[1fr] pb-2 opacity-100"
                                : "mt-0 grid-rows-[0fr] pb-0 opacity-0"
                            }`}
                          >
                            <div className="min-h-0 space-y-1 overflow-hidden">
                            {group.items.map((item) => (
                              <button
                                className={`block h-8 w-full truncate rounded-md px-2 text-left text-sm transition ${
                                  item.muted
                                    ? "text-slate-400"
                                    : item.label.toLowerCase() ===
                                          "class routine" ||
                                        item.label === "Results"
                                      ? "text-blue-700"
                                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-950"
                                }`}
                                key={item.label}
                                type="button"
                              >
                                {item.label}
                              </button>
                            ))}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </nav>

              <div className="space-y-2 border-t border-slate-200 p-4">
                <button
                  className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-blue-700 px-4 text-sm font-medium text-white hover:bg-blue-800"
                  type="button"
                >
                  <ExternalLink className="h-4 w-4" />
                  Go to Website
                </button>
                <button
                  onClick={logout}
                  className="h-10 w-full cursor-pointer rounded-md bg-red-500 px-4 text-sm font-medium text-white hover:bg-red-600"
                  type="button"
                >
                  Logout
                </button>
              </div>
            </div>
          </aside>

          <section className="min-w-0 flex-1">
            <header className="border-b border-slate-200 bg-white">
              <div className="flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-8">
                <div className="flex items-center gap-3">
                  <button
                    className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-600 lg:hidden"
                    type="button"
                  >
                    <PanelLeft className="h-5 w-5" />
                  </button>
                  <div>
                    <p className="text-sm font-medium text-blue-700">
                      School Admin Dashboard
                    </p>
                    <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                      {schoolProfile?.school.name || schoolUser.schoolName}
                    </h1>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                    <p className="text-xs text-slate-500">Signed in</p>
                    <p className="text-sm font-medium">{schoolUser.email}</p>
                  </div>
                  <button
                    onClick={logout}
                    className="h-10 rounded-md border border-slate-300 bg-white px-4 text-sm font-medium hover:bg-slate-50"
                    type="button"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </header>

            <div className="px-4 py-6 lg:px-8">
              <div className="mb-5 overflow-x-auto rounded-lg border border-slate-200 bg-white p-3 lg:hidden">
                <div className="flex gap-2">
                  {schoolSidebarGroups.slice(0, 8).map((group) => {
                    const Icon = group.icon;
                    return (
                      <button
                        className="flex h-10 shrink-0 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm text-slate-600"
                        key={group.label}
                        type="button"
                      >
                        <Icon className="h-4 w-4" />
                        {group.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
                <section className="space-y-5">
                  <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <LayoutDashboard className="h-5 w-5 text-slate-500" />
                          <h2 className="text-lg font-semibold">Dashboard</h2>
                        </div>
                        <p className="mt-2 text-sm text-slate-500">
                          Overview for academic operations, finance, attendance,
                          and communication.
                        </p>
                      </div>
                      <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
                        <ShieldCheck className="h-4 w-4" />
                        Tenant verified
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    {schoolMetricCards.map((card) => {
                      const Icon = card.icon;
                      return (
                        <div
                          className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
                          key={card.label}
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-100 text-blue-700">
                            <Icon className="h-5 w-5" />
                          </div>
                          <p className="mt-4 text-sm font-semibold text-slate-500">
                            {card.label}
                          </p>
                          <p className="mt-6 text-3xl font-semibold tracking-tight text-slate-700">
                            {card.value}
                          </p>
                          <p className="mt-5 text-sm text-slate-400">
                            {card.helper}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="grid gap-5 xl:grid-cols-2">
                    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-blue-700" />
                        <h3 className="font-semibold">Academic Snapshot</h3>
                      </div>
                      <div className="mt-5 space-y-4">
                        {[
                          ["Attendance completion", "86%"],
                          ["Homework review", "42 pending"],
                          ["Exam preparation", "3 active exams"],
                          ["Lesson diary updates", "18 today"],
                        ].map(([label, value]) => (
                          <div
                            className="flex items-center justify-between gap-4"
                            key={label}
                          >
                            <span className="text-sm text-slate-500">
                              {label}
                            </span>
                            <span className="text-sm font-semibold text-slate-700">
                              {value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="flex items-center gap-2">
                        <WalletCards className="h-5 w-5 text-blue-700" />
                        <h3 className="font-semibold">Finance Snapshot</h3>
                      </div>
                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-md bg-slate-50 p-4">
                          <p className="text-xs uppercase text-slate-400">
                            Fee collection
                          </p>
                          <p className="mt-2 text-xl font-semibold">72%</p>
                        </div>
                        <div className="rounded-md bg-slate-50 p-4">
                          <p className="text-xs uppercase text-slate-400">
                            Receipts
                          </p>
                          <p className="mt-2 text-xl font-semibold">31</p>
                        </div>
                        <div className="rounded-md bg-slate-50 p-4">
                          <p className="text-xs uppercase text-slate-400">
                            Expenses
                          </p>
                          <p className="mt-2 text-xl font-semibold">8</p>
                        </div>
                        <div className="rounded-md bg-slate-50 p-4">
                          <p className="text-xs uppercase text-slate-400">
                            Salaries
                          </p>
                          <p className="mt-2 text-xl font-semibold">Ready</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <aside className="space-y-5">
                  <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-blue-700" />
                      <h3 className="font-semibold">School Settings</h3>
                    </div>
                    <dl className="mt-5 space-y-4">
                      <div>
                        <dt className="text-xs uppercase text-slate-400">
                          Name
                        </dt>
                        <dd className="mt-1 text-sm font-medium">
                          {schoolProfile?.school.name || schoolUser.schoolName}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs uppercase text-slate-400">
                          Email
                        </dt>
                        <dd className="mt-1 break-all text-sm font-medium">
                          {schoolProfile?.school.email || schoolUser.email}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs uppercase text-slate-400">
                          Tenant DB
                        </dt>
                        <dd className="mt-1 break-all font-mono text-xs">
                          {schoolProfile?.school.databaseName || "Loading..."}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-blue-700" />
                      <h3 className="font-semibold">Quick Modules</h3>
                    </div>
                    <div className="mt-5 grid grid-cols-2 gap-3">
                      {quickModules.map((module) => {
                        const Icon = module.icon;
                        return (
                          <button
                            className="rounded-md border border-slate-200 p-3 text-left hover:bg-slate-50"
                            key={module.label}
                            type="button"
                          >
                            <div
                              className={`flex h-9 w-9 items-center justify-center rounded-md ${module.color}`}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            <p className="mt-3 truncate text-sm font-medium">
                              {module.label}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-blue-700" />
                      <h3 className="font-semibold">Today</h3>
                    </div>
                    <div className="mt-5 space-y-3">
                      {[
                        { icon: FileText, text: "Publish class diary" },
                        { icon: FileCheck2, text: "Approve result draft" },
                        { icon: IdCard, text: "Print pending ID cards" },
                        { icon: Settings, text: "Review school settings" },
                      ].map((task) => {
                        const Icon = task.icon;
                        return (
                          <div
                            className="flex items-center gap-3 rounded-md bg-slate-50 p-3"
                            key={task.text}
                          >
                            <Icon className="h-4 w-4 text-slate-500" />
                            <span className="text-sm text-slate-600">
                              {task.text}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <SchoolLoginPanel
        email={email}
        isLoading={isLoading}
        loginMode={loginMode}
        message={message}
        onSubmit={loginMode === "platform" ? handleLogin : handleSchoolLogin}
        password={password}
        setEmail={setEmail}
        setLoginMode={setLoginMode}
        setMessage={setMessage}
        setPassword={setPassword}
      />
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="flex w-full flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-900 text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-700">
                Platform Super Admin
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                School Provisioning Dashboard
              </h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <p className="text-xs text-slate-500">Signed in</p>
              <p className="text-sm font-medium">{user.email}</p>
            </div>
            <button
              onClick={logout}
              className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-medium hover:bg-slate-50"
              type="button"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <section className="w-full space-y-5 px-4 py-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              label: "Total Schools",
              value: schools.length,
              helper: "Registered tenants",
              icon: Building2,
              color: "bg-blue-50 text-blue-700",
            },
            {
              label: "Active",
              value: activeSchools,
              helper: "Ready for school login",
              icon: CheckCircle2,
              color: "bg-emerald-50 text-emerald-700",
            },
            {
              label: "Failed",
              value: failedSchools,
              helper: "Need review or retry",
              icon: AlertTriangle,
              color: "bg-red-50 text-red-700",
            },
          ].map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
                key={metric.label}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {metric.label}
                    </p>
                    <p className="mt-3 text-3xl font-semibold tracking-tight">
                      {metric.value}
                    </p>
                  </div>
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-lg ${metric.color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-4 text-sm text-slate-500">{metric.helper}</p>
              </div>
            );
          })}
        </div>

        <div className="grid gap-5 xl:grid-cols-[380px_1fr]">
          <aside className="space-y-5">
            <form
              onSubmit={handleCreateSchool}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-50 text-blue-700">
                  <Plus className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Create School</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Provision a tenant database and initial admin.
                  </p>
                </div>
              </div>
              <label className="mt-5 block text-sm font-medium text-slate-700">
                School Name
                <input
                  value={schoolName}
                  onChange={(event) => setSchoolName(event.target.value)}
                  className="mt-2 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  placeholder="ABC School"
                  required
                />
              </label>
              <label className="mt-4 block text-sm font-medium text-slate-700">
                School Email
                <input
                  value={schoolEmail}
                  onChange={(event) => setSchoolEmail(event.target.value)}
                  className="mt-2 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  placeholder="admin@school.edu"
                  type="email"
                  required
                />
              </label>
              <label className="mt-4 block text-sm font-medium text-slate-700">
                Initial Admin Password
                <span className="relative mt-2 block">
                  <input
                    value={initialAdminPassword}
                    onChange={(event) =>
                      setInitialAdminPassword(event.target.value)
                    }
                    className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 pr-11 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    minLength={8}
                    type={showInitialAdminPassword ? "text" : "password"}
                    required
                  />
                  <button
                    aria-label={
                      showInitialAdminPassword
                        ? "Hide initial admin password"
                        : "Show initial admin password"
                    }
                    className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                    onClick={() =>
                      setShowInitialAdminPassword((current) => !current)
                    }
                    type="button"
                  >
                    {showInitialAdminPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </span>
              </label>
              <button
                className="mt-5 inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-blue-700 px-4 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                disabled={isCreating}
                type="submit"
              >
                <Plus className="h-4 w-4" />
                {isCreating ? "Provisioning..." : "Create and Provision"}
              </button>
              {message ? (
                <p className="mt-4 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  {message}
                </p>
              ) : null}
            </form>

            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-700" />
                <h2 className="font-semibold">Control Plane</h2>
              </div>
              <div className="mt-5 space-y-3">
                {[
                  ["Auth", "JWT protected"],
                  ["Provisioning", "Database per school"],
                  ["Audit", `${auditLogs.length} events loaded`],
                ].map(([label, value]) => (
                  <div
                    className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2"
                    key={label}
                  >
                    <span className="text-sm text-slate-500">{label}</span>
                    <span className="text-sm font-medium text-slate-700">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-slate-700">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Schools</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Central registry records with tenant database status.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  fetchSchools().catch((error) => setMessage(error.message));
                  fetchAuditLogs().catch((error) => setMessage(error.message));
                }}
                className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-medium hover:bg-slate-50"
                type="button"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                    <th className="px-5 py-3 font-medium">School</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Database</th>
                    <th className="px-5 py-3 font-medium">Created</th>
                    <th className="px-5 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {schools.length === 0 ? (
                    <tr>
                      <td
                        className="px-5 py-12 text-center text-slate-500"
                        colSpan={5}
                      >
                        No schools yet.
                      </td>
                    </tr>
                  ) : (
                    schools.map((school) => (
                      <tr
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                        key={school.id}
                      >
                        <td className="px-5 py-4">
                          <p className="font-medium text-slate-900">
                            {school.schoolName}
                          </p>
                          <p className="mt-1 text-slate-500">
                            {school.schoolEmail}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                              school.status === "ACTIVE"
                                ? "bg-emerald-50 text-emerald-700"
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
                          <p className="break-all font-mono text-xs text-slate-700">
                            {school.tenantDatabase?.databaseName || "-"}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {school.tenantDatabase?.status || "-"}
                          </p>
                        </td>
                        <td className="px-5 py-4 text-slate-600">
                          {new Date(school.createdAt).toLocaleString()}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-2">
                            {school.status === "ACTIVE" ? (
                              <button
                                className="inline-flex h-9 cursor-pointer items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-3 text-xs font-medium text-amber-700 hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
                                disabled={mutatingSchoolId === school.id}
                                onClick={() =>
                                  handleSchoolLifecycleAction(
                                    school.id,
                                    "deactivate",
                                  )
                                }
                                type="button"
                              >
                                <Power className="h-3.5 w-3.5" />
                                Deactivate
                              </button>
                            ) : (
                              <button
                                className="inline-flex h-9 cursor-pointer items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-3 text-xs font-medium text-emerald-700 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                                disabled={mutatingSchoolId === school.id}
                                onClick={() =>
                                  handleSchoolLifecycleAction(
                                    school.id,
                                    "activate",
                                  )
                                }
                                type="button"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Activate
                              </button>
                            )}
                            <button
                              className="inline-flex h-9 cursor-pointer items-center gap-1 rounded-md border border-red-200 bg-red-50 px-3 text-xs font-medium text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                              disabled={mutatingSchoolId === school.id}
                              onClick={() => {
                                setDeletingSchool(school);
                                setDeleteConfirmation("");
                              }}
                              type="button"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-slate-700">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Audit Logs</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Latest platform events for school provisioning and lifecycle
                  changes.
                </p>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                  <th className="w-20 px-5 py-3 font-medium">SL</th>
                  <th className="px-5 py-3 font-medium">Action</th>
                  <th className="px-5 py-3 font-medium">School</th>
                  <th className="px-5 py-3 font-medium">Actor</th>
                  <th className="px-5 py-3 font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.length === 0 ? (
                  <tr>
                    <td
                      className="px-5 py-12 text-center text-slate-500"
                      colSpan={5}
                    >
                      No audit events yet.
                    </td>
                  </tr>
                ) : (
                  paginatedAuditLogs.map((log, index) => (
                    <tr
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                      key={log.id}
                    >
                      <td className="px-5 py-4 font-medium text-slate-500">
                        {(currentAuditLogPage - 1) * auditLogsPerPage +
                          index +
                          1}
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-mono text-xs font-semibold text-slate-800">
                          {log.action}
                        </p>
                        {log.metadata?.databaseName ? (
                          <p className="mt-1 break-all font-mono text-xs text-slate-500">
                            {String(log.metadata.databaseName)}
                          </p>
                        ) : null}
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-900">
                          {log.school?.schoolName || "-"}
                        </p>
                        <p className="mt-1 text-slate-500">
                          {log.school?.schoolEmail || "-"}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {log.actor?.email || "System"}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-medium text-slate-700">
                {auditLogs.length === 0
                  ? 0
                  : (currentAuditLogPage - 1) * auditLogsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium text-slate-700">
                {Math.min(
                  currentAuditLogPage * auditLogsPerPage,
                  auditLogs.length,
                )}
              </span>{" "}
              of{" "}
              <span className="font-medium text-slate-700">
                {auditLogs.length}
              </span>{" "}
              logs
            </p>
            <div className="flex items-center gap-2">
              <button
                className="h-9 cursor-pointer rounded-md border border-slate-300 bg-white px-3 text-sm font-medium hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={currentAuditLogPage === 1}
                onClick={() =>
                  setAuditLogPage((currentPage) => Math.max(1, currentPage - 1))
                }
                type="button"
              >
                Previous
              </button>
              <span className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                Page {currentAuditLogPage} of {auditLogPageCount}
              </span>
              <button
                className="h-9 cursor-pointer rounded-md border border-slate-300 bg-white px-3 text-sm font-medium hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={currentAuditLogPage === auditLogPageCount}
                onClick={() =>
                  setAuditLogPage((currentPage) =>
                    Math.min(auditLogPageCount, currentPage + 1),
                  )
                }
                type="button"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </section>

      {deletingSchool ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
          <div className="w-full max-w-md rounded-lg border border-red-200 bg-white p-5 shadow-xl">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-red-50 text-red-700">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Permanently delete school
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  This will delete the central school record and drop the tenant
                  database. Export a backup before continuing.
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              Type{" "}
              <span className="font-semibold">{deletingSchool.schoolName}</span>{" "}
              to confirm permanent deletion.
            </div>

            <label className="mt-4 block text-sm font-medium text-slate-700">
              School name confirmation
              <input
                value={deleteConfirmation}
                onChange={(event) => setDeleteConfirmation(event.target.value)}
                className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100"
                placeholder={deletingSchool.schoolName}
              />
            </label>

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                className="h-10 cursor-pointer rounded-md border border-slate-300 bg-white px-4 text-sm font-medium hover:bg-slate-50"
                onClick={() => {
                  setDeletingSchool(null);
                  setDeleteConfirmation("");
                }}
                type="button"
              >
                Cancel
              </button>
              <button
                className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md bg-red-700 px-4 text-sm font-semibold text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                disabled={
                  deleteConfirmation.trim() !== deletingSchool.schoolName ||
                  mutatingSchoolId === deletingSchool.id
                }
                onClick={handlePermanentDeleteSchool}
                type="button"
              >
                <Trash2 className="h-4 w-4" />
                Permanently delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
