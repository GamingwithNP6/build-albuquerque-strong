import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

const statusColors: Record<string, string> = {
  New: "bg-blue-100 text-blue-800",
  Triaged: "bg-purple-100 text-purple-800",
  "In Progress": "bg-yellow-100 text-yellow-800",
  "Waiting on User": "bg-orange-100 text-orange-800",
  Blocked: "bg-red-100 text-red-800",
  Done: "bg-green-100 text-green-800",
  Closed: "bg-muted text-muted-foreground",
};

const importanceColors: Record<string, string> = {
  Low: "bg-muted text-muted-foreground",
  Medium: "bg-blue-100 text-blue-800",
  High: "bg-orange-100 text-orange-800",
  Critical: "bg-red-100 text-red-800",
};

const MyRequests = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("contact_submissions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => { setSubmissions(data || []); setLoading(false); });
  }, [user]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-8">My Requests</h1>
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg mb-2">No submissions yet.</p>
              <Link to="/#contact-form" className="text-secondary hover:underline">Submit a request →</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((s) => (
                <Link key={s.id} to={`/my-requests/${s.id}`} className="block bg-card rounded-xl p-5 shadow-card hover:shadow-card-hover transition-shadow">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <h3 className="font-heading font-semibold text-card-foreground line-clamp-1">{s.description.substring(0, 80)}{s.description.length > 80 ? "…" : ""}</h3>
                    <span className="text-xs text-muted-foreground">{new Date(s.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className={statusColors[s.status] || ""}>{s.status}</Badge>
                    <Badge variant="outline" className={importanceColors[s.importance] || ""}>{s.importance}</Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default MyRequests;
