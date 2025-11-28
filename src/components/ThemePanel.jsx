// src/components/ThemePanel.jsx
import React from 'react';

// Estilos simples para el panel de control
const panelStyle = {
    position: 'fixed',
    top: '50px',
    right: '20px',
    zIndex: 1000,
    padding: '10px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
};

// Definición de los temas disponibles
const themes = [
    { name: '', class: 'theme-default', color: '#3498db' },
    { name: '', class: 'theme-black', color: '#000000ff' },
    { name: '', class: 'theme-sapphire', color: '#1abc9c' },
    { name: '', class: 'theme-peach', color: '#ad9378' },
    { name: '', class: 'theme-charcoal', color: '#df5343ff' },
    { name: '', class: 'theme-night', color: '#8e44ad' },
    { name: '', class: 'theme-forest', color: '#1e8449' },
    { name: '', class: 'theme-gold', color: '#f1c40f' },
    { name: '', class: 'theme-custom', color: '#cececeff' },
];


function ThemePanel({ onThemeChange, currentTheme }) {

    const updateVariable = (variable, value) => {
        const cv = document.getElementById("cv-preview");
        if (cv) {
            cv.style.setProperty(variable, value);
        }
    };

    const handleCustomColorChange = (variable) => (e) => {
        const color = e.target.value;
        updateVariable(variable, color);
    };

    // Para generar gradient con 2 colores
    const handleGradientChange = (index) => (e) => {
        const color = e.target.value;

        const cv = document.getElementById("cv-preview");

        // Obtener el gradient actual
        const current = getComputedStyle(cv).getPropertyValue("--accent-gradient");

        // Extraer colores
        const matches = current.match(/#([0-9A-F]{3,8})/gi) || ["#3498db", "#2980b9"];
        matches[index] = color;

        const newGradient = `linear-gradient(90deg, ${matches[0]}, ${matches[1]})`;

        cv.style.setProperty("--accent-gradient", newGradient);
    };

    return (
        <div style={panelStyle}>
            <h4>Tema</h4>

            {themes.map((theme) => (
                <button
                    key={theme.class}
                    onClick={() => onThemeChange(theme.class)}
                    style={{
                        padding: "8px 25px",
                        borderRadius: "5px",
                        backgroundColor: theme.color,
                        color: "white",
                        border: "none",
                        cursor: "pointer"
                    }}
                >
                    {theme.name}
                </button>
            ))}

            {currentTheme === "theme-custom" && (
                <div style={{ display: "grid", gap: "4px" }}>
                    <input style={{ cursor: "pointer" }} type="color" onChange={handleCustomColorChange("--primary-color")} />
                    <input style={{ cursor: "pointer" }} type="color" onChange={handleCustomColorChange("--sidebar-bg")} />
                    <input style={{ cursor: "pointer" }} type="color" onChange={handleCustomColorChange("--text-color-dark")} />
                    <input style={{ cursor: "pointer" }} type="color" onChange={handleGradientChange(0)} />
                    <input style={{ cursor: "pointer" }} type="color" onChange={handleGradientChange(1)} />
                </div>
            )}
        </div>
    );
}

export default ThemePanel;