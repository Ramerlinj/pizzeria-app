"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  AdminUser,
  deleteUser,
  listUsers,
  updateUserRole,
  UserRole,
} from "@/lib/user-api";
import { useAuth } from "@/components/providers/auth-provider";

const roleLabels: Record<UserRole, string> = {
  user: "Usuario",
  admin: "Admin",
  superadmin: "Super Admin",
};

export default function AdminUsersPage() {
  const { user: currentUser, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await listUsers();
      setUsers(data);
    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof Error ? error.message : null;
      toast.error(message || "No se pudieron cargar los usuarios");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!authLoading && currentUser && currentUser.role !== "superadmin") {
      toast.error("Solo superadmins pueden administrar usuarios");
    }
  }, [authLoading, currentUser]);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchesRole = roleFilter === "all" ? true : u.role === roleFilter;
      const term = search.toLowerCase().trim();
      const matchesSearch = term
        ? (u.name || "").toLowerCase().includes(term) ||
          (u.email || "").toLowerCase().includes(term)
        : true;
      return matchesRole && matchesSearch;
    });
  }, [users, roleFilter, search]);

  const canEdit = (_target: AdminUser) => {
    // superadmin can edit anyone; admin cannot change superadmin to avoid lockout
    if (currentUser?.role === "superadmin") return true;
    return false;
  };

  const handleDelete = async (userId: number) => {
    setUpdatingId(userId);
    try {
      await deleteUser(userId);
      toast.success("Usuario eliminado");
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof Error ? error.message : null;
      toast.error(message || "No se pudo eliminar el usuario");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRoleChange = async (userId: number, role: UserRole) => {
    setUpdatingId(userId);
    try {
      await updateUserRole(userId, role);
      toast.success("Rol actualizado");
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role } : u))
      );
    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof Error ? error.message : null;
      toast.error(message || "No se pudo actualizar el rol");
    } finally {
      setUpdatingId(null);
    }
  };

  if (!authLoading && currentUser?.role !== "superadmin") {
    return (
      <main className="mx-auto max-w-4xl py-10">
        <p className="text-center text-gray-600">
          Solo superadmins pueden acceder a la gestión de usuarios.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-pizza-naranja uppercase tracking-wide">
            Admin
          </p>
          <h1 className="text-3xl font-heading font-bold text-pizza-texto">
            Usuarios
          </h1>
          <p className="text-gray-600 text-sm">Gestiona roles y accesos.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Input
            placeholder="Buscar por nombre o correo"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filtrar rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="user">Usuario</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="superadmin">Super Admin</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchUsers} disabled={isLoading}>
            {isLoading ? "Actualizando..." : "Refrescar"}
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-3 text-sm text-gray-600">
          <span>Resultados: {filtered.length}</span>
          <span>
            Rol activo:{" "}
            {roleFilter === "all"
              ? "Todos"
              : roleLabels[roleFilter as UserRole]}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-gray-500">
              <tr className="border-b">
                <th className="py-2">Nombre</th>
                <th className="py-2">Correo</th>
                <th className="py-2">Rol</th>
                <th className="py-2 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-gray-500">
                    Cargando usuarios...
                  </td>
                </tr>
              )}
              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-gray-500">
                    Sin usuarios para este filtro.
                  </td>
                </tr>
              )}
              {!isLoading &&
                filtered.map((u) => (
                  <tr key={u.id} className="border-b last:border-b-0">
                    <td className="py-3">
                      <div className="font-semibold text-pizza-texto">
                        {u.name}
                      </div>
                      <div className="text-xs text-gray-500">ID: {u.id}</div>
                    </td>
                    <td className="py-3 text-gray-700">{u.email}</td>
                    <td className="py-3">
                      <Badge className="bg-gray-100 text-gray-700">
                        {roleLabels[(u.role as UserRole) || "user"]}
                      </Badge>
                    </td>
                    <td className="py-3 text-right space-x-2 flex justify-end">
                      <Select
                        value={(u.role as UserRole) || "user"}
                        onValueChange={(val) =>
                          handleRoleChange(u.id, val as UserRole)
                        }
                        disabled={!canEdit(u) || updatingId === u.id}
                      >
                        <SelectTrigger className="w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">Usuario</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="superadmin">
                            Super Admin
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {currentUser?.role === "superadmin" && (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={updatingId === u.id}
                          onClick={() => handleDelete(u.id)}
                        >
                          Eliminar
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>
    </main>
  );
}
