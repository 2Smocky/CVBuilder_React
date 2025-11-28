import React, { useState } from 'react';
import { useDraft } from "../hooks/useDraft";
import CVPreview from '../components/CVPreview';
import initialData from '../data/initialData';
import ThemePanel from '../components/ThemePanel';
import "./styles/CVBuilder.css";
import "../App.css";


// --- Componente Principal ---
function App() {
    const [cvData, setCvData] = useState(initialData);
    const [theme, setTheme] = useState('theme-default');

    const {
        draftList,
        loadDrafts,
        saveDraft,
        loadDraft,
        deleteDraft,
        resetDraftId
    } = useDraft(cvData, setCvData);

    // Cuando cargues un borrador:
    const handleLoadDraft = async (id) => {
        await loadDraft(id);
    };

    // Cuando guardes:
    const handleSaveDraft = async () => {
        await saveDraft();
    };

    // Cambiar tema
    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);

        if (newTheme !== "theme-custom") {
            const cv = document.getElementById("cv-preview");
            if (cv) {
                cv.style.removeProperty("--primary-color");
                cv.style.removeProperty("--sidebar-bg");
                cv.style.removeProperty("--text-color-dark");
                cv.style.removeProperty("--accent-gradient");
            }
        }
    };

    // Actualizar datos del CV
    const handleDataChange = (sectionKey, field, value, itemId = null, subSection = null) => {
        setCvData(prevData => {
            // Referencias separadas
            if (subSection) {
                return {
                    ...prevData,
                    [sectionKey]: {
                        ...prevData[sectionKey],
                        [subSection]: prevData[sectionKey][subSection].map(item =>
                            item.id === itemId ? { ...item, [field]: value } : item
                        )
                    }
                };
            }

            const section = prevData[sectionKey];

            if (typeof section === "object" && !Array.isArray(section)) {
                return { ...prevData, [sectionKey]: { ...section, [field]: value } };
            }

            if (Array.isArray(section) && itemId !== null) {
                return { ...prevData, [sectionKey]: section.map(item => item.id === itemId ? { ...item, [field]: value } : item) };
            }

            console.warn(`handleDataChange: Falta itemId para actualizar "${sectionKey}"`);
            return prevData;
        });
    };

    // Añadir ítem
    const handleAddItem = (sectionKey) => {
        const newItem = { id: crypto.randomUUID() };

        // Soporte referencias separadas
        if (sectionKey.includes(".")) {
            const [parent, child] = sectionKey.split(".");
            Object.assign(newItem, { nombre: "Nuevo", cargo: "Cargo", contacto: "Contacto" });
            setCvData(prev => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: [...prev[parent][child], newItem] }
            }));
            return;
        }

        switch (sectionKey) {
            case 'experiencia': Object.assign(newItem, { puesto: "Nuevo Puesto", empresa: "Empresa", ubicacion: "Ciudad", periodo: "Fechas", descripcion: "Describe tus responsabilidades y logros aquí." }); break;
            case 'educacion_academica': Object.assign(newItem, { tipo: "Nueva", titulo: "Título académico (Ej: Técnico, Tecnólogo, Profesional)", institucion: "Nombre de la institución", ubicacion: "Ciudad - País", periodo: "Año inicio - Año fin", detalle_periodo: "", descripcion: "Descripción breve del programa o logros académicos." }); break;
            case 'educacion_complementaria': Object.assign(newItem, { tipo: "Nueva", titulo: "Título del curso o formación", institucion: "Nombre de la institución", horas: "horas de duración", descripcion: "Detalles del curso/formación." }); break;
            case 'habilidades': Object.assign(newItem, { nombre: "Nueva habilidad" }); break;
            case 'lenguajes': Object.assign(newItem, { nombre: "Nuevo Lenguaje", progreso: 50 }); break;
            case 'idiomas': Object.assign(newItem, { nombre: "Nuevo Idioma", progreso: 50 }); break;
            case 'redes': Object.assign(newItem, { nombre: "Red Social", url: "Direccion URL" }); break;
            case 'proyectos': Object.assign(newItem, { nombre: "Nuevo Proyecto", empresa: "Empresa", anio: "Año", descripcion: "Descripción del proyecto.", stack: "Tecnologías", link: "" }); break;
            default: Object.assign(newItem, { nombre: "Nuevo elemento" }); break;
        }

        setCvData(prev => ({ ...prev, [sectionKey]: [...prev[sectionKey], newItem] }));
    };

    // Eliminar ítem
    const handleRemoveItem = (sectionKey, itemId) => {
        if (sectionKey.includes(".")) {
            const [parent, child] = sectionKey.split(".");
            setCvData(prev => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: prev[parent][child].filter(item => item.id !== itemId) }
            }));
            return;
        }

        setCvData(prev => ({
            ...prev,
            [sectionKey]: prev[sectionKey].filter(item => item.id !== itemId)
        }));
    };

    const handleResetCV = () => {
        setCvData(initialData);   // ⬅️ Restaurar datos por defecto
        resetDraftId();
    };

    return (
        <div className="app-layout">
            <main>
                <ThemePanel onThemeChange={handleThemeChange} currentTheme={theme} />

                <CVPreview
                    cvData={cvData}
                    themeClass={theme}
                    onDataChange={handleDataChange}
                    onAddItem={handleAddItem}
                    onRemoveItem={handleRemoveItem}

                    onSaveDraft={saveDraft}
                    onOpenDrafts={loadDrafts}
                    draftList={draftList}
                    onLoadDraft={loadDraft}
                    onDeleteDraft={deleteDraft}

                    onResetCV={handleResetCV}
                    resetDraftId={resetDraftId}
                />
            </main>


            <div className="p404-page">
                <h1>Error</h1>
                <span>Pagina no disponible para moviles</span>
            </div>
        </div>
    );
}

export default App;
