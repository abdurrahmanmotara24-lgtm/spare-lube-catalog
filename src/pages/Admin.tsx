import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, LogOut, Upload, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { useDbBrands } from "@/hooks/useDbBrands";
import { useDbCategories } from "@/hooks/useDbCategories";
import { useDbSizes } from "@/hooks/useDbSizes";
import BrandManager from "@/components/admin/BrandManager";
import CategoryManager from "@/components/admin/CategoryManager";
import SizeManager from "@/components/admin/SizeManager";
import DesignSettings from "@/components/admin/DesignSettings";

interface DbProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  sizes: string[];
  description: string | null;
  image_url: string | null;
  created_at: string;
}

const Admin = () => {
  const { user, loading, signOut } = useAuth();
  const { toast } = useToast();
  const { brands } = useDbBrands();
  const { categories } = useDbCategories();
  const { sizes: sizeLibrary } = useDbSizes();
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Form state
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Edit state
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editSizes, setEditSizes] = useState<string[]>([]);

  const toggleSize = (s: string, list: string[], setter: (v: string[]) => void) => {
    setter(list.includes(s) ? list.filter((x) => x !== s) : [...list, s]);
  };

  const moveSize = (s: string, dir: -1 | 1, list: string[], setter: (v: string[]) => void) => {
    const i = list.indexOf(s);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= list.length) return;
    const next = [...list];
    [next[i], next[j]] = [next[j], next[i]];
    setter(next);
  };

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setProducts(data);
    setLoadingProducts(false);
  };

  useEffect(() => {
    if (user) fetchProducts();
  }, [user]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><p className="text-muted-foreground">Loading...</p></div>;
  if (!user) return <Navigate to="/login" replace />;

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    let image_url = "";

    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, imageFile);

      if (uploadError) {
        toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
        setSubmitting(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);
      image_url = urlData.publicUrl;
    }

    const { error } = await supabase.from("products").insert({
      name,
      brand,
      category,
      sizes: selectedSizes,
      description,
      image_url,
    });

    if (error) {
      toast({ title: "Error adding product", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Product added successfully" });
      setName("");
      setBrand("");
      setCategory("");
      setSelectedSizes([]);
      setDescription("");
      setImageFile(null);
      fetchProducts();
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast({ title: "Error deleting product", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Product deleted" });
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const saveProductSizes = async (id: string) => {
    const { error } = await supabase.from("products").update({ sizes: editSizes }).eq("id", id);
    if (error) {
      toast({ title: "Error updating sizes", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Sizes updated" });
      setEditingProductId(null);
      fetchProducts();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
            </Link>
            <h1 className="font-heading text-lg font-bold text-foreground">Product Admin</h1>
          </div>
          <Button variant="outline" size="sm" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-1" /> Sign Out
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Design Settings */}
        <DesignSettings />

        {/* Brand Manager */}
        <BrandManager />

        {/* Category Manager */}
        <CategoryManager />

        {/* Size Manager */}
        <SizeManager />

        {/* Add Product Form */}
        <div className="bg-card border border-border rounded-xl p-6 mb-10">
          <h2 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Plus className="h-5 w-5" /> Add New Product
          </h2>
          <form onSubmit={handleAddProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Shell Helix HX5" required />
            </div>
            <div>
              <Label htmlFor="brand">Brand</Label>
              <select
                id="brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground text-sm"
                required
              >
                <option value="">Select brand</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground text-sm"
                required
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <Label>Sizes</Label>
              {sizeLibrary.length === 0 ? (
                <p className="text-xs text-muted-foreground mt-1">
                  No sizes defined yet. Add some in the Manage Sizes section above.
                </p>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {sizeLibrary.map((s) => {
                      const checked = selectedSizes.includes(s.name);
                      return (
                        <button
                          type="button"
                          key={s.id}
                          onClick={() => toggleSize(s.name, selectedSizes, setSelectedSizes)}
                          className={`text-xs px-3 py-1.5 rounded-md border transition-colors ${
                            checked
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-background text-foreground border-input hover:border-primary/50"
                          }`}
                        >
                          {s.name}
                        </button>
                      );
                    })}
                  </div>
                  {selectedSizes.length > 1 && (
                    <p className="text-[11px] text-muted-foreground mt-2">
                      Selection order: {selectedSizes.join(" → ")}
                    </p>
                  )}
                </>
              )}
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Product description..." rows={3} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="image">Product Image</Label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-md border border-input bg-background text-sm text-foreground hover:bg-muted transition-colors">
                  <Upload className="h-4 w-4" />
                  {imageFile ? imageFile.name : "Choose file"}
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  />
                </label>
              </div>
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={submitting}>
                {submitting ? "Adding..." : "Add Product"}
              </Button>
            </div>
          </form>
        </div>

        {/* Product List */}
        <h2 className="font-heading text-lg font-semibold text-foreground mb-4">
          Database Products ({products.length})
        </h2>
        {loadingProducts ? (
          <p className="text-muted-foreground">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-muted-foreground">No database products yet. Add one above.</p>
        ) : (
          <div className="space-y-3">
            {products.map((product) => {
              const isEditing = editingProductId === product.id;
              return (
                <div key={product.id} className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="h-16 w-16 rounded-md object-contain bg-muted shrink-0" />
                    ) : (
                      <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center text-2xl opacity-20 shrink-0">🛢️</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {brands.find((b) => b.id === product.brand)?.name || product.brand} · {product.category}
                        {product.sizes.length > 0 && ` · ${product.sizes.join(", ")}`}
                      </p>
                      {product.description && (
                        <p className="text-xs text-muted-foreground mt-1 truncate">{product.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (isEditing) {
                            setEditingProductId(null);
                          } else {
                            setEditingProductId(product.id);
                            setEditSizes(product.sizes);
                          }
                        }}
                      >
                        {isEditing ? "Close" : "Sizes"}
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDelete(product.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-xs font-medium text-foreground mb-2">Assign sizes (click to toggle)</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {sizeLibrary.map((s) => {
                          const checked = editSizes.includes(s.name);
                          return (
                            <button
                              type="button"
                              key={s.id}
                              onClick={() => toggleSize(s.name, editSizes, setEditSizes)}
                              className={`text-xs px-3 py-1.5 rounded-md border transition-colors ${
                                checked
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "bg-background text-foreground border-input hover:border-primary/50"
                              }`}
                            >
                              {s.name}
                            </button>
                          );
                        })}
                      </div>
                      {editSizes.length > 0 && (
                        <>
                          <p className="text-xs font-medium text-foreground mb-2">Display order</p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {editSizes.map((s) => (
                              <div key={s} className="flex items-center gap-1 px-2 py-1 rounded-md border border-border bg-background text-xs">
                                <span>{s}</span>
                                <button
                                  type="button"
                                  className="text-muted-foreground hover:text-foreground px-1"
                                  onClick={() => moveSize(s, -1, editSizes, setEditSizes)}
                                  aria-label="Move up"
                                >
                                  ↑
                                </button>
                                <button
                                  type="button"
                                  className="text-muted-foreground hover:text-foreground px-1"
                                  onClick={() => moveSize(s, 1, editSizes, setEditSizes)}
                                  aria-label="Move down"
                                >
                                  ↓
                                </button>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                      <Button size="sm" onClick={() => saveProductSizes(product.id)}>
                        Save sizes
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
