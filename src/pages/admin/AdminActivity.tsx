import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Loader2, ArrowLeft, X } from "lucide-react";
import { Link } from "react-router-dom";

const AdminActivity = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [entityFilter, setEntityFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("");
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 30;

  useEffect(() => {
    supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(500)
      .then(({ data }) => { setLogs(data || []); setLoading(false); });
  }, []);

  const filtered = logs.filter((l) => {
    if (entityFilter !== "all" && l.entity_type !== entityFilter) return false;
    if (actionFilter && !l.action_type.toLowerCase().includes(actionFilter.toLowerCase())) return false;
    return true;
  });

  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4">
          <Link to="/admin/dashboard" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground mb-6 text-sm"><ArrowLeft className="w-4 h-4" /> Back</Link>
          <h1 className="font-heading text-3xl font-bold text-foreground mb-6">Activity Log</h1>

          <div className="flex flex-wrap gap-3 mb-6">
            <Input placeholder="Filter by action…" value={actionFilter} onChange={(e) => { setActionFilter(e.target.value); setPage(0); }} className="max-w-xs" />
            <Select value={entityFilter} onValueChange={(v) => { setEntityFilter(v); setPage(0); }}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All entities</SelectItem>
                <SelectItem value="submission">Submissions</SelectItem>
                <SelectItem value="label">Labels</SelectItem>
                <SelectItem value="user">Users</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="sm" onClick={() => { setActionFilter(""); setEntityFilter("all"); setPage(0); }}><X className="w-3 h-3 mr-1" /> Clear</Button>
          </div>

          {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : paged.length === 0 ? (
            <p className="text-muted-foreground text-center">No activity found.</p>
          ) : (
            <>
              <div className="space-y-2">
                {paged.map((log) => (
                  <div key={log.id} className="bg-card rounded-lg p-3 shadow-card text-sm flex flex-wrap gap-3 items-start">
                    <span className="text-muted-foreground whitespace-nowrap">{new Date(log.created_at).toLocaleString()}</span>
                    <span className="font-medium">{log.action_type}</span>
                    <span className="text-muted-foreground">{log.entity_type} {log.entity_id?.substring(0, 8)}</span>
                    {log.before_data && <span className="text-xs text-muted-foreground">from: {JSON.stringify(log.before_data)}</span>}
                    {log.after_data && <span className="text-xs text-muted-foreground">to: {JSON.stringify(log.after_data)}</span>}
                  </div>
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</Button>
                  <span className="text-sm text-muted-foreground self-center">Page {page + 1} of {totalPages}</span>
                  <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>Next</Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AdminActivity;
