import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Swal from "sweetalert2";

// --- Componente rehusable para Botones de Acción (Añadir/Eliminar) ---
const handleDownloadPDF = async () => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No estás autenticado");

        // 1️⃣ Llamar al backend para verificar y descontar crédito
        const res = await fetch("http://127.0.0.1:8000/api/cv/download", {
            method: "POST", // asegúrate que tu backend use POST
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            }
        });

        const data = await res.json();

        // 2️⃣ Si no hay créditos o hubo error, mostrar alerta y salir
        if (!res.ok) throw new Error(data.message || "No se pudo descargar el CV");

        // 3️⃣ Si el usuario tiene crédito, continuar con la generación del PDF
        const cvElement = document.getElementById("cv-preview");
        if (!cvElement) return;

        // Ocultar botones de edición
        document.querySelectorAll(".no-print").forEach(el => el.style.display = "none");
        await new Promise(resolve => setTimeout(resolve, 150));

        const canvas = await html2canvas(cvElement, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL("image/png");

        // Crear PDF con altura proporcional
        const pdfWidth = 210; // ancho A4 en mm
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        const pdf = new jsPDF({
            orientation: "p",
            unit: "mm",
            format: [pdfWidth, pdfHeight]
        });

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("CV.pdf");

        // Restaurar visibilidad
        document.querySelectorAll(".no-print").forEach(el => el.style.display = "block");

        Swal.fire("¡Descarga exitosa!", data.message, "success");

    } catch (error) {
        Swal.fire("No se puede descargar", error.message, "error");
    }
};


const ActionButton = ({ onClick, title, label, isAdd = false }) => (
    <button
        className="no-print"
        onClick={onClick}
        title={title}
        // Estilos para visibilidad en el CV y funcionalidad de edición
        style={{
            position: isAdd ? 'static' : 'absolute',
            top: '0px',
            right: '5px',
            float: isAdd ? 'none' : 'none',
            background: isAdd ? 'var(--primary-color)' : '#eb311cff',
            color: 'white',
            border: 'none',
            padding: isAdd ? '10px' : '3px 5px',
            borderRadius: isAdd ? '5px' : '50%',
            cursor: 'pointer',
            fontSize: isAdd ? '14px' : '10px',
            fontWeight: isAdd ? 'bold' : 'normal',
            width: isAdd ? '100%' : 'auto',
            marginTop: isAdd ? '20px' : '0',
            marginBottom: isAdd ? '10px' : '0',
            zIndex: 10
        }}
    >
        {label}
    </button>
);

// --- NUEVO Componente para la Barra de Progreso Movible ---
const RangeProgress = ({ value, onProgressChange, id, sectionKey }) => {
    return (
        <div style={{ position: 'relative', width: '100%', marginTop: '5px', height: '10px' }}>
            <div className="skill-bar" style={{ height: '8px', background: '#ccc', borderRadius: '4px' }}>
                <div
                    className="skill-progress"
                    style={{
                        width: `${value}%`,
                        height: '100%',
                        background: 'var(--primary-color)',
                        borderRadius: '4px',
                        transition: 'width 0.2s'
                    }}
                ></div>
            </div>
            {/* Input range overlay para mover la barra */}
            <input
                type="range"
                min="0"
                max="100"
                value={value}
                onChange={(e) => onProgressChange(sectionKey, 'progreso', parseInt(e.target.value), id)}
                style={{
                    position: 'absolute',
                    top: -5, // Ajuste para cubrir la barra visualmente
                    left: 0,
                    width: '100%',
                    height: '20px',
                    margin: 0,
                    padding: 0,
                    opacity: 0, // Hacer invisible pero funcional
                    cursor: 'pointer'
                }}
                title={`Nivel de ${sectionKey} (${value}%)`}
            />
        </div>
    );
};


