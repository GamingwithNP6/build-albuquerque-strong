import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Loader2, Pencil, Trash2, Plus, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const AdminLabels = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [labels, setLabels] = useState<any[]>([]);
  const [newName, setNewName] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    const { data } = await supabase.from("labels").select("*").order("name");
    setLabels(data || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const logAudit = async (action: string, entityId: string, before: any, after: any) => {
    await supabase.from("audit_logs").insert({ admin_id: user!.id, action_type: action, entity_type: "label", entity_id: entityId, before_data: before, after_data: after });
  };

  const create = async () => {
    if (!newName.trim()) return;
    const { data, error } = await supabase.from("labels").insert({ name: newName.trim() }).select().single();
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    await logAudit("label_created", data.id, null, { name: data.name });
    setNewName("");
    toast({ title: "Label created" });
    fetch();
  };

  const rename = async (id: string) => {
    if (!editName.trim()) return;
    const old = labels.find((l) => l.id === id);
    const { error } = await supabase.from("labels").update({ name: editName.trim() }).eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    await logAudit("label_renamed", id, { name: old?.name }, { name: editName.trim() });
    setEditId(null);
    toast({ title: "Label renamed" });
    fetch();
  };

  const remove = async (id: string, name: string) => {
    if (!confirm(`Delete label "${name}"?`)) return;
    await logAudit("label_deleted", id, { name }, null);
    await supabase.from("labels").delete().eq("id", id);
    toast({ title: "Label deleted" });
    fetch();
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-lg">
          <Link to="/admin/dashboard" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground mb-6 text-sm"><ArrowLeft className="w-4 h-4" /> Back</Link>
          <h1 className="font-heading text-3xl font-bold text-foreground mb-6">Manage Labels</h1>

          <div className="flex gap-2 mb-6">
            <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="New label name" maxLength={50} />
            <Button onClick={create}><Plus className="w-4 h-4 mr-1" /> Add</Button>
          </div>

          {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : labels.length === 0 ? (
            <p className="text-muted-foreground text-center">No labels yet.</p>
          ) : (
            <div className="space-y-2">
              {labels.map((l) => (
                <div key={l.id} className="flex items-center gap-2 bg-card rounded-lg p-3 shadow-card">
                  {editId === l.id ? (
                    <>
                      <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="flex-1" />
                      <Button size="sm" onClick={() => rename(l.id)}>Save</Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditId(null)}>Cancel</Button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 text-sm font-medium">{l.name}</span>
                      <Button variant="ghost" size="icon" onClick={() => { setEditId(l.id); setEditName(l.name); }}><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => remove(l.id, l.name)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </>
                  )}
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

export default AdminLabels;
