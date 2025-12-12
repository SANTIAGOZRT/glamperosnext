"use client";

import React, { useState } from "react";
import "./estilos.css";

type Categoria = {
  nombre: string;
  imagen: string;
};

const HeaderCompleto: React.FC = () => {
  const [destino, setDestino] = useState<string>("");
  const [fecha, setFecha] = useState<string>("");
  const [personas, setPersonas] = useState<number | "">("");
  const [seleccionadas, setSeleccionadas] = useState<string[]>([]);
  const [menuAbierto, setMenuAbierto] = useState(false);

  const categorias: Categoria[] = [
    { nombre: "Bogotá", imagen: "https://storage.cloud.google.com/glamperos-imagenes/Imagenes/Bogota.svg" },
    { nombre: "Medellín", imagen: "https://storage.cloud.google.com/glamperos-imagenes/Imagenes/Medellin.svg" },
    { nombre: "Domos", imagen: "https://storage.cloud.google.com/glamperos-imagenes/Imagenes/Domo.svg" },
    { nombre: "Tienda", imagen: "https://storage.cloud.google.com/glamperos-imagenes/Imagenes/Tienda.svg" },
    { nombre: "Cabañas", imagen: "https://storage.cloud.google.com/glamperos-imagenes/Imagenes/Caba%C3%B1as.svg" },
    { nombre: "Chalet", imagen: "https://storage.cloud.google.com/glamperos-imagenes/Imagenes/Chalet.svg" },
    { nombre: "Tipis", imagen: "https://storage.cloud.google.com/glamperos-imagenes/Imagenes/Tipis.svg" },
    { nombre: "Jacuzzi", imagen: "https://storage.cloud.google.com/glamperos-imagenes/Imagenes/Jacuzzi.svg" },
    { nombre: "Piscina", imagen: "https://storage.cloud.google.com/glamperos-imagenes/Imagenes/Piscina.svg" }
  ];

  const toggleCategoria = (nombre: string) => {
    setSeleccionadas((prev) =>
      prev.includes(nombre)
        ? prev.filter((c) => c !== nombre)
        : [...prev, nombre]
    );
  };

  const removeTag = (nombre: string) => {
    setSeleccionadas((prev) => prev.filter((c) => c !== nombre));
  };

  const handleSearchClick = () => {
    console.log({
      destino,
      fecha,
      personas: personas === "" ? 0 : personas,
      categorias: seleccionadas
    });
  };

  return (
    <header className="Prueba-header">

      <div className="Prueba-header-background" />

      <div className="Prueba-header-content">

        {/* TOP */}
        <div className="Prueba-header-top">
          <div className="Prueba-header-logo">
            <img
              src="https://storage.googleapis.com/glamperos-imagenes/Imagenes/animal5.jpeg"
              className="Prueba-logo-img"
            />
            <span className="Prueba-logo-text">Glamperos</span>
          </div>

          {/* NAV + HAMBURGUESA */}
          <nav className="Prueba-header-nav">
            {/* HAMBURGUESA */}
            <button
              className="Prueba-hamburger-btn"
              onClick={() => setMenuAbierto(!menuAbierto)}
            >
              <img
                src={menuAbierto ? "/icons/close.svg" : "/icons/hamburger.svg"}
                className="Prueba-hamburger-icon"
              />
            </button>

            {/* BOTONES NORMAL (DESKTOP) */}
            <button className="Prueba-nav-button">Publica tu glamping</button>
            <button className="Prueba-nav-button">Blog</button>

            <button className="Prueba-nav-button Prueba-nav-button-login">
              Iniciar sesión
            </button>
          </nav>
        </div>

        {/* MENÚ DESPLEGABLE */}
        {menuAbierto && (
          <div className="Prueba-dropdown-menu">
            <button className="Prueba-dropdown-item">Publica tu glamping</button>
            <button className="Prueba-dropdown-item">Blog</button>
            <button className="Prueba-dropdown-item">Iniciar sesión</button>
          </div>
        )}

        {/* TITULO */}
        <h1 className="Prueba-header-tagline">
          DESCUBRE GLAMPINGS Y ALOJAMIENTOS RURALES INCREÍBLES PARA RESERVAR EN COLOMBIA
        </h1>

        {/* TAGS */}
        {seleccionadas.length > 0 && (
          <div className="Prueba-tags-container">
            {seleccionadas.map((nombre) => (
              <div key={nombre} className="Prueba-tag-chip">
                <span>{nombre}</span>
                <button
                  type="button"
                  className="Prueba-tag-close"
                  onClick={() => removeTag(nombre)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* BARRA DE BÚSQUEDA */}
        <div className="Prueba-new-search-wrapper">
          <div className="Prueba-new-search-bar">

            <label className="Prueba-new-search-item">
              <img src="ubi.png" className="Prueba-new-icon" />
              <input
                type="text"
                placeholder="¿A dónde vas?"
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
              />
            </label>

            <label className="Prueba-new-search-item">
              <img src="calendario.png" className="Prueba-new-icon" />
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
              />
            </label>

            <label className="Prueba-new-search-item">
              <img src="persona.png" className="Prueba-new-icon" />
              <input
                type="number"
                placeholder="Personas"
                min={1}
                value={personas === "" ? "" : personas}
                onChange={(e) => {
                  const v = e.target.value;
                  setPersonas(v === "" ? "" : Math.max(1, parseInt(v)));
                }}
              />
            </label>

            <button
              type="button"
              className="Prueba-new-search-btn"
              onClick={handleSearchClick}
            >
              <img src="./icons/lupa.png" className="Prueba-new-search-icon" />
            </button>
          </div>
        </div>

        {/* CATEGORÍAS */}
        <div className="Prueba-header-categories">
          {categorias.map((cat) => (
            <button
              key={cat.nombre}
              type="button"
              className={`Prueba-category ${
                seleccionadas.includes(cat.nombre)
                  ? "Prueba-active-cat"
                  : ""
              }`}
              onClick={() => toggleCategoria(cat.nombre)}
            >
              <img src={cat.imagen} className="Prueba-category-img" />
              <span className="Prueba-category-span">{cat.nombre}</span>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default HeaderCompleto;