// --- Subcomponente Sidebar (Edición de Contacto, Habilidades, Lenguajes) ---
const Sidebar = ({ personal, contacto, habilidades, lenguajes, idiomas, redes, onDataChange, onAddItem, onRemoveItem }) => (
    <div className="sidebar">
        {/* Profile Section */}
        <div className="profile-section">
            <div className="profile-img" style={{ textAlign: "center", marginBottom: "15px" }}>

                <label htmlFor="fotoInput">
                    <img
                        src={personal.foto || "/src/assets/Yo.jpg"}
                        alt="."
                    />
                </label>

                <input
                    id="fotoInput"
                    type="file"
                    accept="image/*"
                    style={{ display: "none", }}
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;

                        const reader = new FileReader();
                        reader.onload = () => {
                            onDataChange("personal", "foto", reader.result); // Guardar Base64
                        };
                        reader.readAsDataURL(file);
                    }}
                />
            </div>

            <div
                className="name"
                contentEditable
                suppressContentEditableWarning={true}
                onBlur={(e) => onDataChange('personal', 'nombre', e.target.innerText)}
            >
                {personal.nombre}
            </div>
            <div
                className="title"
                contentEditable
                suppressContentEditableWarning={true}
                onBlur={(e) => onDataChange('personal', 'cc', e.target.innerText)}
            >
                {personal.cc}
            </div>
        </div>

        {/* Contacto */}
        <div className="section">
            <h3>Contacto</h3>
            {['telefono', 'email', 'ubicacion', 'direccion'].map(field => (
                <div key={field} className="item-contact">
                    <img
                        src={`/src/assets/Icons/${field === 'telefono'
                            ? 'Telefono'
                            : field === 'email'
                                ? 'Correo'
                                : field === 'ubicacion'
                                    ? 'Ubicacion'
                                    : 'Casa'
                            }.png`}
                        alt={field}
                    />
                    <span
                        contentEditable
                        suppressContentEditableWarning={true}
                        onBlur={(e) => onDataChange('contacto', field, e.target.innerText)}
                    >
                        {contacto[field]}
                    </span>
                </div>
            ))}
        </div>

        {/* Habilidades (Soft Skills) - Completa edición */}
        <div className="section">
            <h3>Habilidades</h3>
            {habilidades.map((habilidad) => (
                <div key={habilidad.id} className="contact-item editable-list-item" style={{ position: 'relative', paddingRight: '30px', marginBottom: '8px' }}>
                    <ActionButton onClick={() => onRemoveItem('habilidades', habilidad.id)} title="Eliminar habilidad" label="✖" />
                    <span
                        contentEditable
                        suppressContentEditableWarning={true}
                        onBlur={(e) => onDataChange('habilidades', 'nombre', e.target.innerText, habilidad.id)}
                        style={{ display: 'block', paddingRight: '10px' }} // Asegura que ocupe el espacio sin interferir con el botón
                    >
                        {habilidad.nombre}
                    </span>
                </div>
            ))}
            <ActionButton onClick={() => onAddItem('habilidades')} title="Añadir nueva habilidad" label="+ Añadir Habilidad" isAdd={true} />
        </div>

        {/* Lenguajes (Technical Skills) - Progreso Movible y Nombre Editable */}
        <div className="section">
            <h3>Lenguajes</h3>
            {lenguajes.map((lang) => (
                <div key={lang.id} className="skill-item" style={{ position: 'relative' }}>
                    <ActionButton onClick={() => onRemoveItem('lenguajes', lang.id)} title="Eliminar lenguaje" label="✖" />
                    <span
                        contentEditable
                        suppressContentEditableWarning={true}
                        onBlur={(e) => onDataChange('lenguajes', 'nombre', e.target.innerText, lang.id)}
                        style={{ display: 'block', marginBottom: '5px', paddingRight: '10px' }}
                    >
                        {lang.nombre}
                    </span>
                    <RangeProgress
                        value={lang.progreso}
                        onProgressChange={onDataChange}
                        id={lang.id}
                        sectionKey="lenguajes"
                    />
                </div>
            ))}
            <ActionButton onClick={() => onAddItem('lenguajes')} title="Añadir nuevo lenguaje" label="+ Añadir Lenguaje" isAdd={true} />
        </div>

        {/* Idiomas - Progreso Movible y Nombre Editable */}
        <div className="section">
            <h3>Idiomas</h3>
            {idiomas.map((idioma) => (
                <div key={idioma.id} className="skill-item" style={{ position: 'relative' }}>
                    <ActionButton onClick={() => onRemoveItem('idiomas', idioma.id)} title="Eliminar idioma" label="✖" />
                    <span
                        contentEditable
                        suppressContentEditableWarning={true}
                        onBlur={(e) => onDataChange('idiomas', 'nombre', e.target.innerText, idioma.id)}
                        style={{ display: 'block', marginBottom: '5px', paddingRight: '10px' }}
                    >
                        {idioma.nombre}
                    </span>
                    <RangeProgress
                        value={idioma.progreso}
                        onProgressChange={onDataChange}
                        id={idioma.id}
                        sectionKey="idiomas"
                    />
                </div>
            ))}
            <ActionButton onClick={() => onAddItem('idiomas')} title="Añadir nuevo idioma" label="+ Añadir Idioma" isAdd={true} />
        </div>

        {/* ===================== REDES SOCIALES ===================== */}
        <div className="section">
            <h3>Redes Sociales</h3>

            {redes.map(r => (
                <div
                    key={r.id}
                    className="editable-list-item redes-item"
                    style={{
                        position: 'relative',
                        paddingRight: '30px',
                        marginBottom: '12px',
                        display: 'flex',
                        gap: '4px'
                    }}
                >
                    <ActionButton
                        onClick={() => onRemoveItem("redes", r.id)}
                        title="Eliminar red social"
                        label="✖"
                    />

                    {/* Nombre */}
                    <span
                        contentEditable
                        suppressContentEditableWarning={true}
                        onBlur={(e) =>
                            onDataChange("redes", "nombre", e.target.innerText, r.id)
                        }
                        style={{ fontWeight: "bold", display: "block" }}
                    >
                        {r.nombre}
                    </span>

                    {/* URL */}
                    <a
                        contentEditable
                        suppressContentEditableWarning={true}
                        onBlur={(e) =>
                            onDataChange("redes", "url", e.target.innerText, r.id)
                        }
                        style={{ fontSize: "12px", opacity: 0.8 }}
                    >
                        {r.url}
                    </a>
                </div>
            ))}

            {/* Botón para añadir nueva red */}
            <ActionButton
                onClick={() => onAddItem("redes")}
                title="Añadir red social"
                label="+ Añadir Red Social"
                isAdd={true}
            />
        </div>
    </div>
);

