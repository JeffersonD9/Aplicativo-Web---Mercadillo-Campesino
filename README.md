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
graph TD
    A[Administrador configura categorías y productos] --> B[Campesinos se registran]
    C --> D[Visitantes exploran la plataforma]
    D --> E[Visitantes contactan vendedores]
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
