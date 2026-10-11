import { useCallback, useEffect, useState } from "react";
import { adminService } from "../services/adminService.js";
function AdminAmenities() {
    const [amenities, setAmenities] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [statusMessage, setStatusMessage] = useState("");
    const loadAmenities = useCallback(async () => {
        setIsLoading(true);
        setErrorMessage("");
        try {
            setAmenities(await adminService.getAmenities());
        }
        catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "Could not load amenities.");
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    useEffect(() => {
        loadAmenities();
    }, [loadAmenities]);
    function resetForm() {
        setEditingId(null);
        setName("");
        setDescription("");
        setErrorMessage("");
    }
    function editAmenity(amenity) {
        setEditingId(amenity.id);
        setName(amenity.name);
        setDescription(amenity.description || "");
        setErrorMessage("");
        setStatusMessage("");
    }
    async function handleSubmit(event) {
        event.preventDefault();
        setErrorMessage("");
        setStatusMessage("");
        setIsSaving(true);
        try {
            await adminService.saveAmenity({ id: editingId, name, description });
            await loadAmenities();
            setStatusMessage(editingId ? "Amenity updated." : "Amenity added.");
            resetForm();
        }
        catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "Could not save this amenity.");
        }
        finally {
            setIsSaving(false);
        }
    }
    return (<section className="space-y-8">
      <header>
        <p className="text-sm font-semibold text-violet-700">Roomly Admin</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Manage Amenities</h1>
        <p className="mt-2 text-sm text-slate-500">
          Add or update amenities that can be assigned to rooms.
        </p>
      </header>

      {statusMessage && <p role="status" className="text-sm text-emerald-700">{statusMessage}</p>}
      {errorMessage && (<p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {errorMessage}
        </p>)}

      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">
            {editingId ? "Edit amenity" : "Add an amenity"}
          </h2>
          {editingId && (<button type="button" onClick={resetForm} className="text-sm font-semibold text-slate-600 underline">
              Cancel editing
            </button>)}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="amenity-name" className="block text-sm font-semibold text-slate-700">Name</label>
            <input id="amenity-name" type="text" maxLength={60} required value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-100"/>
          </div>
          <div className="space-y-2">
            <label htmlFor="amenity-description" className="block text-sm font-semibold text-slate-700">Description</label>
            <textarea id="amenity-description" rows={2} maxLength={300} value={description} onChange={(event) => setDescription(event.target.value)} className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-100"/>
          </div>
        </div>
        <button type="submit" disabled={isSaving} className="rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700 disabled:cursor-wait disabled:opacity-60">
          {isSaving ? "Saving amenity..." : editingId ? "Save amenity" : "Add amenity"}
        </button>
      </form>

      {isLoading ? (<p role="status" className="text-sm text-slate-500">Loading amenities...</p>) : errorMessage ? null : amenities.length === 0 ? (<p className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">No amenities have been added.</p>) : (<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {amenities.map((amenity) => (<article key={amenity.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-semibold text-slate-900">{amenity.name}</h2>
                <button type="button" onClick={() => editAmenity(amenity)} className="text-sm font-semibold text-violet-700 underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700">
                  Edit
                </button>
              </div>
              <p className="mt-2 text-sm text-slate-600">{amenity.description || "No description."}</p>
            </article>))}
        </div>)}
    </section>);
}
export default AdminAmenities;