// --- Componente Principal MainContent (Edición de Proyectos y Referencias) ---
const MainContent = ({ perfil, formacion, formacion_complementaria, experiencia, proyectos, referencias, firma, onDataChange, onAddItem, onRemoveItem }) => (
    <div className="main-content">
        {/* Perfil Profesional - Solución a la advertencia de key */}
        <div className="main-section">
            <h2>Perfil Profesional</h2>
            <div
                className="description"
                contentEditable
                suppressContentEditableWarning={true}
                // Solo referenciamos el primer elemento (índice 0)
                onBlur={(e) => onDataChange('perfil', 'descripciones', [e.target.innerText], null)}
            >
                {/* Mostramos el primer elemento. Asumimos que siempre hay uno. */}
                {perfil.descripciones[0]}
            </div>
        </div>

        {/* Formación Académica */}
        <div className="main-section">
            <h2>Formación Académica</h2>
            {formacion.map(edu => (
                <div key={edu.id} className="education-item" style={{ position: 'relative', paddingRight: '30px', marginBottom: '15px' }}>
                    <ActionButton onClick={() => onRemoveItem('educacion_academica', edu.id)} title="Eliminar formación" label="✖" />
                    <div className="degree-title" contentEditable suppressContentEditableWarning={true} onBlur={(e) => onDataChange('educacion_academica', 'titulo', e.target.innerText, edu.id)}>{edu.titulo}</div>
                    <div className="institution" contentEditable suppressContentEditableWarning={true} onBlur={(e) => onDataChange('educacion_academica', 'institucion', e.target.innerText, edu.id)}>{edu.institucion}</div>
                    <div className="date" contentEditable suppressContentEditableWarning={true} onBlur={(e) => onDataChange('educacion_academica', 'ubicacion', e.target.innerText, edu.id)}>{edu.ubicacion}</div>
                    <div className="date" contentEditable suppressContentEditableWarning={true} onBlur={(e) => onDataChange('educacion_academica', 'periodo', e.target.innerText, edu.id)}>{edu.periodo}</div>
                    <div className="description" contentEditable suppressContentEditableWarning={true} onBlur={(e) => onDataChange('educacion_academica', 'descripcion', e.target.innerText, edu.id)}>{edu.descripcion}</div>
                </div>
            ))}
            <ActionButton onClick={() => onAddItem('educacion_academica')} title="Añadir nueva formación" label="+ Añadir Formación" isAdd={true} />
        </div>

        {/* Formación Académica */}
        <div className="main-section">
            <h2>Formación Complementaria</h2>
            {formacion_complementaria.map(edu => (
                <div key={edu.id} className="education-item" style={{ position: 'relative', paddingRight: '30px', marginBottom: '15px' }}>
                    <ActionButton onClick={() => onRemoveItem('educacion_complementaria', edu.id)} title="Eliminar formación" label="✖" />
                    <div className="degree-title" contentEditable suppressContentEditableWarning={true} onBlur={(e) => onDataChange('educacion_complementaria', 'titulo', e.target.innerText, edu.id)}>{edu.titulo}</div>
                    <div className="institution" contentEditable suppressContentEditableWarning={true} onBlur={(e) => onDataChange('educacion_complementaria', 'institucion', e.target.innerText, edu.id)}>{edu.institucion}</div>
                    <div className="date" contentEditable suppressContentEditableWarning={true} onBlur={(e) => onDataChange('educacion_complementaria', 'horas', e.target.innerText, edu.id)}>{edu.horas}</div>
                    <div className="description" contentEditable suppressContentEditableWarning={true} onBlur={(e) => onDataChange('educacion_complementaria', 'descripcion', e.target.innerText, edu.id)}>{edu.descripcion}</div>
                </div>
            ))}
            <ActionButton onClick={() => onAddItem('educacion_complementaria')} title="Añadir nueva formación" label="+ Añadir Formación" isAdd={true} />
        </div>

        {/* Experiencia Laboral */}
        <div className="main-section">
            <h2>Experiencia Laboral</h2>
            {experiencia.map(exp => (
                <div key={exp.id} className="experience-item" style={{ position: 'relative', paddingRight: '30px', marginBottom: '15px' }}>
                    <ActionButton onClick={() => onRemoveItem('experiencia', exp.id)} title="Eliminar esta experiencia" label="✖" />
                    <div className="job-title" contentEditable suppressContentEditableWarning={true} onBlur={(e) => onDataChange('experiencia', 'puesto', e.target.innerText, exp.id)}>{exp.puesto}</div>
                    <div className="company" contentEditable suppressContentEditableWarning={true} onBlur={(e) => onDataChange('experiencia', 'empresa', e.target.innerText, exp.id)}>{exp.empresa}</div>
                    <div className="date" contentEditable suppressContentEditableWarning={true} onBlur={(e) => onDataChange('experiencia', 'ubicacion', e.target.innerText, exp.id)}>{exp.ubicacion}</div>
                    <div className="date" contentEditable suppressContentEditableWarning={true} onBlur={(e) => onDataChange('experiencia', 'periodo', e.target.innerText, exp.id)}>{exp.periodo}</div>
                    <div className="description" contentEditable suppressContentEditableWarning={true} onBlur={(e) => onDataChange('experiencia', 'descripcion', e.target.innerText, exp.id)}>{exp.descripcion}</div>
                </div>
            ))}
            <ActionButton onClick={() => onAddItem('experiencia')} title="Añadir nueva experiencia" label="+ Añadir Experiencia" isAdd={true} />
        </div>

        {/* Proyectos Destacados (NUEVO) */}
        <div className="main-section">
            <h2>Proyectos Destacados</h2>
            {proyectos.map(proj => (
                <div key={proj.id} className="experience-item" style={{ position: 'relative', paddingRight: '30px', marginBottom: '15px' }}>
                    <ActionButton onClick={() => onRemoveItem('proyectos', proj.id)} title="Eliminar proyecto" label="✖" />
                    <div className="job-title" contentEditable suppressContentEditableWarning={true} onBlur={(e) => onDataChange('proyectos', 'nombre', e.target.innerText, proj.id)}>{proj.nombre}</div>
                    <div className="company" contentEditable suppressContentEditableWarning={true} onBlur={(e) => onDataChange('proyectos', 'empresa', e.target.innerText, proj.id)}>{proj.empresa}</div>
                    <div className="date" contentEditable suppressContentEditableWarning={true} onBlur={(e) => onDataChange('proyectos', 'anio', e.target.innerText, proj.id)}>{proj.anio}</div>
                    <div className="description" contentEditable suppressContentEditableWarning={true} onBlur={(e) => onDataChange('proyectos', 'descripcion', e.target.innerText, proj.id)}>{proj.descripcion}</div>
                    <div className="company" contentEditable suppressContentEditableWarning={true} onBlur={(e) => onDataChange('proyectos', 'link', e.target.innerText, proj.id)}>{proj.link}</div>
                </div>
            ))}
            <ActionButton onClick={() => onAddItem('proyectos')} title="Añadir nuevo proyecto" label="+ Añadir Proyecto" isAdd={true} />
        </div>

        {/* Referencias (NUEVO) */}
        <div className="main-section references-section">
            <h2>Referencias</h2>

            {/* Referencias Personales */}
            <h3 style={{ marginBottom: '10px' }}>Personales</h3>
            {referencias.personales.map(ref => (
                <div key={ref.id} className="experience-item" style={{ position: 'relative', paddingRight: '30px', marginBottom: '10px' }}>
                    <ActionButton
                        onClick={() => onRemoveItem('referencias.personales', ref.id)}
                        title="Eliminar referencia personal"
                        label="✖"
                    />
                    <div
                        className="job-title"
                        contentEditable
                        suppressContentEditableWarning={true}
                        onBlur={(e) => onDataChange('referencias', 'nombre', e.target.innerText, ref.id, 'personales')}
                    >
                        {ref.nombre}
                    </div>

                    <div
                        className="company"
                        contentEditable
                        suppressContentEditableWarning={true}
                        onBlur={(e) => onDataChange('referencias', 'cargo', e.target.innerText, ref.id, 'personales')}
                    >
                        {ref.cargo}
                    </div>

                    <div
                        className="description"
                        contentEditable
                        suppressContentEditableWarning={true}
                        onBlur={(e) => onDataChange('referencias', 'contacto', e.target.innerText, ref.id, 'personales')}
                    >
                        {ref.contacto}
                    </div>
                </div>
            ))}

            {/* Botón para añadir referencia personal */}
            <ActionButton
                onClick={() => onAddItem('referencias.personales')}
                title="Añadir referencia personal"
                label="+ Añadir Referencia Personal"
                isAdd={true}
            />

            {/* Referencias Laborales */}
            <h3 style={{ marginTop: '20px', marginBottom: '10px' }}>Laborales</h3>
            {referencias.laborales.map(ref => (
                <div key={ref.id} className="experience-item" style={{ position: 'relative', paddingRight: '30px', marginBottom: '10px' }}>
                    <ActionButton
                        onClick={() => onRemoveItem('referencias.laborales', ref.id)}
                        title="Eliminar referencia laboral"
                        label="✖"
                    />
                    <div
                        className="job-title"
                        contentEditable
                        suppressContentEditableWarning={true}
                        onBlur={(e) => onDataChange('referencias', 'nombre', e.target.innerText, ref.id, 'laborales')}
                    >
                        {ref.nombre}
                    </div>

                    <div
                        className="company"
                        contentEditable
                        suppressContentEditableWarning={true}
                        onBlur={(e) => onDataChange('referencias', 'cargo', e.target.innerText, ref.id, 'laborales')}
                    >
                        {ref.cargo}
                    </div>

                    <div
                        className="description"
                        contentEditable
                        suppressContentEditableWarning={true}
                        onBlur={(e) => onDataChange('referencias', 'contacto', e.target.innerText, ref.id, 'laborales')}
                    >
                        {ref.contacto}
                    </div>
                </div>
            ))}

            {/* Botón para añadir referencia laboral */}
            <ActionButton
                onClick={() => onAddItem('referencias.laborales')}
                title="Añadir referencia laboral"
                label="+ Añadir Referencia Laboral"
                isAdd={true}
            />

        </div>

        {/* ===================== FIRMA DIGITAL (IMAGEN) ===================== */}
        <div className="main-section">
            <h2>Firma Digital</h2>

            <div style={{ marginBottom: "10px" }}>
                <label className="no-print" style={{ fontWeight: "bold" }}>
                    Subir firma:
                </label>

                <input
                    type="file"
                    accept="image/*"
                    className="no-print"
                    style={{ display: "block", marginTop: "6px" }}
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;

                        const reader = new FileReader();
                        reader.onload = () => {
                            onDataChange("firma", "img", reader.result);
                        };
                        reader.readAsDataURL(file);
                    }}
                />
            </div>

            {/* Vista previa de la firma */}
            {firma.img ? (
                <img
                    src={firma.img}
                    alt="Firma digital"
                    style={{
                        maxWidth: "250px",
                        height: "auto",
                        objectFit: "contain",
                        marginTop: "10px"
                    }}
                />
            ) : (
                <p style={{ opacity: 0.6 }}>No se ha subido una firma aún.</p>
            )}
        </div>
    </div>
);


