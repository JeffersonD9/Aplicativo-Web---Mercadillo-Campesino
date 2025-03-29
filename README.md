# 🧪 Testing Branch - Mercadillo Campesino Bucaramanga

> Este branch está dedicado a las pruebas automatizadas para asegurar la calidad y estabilidad del aplicativo web del Mercadillo Campesino.

## 📋 Resumen

Esta rama contiene todas las pruebas automatizadas para verificar el correcto funcionamiento de las rutas, controladores y modelos de la aplicación. Utilizamos Jest como framework de testing junto con Supertest para las pruebas de integración de API.

## 🛠️ Tecnologías utilizadas

- **Jest**: Framework de testing para JavaScript
- **Supertest**: Librería para testear HTTP servers
- **Node.js**: Entorno de ejecución para JavaScript
- **Express**: Framework web para backend

## 📊 Cobertura actual de pruebas

| Tipo de prueba | Rutas cubiertas | Estado |
|----------------|-----------------|--------|
| GET Endpoints  | 5 rutas         | ✅     |
| POST Endpoints | 5 rutas         | ✅     |
| PUT Endpoints  | No implementado | 🔄     |
| DELETE Endpoints | No implementado | 🔄     |

## 🚀 Cómo ejecutar las pruebas

```bash
# Instalar dependencias
npm install

# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas con cobertura
npm run test:coverage

# Ejecutar pruebas en modo watch
npm run test:watch
```

## 📝 Estructura de las pruebas

Las pruebas están organizadas por tipo de endpoint y funcionalidad:

```
tests/
├── routes/
│   ├── admin.test.js
│   ├── auth.test.js
│   ├── productos.test.js
│   └── usuarios.test.js
├── controllers/
│   └── ... (no implementado aún)
└── models/
    └── ... (no implementado aún)
```

## 🔍 Resultados de las pruebas actuales

### Rutas GET
- ✅ `/MercadilloBucaramanga` - Retorna 200
- ✅ `/MercadilloBucaramanga/Admin` - Retorna 302 (redirección)
- ✅ `/MercadilloBucaramanga/Admin/Usuarios` - Retorna 302 (redirección)
- ✅ `/MercadilloBucaramanga/Usuario` - Retorna 302 (redirección)
- ✅ `/MercadilloBucaramanga/Admin/Categorias` - Retorna 302 (redirección)

### Rutas POST
- ✅ `/MercadilloBucaramanga/Productos` - Retorna 302 (redirección)
- ✅ `/MercadilloBucaramanga/Admin/Catalogos` - Retorna 302 (redirección)
- ✅ `/MercadilloBucaramanga/Admin/Categorias` - Retorna 302 (redirección)
- ✅ `/MercadilloBucaramanga/Login` (credenciales incorrectas) - Retorna 404
- ✅ `/MercadilloBucaramanga/Login` (credenciales correctas) - Retorna 201
- ✅ `/MercadilloBucaramanga/Registrar` - Retorna 200

## 📈 Plan de mejora para las pruebas

1. Implementar pruebas para rutas PUT y DELETE
2. Añadir pruebas para controladores
3. Añadir pruebas para modelos y validaciones
4. Implementar pruebas E2E con Cypress
5. Configurar integración continua con GitHub Actions o Jenkins

## 📚 Referencias y documentación

- [Documentación de Jest](https://jestjs.io/docs/getting-started)
- [Documentación de Supertest](https://github.com/visionmedia/supertest)
- [Guía de buenas prácticas de testing](https://github.com/goldbergyoni/javascript-testing-best-practices)

---

<div align="center">
  <p>Desarrollado por Jefferson Steven Muñoz Delgado e Ivan Dario Villamizar Archila</p>
  <p><strong>Asegurando la calidad del Mercadillo Campesino, test por test</strong></p>
</div>