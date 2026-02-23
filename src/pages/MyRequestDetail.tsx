import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MyRequestDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [submission, setSubmission] = useState<any>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  const fetchData = async () => {
    if (!id || !user) return;
    const { data: sub } = await supabase.from("contact_submissions").select("*").eq("id", id).eq("user_id", user.id).single();
    setSubmission(sub);
    const { data: n } = await supabase.from("request_notes").select("*").eq("submission_id", id).order("created_at", { ascending: true });
    setNotes(n || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [id, user]);

  const addNote = async () => {
    if (!newNote.trim() || !user) return;
    setPosting(true);
    const { error } = await supabase.from("request_notes").insert({
      submission_id: id!,
      author_user_id: user.id,
      author_role: "user",
      content: newNote.trim(),
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { setNewNote(""); await fetchData(); }
    setPosting(false);
  };

  if (loading) return (<><Header /><div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div></>);
  if (!submission) return (<><Header /><div className="min-h-screen flex items-center justify-center text-muted-foreground">Request not found.</div><Footer /></>);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <Link to="/my-requests" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground mb-6 text-sm"><ArrowLeft className="w-4 h-4" /> Back to My Requests</Link>
          <div className="bg-card rounded-xl p-6 shadow-card mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline">{submission.status}</Badge>
              <Badge variant="outline">{submission.importance}</Badge>
            </div>
            <h1 className="font-heading text-xl font-bold text-card-foreground mb-2">Request Details</h1>
            <p className="text-sm text-muted-foreground mb-1"><strong>Name:</strong> {submission.name}</p>
            <p className="text-sm text-muted-foreground mb-1"><strong>Email:</strong> {submission.email}</p>
            <p className="text-sm text-muted-foreground mb-1"><strong>Phone:</strong> {submission.phone}</p>
            <p className="text-sm text-muted-foreground mb-1"><strong>Submitted:</strong> {new Date(submission.created_at).toLocaleString()}</p>
            <p className="mt-4 text-foreground whitespace-pre-wrap">{submission.description}</p>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-card">
            <h2 className="font-heading text-lg font-semibold mb-4">Notes</h2>
            {notes.length === 0 && <p className="text-muted-foreground text-sm mb-4">No notes yet.</p>}
            <div className="space-y-3 mb-4">
              {notes.map((n) => (
                <div key={n.id} className="border border-border rounded-lg p-3">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span className="capitalize">{n.author_role}</span>
                    <span>{new Date(n.created_at).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-foreground">{n.content}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note..."
                maxLength={1000}
                rows={2}
                className="flex-1 px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm resize-none focus:ring-2 focus:ring-ring focus:outline-none"
              />
              <Button onClick={addNote} disabled={posting || !newNote.trim()}>
                {posting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send"}
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default MyRequestDetail;