// --- Componente Principal CVPreview ---
function CVPreview({ cvData, themeClass, onDataChange, onAddItem, onRemoveItem, onSaveDraft, onLoadDraft, onOpenDrafts, draftList, onResetCV, resetDraftId, activeDraftName, setActiveDraft }) {
    const { personal, contacto, habilidades, lenguajes, idiomas, perfil, experiencia, educacion_academica, educacion_complementaria, proyectos, referencias } = cvData;

    return (
        <>
            <div className="cv-actions">

                <div className="izq">

                    <button
                        className="btn-new btn no-print"
                        onClick={() => {
                            Swal.fire({
                                title: "¿Restaurar CV?",
                                text: "Todos los campos volverán a sus valores predeterminados.",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonText: "Sí, restaurar",
                                cancelButtonText: "Cancelar"
                            }).then(result => {
                                if (result.isConfirmed) {
                                    resetDraftId();
                                    onResetCV();
                                    Swal.fire("Restaurado", "El CV volvió a sus valores iniciales.", "success");
                                }
                            });
                        }}
                    >
                        <img src="/src/assets/new.png" alt="" />
                    </button>

                    <button
                        className="btn-download btn"
                        onClick={() => {
                            Swal.fire({
                                title: '¿Estás seguro?',
                                text: "Se descontará un crédito de tu cuenta para descargar el CV.",
                                icon: 'warning',
                                showCancelButton: true,
                                confirmButtonColor: '#3085d6',
                                cancelButtonColor: '#d33',
                                confirmButtonText: 'Sí, descargar',
                                cancelButtonText: 'Cancelar'
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    handleDownloadPDF();
                                }
                            })
                        }}
                    >
                        Descargar CV
                    </button>

                    <button className="btn-save btn" onClick={onSaveDraft}>
                        Guardar borrador
                    </button>

                    <button
                        className="btn-restore btn"
                        onClick={async () => {
                            // 1) Cargar la lista de borradores y obtener el resultado
                            const drafts = await onOpenDrafts(); // Asegúrate que onOpenDrafts devuelva la lista

                            // 2) Validar que haya borradores
                            if (!drafts || drafts.length === 0) {
                                return Swal.fire({
                                    icon: "info",
                                    title: "Sin borradores",
                                    text: "No tienes borradores guardados aún."
                                });
                            }

                            // 3) Mostrar selección de borradores
                            Swal.fire({
                                title: 'Selecciona un borrador',
                                input: 'select',
                                inputOptions: drafts.reduce((acc, draft) => {
                                    acc[draft.id] = draft.titulo || `Borrador #${draft.id}`;
                                    return acc;
                                }, {}),
                                inputPlaceholder: 'Elige un borrador',
                                showCancelButton: true,
                            }).then(async (result) => {
                                if (result.value) {
                                    const draftId = result.value;
                                    const selectedDraft = drafts.find(d => d.id == draftId);
                                    if (selectedDraft) {
                                        setActiveDraft(selectedDraft.titulo || `Borrador #${selectedDraft.id}`);
                                    }
                                    await onLoadDraft(draftId);
                                }
                            });
                        }}
                    >
                        Restaurar borrador
                    </button>

                    {activeDraftName && (
                        <div style={{
                            backgroundColor: 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            color: '#E69500',
                            height: '100%'
                        }}>
                            <span style={{ fontSize: '1.2em' }}>&#x2139;</span>
                            <span>
                                Borrador activo: <strong style={{ fontWeight: 'bold' }}>{activeDraftName}</strong>
                            </span>
                        </div>
                    )}



                </div>


                <div className="der">
                    <button
                        className="btn-logout btn"
                        onClick={() => {
                            Swal.fire({
                                title: "¿Cerrar sesión?",
                                text: "Tu sesión será cerrada",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonText: "Sí, salir",
                                cancelButtonText: "Cancelar"
                            }).then(result => {
                                if (result.isConfirmed) {
                                    localStorage.removeItem("token");

                                    Swal.fire({
                                        title: "Sesión cerrada",
                                        text: "Has salido correctamente",
                                        icon: "success",
                                        timer: 1500,
                                        showConfirmButton: false
                                    });

                                    setTimeout(() => {
                                        window.location.href = "/login";
                                    }, 1500);
                                }
                            });
                        }}
                    >
                        Cerrar sesión
                    </button>
                </div>

            </div>

            <div className={`container ${themeClass}`} id="cv-preview">

                <Sidebar
                    personal={personal}
                    contacto={contacto}
                    habilidades={habilidades}
                    lenguajes={lenguajes}
                    idiomas={idiomas}
                    redes={cvData.redes}
                    onDataChange={onDataChange}
                    onAddItem={onAddItem}
                    onRemoveItem={onRemoveItem}
                />

                <MainContent
                    perfil={perfil}
                    formacion={educacion_academica}
                    formacion_complementaria={educacion_complementaria}
                    experiencia={experiencia}
                    proyectos={proyectos}
                    referencias={referencias}
                    firma={cvData.firma}
                    onDataChange={onDataChange}
                    onAddItem={onAddItem}
                    onRemoveItem={onRemoveItem}
                />

            </div>
        </>
    );
}

export default CVPreview;
