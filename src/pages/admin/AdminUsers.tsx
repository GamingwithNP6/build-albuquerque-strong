import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Loader2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const AdminUsers = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const [{ data: profiles }, { data: allRoles }] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at"),
      supabase.from("user_roles").select("*"),
    ]);
    setUsers(profiles || []);
    setRoles(allRoles || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const getUserRole = (uid: string) => {
    const r = roles.find((r) => r.user_id === uid && r.role === "admin");
    return r ? "admin" : "user";
  };

  const adminCount = () => roles.filter((r) => r.role === "admin").length;

  const changeRole = async (uid: string, newRole: string) => {
    const currentRole = getUserRole(uid);
    if (currentRole === newRole) return;

    // Prevent removing last admin
    if (uid === user!.id && newRole === "user" && adminCount() <= 1) {
      toast({ title: "Cannot remove", description: "You are the only admin.", variant: "destructive" });
      return;
    }

    if (newRole === "admin") {
      // Add admin role
      const { error } = await supabase.from("user_roles").insert({ user_id: uid, role: "admin" as any });
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    } else {
      // Remove admin role
      const { error } = await supabase.from("user_roles").delete().eq("user_id", uid).eq("role", "admin");
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    }

    // Log
    await supabase.from("audit_logs").insert({
      admin_id: user!.id, action_type: "role_change", entity_type: "user", entity_id: uid,
      before_data: { role: currentRole }, after_data: { role: newRole },
    });

    toast({ title: "Role updated" });
    fetchData();
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <Link to="/admin/dashboard" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground mb-6 text-sm"><ArrowLeft className="w-4 h-4" /> Back</Link>
          <h1 className="font-heading text-3xl font-bold text-foreground mb-6">User Management</h1>

          {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : users.length === 0 ? (
            <p className="text-muted-foreground text-center">No users found.</p>
          ) : (
            <div className="space-y-3">
              {users.map((u) => (
                <div key={u.id} className="bg-card rounded-xl p-4 shadow-card flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-card-foreground">{u.display_name || "—"}</p>
                    <p className="text-sm text-muted-foreground">{u.id}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{getUserRole(u.id)}</Badge>
                    <Select value={getUserRole(u.id)} onValueChange={(v) => changeRole(u.id, v)}>
                      <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">user</SelectItem>
                        <SelectItem value="admin">admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AdminUsers;
