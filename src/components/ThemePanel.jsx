// src/components/ThemePanel.jsx
import React from 'react';

// Estilos para el tooltip y el botón
const style = `
.theme-button-wrapper {
    position: relative;
    display: inline-block;
}

.theme-button-wrapper .tooltip {
    visibility: hidden;
    background-color: #555555a3;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 1px 5px;
    position: absolute;
    z-index: 1;
    width: 120px;
    top: 70%;
    right: 110%;
    transform: translateY(-50%);
    opacity: 0;
    transition: opacity 0.3s;
}

.theme-button-wrapper .tooltip::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 100%;
    margin-top: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent transparent #555;
}

.theme-button-wrapper:hover .tooltip {
    visibility: visible;
    opacity: 1;
}
`;

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
};

// Definición de los temas disponibles
const themes = [
    { name: 'Predeterminado', class: 'theme-default', color: '#3498db' },
    { name: 'Negro', class: 'theme-black', color: '#000000ff' },
    { name: 'Zafiro', class: 'theme-sapphire', color: '#1abc9c' },
    { name: 'Durazno', class: 'theme-peach', color: '#ad9378' },
    { name: 'Carbón', class: 'theme-charcoal', color: '#df5343ff' },
    { name: 'Noche', class: 'theme-night', color: '#8e44ad' },
    { name: 'Bosque', class: 'theme-forest', color: '#1e8449' },
    { name: 'Dorado', class: 'theme-gold', color: '#f1c40f' },
    { name: 'Personalizado', class: 'theme-custom', color: '#cececeff' },
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
        const matches = current.match(/#([0-9A-F]{3,8})/gi) || ["#3498db", "2980b9"];
        matches[index] = color;

        const newGradient = `linear-gradient(90deg, ${matches[0]}, ${matches[1]})`;

        cv.style.setProperty("--accent-gradient", newGradient);
    };

    return (
        <>
            <style>{style}</style>
            <div style={panelStyle}>
                <h4>Tema</h4>

                {themes.map((theme) => (
                    <div key={theme.class} className="theme-button-wrapper">
                        <button
                            onClick={() => onThemeChange(theme.class)}
                            style={{
                                padding: "8px 25px",
                                borderRadius: "5px",
                                backgroundColor: theme.color,
                                color: "white",
                                border: "none",
                                cursor: "pointer",
                                width: '100%'
                            }}
                        >
                        </button>
                        <span className="tooltip">{theme.name}</span>
                    </div>
                ))}

                {currentTheme === "theme-custom" && (
                    <div style={{ display: "grid", gap: "4px", marginTop: "8px" }}>
                        <div className="theme-button-wrapper">
                            <input style={{ cursor: "pointer", width: '100%' }} type="color" onChange={handleCustomColorChange("--primary-color")} />
                            <span className="tooltip">Color primario</span>
                        </div>
                        <div className="theme-button-wrapper">
                            <input style={{ cursor: "pointer", width: '100%' }} type="color" onChange={handleCustomColorChange("--sidebar-bg")} />
                            <span className="tooltip">Fondo de la barra lateral</span>
                        </div>
                        <div className="theme-button-wrapper">
                            <input style={{ cursor: "pointer", width: '100%' }} type="color" onChange={handleCustomColorChange("--text-color-dark")} />
                            <span className="tooltip">Color del texto oscuro</span>
                        </div>
                        <div className="theme-button-wrapper">
                            <input style={{ cursor: "pointer", width: '100%' }} type="color" onChange={handleGradientChange(0)} />
                            <span className="tooltip">Color del gradiente 1</span>
                        </div>
                        <div className="theme-button-wrapper">
                            <input style={{ cursor: "pointer", width: '100%' }} type="color" onChange={handleGradientChange(1)} />
                            <span className="tooltip">Color del gradiente 2</span>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default ThemePanel;