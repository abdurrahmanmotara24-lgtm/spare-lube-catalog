import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, LogOut, Upload, ArrowLeft, Pencil, ArrowUp, ArrowDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { useDbBrands } from "@/hooks/useDbBrands";
import { useDbCategories } from "@/hooks/useDbCategories";
import { useDbSizes } from "@/hooks/useDbSizes";
import { getStoredBrandProductOrder, setStoredBrandProductOrder } from "@/lib/productOrder";
import BrandManager from "@/components/admin/BrandManager";
import CategoryManager from "@/components/admin/CategoryManager";
import SizeManager from "@/components/admin/SizeManager";
import DesignSettings from "@/components/admin/DesignSettings";

interface DbProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  sizes: string[] | null;
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

  // Full product edit state
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editBrand, setEditBrand] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editSizes, setEditSizes] = useState<string[]>([]);
  const [editDescription, setEditDescription] = useState("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImageUrl, setEditImageUrl] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  // Local per-brand product ordering
  const [brandProductOrder, setBrandProductOrder] = useState<Record<string, string[]>>(
    () => getStoredBrandProductOrder(),
  );

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
    if (!error && data) {
      const normalized = data.map((product) => ({
        ...product,
        sizes: Array.isArray(product.sizes) ? product.sizes : [],
      }));
      setProducts(applyStoredBrandOrder(normalized));
    }
    setLoadingProducts(false);
  };

  const applyStoredBrandOrder = (list: DbProduct[]) => {
    return [...list].sort((a, b) => {
      if (a.brand !== b.brand) return 0;
      const order = brandProductOrder[a.brand] || [];
      const ai = order.indexOf(a.id);
      const bi = order.indexOf(b.id);
      if (ai === -1 && bi === -1) return b.created_at.localeCompare(a.created_at);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
  };

  useEffect(() => {
    if (user) fetchProducts();
  }, [user, brandProductOrder]);

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

  const startEditProduct = (product: DbProduct) => {
    setEditingProductId(product.id);
    setEditName(product.name);
    setEditBrand(product.brand);
    setEditCategory(product.category);
    setEditSizes(Array.isArray(product.sizes) ? product.sizes : []);
    setEditDescription(product.description || "");
    setEditImageUrl(product.image_url || "");
    setEditImageFile(null);
  };

  const saveProductEdit = async (id: string) => {
    setSavingEdit(true);
    let nextImageUrl = editImageUrl;
    if (editImageFile) {
      const ext = editImageFile.name.split(".").pop();
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("product-images").upload(path, editImageFile);
      if (uploadError) {
        toast({ title: "Image upload failed", description: uploadError.message, variant: "destructive" });
        setSavingEdit(false);
        return;
      }
      nextImageUrl = supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl;
    }

    const { error } = await supabase.from("products").update({
      name: editName,
      brand: editBrand,
      category: editCategory,
      sizes: editSizes,
      description: editDescription,
      image_url: nextImageUrl || null,
    }).eq("id", id);
    if (error) {
      toast({ title: "Error updating product", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Product updated" });
      setEditingProductId(null);
      fetchProducts();
    }
    setSavingEdit(false);
  };

  const moveProductWithinBrand = (product: DbProduct, dir: -1 | 1) => {
    const brandId = product.brand;
    const inBrand = products.filter((p) => p.brand === brandId);
    const ids = inBrand.map((p) => p.id);
    const current = ids.indexOf(product.id);
    const target = current + dir;
    if (current < 0 || target < 0 || target >= ids.length) return;
    const nextIds = [...ids];
    [nextIds[current], nextIds[target]] = [nextIds[target], nextIds[current]];
    const nextOrder = { ...brandProductOrder, [brandId]: nextIds };
    setBrandProductOrder(nextOrder);
    setStoredBrandProductOrder(nextOrder);
  };

  const groupedProducts = useMemo(() => {
    const map: Record<string, DbProduct[]> = {};
    products.forEach((p) => {
      if (!map[p.brand]) map[p.brand] = [];
      map[p.brand].push(p);
    });
    return map;
  }, [products]);

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
          <div className="space-y-6">
            {Object.entries(groupedProducts).map(([brandId, items]) => (
              <div key={brandId} className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">
                  {brands.find((b) => b.id === brandId)?.name || brandId} ({items.length})
                </h3>
                {items.map((product, index) => {
              const isEditing = editingProductId === product.id;
              const productSizes = Array.isArray(product.sizes) ? product.sizes : [];
              return (
                <div key={product.id} className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="h-16 w-16 rounded-md object-contain shrink-0" />
                    ) : (
                      <div className="h-16 w-16 rounded-md border border-border flex items-center justify-center text-2xl opacity-30 shrink-0">🛢️</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {brands.find((b) => b.id === product.brand)?.name || product.brand} · {product.category}
                        {productSizes.length > 0 && ` · ${productSizes.join(", ")}`}
                      </p>
                      {product.description && (
                        <p className="text-xs text-muted-foreground mt-1 truncate">{product.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2 shrink-0 items-center">
                      <Button variant="outline" size="icon" onClick={() => moveProductWithinBrand(product, -1)} disabled={index === 0}>
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => moveProductWithinBrand(product, 1)} disabled={index === items.length - 1}>
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (isEditing) {
                            setEditingProductId(null);
                          } else {
                            startEditProduct(product);
                          }
                        }}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        {isEditing ? "Close" : "Edit"}
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDelete(product.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label className="text-xs">Product name</Label>
                          <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
                        </div>
                        <div>
                          <Label className="text-xs">Brand</Label>
                          <select
                            value={editBrand}
                            onChange={(e) => setEditBrand(e.target.value)}
                            className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground text-sm"
                          >
                            {brands.map((b) => (
                              <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <Label className="text-xs">Category</Label>
                          <select
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value)}
                            className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground text-sm"
                          >
                            {categories.map((c) => (
                              <option key={c.id} value={c.name}>{c.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <Label className="text-xs">Image URL</Label>
                          <Input value={editImageUrl} onChange={(e) => setEditImageUrl(e.target.value)} placeholder="https://..." />
                        </div>
                        <div className="sm:col-span-2">
                          <Label className="text-xs">Replace image file (optional)</Label>
                          <label className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-md border border-input bg-background text-sm text-foreground hover:bg-muted transition-colors w-fit mt-1">
                            <Upload className="h-4 w-4" />
                            {editImageFile ? editImageFile.name : "Choose file"}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => setEditImageFile(e.target.files?.[0] || null)}
                            />
                          </label>
                        </div>
                        <div className="sm:col-span-2">
                          <Label className="text-xs">Description</Label>
                          <Textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} rows={3} />
                        </div>
                      </div>

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
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => saveProductEdit(product.id)} disabled={savingEdit}>
                          {savingEdit ? "Saving..." : "Save product"}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingProductId(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
                })}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
