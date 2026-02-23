import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Loader2, ArrowLeft } from "lucide-react";

const STATUSES = ["New", "Triaged", "In Progress", "Waiting on User", "Blocked", "Done", "Closed"];
const IMPORTANCES = ["Low", "Medium", "High", "Critical"];

const AdminSubmissionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [sub, setSub] = useState<any>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [newNote, setNewNote] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [status, setStatus] = useState("");
  const [importance, setImportance] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    if (!id) return;
    const [{ data: s }, { data: n }, { data: a }] = await Promise.all([
      supabase.from("contact_submissions").select("*").eq("id", id).single(),
      supabase.from("request_notes").select("*").eq("submission_id", id).order("created_at"),
      supabase.from("audit_logs").select("*").eq("entity_id", id).eq("entity_type", "submission").order("created_at", { ascending: false }).limit(50),
    ]);
    if (s) { setSub(s); setStatus(s.status); setImportance(s.importance); setAdminNotes(s.admin_notes || ""); }
    setNotes(n || []);
    setAuditLogs(a || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [id]);

  const logAudit = async (action: string, before: any, after: any) => {
    await supabase.from("audit_logs").insert({ admin_id: user!.id, action_type: action, entity_type: "submission", entity_id: id!, before_data: before, after_data: after });
  };

  const saveChanges = async () => {
    setSaving(true);
    const updates: any = { updated_at: new Date().toISOString(), updated_by: user!.id };
    if (status !== sub.status) { updates.status = status; await logAudit("status_change", { status: sub.status }, { status }); }
    if (importance !== sub.importance) { updates.importance = importance; await logAudit("importance_change", { importance: sub.importance }, { importance }); }
    if (adminNotes !== (sub.admin_notes || "")) { updates.admin_notes = adminNotes; await logAudit("admin_notes_update", { admin_notes: sub.admin_notes }, { admin_notes: adminNotes }); }
    await supabase.from("contact_submissions").update(updates).eq("id", id!);
    toast({ title: "Saved" });
    fetchData();
    setSaving(false);
  };

  const addNote = async () => {
    if (!newNote.trim()) return;
    setSaving(true);
    await supabase.from("request_notes").insert({ submission_id: id!, author_user_id: user!.id, author_role: "admin", content: newNote.trim() });
    await logAudit("admin_note_added", null, { content: newNote.trim() });
    setNewNote("");
    toast({ title: "Note added" });
    fetchData();
    setSaving(false);
  };

  if (loading) return <><Header /><div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div></>;
  if (!sub) return <><Header /><div className="min-h-screen flex items-center justify-center text-muted-foreground">Not found.</div><Footer /></>;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link to="/admin/dashboard" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground mb-6 text-sm"><ArrowLeft className="w-4 h-4" /> Back to Dashboard</Link>

          <div className="bg-card rounded-xl p-6 shadow-card mb-6">
            <h1 className="font-heading text-xl font-bold mb-4">Submission Detail</h1>
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div><strong>Name:</strong> {sub.name}</div>
              <div><strong>Email:</strong> {sub.email}</div>
              <div><strong>Phone:</strong> {sub.phone}</div>
              <div><strong>Submitted:</strong> {new Date(sub.created_at).toLocaleString()}</div>
            </div>
            <p className="text-foreground whitespace-pre-wrap mb-6">{sub.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <Label>Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Importance</Label>
                <Select value={importance} onValueChange={setImportance}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{IMPORTANCES.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="mb-4">
              <Label>Admin Notes</Label>
              <textarea value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} rows={3} maxLength={2000}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm resize-none focus:ring-2 focus:ring-ring focus:outline-none" />
            </div>
            <Button onClick={saveChanges} disabled={saving}>{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}</Button>
          </div>

          {/* Notes */}
          <div className="bg-card rounded-xl p-6 shadow-card mb-6">
            <h2 className="font-heading text-lg font-semibold mb-4">Notes</h2>
            <div className="space-y-3 mb-4">
              {notes.map((n) => (
                <div key={n.id} className="border border-border rounded-lg p-3">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <Badge variant="outline" className="text-xs">{n.author_role}</Badge>
                    <span>{new Date(n.created_at).toLocaleString()}</span>
                  </div>
                  <p className="text-sm">{n.content}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <textarea value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Add admin note…" rows={2} maxLength={1000}
                className="flex-1 px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm resize-none focus:ring-2 focus:ring-ring focus:outline-none" />
              <Button onClick={addNote} disabled={saving || !newNote.trim()}>Send</Button>
            </div>
          </div>

          {/* Activity */}
          <div className="bg-card rounded-xl p-6 shadow-card">
            <h2 className="font-heading text-lg font-semibold mb-4">Activity Log</h2>
            {auditLogs.length === 0 ? <p className="text-muted-foreground text-sm">No activity yet.</p> : (
              <div className="space-y-2">
                {auditLogs.map((log) => (
                  <div key={log.id} className="text-sm border-b border-border pb-2">
                    <span className="text-muted-foreground">{new Date(log.created_at).toLocaleString()}</span>
                    <span className="ml-2 font-medium">{log.action_type}</span>
                    {log.before_data && <span className="ml-2 text-muted-foreground">from: {JSON.stringify(log.before_data)}</span>}
                    {log.after_data && <span className="ml-2 text-muted-foreground">to: {JSON.stringify(log.after_data)}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AdminSubmissionDetail;
