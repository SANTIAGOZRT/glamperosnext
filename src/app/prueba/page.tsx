"use client"

import Image from "next/image"
import { useState, useRef, useEffect } from "react"
import "./estilos.css"
import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css'; 
import { DateRangePicker } from 'react-date-range';
import { addDays, format, addMonths, isSameDay } from 'date-fns'; 
import { es } from 'date-fns/locale'; 
import municipiosData from "../../Componentes/Municipios/municipios.json"

interface Municipio {
  CIUDAD_DEPARTAMENTO: string;
  CIUDAD: string;
  DEPARTAMENTO: string;
}

type Operacion = "sumar" | "restar";
interface CounterRowProps {
  label: string;
  sublabel: string;
  value: number;
  onChange: (op: Operacion) => void;
  max: number;
}

export default function HeaderFinal() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [destino, setDestino] = useState("")
  const [municipiosFiltrados, setMunicipiosFiltrados] = useState<Municipio[]>(municipiosData as Municipio[])
  const [calendarTab, setCalendarTab] = useState<'dates' | 'flexible'>('dates');
  const [monthsToShow, setMonthsToShow] = useState(2);

  // Estado para saber si el usuario ya seleccionó fecha
  const [hasSelection, setHasSelection] = useState(false); 

  const [stateDates, setStateDates] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1), 
      key: 'selection'
    }
  ]);

  const [flexibleDuration, setFlexibleDuration] = useState('semana');
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [viajeros, setViajeros] = useState({ adultos: 0, ninos: 0, bebes: 0, mascotas: 0 })

  const searchRef = useRef<HTMLDivElement>(null)
  const nextMonths = Array.from({ length: 6 }, (_, i) => addMonths(new Date(), i));

  // Responsividad del calendario
  useEffect(() => {
    const handleResize = () => {
      setMonthsToShow(window.innerWidth < 768 ? 1 : 2);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Click outside y Touch outside
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        if ((event.target as HTMLElement).closest('.rdrCalendarWrapper')) return;
        if ((event.target as HTMLElement).closest('.dropdown-panel')) return;
        setActiveMenu(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("touchstart", handleClickOutside);
    }
  }, [])

  // Filtros
  const handleDestinoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const busqueda = e.target.value;
    setDestino(busqueda);
    const filtrados = (municipiosData as Municipio[]).filter((m) =>
      m.CIUDAD_DEPARTAMENTO.toLowerCase().includes(busqueda.toLowerCase())
    );
    setMunicipiosFiltrados(filtrados);
  }

  const seleccionarDestino = (nombre: string) => {
    setDestino(nombre)
    setActiveMenu("fechas")
  }

  // === LÓGICA DE SELECCIÓN Y DESELECCIÓN ===
  const handleSelectDate = (ranges: any) => {
    const newSelection = ranges.selection;
    const currentSelection = stateDates[0];

    const clickedSameStart = isSameDay(newSelection.startDate, currentSelection.startDate);
    const clickedSameEnd = isSameDay(newSelection.endDate, currentSelection.endDate);

    if (hasSelection && clickedSameStart && clickedSameEnd) {
        setHasSelection(false); 
        setStateDates([{ startDate: new Date(), endDate: addDays(new Date(), 1), key: 'selection' }]); 
    } else {
        setHasSelection(true);
        setStateDates([newSelection]);
    }
  }

  // Contadores
  const actualizarViajeros = (tipo: "adultos" | "ninos" | "bebes" | "mascotas", operacion: "sumar" | "restar") => {
    setViajeros((prev) => {
      const actual = prev[tipo]
      let nuevo = operacion === "sumar" ? actual + 1 : actual - 1
      if (nuevo < 0) nuevo = 0
      if (tipo === "mascotas" && nuevo > 5) return prev
      if ((tipo !== "mascotas") && nuevo > 10) return prev
      return { ...prev, [tipo]: nuevo }
    })
  }
  
  const totalPersonas = viajeros.adultos + viajeros.ninos

  const handleSearch = () => {
    console.log("Buscar...")
    setActiveMenu(null); 
  }

  const categories = [
    { name: "Bogotá", icon: "Bogota" }, { name: "Medellín", icon: "Medellin" },
    { name: "Domos", icon: "Domo" }, { name: "Tiendas", icon: "Tienda" },
    { name: "Cabañas", icon: "Cabañas" }, { name: "Chalets", icon: "Chalet" },
    { name: "Tipis", icon: "Tipis" }, { name: "Jacuzzi", icon: "Jacuzzi" },
    { name: "Piscina", icon: "Piscina" },
  ]

  return (
    <header className="headerFinal-container">
       <nav className="headerFinal-topNav">
        <div className="headerFinal-topNavContent">
            
            {/* Botón Menú Hamburguesa */}
             <button className="headerFinal-mobileMenuBtn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
             </button>

            {/* Logo Central */}
            <div className="headerFinal-logo">
                 <Image src="https://storage.googleapis.com/glamperos-imagenes/Imagenes/animal5.jpeg" alt="Logo" width={50} height={50} className="headerFinal-logoImage"/>
                 <span className="headerFinal-logoText">GLAMPEROS</span>
            </div>

            {/* Enlaces Desktop */}
            <ul className="headerFinal-navLinks">
                <li><a href="/" className="headerFinal-navLink">Publica tu glamping</a></li>
                <li><a href="/blog" className="headerFinal-navLink">Blog</a></li>
                <li><button className="headerFinal-loginBtn">Iniciar sesión</button></li>
            </ul>

            {/* Icono Usuario */}
            <div className="headerFinal-mobileUser">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user-circle"><circle cx="12" cy="12" r="10"></circle><path d="M7 20.662V19a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1.662"></path></svg>
                <span className="headerFinal-mobileUserText">Iniciar sesión</span>
            </div>

        </div>
       </nav>
       {mobileMenuOpen && (
        <div className="headerFinal-mobileMenu">
          <a href="#" className="headerFinal-mobileMenuItem">Publica tu glamping</a>
          <a href="#" className="headerFinal-mobileMenuItem">Blog</a>
          <button className="headerFinal-mobileMenuItem headerFinal-mobileLoginBtn">Iniciar sesión</button>
        </div>
       )}

      <section className="headerFinal-hero">
        <div className="headerFinal-heroImageWrapper">
          <Image src="https://storage.googleapis.com/glamperos-imagenes/glampings/0f5326c3fa4a404bb1b4c37b9531d8d9.webp" alt="Hero" fill className="headerFinal-heroImage" priority />
          <div className="headerFinal-heroOverlay" />
        </div>

        <div className="headerFinal-heroContent">
          {/* ZONA NARANJA: TEXTO VISIBLE */}
          <h1 className="headerFinal-heroTitle">DESCUBRE GLAMPINGS Y ALOJAMIENTOS RURALES INCREÍBLES PARA RESERVAR EN COLOMBIA</h1>

          {/* ZONA AMARILLA: TARJETA FLOTANTE */}
          <div className="search-bar-container" ref={searchRef}>
            <div className="search-bar">
                
                {/* 1. DÓNDE (Pastilla) */}
                <div className={`search-item ${activeMenu === 'donde' ? 'active' : ''}`} onClick={() => setActiveMenu('donde')}>
                    <div className="search-item-content">
                        <div className="input-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        </div>
                        <div className="search-text-group">
                            <label className="search-label">Dónde</label>
                            <input 
                                type="text" 
                                placeholder="¿A dónde vas?" 
                                className="search-input-text"
                                value={destino}
                                onChange={handleDestinoChange}
                            />
                        </div>
                    </div>
                    {activeMenu === 'donde' && (
                        <div className="dropdown-panel location-dropdown">
                            <ul className="location-list">
                                {municipiosFiltrados.slice(0, 5).map((item, index) => (
                                    <li key={index} className="location-item" onClick={(e) => { e.stopPropagation(); seleccionarDestino(item.CIUDAD_DEPARTAMENTO); }}>
                                        <div className="icon-box">📍</div> 
                                        <div><div style={{fontWeight: 'bold'}}>{item.CIUDAD}</div><div style={{fontSize: '12px'}}>{item.DEPARTAMENTO}</div></div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="divider"></div>

                {/* 2. FECHAS (Pastilla) */}
                <div className={`search-item ${activeMenu === 'fechas' ? 'active' : ''}`} onClick={() => setActiveMenu('fechas')}>
                    <div className="search-item-content">
                        <div className="input-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        </div>
                        <div className="search-text-group">
                            <label className="search-label">Fechas</label>
                            <div className="search-input-text">
                                {hasSelection && calendarTab === 'dates' 
                                    ? `${format(stateDates[0].startDate, 'dd MMM', {locale: es})} - ${format(stateDates[0].endDate, 'dd MMM', {locale: es})}`
                                    : (calendarTab === 'flexible' ? 'Flexible' : 'Fecha')
                                }
                            </div>
                        </div>
                    </div>
                    
                    {activeMenu === 'fechas' && (
                        <div className="dropdown-panel calendar-dropdown" onClick={(e) => e.stopPropagation()}>
                            <div className="calendar-tabs-container">
                                <div className="calendar-tabs">
                                    <button className={`tab-btn ${calendarTab === 'dates' ? 'active' : ''}`} onClick={() => setCalendarTab('dates')}>Fechas</button>
                                    <button className={`tab-btn ${calendarTab === 'flexible' ? 'active' : ''}`} onClick={() => setCalendarTab('flexible')}>Flexible</button>
                                </div>
                            </div>
                            {calendarTab === 'dates' ? (
                                <DateRangePicker
                                    onChange={handleSelectDate}
                                    showSelectionPreview={true}
                                    moveRangeOnFirstSelection={false}
                                    months={monthsToShow}
                                    ranges={stateDates}
                                    direction="horizontal"
                                    locale={es}
                                    rangeColors={['#335429']}
                                    minDate={new Date()}
                                    staticRanges={[]}    
                                    inputRanges={[]}      
                                    showDateDisplay={false} 
                                />
                            ) : (
                                <div className="flexible-container">
                                    <h3 className="flexible-title">¿Cuánto tiempo?</h3>
                                    <div className="duration-options">
                                        <button className={`duration-chip ${flexibleDuration === 'fin-de-semana' ? 'active' : ''}`} onClick={() => setFlexibleDuration('fin-de-semana')}>Fin de semana</button>
                                        <button className={`duration-chip ${flexibleDuration === 'semana' ? 'active' : ''}`} onClick={() => setFlexibleDuration('semana')}>Semana</button>
                                        <button className={`duration-chip ${flexibleDuration === 'mes' ? 'active' : ''}`} onClick={() => setFlexibleDuration('mes')}>Mes</button>
                                    </div>
                                    <h3 className="flexible-title">¿Cuándo?</h3>
                                    <div className="months-grid">
                                        {nextMonths.map((date, index) => (
                                            <div key={index} className={`month-card ${format(selectedMonth, 'yyyy-MM') === format(date, 'yyyy-MM') ? 'active' : ''}`} onClick={() => setSelectedMonth(date)}>
                                                <span className="month-label">{format(date, 'MMM', {locale: es})}</span>
                                                <span className="month-year">{format(date, 'yyyy')}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}   
                </div>
                
                <div className="divider"></div>
                
                {/* 3. QUIÉN (Pastilla) */}
                <div className={`search-item ${activeMenu === 'quien' ? 'active' : ''}`} onClick={() => setActiveMenu('quien')}>
                    <div className="search-item-row">
                         <div className="search-item-content" style={{width: '100%'}}>
                            <div className="input-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                            </div>
                            <div className="search-text-group">
                                <label className="search-label">Quién</label>
                                <div className="search-input-text">
                                    {totalPersonas + viajeros.bebes > 0 ? `${totalPersonas} hués., ${viajeros.bebes} bebes` : "Personas"}
                                </div>
                            </div>
                        </div>
                        
                        {/* Botón Desktop (se oculta en móvil) */}
                        <div className="search-btn-container desktop-only-btn">
                            <button className="search-btn" onClick={(e) => { e.stopPropagation(); handleSearch(); }} type="button">
                                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{display:'block', fill:'none', height:'16px', width:'16px', stroke:'currentColor', strokeWidth:4, overflow:'visible'}} aria-hidden="true" role="presentation"><g fill="none"><path d="m13 24c6.0751322 0 11-4.9248678 11-11 0-6.07513225-4.9248678-11-11-11-6.07513225 0-11 4.92486775-11 11 11zm8-3 9 9"></path></g></svg>
                            </button>
                        </div>
                    </div>

                    {activeMenu === 'quien' && (
                        <div className="dropdown-panel right-aligned counters-dropdown">
                             <CounterRow label="Adultos" sublabel="Edad: 13 años o más" value={viajeros.adultos} onChange={(op) => actualizarViajeros("adultos", op)} max={10} />
                             <CounterRow label="Niños" sublabel="Edades 2 – 12" value={viajeros.ninos} onChange={(op) => actualizarViajeros("ninos", op)} max={10} />
                             <CounterRow label="Bebés" sublabel="Menos de 2 años" value={viajeros.bebes} onChange={(op) => actualizarViajeros("bebes", op)} max={10} />
                             <CounterRow label="Mascotas" sublabel="¿Traes mascota?" value={viajeros.mascotas} onChange={(op) => actualizarViajeros("mascotas", op)} max={5} />
                        </div>
                    )}
                </div>

                {/* BOTÓN MÓVIL (DENTRO DE LA TARJETA) */}
                <button className="search-btn-mobile-big" onClick={handleSearch} type="button">
                    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{display:'block', fill:'none', height:'24px', width:'24px', stroke:'currentColor', strokeWidth:4, overflow:'visible'}} aria-hidden="true" role="presentation"><g fill="none"><path d="m13 24c6.0751322 0 11-4.9248678 11-11 0-6.07513225-4.9248678-11-11-11-6.07513225 0-11 4.92486775-11 11 0 6.0751322 4.92486775 11 11 11zm8-3 9 9"></path></g></svg>
                </button>

            </div>
          </div>
        </div>

        {/* ZONA AZUL: CARRUSEL ABAJO */}
        <nav className="headerFinal-categoriesMobile">
            <ul className="headerFinal-categoriesMobileList">
            {categories.map((category) => (
                <li key={category.name} className="headerFinal-categoryMobileItem">
                <a href="#" className="headerFinal-categoryMobileLink">
                    <div className="headerFinal-categoryMobileIcon">
                    <Image
                        src={`https://storage.cloud.google.com/glamperos-imagenes/Imagenes/${category.icon}.svg`}
                        alt={category.name}
                        width={28}
                        height={28}
                    />
                    </div>
                    <span className="headerFinal-categoryMobileName">{category.name}</span>
                </a>
                </li>
            ))}
            </ul>
        </nav>

      </section>
      
      {/* Categories Menu - Desktop */}
      <nav className="headerFinal-categories">
        <ul className="headerFinal-categoriesList">
          {categories.map((category) => (
            <li key={category.name} className="headerFinal-categoryItem">
              <a href="#" className="headerFinal-categoryLink">
                <div className="headerFinal-categoryIcon">
                  <Image
                    src={`https://storage.cloud.google.com/glamperos-imagenes/Imagenes/${category.icon}.svg`}
                    alt={category.name}
                    width={32}
                    height={32}
                  />
                </div>
                <span className="headerFinal-categoryName">{category.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

function CounterRow({ label, sublabel, value, onChange, max }: CounterRowProps) {
    return (
      <div className="counter-row">
        <div className="counter-info">
          <h4 style={{color:'#222'}}>{label}</h4>
          <p>{sublabel}</p>
        </div>
        <div className="counter-controls">
          <button className="ctrl-btn" onClick={(e) => { e.stopPropagation(); onChange("restar"); }} disabled={value === 0} type="button"> - </button>
          <span style={{width: '20px', textAlign: 'center', color: '#222'}}>{value}</span>
          <button className="ctrl-btn" onClick={(e) => { e.stopPropagation(); onChange("sumar"); }} disabled={value >= max} type="button"> + </button>
        </div>
      </div>
    );
}