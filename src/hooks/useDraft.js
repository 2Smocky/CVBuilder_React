import { useState } from "react";
import { getDrafts, getDraft, saveDraft, updateDraft, deleteDraft } from "../services/draftService";
import Swal from "sweetalert2";

export function useDraft(cvData, setCvData) {
    const [draftList, setDraftList] = useState([]);
    const [currentDraftId, setCurrentDraftId] = useState(null); // ⬅️ NUEVO

    const loadDrafts = async () => {
        try {
            const drafts = await getDrafts();
            setDraftList(drafts);
            return drafts; // ✅ Retornar la lista
        } catch (err) {
            Swal.fire("Error", "No se pudieron cargar los borradores.", "error");
            return [];
        }
    };

    const handleSave = async () => {
        // Si ya existe borrador cargado → actualizar directamente sin pedir nombre
        if (currentDraftId) {
            try {
                await updateDraft(currentDraftId, cvData);
                Swal.fire("Actualizado", "El borrador se actualizó exitosamente.", "success");
                loadDrafts();
                return;
            } catch {
                Swal.fire("Error", "No se pudo actualizar el borrador.", "error");
                return;
            }
        }

        // Si NO hay borrador cargado → pedir nombre y crear nuevo
        const { value: titulo } = await Swal.fire({
            title: "Guardar borrador",
            input: "text",
            inputLabel: "Nombre del borrador",
            inputPlaceholder: "Ej: Hoja de vida versión 1",
            showCancelButton: true,
        });

        if (!titulo) return;

        try {
            const res = await saveDraft(titulo, cvData);

            if (res?.id) setCurrentDraftId(res.id); // ⬅️ Guardamos el ID del borrador creado

            Swal.fire("Guardado", "El borrador se guardó exitosamente.", "success");
            loadDrafts();
        } catch {
            Swal.fire("Error", "No se pudo guardar el borrador.", "error");
        }
    };

    const handleLoad = async (id) => {
        try {
            const draft = await getDraft(id);

            setCvData(draft.data);
            setCurrentDraftId(id); // ⬅️ Guardar ID del borrador cargado

            Swal.fire("Restaurado", "El borrador ha sido cargado.", "success");
        } catch {
            Swal.fire("Error", "No se pudo cargar el borrador.", "error");
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteDraft(id);

            // Si borró el que estaba usando → resetear estado
            if (id === currentDraftId) {
                setCurrentDraftId(null);
            }

            Swal.fire("Eliminado", "Borrador eliminado.", "success");
            loadDrafts();
        } catch {
            Swal.fire("Error", "No se pudo eliminar el borrador.", "error");
        }
    };

    const resetDraftId = () => {
        setCurrentDraftId(null);
    };

    return {
        draftList,
        currentDraftId,
        loadDrafts,
        saveDraft: handleSave,
        loadDraft: handleLoad,
        deleteDraft: handleDelete,
        setCurrentDraftId,
        resetDraftId,
    };
}
