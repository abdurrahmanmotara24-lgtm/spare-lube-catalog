import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useDbBrands, type DbBrand } from "@/hooks/useDbBrands";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Upload, Pencil, X, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BrandManager = () => {
  const { toast } = useToast();
  const { brands, loading, refetch } = useDbBrands();

  // Add form
  const [newId, setNewId] = useState("");
  const [newName, setNewName] = useState("");
  const [newLogo, setNewLogo] = useState("");
  const [newImage, setNewImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editLogo, setEditLogo] = useState("");
  const [editImage, setEditImage] = useState<File | null>(null);

  const uploadLogo = async (file: File) => {
    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("brand-logos").upload(path, file);
    if (error) throw error;
    return supabase.storage.from("brand-logos").getPublicUrl(path).data.publicUrl;
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let image_url = "";
      if (newImage) image_url = await uploadLogo(newImage);

      const id = newId.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const { error } = await supabase.from("brands").insert({
        id,
        name: newName,
        logo: newLogo,
        image_url,
        sort_order: (brands[brands.length - 1]?.sort_order ?? 0) + 10,
      });
      if (error) throw error;

      toast({ title: "Brand added" });
      setNewId(""); setNewName(""); setNewLogo(""); setNewImage(null);
      refetch();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (b: DbBrand) => {
    setEditingId(b.id);
    setEditName(b.name);
    setEditLogo(b.logo || "");
    setEditImage(null);
  };

  const saveEdit = async (id: string) => {
    try {
      const update: any = { name: editName, logo: editLogo };
      if (editImage) update.image_url = await uploadLogo(editImage);
      const { error } = await supabase.from("brands").update(update).eq("id", id);
      if (error) throw error;
      toast({ title: "Brand updated" });
      setEditingId(null);
      refetch();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this brand? Products under this brand will remain but will be unlinked.")) return;
    const { error } = await supabase.from("brands").delete().eq("id", id);
    if (error) {
      toast({ title: "Error deleting brand", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Brand deleted" });
      refetch();
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-10">
      <h2 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Plus className="h-5 w-5" /> Manage Brands
      </h2>

      {/* Add new brand form */}
      <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 pb-6 border-b border-border">
        <div>
          <Label htmlFor="b-id">Brand ID (slug)</Label>
          <Input id="b-id" value={newId} onChange={(e) => setNewId(e.target.value)} placeholder="e.g. ngk" required />
        </div>
        <div>
          <Label htmlFor="b-name">Brand Name</Label>
          <Input id="b-name" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. NGK" required />
        </div>
        <div>
          <Label htmlFor="b-logo">Emoji/Logo (optional)</Label>
          <Input id="b-logo" value={newLogo} onChange={(e) => setNewLogo(e.target.value)} placeholder="🛢️" />
        </div>
        <div>
          <Label htmlFor="b-image">Brand Image (optional)</Label>
          <label className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-md border border-input bg-background text-sm text-foreground hover:bg-muted transition-colors h-10">
            <Upload className="h-4 w-4" />
            <span className="truncate">{newImage ? newImage.name : "Choose file"}</span>
            <input id="b-image" type="file" accept="image/*" className="hidden"
              onChange={(e) => setNewImage(e.target.files?.[0] || null)} />
          </label>
        </div>
        <div className="sm:col-span-2">
          <Button type="submit" disabled={submitting}>{submitting ? "Adding..." : "Add Brand"}</Button>
        </div>
      </form>

      {/* Brand list */}
      <h3 className="font-semibold text-sm text-foreground mb-3">Existing Brands ({brands.length})</h3>
      {loading ? (
        <p className="text-muted-foreground text-sm">Loading...</p>
      ) : (
        <div className="space-y-2">
          {brands.map((b) => (
            <div key={b.id} className="bg-background border border-border rounded-lg p-3 flex items-center gap-3">
              <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center overflow-hidden shrink-0">
                {b.image_url ? (
                  <img src={b.image_url} alt={b.name} className="max-h-full max-w-full object-contain" />
                ) : (
                  <span className="text-xl">{b.logo || "🛢️"}</span>
                )}
              </div>
              {editingId === b.id ? (
                <div className="flex-1 flex flex-wrap items-center gap-2">
                  <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="w-40" placeholder="Name" />
                  <Input value={editLogo} onChange={(e) => setEditLogo(e.target.value)} className="w-20" placeholder="Emoji" />
                  <label className="flex items-center gap-1 cursor-pointer px-3 py-2 rounded-md border border-input bg-background text-xs hover:bg-muted">
                    <Upload className="h-3 w-3" />
                    <span className="truncate max-w-[100px]">{editImage ? editImage.name : "Replace image"}</span>
                    <input type="file" accept="image/*" className="hidden"
                      onChange={(e) => setEditImage(e.target.files?.[0] || null)} />
                  </label>
                  <Button size="icon" variant="default" onClick={() => saveEdit(b.id)}>
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => setEditingId(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm truncate">{b.name}</p>
                    <p className="text-xs text-muted-foreground truncate">id: {b.id}</p>
                  </div>
                  <Button size="icon" variant="outline" onClick={() => startEdit(b)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="destructive" onClick={() => handleDelete(b.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrandManager;
