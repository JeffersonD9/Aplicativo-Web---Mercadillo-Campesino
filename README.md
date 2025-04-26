# 🌿 MERCADILLO CAMPESINO BUCARAMANGA 🌿

> ### *Conectando el campo con la ciudad, un producto a la vez*

## 📝 Descripción

Este aplicativo web tiene como objetivo principal promover y dar visibilidad a los productos agrícolas de los campesinos de los alrededores de Bucaramanga. La plataforma sirve como un puente digital entre los productores locales y los consumidores, facilitando el conocimiento y acceso a productos frescos y de calidad.

---

## ✨ Características principales

| 🥕 | Catálogo digital de productos agrícolas organizados por categorías |
|---|-------------------------------------------------------------------|
| 👨‍🌾 | Perfiles detallados de vendedores campesinos |
| ⚙️ | Sistema de administración para la gestión de categorías y usuarios |
| 📱 | Interfaz intuitiva para visitantes/clientes |

---

## 👥 Roles de usuario

### 👑 Administrador
- Gestiona las categorías de productos
- Administra cuentas de usuarios
- Supervisa el funcionamiento general de la plataforma

### 🧑‍🌾 Vendedor (Campesino)
- Registra sus productos en el sistema
- Actualiza información de disponibilidad y precios
- Gestiona su perfil con información de contacto

### 🛒 Visitante/Cliente
- Explora catálogos de productos
- Visualiza perfiles de campesinos
- Interactúa con los diferentes catálogos
- Puede contactar a los vendedores

---

## 🔄 Flujo de la aplicación

```mermaid
flowchart TB
    subgraph "AWS Cloud"
        EC2[Microservicio EC2]
        API[API REST de Productos]
        RDS[(Base de datos RDS<br>PRODUCTO<br>CATEGORIA)]
        EC2 --- API
        API --- RDS
    end
    
    subgraph "Sistema Local"
        APP[Aplicación Principal]
        APPI[API Local]
        DB_LOCAL[(Base de datos Local<br>USUARIO<br>VENDEDOR<br>VENDEDOR_PRODUCTO)]
        APP --- APPI
        APPI --- DB_LOCAL
    end
    
    %% Conexiones entre sistemas
    API <---> APPI
    
    subgraph "Actores"
        ADMIN[Administrador]
        VENDEDOR[Vendedor]
        CLIENTE[Usuario Final]
    end
    
    %% Flujos por rol
    ADMIN --> StepAdmin
    StepAdmin["Crea productos<br>Gestiona categorías<br>Administra usuarios"]
    StepAdmin --> APP

    VENDEDOR --> StepVendor
    StepVendor["Selecciona productos<br>Crea su catálogo"]
    StepVendor --> APP

    CLIENTE --> StepClient
    StepClient["Visualiza productos<br>por vendedor"]
    StepClient --> APP

    %% Estilos
    classDef cloud fill:#C2E0F4,stroke:#333,stroke-width:1px,color:#000000
    classDef local fill:#D5F5E3,stroke:#333,stroke-width:1px,color:#000000
    classDef users fill:#FCF3CF,stroke:#333,stroke-width:1px,color:#000000

    class EC2,API,RDS cloud
    class APP,APPI,DB_LOCAL local
    class ADMIN,VENDEDOR,CLIENTE users


```

---

## 💻 Stack tecnológico

### Backend
- **Node.js** - Entorno de ejecución
- **Express** - Framework web
- **MySQL Workbench** - Base de datos relacional
- **Prisma ORM** - Mapeo objeto-relacional

### Frontend
- **EJS** - Motor de plantillas
- **HTML5/CSS3** - Estructura y estilos
- **JavaScript** - Interactividad

---

## 🚀 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/mercadillo-campesino.git

# Ingresar al directorio
cd mercadillo-campesino

# Instalar dependencias
npm install

# Configurar la base de datos
npx prisma migrate dev

# Iniciar la aplicación
npm start
```

---

## ⚙️ Configuración

Crea un archivo `.env` en la raíz del proyecto con la siguiente estructura:

```
DATABASE_URL="mysql://usuario:contraseña@localhost:3306/mercadillo_db"
PORT=3000
JWT_SECRET=tu_clave_secreta
```

---

## 🙏 Agradecimientos

- A todos los campesinos de la región que confían en esta plataforma
- A la comunidad de Bucaramanga por apoyar el consumo local
- Al equipo de desarrollo por su dedicación y trabajo

---

<div align="center">
  <p>Hecho con ❤️ para apoyar a los productores locales de Bucaramanga</p>
  <p><strong>Desarrollado por:</strong></p>
  <p>Jefferson Steven Muñoz Delgado</p>
  <p>Ivan Dario Villamizar Archila</p>
</div>
